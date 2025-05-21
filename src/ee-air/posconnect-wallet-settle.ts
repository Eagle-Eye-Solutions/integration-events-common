import {
  EeAirOutboundEvent,
  PointsAttributes,
  TierAttributes,
  TransactionAttributes,
} from '..';
import {
  CouponWithValueAttributes,
  POSConnectWalletSettleEventData,
} from '../types';
import {isTierMembershipEntity} from './atomic-operations';
import {
  isWalletTransactionEntityUpdateSettleSettled,
  isWalletAccountTransactionEntityUpdateRedeemEcoupon,
  isWalletAccountTransactionEntityUpdateCreditPoints,
} from './atomic-operations';
import AtomicOperations from './atomic-operations';
import {BaseEventHandlerOpts} from './types';

/**
 * Returns an array of events derived from a POSCONNECT.WALLET.SETTLE event.
 *
 * @param event
 * @param configuration
 * @returns
 */
export function getPosConnectWalletSettleEventData(
  event: EeAirOutboundEvent,
  opts: BaseEventHandlerOpts,
): POSConnectWalletSettleEventData {
  let transactionAttributes: TransactionAttributes | null = null;
  let pointsAttributes: PointsAttributes | null = null;
  let tierAttributes: TierAttributes | null = null;

  const redeemedCoupons: CouponWithValueAttributes[] = [];

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityUpdateCreditPoints(op)) {
      pointsAttributes =
        AtomicOperations.WalletAccountTransactionEntity.UpdateCreditPoints.getPointsAttributes(
          op,
        );
    } else if (isTierMembershipEntity(op)) {
      tierAttributes =
        AtomicOperations.TierMembershipEntity.getTierAttributes(op);
    } else if (isWalletAccountTransactionEntityUpdateRedeemEcoupon(op)) {
      redeemedCoupons.push(
        AtomicOperations.WalletAccountTransactionEntity.UpdateRedeemEcoupon.getCouponAttributes(
          op,
        ),
      );
    } else if (isWalletTransactionEntityUpdateSettleSettled(op)) {
      transactionAttributes =
        AtomicOperations.WalletTransactionEntity.UpdateSettleSettled.getTransactionAttributes(
          op,
        );
    }
  }

  if (transactionAttributes === null) {
    throw new RangeError(
      'WalletTransactionEntity/Update/Settle/Settled not found in POSCONNECT.WALLET.SETTLE',
    );
  }

  const posConnectWalletSettleEventData: POSConnectWalletSettleEventData = {
    ...(pointsAttributes ? {points: pointsAttributes} : {}),
    ...(tierAttributes ? {tier: tierAttributes} : {}),
    ...(transactionAttributes ? {transaction: transactionAttributes} : {}),
    redeemedCoupons,
    currencyCode: opts.connectorConfig.configuration.currency,
  };

  return posConnectWalletSettleEventData;
}
