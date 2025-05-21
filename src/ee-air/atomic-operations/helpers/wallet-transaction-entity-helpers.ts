import {
  AtomicOperation,
  WalletTransactionEntity,
  WalletTransactionEntityCreate,
  WalletTransactionEntityCreateFulfilFulfilled,
  WalletTransactionEntityCreateRefundSettled,
  WalletTransactionEntityUpdate,
  WalletTransactionEntityUpdateSettleFulfilling,
  WalletTransactionEntityUpdateSettleSettled,
  WalletTransactionEntityUpdateSpend,
  WalletTransactionEntityUpdateSpendVoided,
} from '../../../types';

export function isWalletTransactionEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletTransactionEntity {
  return atomicOperation.objectType === 'walletTransactionEntity';
}

export function isWalletTransactionEntityCreate(
  entity: WalletTransactionEntity,
): entity is WalletTransactionEntityCreate {
  return isWalletTransactionEntity(entity) && entity.operationType === 'CREATE';
}

export function isWalletTransactionEntityUpdate(
  entity: WalletTransactionEntity,
): entity is WalletTransactionEntityUpdate {
  return isWalletTransactionEntity(entity) && entity.operationType === 'UPDATE';
}

export function isWalletTransactionEntityUpdateSettleSettled(
  entity: AtomicOperation,
): entity is WalletTransactionEntityUpdateSettleSettled {
  return (
    isWalletTransactionEntity(entity) &&
    entity.operationType === 'UPDATE' &&
    entity.objectValue.type === 'SETTLE' &&
    entity.objectValue.status === 'SETTLED'
  );
}

export function isWalletTransactionEntityUpdateSettleFulfilling(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletTransactionEntityUpdateSettleFulfilling {
  return (
    atomicOperation.objectType === 'walletTransactionEntity' &&
    atomicOperation.operationType === 'UPDATE' &&
    atomicOperation.objectValue.type === 'SETTLE' &&
    atomicOperation.objectValue.status === 'FULFILLING'
  );
}

export function isWalletTransactionEntityUpdateSpend(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletTransactionEntityUpdateSpend {
  return (
    atomicOperation.objectType === 'walletTransactionEntity' &&
    atomicOperation.operationType === 'UPDATE' &&
    atomicOperation.objectValue.type === 'SPEND'
  );
}

export function isWalletTransactionEntityUpdateSpendVoided(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletTransactionEntityUpdateSpendVoided {
  return (
    atomicOperation.objectType === 'walletTransactionEntity' &&
    atomicOperation.operationType === 'UPDATE' &&
    atomicOperation.objectValue.type === 'SPEND' &&
    atomicOperation.objectValue.status === 'VOIDED'
  );
}

export function isWalletTransactionEntityCreateFulfilFulfilled(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletTransactionEntityCreateFulfilFulfilled {
  return (
    atomicOperation.objectType === 'walletTransactionEntity' &&
    atomicOperation.operationType === 'CREATE' &&
    atomicOperation.objectValue.type === 'FULFIL' &&
    atomicOperation.objectValue.status === 'FULFILLED'
  );
}

export function isWalletTransactionEntityCreateRefundSettled(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletTransactionEntityCreateRefundSettled {
  return (
    atomicOperation.objectType === 'walletTransactionEntity' &&
    atomicOperation.operationType === 'CREATE' &&
    atomicOperation.objectValue.type === 'REFUND' &&
    atomicOperation.objectValue.status === 'SETTLED'
  );
}
