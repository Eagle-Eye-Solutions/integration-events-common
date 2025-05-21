import {EeAirOutboundEvent} from '..';
import {TierMembershipCreateEventData} from '../types';
import {
  getTierAttributesFromTierMembershipEntity,
  isTierMembershipEntityCreate,
} from './atomic-operations';

/**
 * Returns tier data extracted from a TIER.MEMBERSHIP.CREATE event.
 *
 * @param event
 * @returns
 */
export function getTierMembershipCreateEventData(
  event: EeAirOutboundEvent,
): TierMembershipCreateEventData {
  const eventData: TierMembershipCreateEventData = {};

  for (const op of event.atomicOperations) {
    if (isTierMembershipEntityCreate(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
    }
  }

  return eventData;
}
