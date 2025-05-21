import {Subscription} from '@google-cloud/pubsub';
import {FetchMock} from 'jest-fetch-mock';
import {initializePubSubResources} from './create-pub-sub-test-resources';
import {ReceivedPubSubMessage} from '../types';

export async function setupBeforeAll(
  fetchMock: FetchMock,
  internalMessages: ReceivedPubSubMessage[] = [],
  internalMessagesDlq: ReceivedPubSubMessage[] = [],
): Promise<{subscription: Subscription; dlqSubscription: Subscription}> {
  fetchMock.enableMocks();

  return {
    subscription: await initializePubSubResources(
      'internal-messages',
      'internal-messages-subscription',
      internalMessages,
    ),

    dlqSubscription: await initializePubSubResources(
      'internal-messages-dlq',
      'internal-messages-dlq-subscription',
      internalMessagesDlq,
    ),
  };
}

export function setupBeforeEach(
  fetchMock: FetchMock,
  internalMessages: ReceivedPubSubMessage[] = [],
  internalMessagesDlq: ReceivedPubSubMessage[] = [],
): void {
  fetchMock.resetMocks();
  internalMessages.length = 0;
  internalMessagesDlq.length = 0;
}

export async function setupAfterAll(
  fetchMock: FetchMock,
  internalMessagesSubscription?: Subscription,
  internalMessagesDlqSubscription?: Subscription,
): Promise<void> {
  fetchMock.disableMocks();
  if (internalMessagesSubscription) {
    await internalMessagesSubscription.delete();
  }
  if (internalMessagesDlqSubscription) {
    await internalMessagesDlqSubscription.delete();
  }
}
