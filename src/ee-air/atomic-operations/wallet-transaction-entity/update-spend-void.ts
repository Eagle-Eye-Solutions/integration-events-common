import {
  PointsAttributes,
  SpendTransactionAttributes,
  WalletTransactionEntityUpdateSpend,
  EeAirOutboundEvent,
} from '../../../types';
import {getStoreLocationAttributes} from './common';

export function getPointsAttributesFromWalletTransactionEntityUpdateSpendVoid(
  entity: WalletTransactionEntityUpdateSpend,
): PointsAttributes {
  const balanceAfter =
    entity.objectValue.basket?.summary?.spendAdjudicationResults?.balanceAfter
      .current || 0;
  const pointsValue =
    entity.objectValue.basket?.summary?.spendAdjudicationResults?.pointsValue ||
    0;

  return {
    pointsBalance: balanceAfter + pointsValue,
  };
}

export function getTransactionAttributesFromWalletTransactionEntityUpdateSpendVoid(
  entity: WalletTransactionEntityUpdateSpend,
  eeAirOutboundEvent: EeAirOutboundEvent,
): SpendTransactionAttributes {
  const transactionAttributes: SpendTransactionAttributes = {};

  transactionAttributes.transactionReference = entity.objectValue.reference;

  const balanceAfter =
    entity.objectValue.basket?.summary?.spendAdjudicationResults?.balanceAfter
      .current || 0;
  const pointsValue =
    entity.objectValue.basket?.summary?.spendAdjudicationResults?.pointsValue ||
    0;
  const pointsSpent =
    entity.objectValue.basket?.summary?.results?.points.spend || 0;

  transactionAttributes.pointsSpent = pointsSpent;
  transactionAttributes.pointsBalance = balanceAfter + pointsValue;

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
