import {
  ApplicationConfig,
  sendInternalMessageToDlq,
  getInternalMessageFromRequest,
  Logger,
  defaultLogRequestHeadersAllowList,
  defaultLoggerRedactOptions,
  DEFAULT_TRACE_ID_NAME,
  DEFAULT_INCLUDE_TRACE_ID_IN_HTTP_RESPONSE_HEADERS,
} from '../../../src';
import {
  handleCdpInboundEvent,
  handleCdpOutboundEvent,
  handleEeAirInboundEvent,
  handleEeAirOutboundEvent,
} from './handlers';
import packageJson from '../../../package.json';
import {env} from './env';

const platform = env.PLATFORM;

let platformConfig: ApplicationConfig['platformConfig'];

if (platform === 'GCP') {
  platformConfig = {
    platform,
    projectId: env.GCP_PROJECT_ID,
    internalMessagesTopicName: env.GCP_INTERNAL_MESSAGES_TOPIC_NAME,
    cdpDeadLetterQueue: env.GCP_CDP_DEAD_LETTER_QUEUE_TOPIC_NAME,
    pubSubAuthenticatedPushServiceAccount:
      env.GCP_PUBSUB_AUTHENTICATED_PUSH_SERVICE_ACCOUNT,
    pubSubAuthenticatedPushAudience: env.GCP_PUBSUB_AUTHENTICATED_PUSH_AUDIENCE,
  };
} else {
  throw new Error(`Invalid env (platform=${platform}`);
}

const appConfig: ApplicationConfig = {
  platformConfig,
  configPlatform: env.CONFIG_PLATFORM,
  configUrl: env.CONFIG_URL,
  configOverride: env.CONFIG_OVERRIDE,
  routes: {
    internal: {
      path: '/internal',
      getInternalMessageFromRequest,
      handlers: {
        'cdp-outbound-event': handleCdpOutboundEvent,
        'cdp-inbound-event': handleCdpInboundEvent,
        'ee-air-inbound-event': handleEeAirInboundEvent,
        'ee-air-outbound-event': handleEeAirOutboundEvent,
      },
    },
  },
  appMetadata: {
    name: packageJson.name,
    version: packageJson.version,
    tagline: 'Sample API Connector',
  },
  handlePermanentMessageDeliveryFailure: async (
    appConfig: ApplicationConfig,
    connectorConfig: unknown,
    message: unknown,
    attributes: Record<string, string>,
    logger: Logger,
  ) => {
    await sendInternalMessageToDlq(appConfig, message, attributes, logger);
  },
  logRequestHeadersAllowList: [
    ...defaultLogRequestHeadersAllowList,
    'x-cloud-trace-context', // GCP specific
  ],
  loggerRedactOptions: {
    paths: [
      ...defaultLoggerRedactOptions,
      'connectorConfig.configuration',
      'connectorConfig.credentials.secret',
    ],
  },
  traceIdName: DEFAULT_TRACE_ID_NAME,
  includeTraceIdInHttpResponseHeaders:
    DEFAULT_INCLUDE_TRACE_ID_IN_HTTP_RESPONSE_HEADERS,
};

export default appConfig;
