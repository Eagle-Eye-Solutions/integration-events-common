import {
  EeAirOutboundEvent,
  ServiceWalletAccountsCreateEventData,
} from '../types';
import {
  getCouponAttributesFromWalletAccountTransactionEntity,
  getTierAttributesFromTierMembershipEntity,
  getContinuityAttributesFromWalletAccountTransactionEntity,
  getQuestAttributesFromWalletAccountTransactionEntity,
  getStampCardAttributesFromWalletAccountTransactionEntity,
  isTierMembershipEntity,
  isWalletAccountTransactionEntityCreateEcoupon,
  isWalletAccountTransactionEntityCreateContinuity,
  isWalletAccountTransactionEntityCreateQuest,
  isWalletAccountTransactionEntityCreateStampCard,
} from './atomic-operations';
import {collectPointsAccountSnapshotsFromAtomicOperations} from './collect-points-account-snapshots';

export function getServiceWalletAccountsCreateEventData(
  eeAirOutboundEvent: EeAirOutboundEvent,
): ServiceWalletAccountsCreateEventData {
  const {pointsAccounts, points} =
    collectPointsAccountSnapshotsFromAtomicOperations(
      eeAirOutboundEvent.atomicOperations,
      'pointsCreatesOnly',
    );

  const eventData: ServiceWalletAccountsCreateEventData = {
    coupons: [],
    continuityAccounts: [],
    questAccounts: [],
    stampCards: [],
    ...(pointsAccounts.length > 0 ? {pointsAccounts} : {}),
    ...(points ? {points} : {}),
  };

  for (const op of eeAirOutboundEvent.atomicOperations) {
    if (isTierMembershipEntity(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
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
