import {EeAirOutboundEvent} from '..';
import {WalletAccountCreateCampaignEventData} from '../types';
import {
  isWalletAccountTransactionEntityCreateEcoupon,
  getCouponAttributesFromWalletAccountTransactionEntity,
} from './atomic-operations';

/**
 * Returns an array of events derived from a WALLET.ACCOUNT.CREATE.SCHEME event.
 *
 * @param event
 * @param configuration
 * @returns
 */
export function getWalletAccountCreateCampaignEventData(
  event: EeAirOutboundEvent,
): WalletAccountCreateCampaignEventData {
  const eventData: WalletAccountCreateCampaignEventData = {
    coupons: [],
  };

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityCreateEcoupon(op)) {
      eventData.coupons.push(
        getCouponAttributesFromWalletAccountTransactionEntity(op),
      );
    }
  }

  return eventData;
}
