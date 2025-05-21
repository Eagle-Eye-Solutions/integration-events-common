import {ApplicationConfig, GetInternalMessageFromRequestOutput} from '../types';
import gcp, {
  unwrapPubSubMessage,
  isGoogleCloudRun,
  requireGoogleJwt,
} from './gcp';
import {Request} from 'express';
import {Logger} from '../logger';

export {isGoogleCloudRun, requireGoogleJwt} from './gcp';

export async function sendInternalMessage(
  appConfig: ApplicationConfig,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger,
): Promise<void> {
  if (appConfig.platformConfig.platform === 'GCP') {
    await gcp.sendMessageToGcpPubSubTopic(
      appConfig,
      appConfig.platformConfig.internalMessagesTopicName,
      message,
      attributes,
      logger,
    );
  } else {
    throw new Error(
      `Unsupported platform: ${appConfig.platformConfig.platform}`,
    );
  }
}

export async function sendInternalMessageToDlq(
  appConfig: ApplicationConfig,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger,
): Promise<void> {
  if (appConfig.platformConfig.platform === 'GCP') {
    await gcp.sendMessageToGcpPubSubTopic(
      appConfig,
      appConfig.platformConfig.cdpDeadLetterQueue,
      message,
      attributes,
      logger,
    );
  } else {
    throw new Error(
      `Unsupported platform: ${appConfig.platformConfig.platform}`,
    );
  }
}

export function getInternalMessageFromRequest(
  appConfig: ApplicationConfig,
  req: Request,
): GetInternalMessageFromRequestOutput {
  if (appConfig.platformConfig.platform === 'GCP') {
    const message = unwrapPubSubMessage(req);
    const attributes = req.body.message.attributes;

    return {message, attributes};
  } else {
    throw new Error(
      `Unsupported platform: ${appConfig.platformConfig.platform}`,
    );
  }
}

export default {
  sendInternalMessage,
  sendInternalMessageToDlq,
  getInternalMessageFromRequest,
  isGoogleCloudRun,
  requireGoogleJwt,
};
