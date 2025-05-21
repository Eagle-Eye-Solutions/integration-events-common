import supertest from 'supertest';
import {connector, ApplicationConfig, handleStatus} from '../../src';
import {Request, Response, Router} from 'express';

const configWithNoInRouter: ApplicationConfig = {
  platformConfig: {
    platform: 'GCP',
    projectId: 'some-project',
    internalMessagesTopicName: 'internal-messages-topic',
    cdpDeadLetterQueue: 'internal-messages-dlq-topic',
    pubSubAuthenticatedPushServiceAccount: 'fake@example.org',
    pubSubAuthenticatedPushAudience: 'https://example.org/internal',
  },
  configPlatform: 'GENERIC',
  configUrl: 'https://example.org/api',
  routes: {
    internal: {
      path: '/internal',
      getInternalMessageFromRequest: jest.fn(),
      handlers: {
        'cdp-outbound-event': jest.fn(),
        'ee-air-outbound-event': jest.fn(),
        'cdp-inbound-event': jest.fn(),
        'ee-air-inbound-event': jest.fn(),
      },
    },
  },
  appMetadata: {
    name: 'some-app-name',
    version: 'some-version',
    tagline: 'some-tag-line',
  },
  handlePermanentMessageDeliveryFailure: jest.fn(),
  traceIdName: 'some-trace-id-name',
  includeTraceIdInHttpResponseHeaders: false,
};

const inRouter = Router();
inRouter.get('/status', handleStatus);
inRouter.get('/some-path', (_req: Request, res: Response) => {
  res.status(200).send({data: 'some-path'});
});
inRouter.get('/some-other-path', (_req: Request, res: Response) => {
  res.status(200).send({data: 'some-other-path'});
});

const configWithInRouterThatHandlesStatusAndOtherEndpoints: ApplicationConfig =
  {
    ...configWithNoInRouter,
    routes: {
      ...configWithNoInRouter.routes,
      in: inRouter,
    },
  };

describe('status endpoints', () => {
  it.each([
    {
      direction: 'in',
      config: configWithNoInRouter,
      path: 'status',
      expectedResponse: {
        api: 'some-app-name',
        version: 'some-version',
        tagline: 'some-tag-line',
      },
    },
    {
      direction: 'in',
      config: configWithInRouterThatHandlesStatusAndOtherEndpoints,
      path: 'status',
      expectedResponse: {
        api: 'some-app-name',
        version: 'some-version',
        tagline: 'some-tag-line',
      },
    },
    {
      direction: 'in',
      config: configWithInRouterThatHandlesStatusAndOtherEndpoints,
      path: 'some-path',
      expectedResponse: {data: 'some-path'},
    },
    {
      direction: 'in',
      config: configWithInRouterThatHandlesStatusAndOtherEndpoints,
      path: 'some-other-path',
      expectedResponse: {data: 'some-other-path'},
    },
    {
      direction: 'out',
      config: configWithNoInRouter,
      path: 'status',
      expectedResponse: {
        api: 'some-app-name',
        version: 'some-version',
        tagline: 'some-tag-line',
      },
    },
  ])(
    'GET /$direction/generic/$path returns a 200 OK with response body $expectedResponse',
    async ({direction, config, path, expectedResponse}) => {
      // Arrange
      const app = await connector(config);

      // Act
      const response = await supertest(app).get(
        `/${direction}/generic/${path}`,
      );

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedResponse);
    },
  );
});
