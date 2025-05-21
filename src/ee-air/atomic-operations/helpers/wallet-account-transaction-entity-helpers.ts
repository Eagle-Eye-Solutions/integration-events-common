import {
  AtomicOperation,
  WalletAccountTransactionEntity,
  WalletAccountTransactionEntityCreatePoints,
  WalletAccountTransactionEntityRedeemBehavioralAction,
  WalletAccountTransactionEntityCreateEcoupon,
  WalletAccountTransactionEntityCreateEcouponEntitlement,
  WalletAccountTransactionEntityUpdateEcouponEntitlement,
  WalletAccountTransactionEntityUpdateRedeemEcoupon,
  WalletAccountTransactionEntityUpdateUnredeemEcoupon,
  WalletAccountTransactionEntityUpdateEarnPoints,
  WalletAccountTransactionEntityUpdateCreditPoints,
  WalletAccountTransactionEntityUpdateRefundDebitPoints,
  WalletAccountTransactionEntityCreateStandardSubscription,
  WalletAccountTransactionEntityUpdateStandardSubscription,
} from '../../../types';

export function isWalletAccountTransactionEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletAccountTransactionEntity {
  return atomicOperation.objectType === 'walletAccountTransactionEntity';
}

// POINTS accounts

export function isWalletAccountTransactionEntityCreatePoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityCreatePoints {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.objectValue.account.type === 'POINTS' &&
    entity.operationType === 'CREATE'
  );
}

export function isWalletAccountTransactionEntityUpdatePoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityCreatePoints {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.objectValue.account.type === 'POINTS' &&
    entity.operationType === 'UPDATE'
  );
}

export function isWalletAccountTransactionEntityUpdateEarnPoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateEarnPoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'EARN'
  );
}

export function isWalletAccountTransactionEntityUpdateCreditPoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateCreditPoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'CREDIT'
  );
}

export function isWalletAccountTransactionEntityUpdateRefundDebitPoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateRefundDebitPoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'REFUND_DEBIT'
  );
}

export function isWalletAccountTransactionEntityRedeemBehavioralAction(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityRedeemBehavioralAction {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.objectValue.account.type === 'BEHAVIOURAL_ACTION' &&
    entity.operationType === 'CREATE' &&
    entity.objectValue.event === 'REDEEM'
  );
}

// ECOUPON accounts

export function isWalletAccountTransactionEntityCreateEcoupon(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityCreateEcoupon {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.objectValue.account.type === 'ECOUPON' &&
    entity.operationType === 'CREATE' &&
    entity.objectValue.account.clientType !== null &&
    entity.objectValue.account.clientType !== undefined
  );
}

export function isWalletAccountTransactionEntityCreateEcouponEntitlement(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityCreateEcouponEntitlement {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.objectValue.account.type === 'ECOUPON' &&
    entity.operationType === 'CREATE' &&
    entity.objectValue.account.clientType === 'ENTITLEMENT'
  );
}

export function isWalletAccountTransactionEntityUpdateEcouponEntitlement(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateEcouponEntitlement {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.objectValue.account.type === 'ECOUPON' &&
    entity.operationType === 'UPDATE' &&
    entity.objectValue.account.clientType === 'ENTITLEMENT'
  );
}

export function isWalletAccountTransactionEntityUpdateEcoupon(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityCreateEcoupon {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.objectValue.account.type === 'ECOUPON' &&
    entity.operationType === 'UPDATE' &&
    entity.objectValue.account.clientType !== null &&
    entity.objectValue.account.clientType !== undefined
  );
}

export function isWalletAccountTransactionEntityUpdateRedeemEcoupon(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateRedeemEcoupon {
  return (
    isWalletAccountTransactionEntityUpdateEcoupon(entity) &&
    entity.objectValue.event === 'REDEEM'
  );
}

export function isWalletAccountTransactionEntityUpdateUnredeemEcoupon(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateUnredeemEcoupon {
  return (
    isWalletAccountTransactionEntityUpdateEcoupon(entity) &&
    entity.objectValue.event === 'UNREDEEM'
  );
}

// STANDARD_SUBSCRIPTION accounts

export function isWalletAccountTransactionEntityCreateStandardSubscription(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityCreateStandardSubscription {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.operationType === 'CREATE' &&
    entity.objectValue.account.type === 'STANDARD_SUBSCRIPTION'
  );
}

export function isWalletAccountTransactionEntityUpdateStandardSubscription(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateStandardSubscription {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.operationType === 'UPDATE' &&
    entity.objectValue.account.type === 'STANDARD_SUBSCRIPTION'
  );
}
