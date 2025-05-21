import fetchMock from 'jest-fetch-mock';
import supertest from 'supertest';
import connector from '../../src/connector';
import {InternalMessageType} from '../../../../src/types';
import {Subscription} from '@google-cloud/pubsub';
import {eeAirInboundPayload} from '../data/payloads';
import waitForExpect from 'wait-for-expect';
import {
  setupAfterAll,
  setupBeforeAll,
  setupBeforeEach,
} from './utils/jest-setup-teardown-functions';
import {wrapPubSubMessage} from './utils/create-pub-sub-test-resources';
import {defaultInConnectorConfig, defaultOutConnectorConfig} from './fixtures';
import {SERVICE_WALLET_ACCOUNTS_CREATE as sampleEvent} from '../../../../test/fixtures/ee-air-outbound-events/sample-events';
import {SERVICE_WALLET_ACCOUNTS_CREATE as expectedParsedSampleEvent} from '../../../../test/fixtures/ee-air-outbound-events/expected-parsed-sample-events';
import {ReceivedPubSubMessage} from './types';

const internalMessages: ReceivedPubSubMessage[] = [];
const internalMessagesDlq: ReceivedPubSubMessage[] = [];

describe.each([
  {
    eventType: 'cdp-outbound-event' as InternalMessageType,
    payload: eeAirInboundPayload,
    targetPlatform: 'PubSub topic',
    outputEventType: 'ee-air-outbound-event' as InternalMessageType,
    inputEvent: {
      type: 'cdp-outbound-event',
      connectorConfig: defaultInConnectorConfig,
      payload: {
        baseUrl: 'https://api.sandbox.uk.eagleeye.com/',
        body: {
          some: 'arbitrary',
          json: 'data',
        },
      },
    },
    attributes: {
      'x-ees-connector-trace-id': 'some-ees-event-id',
    } as Record<string, string>,
    expectedOutputEvent: {
      attributes: {
        'x-ees-connector-trace-id': 'some-ees-event-id',
      },
      data: {
        type: 'ee-air-inbound-event',
        connectorConfig: defaultInConnectorConfig,
        payload: {
          url: 'https://api.sandbox.uk.eagleeye.com/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.any(String),
        },
      },
    },
    expectedOutputEventPayloadBody: {
      some: 'arbitrary',
      json: 'data',
    },
  },
  {
    inputEvent: {
      type: 'ee-air-outbound-event',
      connectorConfig: defaultOutConnectorConfig,
      payload: sampleEvent,
    },
    attributes: {
      'x-ees-connector-trace-id': 'some-ees-event-id',
    } as Record<string, string>,
    expectedOutputEvent: {
      attributes: {
        'x-ees-connector-trace-id': 'some-ees-event-id',
      },
      data: {
        type: 'cdp-inbound-event',
        connectorConfig: defaultOutConnectorConfig,
        payload: {
          url: '',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          identity: {
            identityId: '187129876',
            walletId: '216396239',
            type: 'CARD',
            value: '2222222222222214',
            state: 'DEFAULT',
            status: 'ACTIVE',
          },
          body: expect.any(String),
        },
      },
    },
    expectedOutputEventPayloadBody: expectedParsedSampleEvent,
  },
])(
  'Handle $eventType',
  ({
    inputEvent,
    attributes,
    expectedOutputEvent,
    expectedOutputEventPayloadBody,
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

    it(`transforms the message from ${inputEvent.type} to ${expectedOutputEvent.data.type}`, async () => {
      // Arrange
      delete process.env.SIMULATE_PUBSUB_FAILURE;
      const app = await connector();

      // Act
      const response = await supertest(app)
        .post('/internal')
        .send(wrapPubSubMessage(inputEvent, attributes));

      // Assert
      expect(response.status).toEqual(200);

      await waitForExpect(
        () => {
          expect(internalMessages).toEqual([expectedOutputEvent]);
          expect(JSON.parse(internalMessages[0].data.payload.body)).toEqual(
            expectedOutputEventPayloadBody,
          );
        },
        10000,
        1000,
      );
    }, 11000);

    it('responds with a 500 Internal Server Error if it is not possible to send the message', async () => {
      // Arrange
      process.env.SIMULATE_PUBSUB_FAILURE = 'true';
      const app = await connector();

      // Act
      const response = await supertest(app)
        .post('/internal')
        .send(wrapPubSubMessage(inputEvent, attributes));

      // Assert
      expect(response.status).toEqual(500);
    });
  },
);
