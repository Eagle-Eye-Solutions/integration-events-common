import {EeAirOutboundEvent} from '..';
import {
  CouponAttributes,
  StandardSubscriptionAttributes,
  WalletAccountUpdateEventData,
} from '../types';
import {
  getCouponAttributesFromWalletAccountTransactionEntity,
  getStandardSubscriptionAttributesFromWalletAccountTransactionEntity,
  isWalletAccountTransactionEntityUpdateStandardSubscription,
  isWalletAccountTransactionEntityUpdateEcouponEntitlement,
} from './atomic-operations';

/**
 * Returns an array of events derived from a WALLET.ACCOUNT.UPDATE event.
 *
 * @param event
 * @param configuration
 * @returns
 */
export function getWalletAccountUpdateEventData(
  event: EeAirOutboundEvent,
): WalletAccountUpdateEventData {
  let standardSubscriptionAttributes: StandardSubscriptionAttributes | null =
    null;
  const entitlements: CouponAttributes[] = [];

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityUpdateStandardSubscription(op)) {
      standardSubscriptionAttributes =
        getStandardSubscriptionAttributesFromWalletAccountTransactionEntity(op);
    } else if (isWalletAccountTransactionEntityUpdateEcouponEntitlement(op)) {
      entitlements.push(
        getCouponAttributesFromWalletAccountTransactionEntity(op),
      );
    }
  }

  if (standardSubscriptionAttributes === null) {
    throw new RangeError(
      'WalletAccountTransactionEntity/UPDATE/STANDARD_SUBSCRIPTION not found in WALLET.ACCOUNT.CREATE.PLAN',
    );
  }

  const eventData: WalletAccountUpdateEventData = {
    account: standardSubscriptionAttributes,
    entitlements,
  };

  return eventData;
}
