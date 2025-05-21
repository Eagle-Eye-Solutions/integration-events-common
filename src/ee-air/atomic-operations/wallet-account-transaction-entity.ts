import {parseISO} from 'date-fns';
import {
  PointsAttributes,
  CouponAttributes,
  CouponWithValueAttributes,
  StandardSubscriptionAttributes,
  WalletAccountTransactionEntityCreatePoints,
  WalletAccountTransactionEntityCreateEcoupon,
  WalletAccountTransactionEntityCreateStandardSubscription,
  WalletAccountTransactionEntityUpdateStandardSubscription,
  WalletAccountTransactionEntityUpdateEcoupon,
  WalletAccountTransactionEntityUpdateRedeemEcoupon,
  WalletAccountTransactionEntityUpdateUnredeemEcoupon,
  WalletAccountTransactionEntityUpdateCreditPoints,
  WalletAccountTransactionEntityUpdateEarnPoints,
  WalletAccountTransactionEntityUpdateRefundDebitPoints,
  WalletAccountTransactionEntityRedeemBehavioralAction,
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
};
