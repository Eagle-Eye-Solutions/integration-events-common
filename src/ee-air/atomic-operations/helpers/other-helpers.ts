import {
  AtomicOperation,
  CampaignEntity,
  FundEntity,
  FundTransactionEntity,
  PlanEntity,
  PointsRewardBankEntity,
  PointsRewardBankRewardEntity,
  PointsRewardBankWalletLinkEntity,
  SchemeEntity,
  SupplierUnitEntity,
  TierMembershipEntity,
  TierMembershipTransactionEntity,
  WalletAccountEntity,
  WalletConsumerEntity,
  WalletEntity,
  WalletIdentityEntity,
  WalletInviteEntity,
} from '../../../types';

export function isCampaignEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is CampaignEntity {
  return atomicOperation.objectType === 'campaignEntity';
}

export function isPlanEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is PlanEntity {
  return atomicOperation.objectType === 'planEntity';
}

export function isSchemeEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is SchemeEntity {
  return atomicOperation.objectType === 'schemeEntity';
}

export function isFundEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is FundEntity {
  return atomicOperation.objectType === 'fundEntity';
}

export function isFundTransactionEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is FundTransactionEntity {
  return atomicOperation.objectType === 'fundTransactionEntity';
}

export function isPointsRewardBankEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is PointsRewardBankEntity {
  return atomicOperation.objectType === 'pointsRewardBankEntity';
}

export function isPointsRewardBankRewardEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is PointsRewardBankRewardEntity {
  return atomicOperation.objectType === 'pointsRewardBankRewardEntity';
}

export function isPointsRewardBankWalletLinkEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is PointsRewardBankWalletLinkEntity {
  return atomicOperation.objectType === 'pointsRewardBankWalletLinkEntity';
}

export function isSupplierUnitEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is SupplierUnitEntity {
  return atomicOperation.objectType === 'supplierUnitEntity';
}

export function isTierMembershipEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is TierMembershipEntity {
  return atomicOperation.objectType === 'tierMembershipEntity';
}

export function isTierMembershipEntityCreate(
  atomicOperation: AtomicOperation,
): atomicOperation is TierMembershipEntity {
  return (
    isTierMembershipEntity(atomicOperation) &&
    atomicOperation.operationType === 'CREATE'
  );
}

export function isTierMembershipEntityUpdate(
  atomicOperation: AtomicOperation,
): atomicOperation is TierMembershipEntity {
  return (
    isTierMembershipEntity(atomicOperation) &&
    atomicOperation.operationType === 'UPDATE'
  );
}

export function isTierMembershipTransactionEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is TierMembershipTransactionEntity {
  return atomicOperation.objectType === 'tierMembershipTransactionEntity';
}

export function isWalletAccountEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletAccountEntity {
  return atomicOperation.objectType === 'walletAccountEntity';
}

export function isWalletConsumerEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletConsumerEntity {
  return atomicOperation.objectType === 'walletConsumerEntity';
}

export function isWalletEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletEntity {
  return atomicOperation.objectType === 'walletEntity';
}

export function isWalletIdentityEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletIdentityEntity {
  return atomicOperation.objectType === 'walletIdentityEntity';
}

export function isWalletInviteEntity(
  atomicOperation: AtomicOperation,
): atomicOperation is WalletInviteEntity {
  return atomicOperation.objectType === 'walletInviteEntity';
}
