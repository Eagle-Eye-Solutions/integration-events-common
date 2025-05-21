import type {Request, Response} from 'express';
import createError from 'http-errors';
import memoize from 'memoizee';
import {env} from './env';
import {Logger} from './logger';
import {
  ApplicationConfig,
  CdpOutboundEvent,
  CdpOutboundRequestBodySchema,
  FormattedError,
} from './types';
import {TemporaryDeliveryFailure} from './exceptions';
import {sendInternalMessage} from './platform';
import {ZodError} from 'zod';
import {
  BaseConnectorConfig,
  BaseConnectorConfigSchema,
} from './types/connector-config';

function redact(input: string) {
  return input[0] + '*'.repeat(input.length - 2) + input.slice(-1);
}

export async function getConnectorConfigInternal({
  appConfig,
  connectorId,
  externalKey,
  direction,
  logger,
}: {
  appConfig: ApplicationConfig;
  connectorId: string;
  externalKey: string;
  direction: 'in' | 'out' | null;
  logger: Logger;
}): Promise<BaseConnectorConfig | null> {
  logger.debug(
    `getConnectorConfigInternal: ${JSON.stringify({connectorId, direction})}`,
  );

  if (
    direction !== null &&
    appConfig.configOverride?.[direction] &&
    connectorId === appConfig.configOverride[direction].connectorId &&
    externalKey === appConfig.configOverride[direction].externalKey
  ) {
    logger.debug(
      `configOverride found for direction=${direction} connectorId=${connectorId} externalKey=${redact(externalKey)}`,
    );
    return appConfig.configOverride[direction].connectorConfig;
  }

  const url = `${appConfig.configUrl}/connectors/${connectorId}/config?platform=${appConfig.configPlatform}&key=${externalKey}`;
  const redactedUrl = `${appConfig.configUrl}/connectors/${connectorId}/config?platform=${appConfig.configPlatform}&key=${redact(externalKey)}`;
  try {
    const t0 = performance.now();
    const response = await fetch(url);
    const t1 = performance.now();

    logger.info(
      `GET ${redactedUrl}: ${response.status} ${response.statusText} (${t1 - t0}ms)`,
    );

    if (response.ok) {
      const connectorConfig = BaseConnectorConfigSchema.parse(
        await response.json(),
      );
      return connectorConfig;
    } else {
      logger.error(
        `GET ${redactedUrl}: ${response.status} ${response.statusText}`,
      );
      return null;
    }
  } catch (err) {
    logger.error(err, `GET ${redactedUrl} failed`);
    return null;
  }
}

export const getConnectorConfig = memoize(getConnectorConfigInternal, {
  maxAge: env.CONFIG_API_RESPONSE_TTL_MS,
  normalizer: function (args) {
    const {connectorId, externalKey, direction} = args[0];
    return `${connectorId}-${externalKey}-${direction}`;
  },
});

export async function handleEeAirOutboundRequest(
  req: Request,
  res: Response,
): Promise<void> {
  const appConfig = res.app.get('appConfig') as ApplicationConfig;
  const connectorId = req.params.connectorId;
  const externalKey = req.get('X-Auth-Token');

  req.log.info(
    {
      'ee-air-outbound-request': req.body,
      connectorId,
    },
    `ee-air-outbound-request: method=${req.method}, url=${req.originalUrl} connectorId=${connectorId}`,
  );

  try {
    if (!externalKey) {
      throw createError.Unauthorized();
    }

    const direction = 'out';
    const eventType = 'ee-air-outbound-event';

    const attributes: Record<string, string> = {};

    const requestBody = req.body;
    attributes[appConfig.traceIdName] = `${req.id}`;

    const connectorConfig = await getConnectorConfig({
      appConfig,
      connectorId,
      externalKey,
      direction,
      logger: req.log,
    });

    if (!connectorConfig) {
      throw createError.Forbidden();
    }

    await sendInternalMessage(
      appConfig,
      {
        type: eventType,
        connectorConfig,
        payload: requestBody,
      },
      attributes,
      req.log,
    );

    res.status(200).send({status: 'OK'});
  } catch (error) {
    req.log.error(error, 'Error in handleEeAirOutboundRequest');
    throw error;
  }
}

