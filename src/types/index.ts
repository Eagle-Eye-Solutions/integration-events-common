import {Request, RequestHandler, Router} from 'express';
import {redactOptions} from 'pino';
import {Logger} from '../logger';
import {InternalMessageType, InternalMessage} from './internal-message';
import {BaseConnectorConfig} from './connector-config';

export * from './logger';
export * from './ee-air';
export * from './internal-message';
export * from './requests';
export * from './connector-config';

export type InternalMessageHandler = (
  appConfig: ApplicationConfig,
  connectorConfig: BaseConnectorConfig,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger,
  error?: unknown,
) => void | Promise<void> | Promise<FormattedError | undefined | void>;

export interface PlatformConfigGcp {
  platform: 'GCP';
  projectId: string;
  internalMessagesTopicName: string;
  cdpDeadLetterQueue: string;
  pubSubAuthenticatedPushServiceAccount: string;
  pubSubAuthenticatedPushAudience: string;
}

export const defaultLogRequestHeadersAllowList = [
  'accept-encoding',
  'accept',
  'content-encoding',
  'content-length',
  'content-type',
  'forwarded',
  'from',
  'host',
  'traceparent',
  'user-agent',
  'x-forwarded-for',
  'x-forwarded-proto',
  'called-unique-id',
  'caller-unique-id',
] as const;

export const defaultLoggerRedactOptions = [];

export type GetInternalMessageFromRequestOutput = {
  message: InternalMessage;
  attributes: Record<string, string>;
};

export interface ApplicationConfig {
  platformConfig: PlatformConfigGcp;
  configPlatform: string;
  configUrl: string;
  configOverride?: {
    in?: {
      connectorId: string;
      externalKey: string;
      connectorConfig: BaseConnectorConfig;
    };
    out?: {
      connectorId: string;
      externalKey: string;
      connectorConfig: BaseConnectorConfig;
    };
  };
  routes: {
    internal: {
      path: string;
      getInternalMessageFromRequest: (
        appConfig: ApplicationConfig,
        req: Request,
      ) => GetInternalMessageFromRequestOutput;
      handlers: Record<InternalMessageType, InternalMessageHandler>;
    };
    in?: Router;
  };

  /**
   * Optionally supply a custom function to set req.id. All logging emitted by the connector
   * will include this value. By default a randomly generated uuid will be used.
   */
  customCdpRequestIdMiddleware?: RequestHandler;

  /**
   * Optionally supply a list of path-specific middlewares that are intended
   * to populate req.id. These may be of use if a CDP sends requests to the
   * connector on custom routes (i.e. uses `routes.in` above).
   */
  pathSpecificCustomCdpRequestIdMiddlewares?: Array<{
    path: string;
    customCdpRequestIdMiddleware: RequestHandler;
  }>;

  appMetadata: {
    name: string;
    version: string;
    tagline: string;
  };

  handlePermanentMessageDeliveryFailure: InternalMessageHandler;

  /**
   * List of request headers that should be logged. Avoid including
   * "authorization" or other headers that may contain credentials.
   */
  logRequestHeadersAllowList?: string[];

  /**
   * Control redactions in logging output.
   */
  loggerRedactOptions?: redactOptions;

  /**
   * Set to the name that should be used for trace id header in HTTP response.
   *
   * Default: 'x-ees-connector-trace-id'
   */
  traceIdName: string;

  /**
   * Set to true to include trace id in HTTP response headers.
   *
   * Default: true
   */
  includeTraceIdInHttpResponseHeaders: boolean;
}

export interface FormattedError {
  message: string;
  errors: Array<{
    path: string;
    message: string;
  }>;
}
