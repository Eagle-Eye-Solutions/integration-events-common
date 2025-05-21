import {EeAirOutboundEvent} from '..';
import {TierMembershipMoveEventData} from '../types';
import {
  getTierAttributesFromTierMembershipEntity,
  isTierMembershipEntityUpdate,
} from './atomic-operations';

/**
 * Returns tier data extracted from a TIER.MEMBERSHIP.MOVE event.
 *
 * @param event
 * @returns
 */
export function getTierMembershipMoveEventData(
  event: EeAirOutboundEvent,
): TierMembershipMoveEventData {
  const eventData: TierMembershipMoveEventData = {};

  for (const op of event.atomicOperations) {
    if (isTierMembershipEntityUpdate(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
    }
  }

  return eventData;
}
