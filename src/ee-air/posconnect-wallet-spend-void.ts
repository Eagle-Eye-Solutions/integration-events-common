import {EeAirOutboundEvent, EeAirClient} from '..';
import {POSConnectWalletSpendVoidEventData} from '../types';
import {BaseEventHandlerOpts} from './types';
import {
  isWalletAccountTransactionEntityUpdatePoints,
  isWalletTransactionEntityUpdateSpendVoided,
} from './atomic-operations';
import AtomicOperations from './atomic-operations';

/**
 * Returns an array of events derived from a POSCONNECT.WALLET.SETTLE event.
 *
 * @param event
 * @param configuration
 * @returns
 */
export async function getPosConnectWalletSpendVoidEventData(
  event: EeAirOutboundEvent,
  opts: BaseEventHandlerOpts,
): Promise<POSConnectWalletSpendVoidEventData> {
  const posConnectWalletSpendVoidEventData: POSConnectWalletSpendVoidEventData =
    {
      voided: true,
    };

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityUpdatePoints(op)) {
      posConnectWalletSpendVoidEventData.points =
        AtomicOperations.WalletAccountTransactionEntity.UpdateEarnPoints.getPointsAttributes(
          op,
        );
    } else if (isWalletTransactionEntityUpdateSpendVoided(op)) {
      posConnectWalletSpendVoidEventData.transaction =
        AtomicOperations.WalletTransactionEntity.UpdateSpendVoid.getTransactionAttributes(
          op,
          event,
        );
      posConnectWalletSpendVoidEventData.tier =
        op.objectValue.basket?.summary?.results?.tiers?.points ?? 0;

      // original transaction reference is not available in the event from AIR, so
      // we have to fetch it directly from AIR itself.
      const airClient = new EeAirClient(
        opts.connectorConfig.credentials.clientId,
        opts.connectorConfig.credentials.secret,
        opts.connectorConfig['domains'],
        opts.logger,
      );
      const parentWalletTransaction = await airClient.getWalletTransactionById(
        op.objectValue.walletId,
        op.objectValue.parentWalletTransactionId,
      );

      const originalTransactionReference = parentWalletTransaction.reference;

      posConnectWalletSpendVoidEventData.transaction.originalTransactionReference =
        originalTransactionReference;
    }
  }

  return posConnectWalletSpendVoidEventData;
}
