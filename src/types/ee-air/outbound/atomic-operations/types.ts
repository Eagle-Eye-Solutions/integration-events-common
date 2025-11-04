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
  relationships?:
    | any[]
    | {
        OBJECTIVE_OF?: Record<
          string,
          Array<{
            accountId: string;
            dateCreated: string;
          }>
        >;
        [key: string]: any;
      };
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

  /**
   * For POSCONNECT.WALLET.SETTLE, the transactionReference of the transaction.
   *
   * For POSCONNECT.WALLET.FULFIL (initial) this will be set to the
   * transactionReference of the main transaction.
   *
   * For POSCONNECT.WALLET.FULFIL (middle, final) this will be set to the
   * transactionReference associated with the items being fulfilled.
   */
  transactionReference?: string;

  /**
   * The date / time at which the transaction took place.
   */
  transactionDate?: Date;

  /**
   * For POSCONNECT.WALLET.SETTLE, this value will not be set.
   *
   * For POSCONNECT.WALLET.FULFIL (initial) this value will not be set.
   *
   * For POSCONNECT.WALLET.FULFIL (middle, final) this will be set to the
   * transactionReference associated with initial transaction.
   */
  originalTransactionReference?: string;

  /**
   * The date / time at which the original transaction took place.
   */
  originalTransactionDate?: Date;
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

/**
 * Attributes associated with a CONTINUITY account.
 */
export type ContinuityAttributes = BaseAccountAttributes & {
  balances: {
    totalSpend: number;
    currentSpend: number;
    transactionCount: number;
    currentTransactions: number;
    totalUnits: number;
    currentUnits: number;
  };
};

/**
 * Attributes associated with a QUEST account.
 */
export type QuestAttributes = BaseAccountAttributes & {
  balances: {
    objectivesMet: number;
  };
  relationships?: {
    OBJECTIVE?: {
      ECOUPON?: Array<{
        accountId: string;
        dateCreated: string;
      }>;
    };
  };
};

/**
 * Attributes associated with a STAMP CARD account.
 */
export type StampCardAttributes = BaseAccountAttributes & {
  balances: {
    available: number;
    refundable: number;
  };
};
