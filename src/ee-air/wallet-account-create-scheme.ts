import {EeAirOutboundEvent} from '..';
import {WalletAccountCreateSchemeEventData} from '../types';
import {
  isTierMembershipEntity,
  getTierAttributesFromTierMembershipEntity,
  isWalletAccountTransactionEntityCreatePoints,
  getPointsAttributesFromWalletAccountTransactionEntity,
} from './atomic-operations';

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
  const eventData: WalletAccountCreateSchemeEventData = {};

  for (const op of event.atomicOperations) {
    if (isTierMembershipEntity(op)) {
      eventData.tier = getTierAttributesFromTierMembershipEntity(op);
    } else if (isWalletAccountTransactionEntityCreatePoints(op)) {
      eventData.points =
        getPointsAttributesFromWalletAccountTransactionEntity(op);
    }
  }

  return eventData;
}
