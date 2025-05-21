import fetchMock from 'jest-fetch-mock';
import supertest from 'supertest';
import connector from '../../src/connector';
import {Subscription} from '@google-cloud/pubsub';
import waitForExpect from 'wait-for-expect';
import {
  setupAfterAll,
  setupBeforeAll,
  setupBeforeEach,
} from './utils/jest-setup-teardown-functions';
import {wrapPubSubMessage} from './utils/create-pub-sub-test-resources';
import {defaultInConnectorConfig, defaultOutConnectorConfig} from './fixtures';
import {ReceivedPubSubMessage} from './types';

const internalMessages: ReceivedPubSubMessage[] = [];
const internalMessagesDlq: ReceivedPubSubMessage[] = [];

describe.each([
  {
    inputEvent: {
      type: 'ee-air-inbound-event',
      connectorConfig: defaultInConnectorConfig,
      payload: {
        url: 'https://eagleeye.com/some/path',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          some: 'arbitrary',
          json: 'data',
        }),
      },
    },
    attributes: {
      'x-ees-connector-trace-id': 'some-trace-id',
    } as Record<string, string>,
    expectedOutputRequest: {
      attributes: {
        'x-ees-connector-trace-id': 'some-trace-id',
      },
      data: {
        url: 'https://eagleeye.com/some/path',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-EES-AUTH-CLIENT-ID': 'some-client-id',
          'X-EES-AUTH-HASH':
            '01ec08cfb3aa78bc8fcec38ed1d4298d3c44eb7b19647e817c30b7ff628bb180',
        },
        body: JSON.stringify({
          some: 'arbitrary',
          json: 'data',
        }),
      },
    },
    hostRegex: /https:\/\/eagleeye\.com.*/,
    targetPlatform: 'AIR',
  },
  {
    inputEvent: {
      type: 'cdp-inbound-event',
      connectorConfig: defaultOutConnectorConfig,
      payload: {
        url: 'some/path',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          some: 'arbitrary',
          json: 'data',
        }),
      },
    },
    attributes: {'x-ees-connector-trace-id': 'some-trace-id'} as Record<
      string,
      string
    >,
    expectedOutputRequest: {
      attributes: {'x-ees-connector-trace-id': 'some-trace-id'},
      data: {
        url: 'https://cdp.url/some/path',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': '7661b053-d1e7-48f4-9e1d-6c650650474f',
        },
        body: JSON.stringify({
          some: 'arbitrary',
          json: 'data',
        }),
      },
    },
    hostRegex: /https:\/\/cdp\.url.*/,
    targetPlatform: 'CDP',
  },
])(
  'Handle $eventType',
  ({
    inputEvent,
    attributes,
    targetPlatform,
    hostRegex,
    expectedOutputRequest,
  }) => {
    let internalMessagesSubscription: Subscription;
    let internalMessagesDlqSubscription: Subscription;

    beforeAll(async () => {
      ({
        subscription: internalMessagesSubscription,
        dlqSubscription: internalMessagesDlqSubscription,
      } = await setupBeforeAll(
        fetchMock,
        internalMessages,
        internalMessagesDlq,
      ));
    }, 60000);

    beforeEach(() =>
      setupBeforeEach(fetchMock, internalMessages, internalMessagesDlq),
    );

    afterAll(
      async () =>
        setupAfterAll(
          fetchMock,
          internalMessagesSubscription,
          internalMessagesDlqSubscription,
        ),
      60000,
    );

    it(`responds with a 200 OK if the event is sent to ${targetPlatform} successfully`, async () => {
      // Arrange
      const app = await connector();

      fetchMock.mockIf(hostRegex, async () => {
        return {
          status: 200,
          body: 'OK',
        };
      });

      // Act
      const response = await supertest(app)
        .post('/internal')
        .send(wrapPubSubMessage(inputEvent, attributes));

      // Assert
      expect(response.status).toEqual(200);
      expect(fetchMock).toHaveBeenCalledWith(expectedOutputRequest.data.url, {
        method: expectedOutputRequest.data.method,
        headers: expectedOutputRequest.data.headers,
        body: expectedOutputRequest.data.body,
      });
    }, 11000);

    it(`responds with a 200 OK and adds the message to a dead letter queue if ${targetPlatform} rejects the message because it is invalid`, async () => {
      // Arrange
      const app = await connector();

      fetchMock.mockIf(hostRegex, async () => {
        return {
          status: 400,
          body: 'Bad Request',
        };
      });

      // Act
      const response = await supertest(app)
        .post('/internal')
        .send(wrapPubSubMessage(inputEvent, attributes));

      // Assert
      expect(response.status).toEqual(200);

      await waitForExpect(() => {
        const filteredDlqMessages = internalMessagesDlq.filter(
          message => message.data.type === inputEvent.type,
        );
        expect(filteredDlqMessages.length).toBeGreaterThanOrEqual(1);
        expect(filteredDlqMessages[0]).toEqual({
          data: inputEvent,
          attributes,
        });
      }, 10000);
    }, 11000);

    it(`responds with a 500 Internal Server Error if it is not possible to send the message to ${targetPlatform}`, async () => {
      // Arrange
      const app = await connector();

      fetchMock.mockIf(hostRegex, async () => {
        return {
          status: 500,
          body: 'Internal Server Error',
        };
      });

      // Act
      const response = await supertest(app)
        .post('/internal')
        .send(wrapPubSubMessage(inputEvent, attributes));

      // Assert
      expect(response.status).toEqual(500);
    });
  },
  11000,
);
