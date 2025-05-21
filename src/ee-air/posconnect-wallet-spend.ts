import {EeAirOutboundEvent} from '..';
import {POSConnectWalletSpendEventData} from '../types';
import {
  isWalletAccountTransactionEntityUpdatePoints,
  isWalletTransactionEntityUpdateSpend,
} from './atomic-operations';
import AtomicOperations from './atomic-operations';

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
  const posConnectWalletSpendEventData: POSConnectWalletSpendEventData = {};

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityUpdatePoints(op)) {
      posConnectWalletSpendEventData.points =
        AtomicOperations.WalletAccountTransactionEntity.UpdateEarnPoints.getPointsAttributes(
          op,
        );
    } else if (isWalletTransactionEntityUpdateSpend(op)) {
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
