import {InternalCompoundMessage} from '../../src/types';

export type ReceivedPubSubMessage = {
  attributes: Record<string, string>;
  data: InternalCompoundMessage;
};
