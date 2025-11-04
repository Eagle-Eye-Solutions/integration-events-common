import {pino} from 'pino';
import pinoHttp from 'pino-http';
import pretty from 'pino-pretty';
import {createGcpLoggingPinoConfig} from '@google-cloud/pino-logging-gcp-config';
import {isGoogleCloudRun} from './platform';
import {env} from './env';
import {ApplicationConfig, defaultLogRequestHeadersAllowList} from './types';

export const logger = pino(
  isGoogleCloudRun()
    ? createGcpLoggingPinoConfig()
    : pretty({sync: true, hideObject: true}),
);

logger.level = env.LOG_LEVEL;

export function httpLogger(appConfig: ApplicationConfig) {
  const logRequestHeadersAllowList =
    appConfig.logRequestHeadersAllowList ?? defaultLogRequestHeadersAllowList;

  const httpLogger = pinoHttp({
    logger,
    serializers: {
      req: (req: any) => {
        const output: {
          id: unknown;
          method?: string;
          path?: string;
          headers: Record<string, string | string[] | undefined>;
        } = {
          id: req.raw.id,
          method: req.raw.method,
          path: req.raw.url?.split('?')[0], // Remove query params which might be sensitive
          headers: {},
        };

        logRequestHeadersAllowList.forEach(header => {
          output.headers[header] = req.raw.headers[header];
        });

        return output;
      },
    },
    redact: appConfig.loggerRedactOptions,
  });

  return httpLogger;
}

export {Logger} from 'pino';
