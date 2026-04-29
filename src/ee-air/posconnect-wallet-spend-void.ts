import {EeAirOutboundEvent, EeAirClient} from '..';
import {POSConnectWalletSpendVoidEventData} from '../types';
import {BaseEventHandlerOpts} from './types';
import {isWalletTransactionEntityUpdateSpendVoided} from './atomic-operations';
import AtomicOperations from './atomic-operations';
import {collectPointsAccountSnapshotsFromAtomicOperations} from './collect-points-account-snapshots';

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
  const {pointsAccounts, points} =
    collectPointsAccountSnapshotsFromAtomicOperations(
      event.atomicOperations,
      'pointsUpdatesOnly',
    );

  const posConnectWalletSpendVoidEventData: POSConnectWalletSpendVoidEventData =
    {
      voided: true,
      ...(pointsAccounts.length > 0 ? {pointsAccounts} : {}),
      ...(points ? {points} : {}),
    };

  for (const op of event.atomicOperations) {
    if (isWalletTransactionEntityUpdateSpendVoided(op)) {
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
