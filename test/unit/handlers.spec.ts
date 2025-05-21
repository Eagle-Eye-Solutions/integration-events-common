import fetchMock from 'jest-fetch-mock';
import {Request, Response} from 'express';
import {
  handleEeAirOutboundRequest,
  handleCdpOutboundRequest,
  getConnectorConfig,
} from '../../src/handlers';
import {ApplicationConfig} from '../../src/types';
import {sendInternalMessage} from '../../src/platform/index';
import {Logger} from '../../src/logger';
import {
  mockOutConnectorConfig,
  mockInConnectorConfig,
} from '../fixtures/connector-configs';

const mockAppConfig: ApplicationConfig = {
  platformConfig: {
    platform: 'GCP',
    projectId: 'test-project',
    internalMessagesTopicName: 'internal-messages',
    cdpDeadLetterQueue: 'internal-messages-dlq',
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
        'cdp-inbound-event': jest.fn(),
        'ee-air-inbound-event': jest.fn(),
        'ee-air-outbound-event': jest.fn(),
      },
    },
  },
  appMetadata: {
    name: 'some-api',
    version: 'some-version',
    tagline: 'some-tagline',
  },
  handlePermanentMessageDeliveryFailure: jest.fn(),
  traceIdName: 'x-ees-connector-trace-id',
  includeTraceIdInHttpResponseHeaders: true,
};

const mockLogger = {
  debug: jest.fn(msg => {
    console.log('debug: ', msg);
  }),
  info: jest.fn(msg => {
    console.log('info: ', msg);
  }),
  error: jest.fn(msg => {
    console.error(msg);
  }),
} as unknown as Logger;

jest.mock('../../src/platform/index');

describe.each([
  {
    requestPath: '/out/generic/connector-id',
    requestBody: {
      some: {
        opaque: 'data',
      },
    },
    connectorConfig: mockOutConnectorConfig,
  },
])(
  'handleEeAirOutboundRequest: $requestPath',
  ({requestPath, requestBody, connectorConfig}) => {
    beforeAll(() => {
      fetchMock.enableMocks();
    });

    afterAll(() => {
      fetchMock.disableMocks();
    });

    afterEach(() => {
      fetchMock.resetMocks();
      getConnectorConfig.clear();
      jest.clearAllMocks();
    });

    it('sets the response status to 200 OK if the request is processed successfully', async () => {
      // Arrange
      const req = {
        params: {
          connectorId: 'some-connector-id',
        },
        get: jest.fn().mockReturnValue('some-external-key'),
        body: requestBody,
        originalUrl: requestPath,
        log: mockLogger,
        id: 'some-id',
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        app: {
          get: jest.fn().mockReturnValue(mockAppConfig),
        },
        set: jest.fn().mockReturnThis(),
      } as unknown as Response;

      fetchMock.mockResponse(async () => {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(connectorConfig),
        };
      });

      // Act
      await handleEeAirOutboundRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledTimes(1);

      expect(sendInternalMessage).toHaveBeenCalledWith(
        mockAppConfig,
        {
          type: 'ee-air-outbound-event',
          connectorConfig,
          payload: requestBody,
        },
        {
          'x-ees-connector-trace-id': 'some-id',
        },
        expect.anything(),
      );
    });
  },
);

describe.each([
  {
    requestPath: '/in/generic/connector-id',
    requestBody: {
      type: 'services/trigger',
      body: {
        walletTransaction: {
          reference: 'some-reference',
        },
        identityValue: 'some-identity',
        triggers: [
          {
            reference: 'some-reference',
          },
        ],
      },
    },
    connectorConfig: mockInConnectorConfig,
  },
])(
  'handleExternalRequest: $requestPath',
  ({requestPath, requestBody, connectorConfig}) => {
    beforeAll(() => {
      fetchMock.enableMocks();
    });

    afterAll(() => {
      fetchMock.disableMocks();
    });

    afterEach(() => {
      fetchMock.resetMocks();
      getConnectorConfig.clear();
      jest.clearAllMocks();
    });

    it('sets the response status to 200 OK if the request is processed successfully', async () => {
      // Arrange
      const req = {
        params: {
          connectorId: 'some-connector-id',
        },
        get: jest.fn().mockReturnValue('some-external-key'),
        body: requestBody,
        originalUrl: requestPath,
        log: mockLogger,
        id: 'some-id',
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        app: {
          get: jest.fn().mockReturnValue(mockAppConfig),
        },
        set: jest.fn().mockReturnThis(),
      } as unknown as Response;

      fetchMock.mockResponse(async () => {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(connectorConfig),
        };
      });

      // Act
      await handleCdpOutboundRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledTimes(1);

      expect(sendInternalMessage).toHaveBeenCalledWith(
        mockAppConfig,
        {
          type: 'cdp-outbound-event',
          connectorConfig,
          payload: requestBody,
        },
        {
          'x-ees-connector-trace-id': 'some-id',
        },
        expect.anything(),
      );
    });
  },
);