export async function handleCdpOutboundRequest(
  req: Request,
  res: Response,
): Promise<void> {
  const appConfig = res.app.get('appConfig') as ApplicationConfig;
  const connectorId = req.params.connectorId;
  const externalKey = req.get('X-Auth-Token');

  req.log.info(
    {
      'cdp-outbound-request': req.body,
      connectorId,
    },
    `cdp-outbound-request: method=${req.method}, url=${req.originalUrl}, connectorId=${connectorId}`,
  );

  try {
    if (!externalKey) {
      throw createError.Unauthorized();
    }

    // direction is relative to AIR
    const direction = 'in';

    const attributes: Record<string, string> = {};

    const requestBody = CdpOutboundRequestBodySchema.parse(req.body);

    attributes[appConfig.traceIdName] = `${req.id}`;

    const connectorConfig = await getConnectorConfig({
      appConfig,
      connectorId,
      externalKey,
      direction,
      logger: req.log,
    });

    if (!connectorConfig) {
      throw createError.Forbidden();
    }

    const cdpOutboundEvent: CdpOutboundEvent = {
      type: 'cdp-outbound-event',
      connectorConfig,
      payload: requestBody,
    };

    await sendInternalMessage(appConfig, cdpOutboundEvent, attributes, req.log);

    res.status(200).send({status: 'OK'});
  } catch (error) {
    if (error instanceof ZodError) {
      req.log.error(error, 'Invalid request from CDP');
      const formattedError = handleZodError(error as ZodError, req.log);
      if (formattedError) {
        res.status(400).send(formattedError);
        return;
      }
    }
    req.log.error(error, 'Error in handleCdpOutboundRequest');
    throw error;
  }
}

export async function handleInternalMessage(req: Request, res: Response) {
  const appConfig = res.app.get('appConfig') as ApplicationConfig;
  const {message, attributes} =
    appConfig.routes.internal.getInternalMessageFromRequest(appConfig, req);
  const handler = appConfig.routes.internal.handlers[message.type];

  const connectorId = new URL(message.connectorConfig.connection_url).pathname
    .split('/')
    .at(-1);

  req.log.info(
    {
      'internal-message': {
        type: message.type,
        payload: message.payload,
      },
      connectorId,
    },
    `internal-message: ${message.type}, connectorId: ${connectorId}`,
  );

  try {
    await handler(
      res.app.get('appConfig'),
      message.connectorConfig,
      message.payload,
      attributes,
      req.log,
    );

    res.status(200).send({status: 'OK'});
  } catch (error) {
    req.log.error(error);
    if (error instanceof TemporaryDeliveryFailure) {
      throw createError.InternalServerError();
    } else {
      const formattedError =
        await appConfig.handlePermanentMessageDeliveryFailure(
          res.app.get('appConfig'),
          message.connectorConfig,
          message,
          attributes,
          req.log,
          error,
        );
      if (formattedError) {
        res.status(400).send(formattedError);
      } else {
        // In the case of permanent delivery failure, we do not
        // want the caller to retry, so we respond with a 200 OK.
        res.status(200).send({status: 200});
      }
    }
  }
}

export async function handleStatus(_req: Request, res: Response) {
  const appConfig = res.app.get('appConfig');

  res.status(200).send({
    api: appConfig.appMetadata.name,
    version: appConfig.appMetadata.version,
    tagline: appConfig.appMetadata.tagline,
  });
}

export const formatZodError = (
  error: ZodError,
  logger: Logger,
): FormattedError => {
  const formattedError: FormattedError = {
    message: 'Validation error',
    errors: error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message,
    })),
  };

  logger.error(formattedError);

  return formattedError;
};

export const handleZodError = (
  error: ZodError,
  logger: Logger,
): FormattedError | void => {
  if (error instanceof ZodError) {
    const formatted = formatZodError(error, logger);
    return formatted;
  }
};
