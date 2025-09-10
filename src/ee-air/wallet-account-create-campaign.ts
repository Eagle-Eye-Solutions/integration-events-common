import {EeAirOutboundEvent} from '..';
import {WalletAccountCreateCampaignEventData} from '../types';
import {
  isWalletAccountTransactionEntityCreateEcoupon,
  isWalletAccountTransactionEntityCreateContinuity,
  isWalletAccountTransactionEntityCreateQuest,
  isWalletAccountTransactionEntityCreateStampCard,
  getCouponAttributesFromWalletAccountTransactionEntity,
  getContinuityAttributesFromWalletAccountTransactionEntity,
  getQuestAttributesFromWalletAccountTransactionEntity,
  getStampCardAttributesFromWalletAccountTransactionEntity,
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
    continuityAccounts: [],
    questAccounts: [],
    stampCards: [],
  };

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityCreateEcoupon(op)) {
      const baseCoupon =
        getCouponAttributesFromWalletAccountTransactionEntity(op);
      const account: any = (op as any).objectValue?.account;
      const relationships = account?.relationships;
      // Include relationships block when present so connectors can flatten OBJECTIVE_OF
      const couponWithRelationships = relationships
        ? ({...baseCoupon, relationships} as any)
        : baseCoupon;
      // Push, allowing extra field via any
      (eventData.coupons as any).push(couponWithRelationships);
    } else if (isWalletAccountTransactionEntityCreateContinuity(op)) {
      eventData.continuityAccounts.push(
        getContinuityAttributesFromWalletAccountTransactionEntity(op),
      );
    } else if (isWalletAccountTransactionEntityCreateQuest(op)) {
      eventData.questAccounts.push(
        getQuestAttributesFromWalletAccountTransactionEntity(op),
      );
    } else if (isWalletAccountTransactionEntityCreateStampCard(op)) {
      eventData.stampCards.push(
        getStampCardAttributesFromWalletAccountTransactionEntity(op),
      );
    }
  }

  return eventData;
}
