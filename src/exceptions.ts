import {EeApiErrorType} from './types';

export class EeApiException extends Error {
  constructor(
    readonly type: EeApiErrorType,
    message: string,
  ) {
    super(message);
  }
}

export class TemporaryDeliveryFailure extends Error {}

export class PermanentDeliveryFailure extends Error {}
