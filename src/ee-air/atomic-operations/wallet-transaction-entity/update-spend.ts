import {
  SpendTransactionAttributes,
  WalletTransactionEntityUpdateSpend,
  EeAirOutboundEvent,
} from '../../../types';
import {getStoreLocationAttributes} from './common';

export function getTransactionAttributesFromWalletTransactionEntityUpdateSpend(
  entity: WalletTransactionEntityUpdateSpend,
  eeAirOutboundEvent: EeAirOutboundEvent,
): SpendTransactionAttributes {
  const transactionAttributes: SpendTransactionAttributes = {};

  transactionAttributes.transactionReference = entity.objectValue.reference;
  transactionAttributes.pointsSpent =
    entity.objectValue.basket?.summary?.results?.points.spend ?? 0;
  transactionAttributes.pointsBalance =
    entity?.objectValue.basket?.summary?.spendAdjudicationResults?.balanceAfter
      .current ?? 0;

  const storeLocation = getStoreLocationAttributes(entity);
  if (storeLocation) {
    transactionAttributes.storeLocation = storeLocation;
  }

  const spendRequestBody =
    typeof eeAirOutboundEvent.request.body === 'string'
      ? JSON.parse(eeAirOutboundEvent.request.body as string)
      : eeAirOutboundEvent.request.body;

  transactionAttributes.originalTransactionReference =
    spendRequestBody.parentWalletTransactionReference;

  return transactionAttributes;
}