describe('', () => {
  it.each([
    {
      requestBody: {},
      expectedErrors: [
        {
          message: 'Invalid literal value, expected "services/trigger"',
          path: 'type',
        },
        {
          message: 'Required',
          path: 'body',
        },
      ],
      description: 'is empty',
    },
    {
      requestBody: {
        type: 'some/invalid/type',
        body: {
          walletTransaction: {
            reference: 'some reference',
          },
          identityValue: 'some-identity',
          triggers: [{reference: 'some-reference'}],
        },
      },
      expectedErrors: [
        {
          message: 'Invalid literal value, expected "services/trigger"',
          path: 'type',
        },
      ],
      description: 'has an invalid type',
    },
    {
      requestBody: {
        type: '',
        body: {
          walletTransaction: {
            reference: 'some reference',
          },
          identityValue: 'some-identity',
          triggers: [{reference: 'some-reference'}],
        },
      },
      expectedErrors: [
        {
          message: 'Invalid literal value, expected "services/trigger"',
          path: 'type',
        },
      ],
      description: 'has an empty type',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: 'some reference',
          },
          identityValue: '',
          triggers: [{reference: 'some-reference'}],
        },
      },
      expectedErrors: [
        {
          message: 'String must contain at least 1 character(s)',
          path: 'body.identityValue',
        },
      ],
      description: 'has an empty body.identityValue',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: 'some reference',
          },
          identityValue: 'a',
          triggers: [],
        },
      },
      expectedErrors: [
        {
          message: 'Array must contain at least 1 element(s)',
          path: 'body.triggers',
        },
      ],
      description: 'has an empty body.triggers array',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: 'some reference',
          },
          identityValue: 'a',
          triggers: [''],
        },
      },
      expectedErrors: [
        {
          message: 'Expected object, received string',
          path: 'body.triggers.0',
        },
      ],
      description: 'has the wrong element type in body.triggers',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: 'some reference',
          },
          identityValue: 'a',
          triggers: [{}],
        },
      },
      expectedErrors: [
        {
          message: 'Required',
          path: 'body.triggers.0.reference',
        },
      ],
      description: 'has no reference attribute in body.triggers.0',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: 'some reference',
          },
          identityValue: 'a',
          triggers: [{reference: 1}],
        },
      },
      expectedErrors: [
        {
          message: 'Expected string, received number',
          path: 'body.triggers.0.reference',
        },
      ],
      description: 'has the wrong type in body.triggers.0.reference (1)',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: 'some reference',
          },
          identityValue: 'a',
          triggers: [{reference: null}],
        },
      },
      expectedErrors: [
        {
          message: 'Expected string, received null',
          path: 'body.triggers.0.reference',
        },
      ],
      description: 'has the wrong type in body.triggers.0.reference (2)',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: 'some reference',
          },
          identityValue: 'a',
          triggers: [{reference: ''}],
        },
      },
      expectedErrors: [
        {
          message: 'String must contain at least 1 character(s)',
          path: 'body.triggers.0.reference',
        },
      ],
      description:
        'triggers.0.reference does not meet the minimum length requirements',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          walletTransaction: {
            reference: null,
          },
          identityValue: 'a',
          triggers: [{reference: 'a'}],
        },
      },
      expectedErrors: [
        {
          message: 'Expected string, received null',
          path: 'body.walletTransaction.reference',
        },
      ],
      description: 'body.walletTransaction.reference is the wrong type',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          identityValue: 'a',
          triggers: [{reference: 'a'}],
          walletTransaction: {
            reference: '',
          },
        },
      },
      expectedErrors: [
        {
          message: 'String must contain at least 1 character(s)',
          path: 'body.walletTransaction.reference',
        },
      ],
      description:
        'body.walletTransaction.reference does not meet the minimum length requirements',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          identityValue: 'a',
          triggers: [{reference: 'a'}],
          walletTransaction: {},
        },
      },
      expectedErrors: [
        {
          message: 'Required',
          path: 'body.walletTransaction.reference',
        },
      ],
      description: 'body.walletTransaction.reference is missing',
    },
    {
      requestBody: {
        type: 'services/trigger',
        body: {
          identityValue: 'a',
          triggers: [{reference: 'a'}],
        },
      },
      expectedErrors: [
        {
          message: 'Required',
          path: 'body.walletTransaction',
        },
      ],
      description: 'body.walletTransaction is missing',
    },
  ])(
    'sends a 400 Bad Request if the request $description',
    async ({requestBody, expectedErrors}) => {
      // Arrange
      const req = {
        params: {
          connectorId: 'some-connector-id',
        },
        get: jest.fn().mockReturnValue('some-external-key'),
        body: requestBody,
        originalUrl: '/in/generic/some-connector-id',
        log: mockLogger,
        id: 'some-id',
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        app: {
          get: jest.fn().mockReturnValue(mockAppConfig),
        },
        set: jest.fn().mockReturnThis(),
      } as unknown as Response;

      // Act
      await handleCdpOutboundRequest(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Validation error',
        errors: expectedErrors,
      });

      expect(sendInternalMessage).not.toHaveBeenCalled();
    },
  );
});

