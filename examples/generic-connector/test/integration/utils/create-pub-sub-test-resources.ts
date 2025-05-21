import {Message, Subscription, Topic, PubSub} from '@google-cloud/pubsub';

const pubSubClient = new PubSub({projectId: 'test-project'});

export async function initializePubSubResources(
  topicName: string,
  subscriptionName: string,
  messages?: unknown[],
): Promise<Subscription> {
  const topicDefinition: Topic = pubSubClient.topic(topicName);

  await topicDefinition.get({autoCreate: true});

  const subscriptionDefinition: Subscription =
    topicDefinition.subscription(subscriptionName);
  const [subscription] = await subscriptionDefinition.get({autoCreate: true});

  if (messages) {
    subscription.on('message', (message: Message) => {
      messages.push({
        attributes: message.attributes,
        data: JSON.parse(message.data.toString()),
      });
    });
  }

  // Register an error handler.
  subscription.on('error', (err: unknown) => {
    if (process.env?.LOG_LEVEL === 'debug') {
      console.error(err);
    }
  });

  // Register a debug handler, to catch non-fatal errors and other messages.
  subscription.on('debug', (msg: {message: unknown}) => {
    if (process.env?.LOG_LEVEL === 'debug') {
      console.log(msg.message);
      console.log(msg);
    }
  });

  return subscription;
}

export function wrapPubSubMessage(
  message: unknown,
  attributes: Record<string, string>,
) {
  return {
    message: {
      data: Buffer.from(JSON.stringify(message)).toString('base64'),
      attributes,
    },
  };
}
