import {
  connector,
  ApplicationConfig,
  InternalMessageHandler,
  getInternalMessageFromRequest,
  getAirIdentities,
  sendInternalMessageToDlq,
  Logger,
  DEFAULT_TRACE_ID_NAME,
  DEFAULT_INCLUDE_TRACE_ID_IN_HTTP_RESPONSE_HEADERS,
  getServiceWalletAccountsCreateEventData,
  EeAirOutboundEventSchema,
  sendInternalMessage,
  BaseOutConnectorConfigSchema,
  EeAirClient,
  BaseConnectorConfigSchema,
  getAirUrl,
  EeAirInboundEvent,
  CdpOutboundEventPayloadSchema,
  EeAirInboundEventPayloadSchema,
} from 'integration-events-common';
import * as packageJson from '../package.json';

// Note that in a real application these will likely be set via environment variables
const GCP_PROJECT_ID = 'gcp-ldn-prj-pfm-snd';
const GCP_REGION = 'europe-west2';
const GCP_SERVICE_NAME = 'my-connector';
const GCP_INTERNAL_MESSAGES_TOPIC_NAME = 'my-connector';
const GCP_INTERNAL_MESSAGES_DLQ_TOPIC_NAME = 'my-connector-dlq';
const GCP_PUBSUB_AUTHENTICATED_PUSH_SERVICE_ACCOUNT = `${GCP_SERVICE_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com`;
const GCP_PUBSUB_AUTHENTICATED_PUSH_AUDIENCE = `${GCP_SERVICE_NAME}-${GCP_REGION}`;
const CONFIG_PLATFORM = 'my-platform';
const CONFIG_URL = 'https://config-api.example.org';
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

const handleEeAirOutboundEvent: InternalMessageHandler = async (
  appConfig: ApplicationConfig,
  connectorConfig: unknown,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger,
) => {
  const eeAirOutboundEvent = EeAirOutboundEventSchema.parse(message);
  const outConnectorConfig =
    BaseOutConnectorConfigSchema.parse(connectorConfig);

  logger.info(
    `handleEeAirOutboundEvent: ${eeAirOutboundEvent.headers.eventName}`,
  );

  // Retrieve the identities that are present in the AIR event
  const identities = getAirIdentities(eeAirOutboundEvent);

  // Find the identity whose type matches our configuration
  const userId = identities.find(
    identity => identity.type === outConnectorConfig.configuration.identityType,
  );

  switch (eeAirOutboundEvent.headers.eventName) {
    case 'SERVICE.WALLET.ACCOUNTS.CREATE': {
      const eventData =
        getServiceWalletAccountsCreateEventData(eeAirOutboundEvent);

      await sendInternalMessage(
        appConfig,
        {
          type: 'cdp-inbound-event',
          connectorConfig,
          payload: {
            userId,
            eventData,
          },
        },
        attributes,
        logger,
      );
      break;
    }

    default: {
      logger.error(`Unhandled event: ${eeAirOutboundEvent.headers.eventName}`);
    }
  }
};

const handleCdpInboundEvent: InternalMessageHandler = async (
  appConfig,
  connectorConfig,
  message,
  attributes: Record<string, string>,
  logger: Logger,
) => {
  logger.info(`handleCdpInboundEvent: ${JSON.stringify(message)}`);
};

const handleCdpOutboundEvent: InternalMessageHandler = async (
  appConfig,
  connectorConfig,
  message,
  attributes: Record<string, string>,
  logger: Logger,
) => {
  const inConnectorConfig = BaseConnectorConfigSchema.parse(connectorConfig);

  const cdpOutboundEventPayload = CdpOutboundEventPayloadSchema.parse(message);

  const url = getAirUrl(inConnectorConfig, cdpOutboundEventPayload.type, logger);

  const eeAirInboundEvent: EeAirInboundEvent = {
    type: 'ee-air-inbound-event',
    connectorConfig,
    payload: {
      url: url.href,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cdpOutboundEventPayload),
    },
  };

  await sendInternalMessage(appConfig, eeAirInboundEvent, attributes, logger);
};

const handleEeAirInboundEvent: InternalMessageHandler = async (
  appConfig,
  connectorConfig,
  message,
  attributes: Record<string, string>,
  logger: Logger,
) => {
  const eeAirInboundEventPayload = EeAirInboundEventPayloadSchema.parse(message);

  const airClient = new EeAirClient(
    connectorConfig.credentials.clientId,
    connectorConfig.credentials.secret,
    connectorConfig.domains,
    logger,
  );

  await airClient.makeApiRequest(eeAirInboundEventPayload);
};

const handlePermanentMessageDeliveryFailure = async (
  appConfig: ApplicationConfig,
  connectorConfig: unknown,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger,
) => {
  await sendInternalMessageToDlq(appConfig, message, attributes, logger);
};

const applicationConfig: ApplicationConfig = {
  platformConfig: {
    platform: 'GCP',
    projectId: GCP_PROJECT_ID,
    internalMessagesTopicName: GCP_INTERNAL_MESSAGES_TOPIC_NAME,
    cdpDeadLetterQueue: GCP_INTERNAL_MESSAGES_DLQ_TOPIC_NAME,
    pubSubAuthenticatedPushServiceAccount:
      GCP_PUBSUB_AUTHENTICATED_PUSH_SERVICE_ACCOUNT,
    pubSubAuthenticatedPushAudience: GCP_PUBSUB_AUTHENTICATED_PUSH_AUDIENCE,
  },
  configPlatform: CONFIG_PLATFORM,
  configOverride: process.env.CONFIG_OVERRIDE
    ? JSON.parse(process.env.CONFIG_OVERRIDE)
    : undefined,
  configUrl: CONFIG_URL,
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
  handlePermanentMessageDeliveryFailure,
  traceIdName: DEFAULT_TRACE_ID_NAME,
  includeTraceIdInHttpResponseHeaders:
    DEFAULT_INCLUDE_TRACE_ID_IN_HTTP_RESPONSE_HEADERS,
};

connector(applicationConfig)
  .then(app => {
    app.listen(PORT);
  })
  .catch(error => {
    console.error(error);
  });
