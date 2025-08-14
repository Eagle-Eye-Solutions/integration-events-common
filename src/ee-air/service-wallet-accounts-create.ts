import {
  EeAirOutboundEvent,
  ServiceWalletAccountsCreateEventData,
} from '../types';
import {
  getCouponAttributesFromWalletAccountTransactionEntity,
  getPointsAttributesFromWalletAccountTransactionEntity,
  getTierAttributesFromTierMembershipEntity,
  getContinuityAttributesFromWalletAccountTransactionEntity,
  getQuestAttributesFromWalletAccountTransactionEntity,
  getStampCardAttributesFromWalletAccountTransactionEntity,
  isTierMembershipEntity,
  isWalletAccountTransactionEntityCreateEcoupon,
  isWalletAccountTransactionEntityCreatePoints,
  isWalletAccountTransactionEntityCreateContinuity,
  isWalletAccountTransactionEntityCreateQuest,
  isWalletAccountTransactionEntityCreateStampCard,
} from './atomic-operations';

export function getServiceWalletAccountsCreateEventData(
  eeAirOutboundEvent: EeAirOutboundEvent,
): ServiceWalletAccountsCreateEventData {
  const eventData: ServiceWalletAccountsCreateEventData = {
    coupons: [],
    continuityAccounts: [],
    questAccounts: [],
    stampCards: [],
  };

  for (const op of eeAirOutboundEvent.atomicOperations) {
    if (isTierMembershipEntity(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
    } else if (isWalletAccountTransactionEntityCreatePoints(op)) {
      eventData.points =
        getPointsAttributesFromWalletAccountTransactionEntity(op);
    } else if (isWalletAccountTransactionEntityCreateEcoupon(op)) {
      const coupon = getCouponAttributesFromWalletAccountTransactionEntity(op);
      eventData.coupons.push(coupon);
    } else if (isWalletAccountTransactionEntityCreateContinuity(op)) {
      const continuity =
        getContinuityAttributesFromWalletAccountTransactionEntity(op);
      eventData.continuityAccounts.push(continuity);
    } else if (isWalletAccountTransactionEntityCreateQuest(op)) {
      const quest = getQuestAttributesFromWalletAccountTransactionEntity(op);
      eventData.questAccounts.push(quest);
    } else if (isWalletAccountTransactionEntityCreateStampCard(op)) {
      const stampCard =
        getStampCardAttributesFromWalletAccountTransactionEntity(op);
      eventData.stampCards.push(stampCard);
    }
  }

  return eventData;
}
