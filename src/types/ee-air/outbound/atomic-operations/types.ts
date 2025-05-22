export type PointsAttributes = {
  pointsBalance: number;
};

export type RedeemedBehavioralActionAttributes = {
  points: number;
  accountId: string;
  campaignId: string;
};

export type TierAttributes = {
  tierId: string;
  tierBalancesPoints: number;
  tierBalancesSpend: number;
  tierBalancesTransactions: number;
  tierBalancesResetDate: Date | null;
};

export type BaseAccountAttributes = {
  /**
   * The account id of the account.
   */
  accountId: string;

  /**
   * The campaign id of the account.
   */
  campaignId: string;

  /**
   * The type of the account, e.g. ECOUPON, STANDARD_SUBSCRIPTION.
   */
  type: string;

  /**
   * The client type associated with the account, e.g. OFFER, ENTITLEMENT.
   */
  clientType: string | null;

  /**
   * The state of the account.
   */
  state: string;

  /**
   * The status of the account, e.g. ACTIVE.
   */
  status: string;

  /**
   * The start date of the account.
   */
  dateStart: Date;

  /**
   * The end date of the account.
   */
  dateEnd: Date | null;
};

/**
 * Attributes of a coupon account.
 */
export type CouponAttributes = BaseAccountAttributes & {
  clientType: string;
};

/**
 * Attributes associated with a STANDARD SUBSCRIPTION
 */
export type StandardSubscriptionAttributes = BaseAccountAttributes;

export type CouponWithValueAttributes = CouponAttributes & {
  value: number;
};

export type ProductAttributes = {
  upc: string;
  description: string;
  itemUnitCost: number;
  totalUnitCostAfterDiscount: number;
  totalUnitCost: number;
  itemUnitCount: number;
};

export type PurchaseAttributes = {
  currencyCode: string;
  couponsRedeemed: CouponWithValueAttributes[];
  products: ProductAttributes[];
  totalBasketValueAfterDiscount: number;
  discountReceived: number;
  totalPointsEarned: number;
  transactionReference: number;
};

export type StoreLocationAttributes = {
  storeId: string | null;
  storeParentId: string | null;
};

export type TransactionAttributes = {
  storeLocation?: StoreLocationAttributes;
  products?: ProductAttributes[];
  totalBasketValueAfterDiscount?: number;
  discountsReceived?: number;
  pointsBalance?: number;
  totalPointsSpent?: number;
  totalPointsEarned?: number;
  totalPointsDeducted?: number;
  transactionReference?: string;
  originalTransactionReference?: string;

  /**
   * The date / time at which the transaction took place.
   */
  transactionDate?: Date;
};

/**
 * Attributes associated with a POINTS SPEND transaction.
 */
export type SpendTransactionAttributes = {
  /**
   * The location in which the spend occurred.
   */
  storeLocation?: StoreLocationAttributes;

  /**
   * The number of points spent in the transaction.
   */
  pointsSpent?: number;

  /**
   * The expected new balance after the spend occurs.
   */
  pointsBalance?: number;

  /**
   * The tier points balance.
   */
  tier?: number;

  /**
   * The transaction reference for the spend operation.
   */
  transactionReference?: string;

  /**
   * TODO
   */
  originalTransactionReference?: string;
};
