import express, {Express, Request, Response, NextFunction} from 'express';
import {ApplicationConfig} from './types/index';
import {
  handleEeAirOutboundRequest,
  handleCdpOutboundRequest,
  handleInternalMessage,
  handleStatus,
} from './handlers';
import {isGoogleCloudRun, requireGoogleJwt} from './platform';
import {httpLogger} from './logger';
import {v4 as uuidv4} from 'uuid';
import {createNewRelicMiddleware} from './common/newrelic-middleware';

export const DEFAULT_TRACE_ID_NAME = 'x-ees-connector-trace-id';
export const DEFAULT_INCLUDE_TRACE_ID_IN_HTTP_RESPONSE_HEADERS = true;

function defaultCdpRequestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  req.id = uuidv4();
  next();
}

export async function connector(appConfig: ApplicationConfig) {
  const app: Express = express();

  app.set('appConfig', appConfig);

  app.use(express.json());

  // External requests coming from EE AIR - we take the eesEventId from the
  // request body headers.
  app.use(
    `/out/${appConfig.configPlatform.toLowerCase()}/:connectorId`,
    (req: Request, res: Response, next) => {
      req.id = req?.body?.headers?.eesEventId;
      next();
    },
  );

  // Requests incoming from GCP Pub/Sub - we take the trace id from the
  // message attributes.
  app.use(
    appConfig.routes.internal.path,
    (req: Request, res: Response, next) => {
      req.id = req?.body?.message?.attributes?.[appConfig.traceIdName];
      next();
    },
  );

  // External requests coming from the CDP - we either generate a random
  // trace id, or use a custom function to extract one from the incoming
  // request (if supplied).
  if (appConfig.routes) {
    if (appConfig.pathSpecificCustomCdpRequestIdMiddlewares) {
      for (const x of appConfig.pathSpecificCustomCdpRequestIdMiddlewares) {
        app.use(x.path, x.customCdpRequestIdMiddleware);
      }
    } else {
      app.use(
        `/in/${appConfig.configPlatform.toLowerCase()}/:connectorId`,
        appConfig.customCdpRequestIdMiddleware ?? defaultCdpRequestIdMiddleware,
      );
    }
  }

  if (appConfig.includeTraceIdInHttpResponseHeaders) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.set(appConfig.traceIdName, `${req.id}`);
      next();
    });
  }

  app.use(httpLogger(appConfig));

  // Middeware to set custom attributes to New Relic transactions
  app.use(createNewRelicMiddleware());

  app.get('/status', handleStatus);

  app.get(
    `/out/${appConfig.configPlatform.toLowerCase()}/status`,
    handleStatus,
  );

  app.use(
    `/out/${appConfig.configPlatform.toLowerCase()}/:connectorId`,
    handleEeAirOutboundRequest,
  );

  if (appConfig.routes) {
    if (appConfig.routes.in) {
      app.use(
        `/in/${appConfig.configPlatform.toLowerCase()}`,
        appConfig.routes.in,
      );
    } else {
      app.get(
        `/in/${appConfig.configPlatform.toLowerCase()}/status`,
        handleStatus,
      );
      app.use(
        `/in/${appConfig.configPlatform.toLowerCase()}/:connectorId`,
        handleCdpOutboundRequest,
      );
    }

    if (appConfig.platformConfig.platform === 'GCP' && isGoogleCloudRun()) {
      app.use(
        appConfig.routes.internal.path,
        async (req: Request, res: Response, next: NextFunction) => {
          await requireGoogleJwt(appConfig, req, res, next);
        },
      );
    }
    app.use(appConfig.routes.internal.path, handleInternalMessage);
  }

  return app;
}

export default connector;
