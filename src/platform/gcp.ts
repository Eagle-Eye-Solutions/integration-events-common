import {PubSub, Topic} from '@google-cloud/pubsub';
import {ApplicationConfig} from '../types';
import {Request, Response, NextFunction} from 'express';
import {OAuth2Client} from 'google-auth-library';
import createError from 'http-errors';
import {Logger} from '../logger';

const authClient = new OAuth2Client();

const pubsubClients: Record<string, PubSub> = {};
const topicClients: Record<string, Topic> = {};

export async function sendMessageToGcpPubSubTopic(
  appConfig: ApplicationConfig,
  topicName: string,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger,
): Promise<void> {
  const projectId = appConfig.platformConfig.projectId;
  if (!pubsubClients[projectId]) {
    pubsubClients[projectId] = new PubSub({projectId});
  }
  const pubsub = pubsubClients[projectId];

  const actualTopicName = process.env.SIMULATE_PUBSUB_FAILURE
    ? 'fake-topic'
    : topicName;
  const topicKey = `${projectId}:${actualTopicName}`;
  if (!topicClients[topicKey]) {
    topicClients[topicKey] = pubsub.topic(actualTopicName);
  }
  const topic = topicClients[topicKey];

  try {
    await topic.publishMessage({
      json: message,
      attributes,
    });
    logger.debug(`Published message to topic: ${topic.name}`);
  } catch (err) {
    logger.error(err, `Error publishing to topic: ${topic.name}`);
    throw err;
  }
}

export function unwrapPubSubMessage(request: Request) {
  if (typeof request?.body?.message?.data === 'string') {
    // Assume received as Pub/Sub wrapped data, so we need to unwrap it.
    return JSON.parse(
      Buffer.from(request.body.message.data, 'base64').toString('utf-8'),
    );
  } else {
    throw new Error(`Unexpected data format: ${JSON.stringify(request.body)}`);
  }
}

export function isGoogleCloudRun() {
  return process.env.K_SERVICE !== undefined;
}

export async function requireGoogleJwt(
  appConfig: ApplicationConfig,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.get('Authorization');
  if (authHeader === undefined) {
    throw createError.Unauthorized('Authorization header not found');
  }

  const [, token] = authHeader.match(/Bearer (.*)/) ?? [];
  if (token === undefined) {
    throw createError.Unauthorized('Bearer token not found');
  }

  const ticket = await authClient.verifyIdToken({
    idToken: token,
    audience: appConfig.platformConfig.pubSubAuthenticatedPushAudience,
  });

  const claim = ticket.getPayload();

  if (
    claim?.email_verified &&
    claim?.email ===
      appConfig.platformConfig.pubSubAuthenticatedPushServiceAccount
  ) {
    next();
  } else {
    throw createError.Unauthorized(
      `Invalid claims: ${JSON.stringify({claim})}`,
    );
  }
}

export default {
  sendMessageToGcpPubSubTopic,
  unwrapPubSubMessage,
  isGoogleCloudRun,
  requireGoogleJwt,
};
