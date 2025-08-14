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
  WalletAccountTransactionEntityCreateContinuity,
  WalletAccountTransactionEntityCreateQuest,
  WalletAccountTransactionEntityCreateStampCard,
  WalletAccountTransactionEntityUpdateContinuity,
  WalletAccountTransactionEntityUpdateCreditContinuity,
  WalletAccountTransactionEntityUpdateRedeemContinuity,
  WalletAccountTransactionEntityUpdateQuest,
  WalletAccountTransactionEntityUpdateRedeemQuest,
  WalletAccountTransactionEntityUpdateStampCard,
  WalletAccountTransactionEntityUpdateCreditStampCard,
  WalletAccountTransactionEntityUpdateRedeemStampCard,
  WalletAccountTransactionEntityUpdateDonateInPoints,
  WalletAccountTransactionEntityUpdateGiftInPoints,
  WalletAccountTransactionEntityUpdateGoodwillPoints,
  WalletAccountTransactionEntityUpdateDebitPoints,
  WalletAccountTransactionEntityUpdateDonatePoints,
  WalletAccountTransactionEntityUpdateGiftPoints,
  WalletAccountTransactionEntityUpdateSpendPoints,
  WalletAccountTransactionEntityUpdateAutoReducePoints,
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

// Points balance increasing events
export function isWalletAccountTransactionEntityUpdateDonateInPoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateDonateInPoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'DONATE_IN'
  );
}

export function isWalletAccountTransactionEntityUpdateGiftInPoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateGiftInPoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'GIFT_IN'
  );
}

export function isWalletAccountTransactionEntityUpdateGoodwillPoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateGoodwillPoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'GOODWILL'
  );
}

// Points balance decreasing events
export function isWalletAccountTransactionEntityUpdateDebitPoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateDebitPoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'DEBIT'
  );
}

export function isWalletAccountTransactionEntityUpdateDonatePoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateDonatePoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'DONATE'
  );
}

export function isWalletAccountTransactionEntityUpdateGiftPoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateGiftPoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'GIFT'
  );
}

export function isWalletAccountTransactionEntityUpdateSpendPoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateSpendPoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'SPEND'
  );
}

export function isWalletAccountTransactionEntityUpdateAutoReducePoints(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateAutoReducePoints {
  return (
    isWalletAccountTransactionEntityUpdatePoints(entity) &&
    entity.objectValue.event === 'AUTO_REDUCE'
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

// CONTINUITY accounts

export function isWalletAccountTransactionEntityCreateContinuity(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityCreateContinuity {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.operationType === 'CREATE' &&
    entity.objectValue.account.type === 'CONTINUITY'
  );
}

// QUEST accounts

export function isWalletAccountTransactionEntityCreateQuest(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityCreateQuest {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.operationType === 'CREATE' &&
    entity.objectValue.account.type === 'QUEST'
  );
}

// STAMP CARD accounts

export function isWalletAccountTransactionEntityCreateStampCard(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityCreateStampCard {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.operationType === 'CREATE' &&
    entity.objectValue.account.type === 'COUPON_STAMP_CARD'
  );
}

// UPDATE operations for Continuity accounts
export function isWalletAccountTransactionEntityUpdateContinuity(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateContinuity {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.operationType === 'UPDATE' &&
    entity.objectValue.account.type === 'CONTINUITY'
  );
}

export function isWalletAccountTransactionEntityUpdateCreditContinuity(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateCreditContinuity {
  return (
    isWalletAccountTransactionEntityUpdateContinuity(entity) &&
    entity.objectValue.event === 'CREDIT'
  );
}

export function isWalletAccountTransactionEntityUpdateRedeemContinuity(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateRedeemContinuity {
  return (
    isWalletAccountTransactionEntityUpdateContinuity(entity) &&
    entity.objectValue.event === 'REDEEM'
  );
}

// UPDATE operations for Quest accounts
export function isWalletAccountTransactionEntityUpdateQuest(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateQuest {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.operationType === 'UPDATE' &&
    entity.objectValue.account.type === 'QUEST'
  );
}

export function isWalletAccountTransactionEntityUpdateRedeemQuest(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateRedeemQuest {
  return (
    isWalletAccountTransactionEntityUpdateQuest(entity) &&
    entity.objectValue.event === 'REDEEM'
  );
}

// UPDATE operations for Stamp Card accounts
export function isWalletAccountTransactionEntityUpdateStampCard(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateStampCard {
  return (
    isWalletAccountTransactionEntity(entity) &&
    entity.operationType === 'UPDATE' &&
    entity.objectValue.account.type === 'COUPON_STAMP_CARD'
  );
}

export function isWalletAccountTransactionEntityUpdateCreditStampCard(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateCreditStampCard {
  return (
    isWalletAccountTransactionEntityUpdateStampCard(entity) &&
    entity.objectValue.event === 'CREDIT'
  );
}

export function isWalletAccountTransactionEntityUpdateRedeemStampCard(
  entity: AtomicOperation,
): entity is WalletAccountTransactionEntityUpdateRedeemStampCard {
  return (
    isWalletAccountTransactionEntityUpdateStampCard(entity) &&
    entity.objectValue.event === 'REDEEM'
  );
}
