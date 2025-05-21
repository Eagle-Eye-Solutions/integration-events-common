import {
  PointsAttributes,
  TierAttributes,
  TransactionAttributes,
  CouponAttributes,
  CouponWithValueAttributes,
  SpendTransactionAttributes,
  BaseAccountAttributes,
  RedeemedBehavioralActionAttributes,
} from './outbound';
export * from './outbound';
export * from './inbound';

export enum EeAirEventTypes {
  serviceWalletCreate = 'SERVICE.WALLET.CREATE',
  serviceWalletAccountsCreate = 'SERVICE.WALLET.ACCOUNTS.CREATE',
  walletAccountCreateScheme = 'WALLET.ACCOUNT.CREATE.SCHEME',
  walletAccountCreateCampaign = 'WALLET.ACCOUNT.CREATE.CAMPAIGN',
  serviceWalletDelete = 'SERVICE.WALLET.DELETE',
  posconnectWalletSettle = 'POSCONNECT.WALLET.SETTLE',
  walletAccountCreatePlan = 'WALLET.ACCOUNT.CREATE.PLAN',
  walletAccountUpdate = 'WALLET.ACCOUNT.UPDATE',
  tierMembershipCreate = 'TIER.MEMBERSHIP.CREATE',
  tierMembershipCredit = 'TIER.MEMBERSHIP.CREDIT',
  tierMembershipDebit = 'TIER.MEMBERSHIP.DEBIT',
  tierMembershipMove = 'TIER.MEMBERSHIP.MOVE',
  tierMembershipAdjust = 'TIER.MEMBERSHIP.ADJUST',
  posconnectWalletFulfil = 'POSCONNECT.WALLET.FULFIL',
  posconnectWalletRefund = 'POSCONNECT.WALLET.REFUND',
  serviceTrigger = 'SERVICE.TRIGGER',
  posconnectWalletSpend = 'POSCONNECT.WALLET.SPEND',
  posconnectWalletSpendVoid = 'POSCONNECT.WALLET.SPEND.VOID',
}

/**
 * Represents the subset of data received in POSCONNECT.WALLET.SETTLE that
 * is made available to connectors via the getPosConnectWalletSettleEventData API.
 */
export type POSConnectWalletSettleEventData = {
  points?: PointsAttributes;
  tier?: TierAttributes;
  transaction?: TransactionAttributes;
  redeemedCoupons: CouponWithValueAttributes[];
  currencyCode: string;
};

/**
 * Represents the subset of data received in POSCONNECT.WALLET.FULFIL that
 * is made available to connectors via the getPosConnectWalletFulfilEventData API.
 */
export type POSConnectWalletFulfilEventData = {
  points?: PointsAttributes;
  tier?: TierAttributes;
  transaction?: TransactionAttributes;
  redeemedCoupons: CouponWithValueAttributes[];
  currencyCode: string;
  initial: boolean;
  final: boolean;
};

/**
 * Represents the subset of data received in POSCONNECT.WALLET.REFUND that
 * is made available to connectors via the getPosConnectWalletRefundEventData API.
 */
export type POSConnectWalletRefundEventData = {
  points?: PointsAttributes;
  tier?: TierAttributes;
  transaction?: TransactionAttributes;
  redeemedCoupons: CouponWithValueAttributes[];
  unredeemedCoupons: CouponWithValueAttributes[];
  currencyCode: string;
};

/**
 * Represents the subset of data received in POSCONNECT.WALLET.SPEND that
 * is made available to connectors via the getPosConnectWalletSpendEventData API.
 */
export type POSConnectWalletSpendEventData = {
  points?: PointsAttributes;
  tier?: number;
  transaction?: SpendTransactionAttributes;
};

/**
 * Represents the subset of data received in POSCONNECT.WALLET.SPEND.VOID that
 * is made available to connectors via the getPosConnectWalletSpendVoidEventData API.
 */
export type POSConnectWalletSpendVoidEventData =
  POSConnectWalletSpendEventData & {
    voided: true;
  };

/**
 * Represents the subset of data received in WALLET.ACCOUNT.CREATE.PLAN that
 * is made available to connectors via the getWalletAccountCreatePlanEventData API.
 */
export type WalletAccountCreatePlanEventData = {
  /**
   * The account details for the plan.
   */
  account: BaseAccountAttributes;

  /**
   * List of entitlements created.
   */
  entitlements: Array<CouponAttributes>;
};

/**
 * Represents the subset of data received in WALLET.ACCOUNT.UPDATE that
 * is made available to connectors via the getWalletAccountCreatePlanEventData API.
 */
export type WalletAccountUpdateEventData = {
  /**
   * The account details of the updated account.
   */
  account: BaseAccountAttributes;

  /**
   * List of entitelements updates.
   */
  entitlements: Array<CouponAttributes>;
};

/**
 * Represents the subset of data received in WALLET.ACCOUNT.CREATE.SCHEME that
 * is made available to connectors via the getWalletAccountCreateSchemeEventData API.
 */
export type WalletAccountCreateSchemeEventData = {
  /**
   * Points account balance, if available.
   */
  points?: PointsAttributes;

  /**
   * Tier balances, if available.
   */
  tier?: TierAttributes;
};

/**
 * Represents the subset of data received in WALLET.ACCOUNT.CREATE.CAMPAIGN that
 * is made available to connectors via the getWalletAccountCreateCampaignEventData API.
 */
export type WalletAccountCreateCampaignEventData = {
  /**
   * List of coupons created.
   */
  coupons: CouponAttributes[];
};

export type ServiceTriggerEventData = {
  /**
   * New points balances.
   */
  points?: PointsAttributes;

  /**
   * Tier balances, if available.
   */
  tier?: TierAttributes;

  /**
   * List of coupons issued to the user.
   */
  awardedCoupons: CouponAttributes[];

  /**
   * Number of points issued to the user.
   */
  awardedPoints?: RedeemedBehavioralActionAttributes;
};

export type ServiceWalletCreateEventData = {};

export type ServiceWalletAccountsCreateEventData = {
  /**
   * New points balances.
   */
  points?: PointsAttributes;

  /**
   * Tier balances, if available.
   */
  tier?: TierAttributes;

  /**
   * List of coupons created.
   */
  coupons: CouponAttributes[];
};

export type TierMembershipEventData = {
  /**
   * Tier balances, if available.
   */
  tier?: TierAttributes;
};

/**
 * Represents the subset of data received in TIER.MEMBERSHIP.ADJUST that
 * is made available to connectors via the getTierMembershipAdjustEventData API.
 */
export type TierMembershipAdjustEventData = TierMembershipEventData;
export type TierMembershipCreateEventData = TierMembershipEventData;
export type TierMembershipCreditEventData = TierMembershipEventData;
export type TierMembershipDebitEventData = TierMembershipEventData;
export type TierMembershipMoveEventData = TierMembershipEventData;
