import {EeAirOutboundEvent} from '..';
import {TierMembershipCreditEventData} from '../types';
import {
  getTierAttributesFromTierMembershipEntity,
  isTierMembershipEntityUpdate,
} from './atomic-operations';

/**
 * Returns tier data extracted from a TIER.MEMBERSHIP.CREDIT event.
 *
 * @param event
 * @returns
 */
export function getTierMembershipCreditEventData(
  event: EeAirOutboundEvent,
): TierMembershipCreditEventData {
  const eventData: TierMembershipCreditEventData = {};

  for (const op of event.atomicOperations) {
    if (isTierMembershipEntityUpdate(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
    }
  }

  return eventData;
}
