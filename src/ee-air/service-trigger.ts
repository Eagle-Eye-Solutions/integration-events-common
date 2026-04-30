import {EeAirOutboundEvent} from '..';
import {ServiceTriggerEventData} from '../types';
import {
  isTierMembershipEntityUpdate,
  getTierAttributesFromTierMembershipEntity,
  getBehavioralActionAttributesFromWalletAccountTransactionEntity,
  isWalletAccountTransactionEntityRedeemBehavioralAction,
  getCouponAttributesFromWalletAccountTransactionEntity,
  isWalletAccountTransactionEntityCreateEcoupon,
} from './atomic-operations';
import {pointsSnapshotFieldsForEvent} from './collect-points-account-snapshots';

/**
 * Returns data extracted from a SERVICE.TRIGGER event.
 *
 * @param event
 * @returns
 */
export function getServiceTriggerEventData(
  event: EeAirOutboundEvent,
): ServiceTriggerEventData {
  const eventData: ServiceTriggerEventData = {
    awardedCoupons: [],
    ...pointsSnapshotFieldsForEvent(
      event.atomicOperations,
      'pointsCreatesOnly',
    ),
  };

  for (const op of event.atomicOperations) {
    if (isTierMembershipEntityUpdate(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
    } else if (isWalletAccountTransactionEntityRedeemBehavioralAction(op)) {
      eventData.awardedPoints =
        getBehavioralActionAttributesFromWalletAccountTransactionEntity(op);
    } else if (isWalletAccountTransactionEntityCreateEcoupon(op)) {
      const coupon = getCouponAttributesFromWalletAccountTransactionEntity(op);

      eventData.awardedCoupons.push({
        accountId: coupon.accountId,
        campaignId: coupon.campaignId,
        type: coupon.type,
        clientType: coupon.clientType,
        state: coupon.state,
        status: coupon.status,
        dateStart: coupon.dateStart,
        dateEnd: coupon.dateEnd,
      });
    }
  }

  return eventData;
}
