import {
  EeAirOutboundEvent,
  ServiceWalletAccountsCreateEventData,
} from '../types';
import {
  getCouponAttributesFromWalletAccountTransactionEntity,
  getPointsAttributesFromWalletAccountTransactionEntity,
  getTierAttributesFromTierMembershipEntity,
  isTierMembershipEntity,
  isWalletAccountTransactionEntityCreateEcoupon,
  isWalletAccountTransactionEntityCreatePoints,
} from './atomic-operations';

export function getServiceWalletAccountsCreateEventData(
  eeAirOutboundEvent: EeAirOutboundEvent,
): ServiceWalletAccountsCreateEventData {
  const eventData: ServiceWalletAccountsCreateEventData = {
    coupons: [],
  };

  for (const op of eeAirOutboundEvent.atomicOperations) {
    if (isTierMembershipEntity(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
    } else if (isWalletAccountTransactionEntityCreatePoints(op)) {
      eventData.points =
        getPointsAttributesFromWalletAccountTransactionEntity(op);
    } else if (isWalletAccountTransactionEntityCreateEcoupon(op)) {
      const coupon = getCouponAttributesFromWalletAccountTransactionEntity(op);

      eventData.coupons.push({
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
