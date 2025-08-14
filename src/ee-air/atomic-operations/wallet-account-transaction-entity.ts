import {parseISO} from 'date-fns';
import {
  PointsAttributes,
  CouponAttributes,
  CouponWithValueAttributes,
  StandardSubscriptionAttributes,
  ContinuityAttributes,
  QuestAttributes,
  StampCardAttributes,
  WalletAccountTransactionEntityCreatePoints,
  WalletAccountTransactionEntityCreateEcoupon,
  WalletAccountTransactionEntityCreateStandardSubscription,
  WalletAccountTransactionEntityCreateContinuity,
  WalletAccountTransactionEntityCreateQuest,
  WalletAccountTransactionEntityCreateStampCard,
  WalletAccountTransactionEntityUpdateStandardSubscription,
  WalletAccountTransactionEntityUpdateEcoupon,
  WalletAccountTransactionEntityUpdateRedeemEcoupon,
  WalletAccountTransactionEntityUpdateUnredeemEcoupon,
  WalletAccountTransactionEntityUpdateCreditPoints,
  WalletAccountTransactionEntityUpdateEarnPoints,
  WalletAccountTransactionEntityUpdateRefundDebitPoints,
  WalletAccountTransactionEntityRedeemBehavioralAction,
  WalletAccountTransactionEntityUpdateCreditContinuity,
  WalletAccountTransactionEntityUpdateRedeemContinuity,
  WalletAccountTransactionEntityUpdateQuest,
  WalletAccountTransactionEntityUpdateRedeemQuest,
  WalletAccountTransactionEntityUpdateCreditStampCard,
  WalletAccountTransactionEntityUpdateRedeemStampCard,
  RedeemedBehavioralActionAttributes,
} from '../../types';

export function getPointsAttributesFromWalletAccountTransactionEntity(
  walletAccountTransactionEntity:
    | WalletAccountTransactionEntityCreatePoints
    | WalletAccountTransactionEntityUpdateCreditPoints
    | WalletAccountTransactionEntityUpdateEarnPoints
    | WalletAccountTransactionEntityUpdateRefundDebitPoints,
): PointsAttributes {
  const account = walletAccountTransactionEntity.objectValue.account;
  const balances = account.balances;

  if (
    balances !== null &&
    balances !== undefined &&
    'current' in balances &&
    balances.current !== undefined
  ) {
    return {
      pointsBalance: balances.current,
    };
  } else {
    throw new Error(
      'Points balance not available in walletAccountTransactionEntity',
    );
  }
}

export function getBehavioralActionAttributesFromWalletAccountTransactionEntity(
  walletAccountTransactionEntity:
    | WalletAccountTransactionEntityCreatePoints
    | WalletAccountTransactionEntityUpdateCreditPoints
    | WalletAccountTransactionEntityUpdateEarnPoints
    | WalletAccountTransactionEntityUpdateRefundDebitPoints
    | WalletAccountTransactionEntityRedeemBehavioralAction,
): RedeemedBehavioralActionAttributes {
  const objectValue = walletAccountTransactionEntity.objectValue;
  const redeemedValue = objectValue.value;

  if (
    walletAccountTransactionEntity.operationType === 'CREATE' &&
    objectValue.account.type === 'BEHAVIOURAL_ACTION' &&
    objectValue.event === 'REDEEM'
  ) {
    return {
      points: redeemedValue,
      accountId: objectValue.account.accountId,
      campaignId: objectValue.account.campaignId,
    };
  } else {
    throw new Error(
      'Points balance not available in walletAccountTransactionEntity',
    );
  }
}

export function getCouponAttributesFromWalletAccountTransactionEntity(
  walletAccountTransactionEntity:
    | WalletAccountTransactionEntityCreateEcoupon
    | WalletAccountTransactionEntityUpdateEcoupon,
): CouponAttributes {
  const account = walletAccountTransactionEntity.objectValue.account;

  return {
    accountId: account.accountId,
    campaignId: account.campaignId,
    type: account.type,
    clientType: account.clientType,
    state: account.state,
    status: account.status,
    dateStart: parseISO(account.dates.start),
    dateEnd: account.dates.end ? parseISO(account.dates.end) : null,
  };
}

export function getCouponAttributesWithValueFromWalletAccountTransactionEntity(
  entity:
    | WalletAccountTransactionEntityUpdateRedeemEcoupon
    | WalletAccountTransactionEntityUpdateUnredeemEcoupon,
): CouponWithValueAttributes {
  return {
    ...getCouponAttributesFromWalletAccountTransactionEntity(entity),
    value: entity.objectValue.value,
  };
}

export function getStandardSubscriptionAttributesFromWalletAccountTransactionEntity(
  entity:
    | WalletAccountTransactionEntityCreateStandardSubscription
    | WalletAccountTransactionEntityUpdateStandardSubscription,
): StandardSubscriptionAttributes {
  const account = entity.objectValue.account;
  return {
    accountId: account.accountId,
    campaignId: account.campaignId,
    type: account.type,
    clientType: account.clientType ?? null,
    state: account.state,
    status: account.status,
    dateStart: parseISO(account.dates.start),
    dateEnd: account.dates.end ? parseISO(account.dates.end) : null,
  };
}

