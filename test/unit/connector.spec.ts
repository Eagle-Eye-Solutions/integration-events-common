import {connector} from '../../src/connector';
import '../../src/handlers';

jest.mock('../../src/handlers');

describe('connector', () => {
  it('returns an instance of Express', () => {
    const app = connector({
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
      traceIdName: 'x-ees-connector-trace-id',
      includeTraceIdInHttpResponseHeaders: true,
    });

    expect(app).toBeDefined();
  });
});
