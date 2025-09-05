import {
  CouponWithValueAttributes,
  EeAirOutboundEvent,
  PointsAttributes,
  TierAttributes,
  TransactionAttributes,
} from '..';
import {POSConnectWalletRefundEventData} from '../types';
import {BaseEventHandlerOpts} from './types';
import {getPointsAttributesFromWalletAccountTransactionEntity} from './atomic-operations/wallet-account-transaction-entity';
import AtomicOperations, {
  isTierMembershipEntity,
  isWalletAccountTransactionEntityUpdatePoints,
  isWalletAccountTransactionEntityUpdateRedeemEcoupon,
  isWalletAccountTransactionEntityUpdateUnredeemEcoupon,
  isWalletTransactionEntityCreateRefundSettled,
} from './atomic-operations';

/**
 * Returns an array of events derived from a POSCONNECT.WALLET.REFUND event.
 *
 * Note that a refund may either be a full refund (i.e. all products in the original
 * order are refunded) or a partial refund, where only a subset of the original
 * products are refunded.
 *
 * Handling of Points accounts
 *
 * For a full refund, we expect a walletAccountTransactionEntity/UPDATE/POINTS
 * with event = REFUND_DEBIT to be the only operation on the points account, so
 * this is used to derive the new points balances.
 *
 * For a partial refund, we expect the same walletAccountTransactionEntity/UPDATE/POINTS
 * with event = REFUND_DEBIT that deducts the original total number of points
 * awarded, followed by a walletAccountTransactionEntity/UPDATE/POINTS with event = EARN
 * that awards points for the non-refunded items in the original order.
 *
 * @param event
 * @param configuration
 * @returns
 */
export function getPosConnectWalletRefundEventData(
  event: EeAirOutboundEvent,
  opts: BaseEventHandlerOpts,
): POSConnectWalletRefundEventData {
  let transactionAttributes: TransactionAttributes | null = null;
  let pointsAttributes: PointsAttributes | null = null;
  let tierAttributes: TierAttributes | null = null;

  const redeemedCoupons: CouponWithValueAttributes[] = [];
  const unredeemedCoupons: CouponWithValueAttributes[] = [];

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityUpdatePoints(op)) {
      try {
        pointsAttributes =
          getPointsAttributesFromWalletAccountTransactionEntity(op as any);
      } catch {
        // Ignore if balance not available on this op.
        // By taking the latest POINTS balance observed in the operations list,
        // we ensure that we always have the most up-to-date balance regardless
        // of the its type.
      }
    } else if (isTierMembershipEntity(op)) {
      tierAttributes =
        AtomicOperations.TierMembershipEntity.getTierAttributes(op);
    } else if (isWalletAccountTransactionEntityUpdateRedeemEcoupon(op)) {
      redeemedCoupons.push(
        AtomicOperations.WalletAccountTransactionEntity.UpdateRedeemEcoupon.getCouponAttributes(
          op,
        ),
      );
    } else if (isWalletAccountTransactionEntityUpdateUnredeemEcoupon(op)) {
      unredeemedCoupons.push(
        AtomicOperations.WalletAccountTransactionEntity.UpdateUnredeemEcoupon.getCouponAttributes(
          op,
        ),
      );
    } else if (isWalletTransactionEntityCreateRefundSettled(op)) {
      transactionAttributes =
        AtomicOperations.WalletTransactionEntity.CreateRefundSettled.getTransactionAttributes(
          op,
        );
    }
  }

  /* An attempt to get overall discount amount not present after a refund.
   * This can be discounted from the total amount to get the proper amount
   * being refunded (totalUnitCostAfterDiscount does not include cart discounts).
   */
  const previousDiscounts =
    unredeemedCoupons.reduce((acc, coupon) => {
      return acc + coupon.value;
    }, 0) -
    redeemedCoupons.reduce((acc, coupon) => {
      return acc + coupon.value;
    }, 0);

  if (transactionAttributes === null) {
    // TODO: more useful error message / context
    throw new RangeError(
      'WalletTransactionEntity/Update/Settle/Settled not found in POSCONNECT.WALLET.SETTLE',
    );
  }

  if (transactionAttributes.totalBasketValueAfterDiscount !== undefined) {
    transactionAttributes.totalBasketValueAfterDiscount -= previousDiscounts;
  }

  const posConnectWalletRefundEventData: POSConnectWalletRefundEventData = {
    ...(pointsAttributes ? {points: pointsAttributes} : {}),
    ...(tierAttributes ? {tier: tierAttributes} : {}),
    ...(transactionAttributes ? {transaction: transactionAttributes} : {}),
    redeemedCoupons,
    unredeemedCoupons,
    currencyCode: opts.connectorConfig.configuration.currency,
  };

  return posConnectWalletRefundEventData;
}
