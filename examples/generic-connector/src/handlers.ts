import {
  ApplicationConfig,
  sendInternalMessage,
  EeAirClient,
  TemporaryDeliveryFailure,
  PermanentDeliveryFailure,
  Logger,
  EeAirOutboundEventSchema,
  getAirIdentities,
} from '../../../src';
import {
  GenericInConnectorConfig,
  GenericInConnectorConfigSchema,
  GenericOutConnectorConfig,
  GenericOutConnectorConfigSchema,
  GenericConnectorInternalMessagePayload,
  GenericConnectorInternalMessagePayloadSchema,
  GenericConnectorCdpOutboundEventSchema,
} from './types';

export async function handleEeAirInboundEvent(
  appConfig: ApplicationConfig,
  connectorConfig: unknown,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger,
) {
  const genericConnectorConfig =
    GenericInConnectorConfigSchema.parse(connectorConfig);
  const genericConnectorInternalMessagePayload =
    GenericConnectorInternalMessagePayloadSchema.parse(message);

  return sendMessageToAir(
    appConfig,
    genericConnectorConfig,
    genericConnectorInternalMessagePayload,
    attributes,
    logger,
  );
}

async function sendMessageToAir(
  appConfig: ApplicationConfig,
  connectorConfig: GenericInConnectorConfig,
  message: GenericConnectorInternalMessagePayload,
  attributes: Record<string, string>,
  logger: Logger,
): Promise<void> {
  const credentials = connectorConfig.credentials;
  if (credentials) {
    const airClient = new EeAirClient(
      credentials.clientId,
      credentials.secret,
      connectorConfig.domains,
      logger,
    );
    await airClient.makeApiRequest(message);
  } else {
    // Will change once type definitions are settled.
    throw new TemporaryDeliveryFailure(
      "No API credentials. Can't process event.",
    );
  }
}

function getCdpIdentity(
  airIdentities: ReturnType<typeof getAirIdentities>,
  connectorConfig: GenericOutConnectorConfig,
) {
  const preferredIdentity = airIdentities.find(
    i => i.type === connectorConfig.configuration.identityType,
  );

  if (!preferredIdentity) {
    throw new Error(
      `Failed to find preferred identity type ${connectorConfig.configuration.identityType}`,
    );
  }

  return preferredIdentity;
}

export async function handleEeAirOutboundEvent(
  appConfig: ApplicationConfig,
  connectorConfig: unknown,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger,
) {
  const eeAirOutboundEvent = EeAirOutboundEventSchema.parse(message);

  const airIdentities = getAirIdentities(eeAirOutboundEvent);

  const cdpIdentity = getCdpIdentity(
    airIdentities,
    GenericOutConnectorConfigSchema.parse(connectorConfig),
  );

  await sendInternalMessage(
    appConfig,
    {
      type: 'cdp-inbound-event',
      connectorConfig,
      payload: {
        url: '',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        identity: cdpIdentity,
        body: JSON.stringify(eeAirOutboundEvent),
      },
    },
    attributes,
    logger,
  );
}

export async function handleCdpInboundEvent(
  appConfig: ApplicationConfig,
  connectorConfig: unknown,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger,
) {
  const genericConnectorConfig =
    GenericOutConnectorConfigSchema.parse(connectorConfig);
  const genericConnectorInternalMessagePayload =
    GenericConnectorInternalMessagePayloadSchema.parse(message);

  return sendMessageToCdp(
    appConfig,
    genericConnectorConfig,
    genericConnectorInternalMessagePayload,
    logger,
  );
}

async function sendMessageToCdp(
  appConfig: ApplicationConfig,
  connectorConfig: GenericOutConnectorConfig,
  message: GenericConnectorInternalMessagePayload,
  logger: Logger,
): Promise<void> {
  const url = `${connectorConfig.configuration.cdpBaseUrl}/${message.url}`;
  const method = message.method;
  const headers = {
    ...message.headers,
    'X-API-KEY': connectorConfig.configuration.cdpApiKey,
  };
  const body = message.body;

  const t0 = performance.now();
  const response = await fetch(url as string, {
    method,
    headers,
    body,
  });
  const t1 = performance.now();

  logger.info(
    `${method} ${url}: ${response.status} ${response.statusText} (${t1 - t0}ms)`,
  );

  if (!response.ok) {
    if (response.status >= 500) {
      throw new TemporaryDeliveryFailure(
        `Failed to deliver message to CDP: ${response.statusText}, will retry`,
      );
    } else if (response.status >= 400) {
      throw new PermanentDeliveryFailure(
        `Failed to deliver message to CDP: ${response.statusText}`,
      );
    }
  }
}

export async function handleCdpOutboundEvent(
  appConfig: ApplicationConfig,
  connectorConfig: unknown,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger,
) {
  const cdpOutboundEvent =
    GenericConnectorCdpOutboundEventSchema.parse(message);

  await sendInternalMessage(
    appConfig,
    {
      type: 'ee-air-inbound-event',
      connectorConfig,
      payload: {
        url: cdpOutboundEvent.baseUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cdpOutboundEvent.body),
      },
    },
    attributes,
    logger,
  );
}
