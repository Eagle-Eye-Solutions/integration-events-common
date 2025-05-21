import {EeAirOutboundEvent} from '..';
import {TierMembershipDebitEventData} from '../types';
import {
  getTierAttributesFromTierMembershipEntity,
  isTierMembershipEntityUpdate,
} from './atomic-operations';

/**
 * Returns tier data extracted from a TIER.MEMBERSHIP.DEBIT event.
 *
 * @param event
 * @returns
 */
export function getTierMembershipDebitEventData(
  event: EeAirOutboundEvent,
): TierMembershipDebitEventData {
  const eventData: TierMembershipDebitEventData = {};

  for (const op of event.atomicOperations) {
    if (isTierMembershipEntityUpdate(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
    }
  }

  return eventData;
}
