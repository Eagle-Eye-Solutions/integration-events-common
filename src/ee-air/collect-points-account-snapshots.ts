import {
  AtomicOperation,
  PointsAccountSnapshot,
  PointsAttributes,
} from '../types';
import {
  isWalletAccountTransactionEntityCreatePoints,
  isWalletAccountTransactionEntityUpdatePoints,
} from './atomic-operations/helpers/wallet-account-transaction-entity-helpers';
import {getPointsAccountSnapshotFromWalletAccountTransactionEntity} from './atomic-operations/wallet-account-transaction-entity';

export type CollectPointsSnapshotsMode =
  | 'pointsCreatesOnly'
  | 'pointsUpdatesOnly'
  | 'pointsCreatesOrUpdates';

/**
 * Collects per–POINTS-account snapshots from atomic operations.
 *
 * - `pointsAccounts`: unique by `accountId` (last occurrence in event order wins).
 * - `points` (legacy): sum of the last-seen balance for each unique account —
 *   providing a total across all loyalty schemes.
 */
export function collectPointsAccountSnapshotsFromAtomicOperations(
  atomicOperations: readonly AtomicOperation[],
  mode: CollectPointsSnapshotsMode,
): {
  pointsAccounts: PointsAccountSnapshot[];
  points?: PointsAttributes;
} {
  const byAccountId = new Map<string, PointsAccountSnapshot>();

  const opMatchesMode = (op: AtomicOperation): boolean => {
    if (mode === 'pointsCreatesOnly') {
      return isWalletAccountTransactionEntityCreatePoints(op);
    }
    if (mode === 'pointsUpdatesOnly') {
      return isWalletAccountTransactionEntityUpdatePoints(op);
    }
    return (
      isWalletAccountTransactionEntityCreatePoints(op) ||
      isWalletAccountTransactionEntityUpdatePoints(op)
    );
  };

  for (const op of atomicOperations) {
    if (!opMatchesMode(op)) {
      continue;
    }
    try {
      const snap = getPointsAccountSnapshotFromWalletAccountTransactionEntity(
        op as any,
      );
      byAccountId.set(snap.accountId, snap);
    } catch {
      // ignore ops without balances
    }
  }

  const pointsAccounts = Array.from(byAccountId.values()).sort((a, b) =>
    a.accountId.localeCompare(b.accountId, 'en'),
  );

  const points: PointsAttributes | undefined =
    byAccountId.size > 0
      ? {
          pointsBalance: pointsAccounts.reduce(
            (sum, snap) => sum + snap.pointsBalance,
            0,
          ),
        }
      : undefined;

  return {pointsAccounts, ...(points ? {points} : {})};
}
