import {EeAirOutboundEvent} from '..';
import {POSConnectWalletSpendEventData} from '../types';
import AtomicOperations, {
  isWalletTransactionEntityUpdateSpend,
} from './atomic-operations';
import {pointsSnapshotFieldsForEvent} from './collect-points-account-snapshots';

/**
 * Returns an array of events derived from a POSCONNECT.WALLET.SETTLE event.
 *
 * @param event
 * @param configuration
 * @returns
 */
export function getPosConnectWalletSpendEventData(
  event: EeAirOutboundEvent,
): POSConnectWalletSpendEventData {
  const posConnectWalletSpendEventData: POSConnectWalletSpendEventData = {
    ...pointsSnapshotFieldsForEvent(
      event.atomicOperations,
      'pointsUpdatesOnly',
    ),
  };

  for (const op of event.atomicOperations) {
    if (isWalletTransactionEntityUpdateSpend(op)) {
      posConnectWalletSpendEventData.transaction =
        AtomicOperations.WalletTransactionEntity.UpdateSpend.getTransactionAttributes(
          op,
          event,
        );
      posConnectWalletSpendEventData.tier =
        op.objectValue.basket?.summary?.results?.tiers?.points ?? 0;
    }
  }

  return posConnectWalletSpendEventData;
}