describe('getConnectorConfig', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    getConnectorConfig.clear();
  });

  it('calls the Config API to fetch the connector config', async () => {
    // Arrange
    fetchMock.mockResponse(async () => {
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockOutConnectorConfig),
      };
    });

    // Act
    const output = await getConnectorConfig({
      appConfig: mockAppConfig,
      connectorId: '123',
      externalKey: '456',
      direction: 'out',
      logger: mockLogger,
    });

    // Assert
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.org/api/connectors/123/config?platform=GENERIC&key=456',
    );
    expect(output).toEqual(mockOutConnectorConfig);
  });

  it('returns a cached response if available', async () => {
    // Arrange
    fetchMock.mockResponse(async () => {
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockOutConnectorConfig),
      };
    });

    // Act
    const output1 = await getConnectorConfig({
      appConfig: mockAppConfig,
      connectorId: '123',
      externalKey: '456',
      direction: 'out',
      logger: mockLogger,
    });

    const output2 = await getConnectorConfig({
      appConfig: mockAppConfig,
      connectorId: '123',
      externalKey: '456',
      direction: 'out',
      logger: mockLogger,
    });

    // Assert
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.org/api/connectors/123/config?platform=GENERIC&key=456',
    );
    expect(output1).toEqual(mockOutConnectorConfig);
    expect(output2).toEqual(mockOutConnectorConfig);
  });

  it('returns a cached response even if the logger instance changes', async () => {
    // Arrange
    fetchMock.mockResponse(async () => {
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockOutConnectorConfig),
      };
    });

    // Act
    const output1 = await getConnectorConfig({
      appConfig: mockAppConfig,
      connectorId: '123',
      externalKey: '456',
      direction: 'out',
      logger: mockLogger,
    });

    const output2 = await getConnectorConfig({
      appConfig: mockAppConfig,
      connectorId: '123',
      externalKey: '456',
      direction: 'out',
      logger: {...mockLogger, warn: console.log, foo: 'bar'} as Logger,
    });

    // Assert
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.org/api/connectors/123/config?platform=GENERIC&key=456',
    );
    expect(output1).toEqual(mockOutConnectorConfig);
    expect(output2).toEqual(mockOutConnectorConfig);
  });

  it('makes separate calls to the Config API if the direction is different', async () => {
    // Arrange
    fetchMock.mockResponse(async req => {
      if (
        req.url ===
        'https://example.org/api/connectors/123/config?platform=GENERIC&key=some-external-key-out'
      ) {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockOutConnectorConfig),
        };
      } else if (
        req.url ===
        'https://example.org/api/connectors/123/config?platform=GENERIC&key=some-external-key-in'
      ) {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockInConnectorConfig),
        };
      } else {
        return {status: 404};
      }
    });

    // Act
    const output1 = await getConnectorConfig({
      appConfig: mockAppConfig,
      connectorId: '123',
      externalKey: 'some-external-key-out',
      direction: 'out',
      logger: mockLogger,
    });

    const output2 = await getConnectorConfig({
      appConfig: mockAppConfig,
      connectorId: '123',
      externalKey: 'some-external-key-in',
      direction: 'in',
      logger: mockLogger,
    });

    // Assert
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://example.org/api/connectors/123/config?platform=GENERIC&key=some-external-key-out',
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://example.org/api/connectors/123/config?platform=GENERIC&key=some-external-key-in',
    );
    expect(output1).toEqual(mockOutConnectorConfig);
    expect(output2).toEqual(mockInConnectorConfig);
  });

  it('makes separate calls to the Config API if the connectorId is different', async () => {
    // Arrange
    fetchMock.mockResponse(async req => {
      if (
        req.url ===
        'https://example.org/api/connectors/123/config?platform=GENERIC&key=some-external-key-out'
      ) {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...mockOutConnectorConfig,
            unitId: 'x',
          }),
        };
      } else if (
        req.url ===
        'https://example.org/api/connectors/234/config?platform=GENERIC&key=some-external-key-out'
      ) {
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...mockOutConnectorConfig,
            unitId: 'y',
          }),
        };
      } else {
        return {status: 404};
      }
    });

    // Act
    const output1 = await getConnectorConfig({
      appConfig: mockAppConfig,
      connectorId: '123',
      externalKey: 'some-external-key-out',
      direction: 'out',
      logger: mockLogger,
    });

    const output2 = await getConnectorConfig({
      appConfig: mockAppConfig,
      connectorId: '234',
      externalKey: 'some-external-key-out',
      direction: 'out',
      logger: mockLogger,
    });

    // Assert
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://example.org/api/connectors/123/config?platform=GENERIC&key=some-external-key-out',
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://example.org/api/connectors/234/config?platform=GENERIC&key=some-external-key-out',
    );
    expect(output1).toEqual({
      ...mockOutConnectorConfig,
      unitId: 'x',
    });
    expect(output2).toEqual({
      ...mockOutConnectorConfig,
      unitId: 'y',
    });
  });
});