export function getContinuityAttributesFromWalletAccountTransactionEntity(
  entity:
    | WalletAccountTransactionEntityCreateContinuity
    | WalletAccountTransactionEntityUpdateCreditContinuity
    | WalletAccountTransactionEntityUpdateRedeemContinuity,
): ContinuityAttributes {
  const account = entity.objectValue.account;
  return {
    accountId: account.accountId,
    campaignId: account.campaignId,
    type: account.type,
    clientType: account.clientType ?? null,
    state: account.state,
    status: account.status,
    dateStart: parseISO(account.dates.start),
    dateEnd: account.dates.end ? parseISO(account.dates.end) : null,
    balances: {
      totalSpend: account.balances.totalSpend,
      currentSpend: account.balances.currentSpend,
      transactionCount: account.balances.transactionCount,
      currentTransactions: account.balances.currentTransactions,
      totalUnits: account.balances.totalUnits,
      currentUnits: account.balances.currentUnits,
    },
  };
}

export function getQuestAttributesFromWalletAccountTransactionEntity(
  entity:
    | WalletAccountTransactionEntityCreateQuest
    | WalletAccountTransactionEntityUpdateQuest
    | WalletAccountTransactionEntityUpdateRedeemQuest,
): QuestAttributes {
  const account = entity.objectValue.account;
  return {
    accountId: account.accountId,
    campaignId: account.campaignId,
    type: account.type,
    clientType: account.clientType ?? null,
    state: account.state,
    status: account.status,
    dateStart: parseISO(account.dates.start),
    dateEnd: account.dates.end ? parseISO(account.dates.end) : null,
    balances: {
      objectivesMet: account.balances.objectivesMet,
    },
    relationships: account.relationships,
  };
}

export function getStampCardAttributesFromWalletAccountTransactionEntity(
  entity:
    | WalletAccountTransactionEntityCreateStampCard
    | WalletAccountTransactionEntityUpdateCreditStampCard
    | WalletAccountTransactionEntityUpdateRedeemStampCard,
): StampCardAttributes {
  const account = entity.objectValue.account;
  return {
    accountId: account.accountId,
    campaignId: account.campaignId,
    type: account.type,
    clientType: account.clientType ?? null,
    state: account.state,
    status: account.status,
    dateStart: parseISO(account.dates.start),
    dateEnd: account.dates.end ? parseISO(account.dates.end) : null,
    balances: {
      available: account.balances.available,
      refundable: account.balances.refundable,
    },
  };
}

export default {
  CreatePoints: {
    getPointsAttributes: getPointsAttributesFromWalletAccountTransactionEntity,
    getAwardedPointsAttributes:
      getBehavioralActionAttributesFromWalletAccountTransactionEntity,
  },
  CreateEcoupon: {
    getCouponAttributes: getCouponAttributesFromWalletAccountTransactionEntity,
  },
  CreateStandardSubscription: {
    getStandardSubscriptionAttributes:
      getStandardSubscriptionAttributesFromWalletAccountTransactionEntity,
  },
  CreateContinuity: {
    getContinuityAttributes:
      getContinuityAttributesFromWalletAccountTransactionEntity,
  },
  CreateQuest: {
    getQuestAttributes: getQuestAttributesFromWalletAccountTransactionEntity,
  },
  CreateStampCard: {
    getStampCardAttributes:
      getStampCardAttributesFromWalletAccountTransactionEntity,
  },
  UpdateStandardSubscription: {
    getStandardSubscriptionAttributes:
      getStandardSubscriptionAttributesFromWalletAccountTransactionEntity,
  },
  UpdateCreditPoints: {
    getPointsAttributes: getPointsAttributesFromWalletAccountTransactionEntity,
  },
  UpdateRefundDebitPoints: {
    getPointsAttributes: getPointsAttributesFromWalletAccountTransactionEntity,
  },
  UpdateEarnPoints: {
    getPointsAttributes: getPointsAttributesFromWalletAccountTransactionEntity,
  },
  UpdateRedeemEcoupon: {
    getCouponAttributes:
      getCouponAttributesWithValueFromWalletAccountTransactionEntity,
  },
  UpdateUnredeemEcoupon: {
    getCouponAttributes:
      getCouponAttributesWithValueFromWalletAccountTransactionEntity,
  },
  UpdateCreditContinuity: {
    getContinuityAttributes:
      getContinuityAttributesFromWalletAccountTransactionEntity,
  },
  UpdateRedeemContinuity: {
    getContinuityAttributes:
      getContinuityAttributesFromWalletAccountTransactionEntity,
  },
  UpdateQuest: {
    getQuestAttributes: getQuestAttributesFromWalletAccountTransactionEntity,
  },
  UpdateRedeemQuest: {
    getQuestAttributes: getQuestAttributesFromWalletAccountTransactionEntity,
  },
  UpdateCreditStampCard: {
    getStampCardAttributes:
      getStampCardAttributesFromWalletAccountTransactionEntity,
  },
  UpdateRedeemStampCard: {
    getStampCardAttributes:
      getStampCardAttributesFromWalletAccountTransactionEntity,
  },
};
