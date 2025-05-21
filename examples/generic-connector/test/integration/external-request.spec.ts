import supertest from 'supertest';
import fetchMock from 'jest-fetch-mock';
import connector from '../../src/connector';
import {Subscription} from '@google-cloud/pubsub';
import waitForExpect from 'wait-for-expect';
import {
  setupAfterAll,
  setupBeforeAll,
  setupBeforeEach,
} from './utils/jest-setup-teardown-functions';
import {defaultInConnectorConfig, defaultOutConnectorConfig} from './fixtures';
import {version} from '../../../../package.json';
import {ReceivedPubSubMessage} from './types';
import {faker} from '@faker-js/faker';
import {sampleEvents} from '../../../../src';

const internalMessages: ReceivedPubSubMessage[] = [];
const internalMessagesDlq: ReceivedPubSubMessage[] = [];

const UUID_REGEX =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

// Note that throughout this test file we use randomly generated connector ids
// when sending requests to the Connector. This is done to ensure that we make
// requests to the (mocked) Config API in every test. If we did not use random
// connector ids, memoization of getConnectorConfig() would prevent us from
// being able to test with different config responses.

describe('External request processing', () => {
  let internalMessagesSubscription: Subscription;
  let internalMessagesDlqSubscription: Subscription;
  let app: Awaited<ReturnType<typeof connector>>;

  beforeAll(async () => {
    ({
      subscription: internalMessagesSubscription,
      dlqSubscription: internalMessagesDlqSubscription,
    } = await setupBeforeAll(fetchMock, internalMessages, internalMessagesDlq));

    app = await connector();
  }, 60000);

  beforeEach(async () => {
    setupBeforeEach(fetchMock, internalMessages, internalMessagesDlq);
  });

  afterEach(async () => {
    fetchMock.resetMocks();
  });

  afterAll(async () => {
    await setupAfterAll(
      fetchMock,
      internalMessagesSubscription,
      internalMessagesDlqSubscription,
    );
  }, 60000);

  describe('POST /in/generic', () => {
    it('returns a 400 Bad Request if the request body is invalid', async () => {
      // Arrange
      const requestBody = {};
      const expectedErrors = [
        {
          message: 'Invalid literal value, expected "services/trigger"',
          path: 'type',
        },
        {
          message: 'Required',
          path: 'body',
        },
      ];

      // Act
      const response = await supertest(app)
        .post(`/in/generic/${faker.string.uuid()}`)
        .set('X-Auth-Token', 'some-external-key')
        .send(requestBody);

      // Assert
      expect(response.status).toEqual(400);

      expect(response.body).toEqual({
        message: 'Validation error',
        errors: expectedErrors,
      });
    });

    it('returns a 200 OK if the request body is valid, and sends a cdp-outbound-event to Pub/Sub', async () => {
      // Arrange
      fetchMock.mockResponse(async () => {
        return {
          body: JSON.stringify(defaultInConnectorConfig),
        };
      });

      const requestBody = {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: 'some reference',
          },
          identityValue: 'some-identity',
          triggers: [{reference: 'some-reference'}],
        },
      };

      // Act
      const response = await supertest(app)
        .post(`/in/generic/${faker.string.uuid()}`)
        .set('X-Auth-Token', 'some-external-key')
        .send(requestBody);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.headers['x-ees-connector-trace-id']).toMatch(UUID_REGEX);

      const expectedInternalMessages = [
        {
          attributes: {
            // We don't know exactly what the trace id will be as it is a random UUID,
            // but it should match what is returned in the HTTP response, so we assert
            // that here.
            'x-ees-connector-trace-id':
              response.headers['x-ees-connector-trace-id'],
          },
          data: {
            type: 'cdp-outbound-event',
            connectorConfig: defaultInConnectorConfig,
            payload: requestBody,
          },
        },
      ];

      await waitForExpect(() => {
        expect(internalMessages).toEqual(expectedInternalMessages);
      }, 5000);
    }, 6000);

    it('returns a 401 if a X-Auth-Token header is empty', async () => {
      // Arrange
      fetchMock.mockResponse(async () => {
        return {
          status: 404,
        };
      });

      const requestBody = {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: 'some-reference',
          },
          identityValue: 'some-identity',
          triggers: [{reference: 'some-reference'}],
        },
      };

      // Act
      const response = await supertest(app)
        .post(`/in/generic/${faker.string.uuid()}`)
        .set('X-Auth-Token', '')
        .send(requestBody);

      // Assert
      expect(response.status).toEqual(401);
      expect(response.headers['x-ees-connector-trace-id']).toMatch(UUID_REGEX);
    });

    it('returns a 403 if a connector config is not available', async () => {
      // Arrange
      fetchMock.mockResponse(async () => {
        return {
          status: 404,
        };
      });

      const requestBody = {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: 'some-reference',
          },
          identityValue: 'some-identity',
          triggers: [{reference: 'some-reference'}],
        },
      };

      // Act
      const response = await supertest(app)
        .post(`/in/generic/${faker.string.uuid()}`)
        .set('X-Auth-Token', 'some-external-key')
        .send(requestBody);

      // Assert
      expect(response.status).toEqual(403);
      expect(response.headers['x-ees-connector-trace-id']).toMatch(UUID_REGEX);
    });
  });

  describe('POST /out/generic', () => {
    it('returns a 200 OK if the request body is valid, and sends an ee-air-outbound-event to Pub/Sub', async () => {
      // Arrange
      fetchMock.mockResponse(async () => {
        return {
          body: JSON.stringify(defaultOutConnectorConfig),
        };
      });

      const requestBody = sampleEvents.SERVICE_WALLET_ACCOUNTS_CREATE;

      // Act
      const response = await supertest(app)
        .post(`/out/generic/${faker.string.uuid()}`)
        .set('X-Auth-Token', 'some-external-key')
        .send(requestBody);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.headers['x-ees-connector-trace-id']).toEqual(
        '3c1067fe-8eb8-4541-88f6-9d677618d0a9',
      );

      const expectedInternalMessages = [
        {
          attributes: {
            'x-ees-connector-trace-id': '3c1067fe-8eb8-4541-88f6-9d677618d0a9',
          },
          data: {
            type: 'ee-air-outbound-event',
            connectorConfig: defaultOutConnectorConfig,
            payload: requestBody,
          },
        },
      ];

      await waitForExpect(() => {
        expect(internalMessages).toEqual(expectedInternalMessages);
      }, 5000);
    }, 6500);

    it('returns a 401 if a X-Auth-Token header is empty', async () => {
      // Arrange
      fetchMock.mockResponse(async () => {
        return {
          status: 404,
        };
      });

      const requestBody = sampleEvents.SERVICE_WALLET_ACCOUNTS_CREATE;

      // Act
      const response = await supertest(app)
        .post(`/out/generic/${faker.string.uuid()}`)
        .set('X-Auth-Token', '')
        .send(requestBody);

      // Assert
      expect(response.status).toEqual(401);
      expect(response.headers['x-ees-connector-trace-id']).toEqual(
        '3c1067fe-8eb8-4541-88f6-9d677618d0a9',
      );
    });

    it('returns a 403 if a connector config is not available', async () => {
      // Arrange
      fetchMock.mockResponse(async () => {
        return {
          status: 404,
        };
      });

      const requestBody = sampleEvents.SERVICE_WALLET_ACCOUNTS_CREATE;

      // Act
      const response = await supertest(app)
        .post(`/out/generic/${faker.string.uuid()}`)
        .set('X-Auth-Token', 'some-external-key')
        .send(requestBody);

      // Assert
      expect(response.status).toEqual(403);
      expect(response.headers['x-ees-connector-trace-id']).toEqual(
        '3c1067fe-8eb8-4541-88f6-9d677618d0a9',
      );
    });
  });

  describe.each(['in', 'out'])('GET /%s/generic/status', direction => {
    it('returns a 200 OK with a status response', async () => {
      // Arrange
      const app = await connector();

      // Act
      const response = await supertest(app).get(`/${direction}/generic/status`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        api: '@eagleeye-solutions/integration-events-common',
        version,
        tagline: 'Sample API Connector',
      });
    });
  });
});
