import {EeAirOutboundEvent} from '..';
import {
  CouponWithValueAttributes,
  WalletAccountTransactionRedeemEventData,
} from '../types';
import AtomicOperations, {
  isWalletAccountTransactionEntityUpdateRedeemEcoupon,
} from './atomic-operations';

/**
 * Returns data extracted from a WALLET.ACCOUNT.TRANSACTION.REDEEM event.
 *
 * @param event
 * @returns
 */
export function getWalletAccountTransactionRedeemEventData(
  event: EeAirOutboundEvent,
): WalletAccountTransactionRedeemEventData {
  const redeemedCoupons: CouponWithValueAttributes[] = [];

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityUpdateRedeemEcoupon(op)) {
      redeemedCoupons.push(
        AtomicOperations.WalletAccountTransactionEntity.UpdateRedeemEcoupon.getCouponAttributes(
          op,
        ),
      );
    }
  }

  return {
    redeemedCoupons,
  };
}
