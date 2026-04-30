import {EeAirOutboundEvent} from '..';
import {WalletAccountCreateSchemeEventData} from '../types';
import {
  isTierMembershipEntity,
  getTierAttributesFromTierMembershipEntity,
} from './atomic-operations';
import {pointsSnapshotFieldsForEvent} from './collect-points-account-snapshots';

/**
 * Returns an array of events derived from a WALLET.ACCOUNT.CREATE.SCHEME event.
 *
 * @param event
 * @param configuration
 * @returns
 */
export function getWalletAccountCreateSchemeEventData(
  event: EeAirOutboundEvent,
): WalletAccountCreateSchemeEventData {
  const eventData: WalletAccountCreateSchemeEventData = {
    ...pointsSnapshotFieldsForEvent(
      event.atomicOperations,
      'pointsCreatesOnly',
    ),
  };

  for (const op of event.atomicOperations) {
    if (isTierMembershipEntity(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
    }
  }

  return eventData;
}
