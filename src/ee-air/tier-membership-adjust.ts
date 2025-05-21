import {EeAirOutboundEvent} from '..';
import {TierMembershipAdjustEventData} from '../types';
import {
  getTierAttributesFromTierMembershipEntity,
  isTierMembershipEntityUpdate,
} from './atomic-operations';

/**
 * Returns tier data extracted from a TIER.MEMBERSHIP.ADJUST event.
 *
 * @param event
 * @returns
 */
export function getTierMembershipAdjustEventData(
  event: EeAirOutboundEvent,
): TierMembershipAdjustEventData {
  const eventData: TierMembershipAdjustEventData = {};

  for (const op of event.atomicOperations) {
    if (isTierMembershipEntityUpdate(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
    }
  }

  return eventData;
}
