import {EeAirOutboundEvent} from '..';
import {
  CouponAttributes,
  StandardSubscriptionAttributes,
  WalletAccountCreatePlanEventData,
} from '../types';
import {
  getCouponAttributesFromWalletAccountTransactionEntity,
  getStandardSubscriptionAttributesFromWalletAccountTransactionEntity,
  isWalletAccountTransactionEntityCreateStandardSubscription,
  isWalletAccountTransactionEntityCreateEcouponEntitlement,
} from './atomic-operations';

/**
 * Returns an array of events derived from a WALLET.ACCOUNT.CREATE.PLAN event.
 *
 * @param event
 * @param configuration
 * @returns
 */
export function getWalletAccountCreatePlanEventData(
  event: EeAirOutboundEvent,
): WalletAccountCreatePlanEventData {
  let standardSubscriptionAttributes: StandardSubscriptionAttributes | null =
    null;
  const entitlements: CouponAttributes[] = [];

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityCreateStandardSubscription(op)) {
      standardSubscriptionAttributes =
        getStandardSubscriptionAttributesFromWalletAccountTransactionEntity(op);
    } else if (isWalletAccountTransactionEntityCreateEcouponEntitlement(op)) {
      entitlements.push(
        getCouponAttributesFromWalletAccountTransactionEntity(op),
      );
    }
  }

  if (standardSubscriptionAttributes === null) {
    throw new RangeError(
      'WalletAccountTransactionEntity/CREATE/STANDARD_SUBSCRIPTION not found in WALLET.ACCOUNT.CREATE.PLAN',
    );
  }

  const eventData: WalletAccountCreatePlanEventData = {
    account: standardSubscriptionAttributes,
    entitlements,
  };

  return eventData;
}
