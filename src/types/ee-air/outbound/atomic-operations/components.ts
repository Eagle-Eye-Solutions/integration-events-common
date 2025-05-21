import {z} from 'zod';

const EmptyArray = z.array(z.unknown()).length(0);

const AccountTransactionBalanceHistoryEntitySchema = EmptyArray.or(
  z.object({
    available: z.number().int().optional(),
    refundable: z.number().int().optional(),
    current: z.number().int().optional(),
    lifetime: z.number().int().optional(),
    totalSpend: z.number().int().optional(),
    transactionCount: z.number().int().optional(),
  }),
);

const DatesEntitySchema = z.object({
  start: z.string(),
  end: z.string().nullish(),
});

const MetaEntitySchema = EmptyArray.or(z.record(z.string(), z.string()));

const WalletTransactionBasketEntitySchema = z
  .object({
    contents: z.array(z.any()).nullish(),
    summary: z
      .object({
        totalItems: z.number().nullish(),
        totalBasketValue: z.number().nullish(),
        totalQualifyingAmount: z
          .object({
            points: z.number().int().nullish(),
            baseEarn: z.number().int(),
            promotions: z.number().nullish(),
            staff: z.number().nullish(),
          })
          .passthrough()
          .nullish(),
        totalDiscountAmount: z
          .object({
            promotions: z.number().int().nullish(),
            staff: z.number().int().nullish(),
            general: z.number().int().nullish(),
          })
          .passthrough()
          .nullish(),
        spendAdjudicationResults: z
          .object({
            pointsValue: z.number().int().nullish(),
            pointsRemainder: z.number().int().nullish(),
            monetaryValue: z.number().int().nullish(),
            balanceAfter: z.object({
              current: z.number().int().nullish(),
              usable: z.number().int().nullish(),
              locked: z.number().int().nullish(),
              lifetime: z.number().int().nullish(),
              lifetimeSpend: z.number().int().nullish(),
              lifetimeSpendValue: z.number().int().nullish(),
              pending: z.number().int().nullish(),
            }),
            appliedTier: z.object({
              bonus: z.number().int().nullish(),
              ceiling: z.number().int().nullish(),
              floor: z.number().int().nullish(),
              pointsBack: z.number().int().nullish(),
              rate: z.number().nullish(),
              step: z.number().int().nullish(),
            }),
            operations: z.array(
              z.object({
                resourceType: z.string(),
                resourceId: z.string(),
                accountId: z.string(),
                walletId: z.string(),
                operationType: z.string(),
                value: z.number().int().nullish(),
                details: z.any(),
                balances: z.object({
                  current: z.number().int().nullish(),
                  lifetime_spend: z.number().int().nullish(),
                  lifetime_spend_value: z.number().int().nullish(),
                }),
              }),
            ),
            analysedDateTime: z.string(),
            excludedProducts: z.any(),
          })
          .passthrough()
          .nullish(),
        results: z
          .object({
            points: z
              .object({
                spend: z.number(),
                debit: z.number(),
                refund: z.number(),
                totalPointsTaken: z.number(),
                earn: z.number(),
                credit: z.number(),
                totalPointsGiven: z.number(),
                totalMonetaryValue: z.number(),
              })
              .passthrough(),
            tiers: z.any().nullish(),
          })
          .passthrough()
          .nullish(),
        tiers: z
          .object({
            points: z.number(),
            transactions: z.number(),
            spend: z.number(),
          })
          .passthrough()
          .nullish(),
      })
      .passthrough()
      .nullish(),
  })
  .passthrough();

const AccountBalancesEntitySchema = z
  .object({
    available: z.number().int().optional(),
    current: z.number().int().optional(),
    lifetime: z.number().int().optional(),
    lifetimeSpend: z.number().int().optional(),
    lifetimeSpendValue: z.number().int().optional(),
    locked: z.number().int().optional(),
    pending: z.number().int().optional(),
    refundable: z.number().int().optional(),
    totalSpend: z.number().int().optional(),
    totalUnits: z.number().int().optional(),
    transactionCount: z.number().int().optional(),
    usable: z.number().int().optional(),
  })
  .passthrough();

export const TierMembershipEntityObjectValueSchema = z
  .object({
    tierMembershipId: z.string(),
    tierId: z.string(),
    status: z.string(),
    accountIds: z.array(z.string()),
    balances: z
      .object({
        points: z.number(),
        spend: z.number(),
        transactions: z.number(),
      })
      .passthrough(),
    expiryDate: z.string(),
    tierBalancesResetDate: z.string(),
    dateCreated: z.string(),
    lastUpdated: z.string(),
  })
  .passthrough();

export const TierMembershipTransactionEntityObjectValueSchema = z
  .object({
    tierMembershipTransactionId: z.string(),
    tierId: z.string(),
    tierIdAfter: z.string().nullish(),
    tierMembershipId: z.string(),
    transactionType: z.string(),
    parentTierMembershipTransactionId: z.string().nullish(),
    walletTransactionId: z.string().nullish(),
    dateCreated: z.string(),
    lastUpdated: z.string(),
    actions: z.array(
      z
        .object({
          balanceType: z.string(),
          amount: z.number(),
          balanceBefore: z.number(),
          balanceAfter: z.number(),
        })
        .passthrough(),
    ),
  })
  .passthrough();

export const WalletAccountEntityObjectValueSchema = z
  .object({
    accountId: z.string(),
    walletId: z.string(),
    campaignId: z.string(),
    type: z.string(),
    clientType: z.string().nullish(),
    status: z.string(),
    state: z.string(),
    dates: DatesEntitySchema,
    meta: MetaEntitySchema.nullish(),
    balances: AccountBalancesEntitySchema.nullish(),
    dateCreated: z.string(),
    lastUpdated: z.string(),
  })
  .passthrough();

type WalletAccountEntityObjectValue = z.infer<
  typeof WalletAccountEntityObjectValueSchema
>;

export const baseWalletAccountTransactionChildEntitySchema = z.object({
  accountTransactionId: z.string(),
  parentAccountTransactionId: z.string().nullish(),
  accountId: z.string(),
  account: WalletAccountEntityObjectValueSchema,
  event: z.string(),
  value: z.number().int(),
  source: z.union([z.string(), z.number()]),
  balancesBefore: AccountTransactionBalanceHistoryEntitySchema,
  balancesAfter: AccountTransactionBalanceHistoryEntitySchema,
  transactionDetails: EmptyArray.or(z.record(z.string(), z.unknown())),
  properties: EmptyArray.or(z.object({}).passthrough().nullish()),
  dateCreated: z.string(),
  lastUpdated: z.string(),
});

export type WalletAccountTransactionChildEntity = z.infer<
  typeof baseWalletAccountTransactionChildEntitySchema
> & {
  children: WalletAccountTransactionChildEntity[];
  rewardAccounts: Array<
    WalletAccountEntityObjectValue | WalletAccountTransactionChildEntity
  >;
};

export const WalletAccountTransactionChildEntitySchema: z.ZodType<WalletAccountTransactionChildEntity> =
  baseWalletAccountTransactionChildEntitySchema.extend({
    children: z.lazy(() => z.array(WalletAccountTransactionChildEntitySchema)),
    rewardAccounts: z.lazy(() =>
      z.array(
        z.union([
          WalletAccountEntityObjectValueSchema,
          WalletAccountTransactionChildEntitySchema,
        ]),
      ),
    ),
  });

export const WalletAccountTransactionEntityObjectValueSchema = z.object({
  accountTransactionId: z.string(),
  parentAccountTransactionId: z.string().nullish(),
  accountId: z.string(),
  account: WalletAccountEntityObjectValueSchema,
  event: z.string(),
  value: z.number().int(),
  source: z.union([z.string(), z.number()]),
  balancesBefore: EmptyArray.or(AccountTransactionBalanceHistoryEntitySchema),
  balancesAfter: EmptyArray.or(AccountTransactionBalanceHistoryEntitySchema),
  transactionDetails: EmptyArray.or(z.record(z.string(), z.unknown())),
  properties: EmptyArray.or(z.object({})).nullish(),
  dateCreated: z.string(),
  lastUpdated: z.string(),
  children: z.array(WalletAccountTransactionChildEntitySchema).optional(),
  rewardAccounts: z
    .array(
      z.union([
        WalletAccountEntityObjectValueSchema,
        WalletAccountTransactionChildEntitySchema,
      ]),
    )
    .optional(),
});

export const WalletIdentityEntityObjectValueSchema = z.object({
  identityId: z.string(),
  walletId: z.string(),
  type: z.string(),
  friendlyName: z.string().nullish(),
  value: z.string(),
  safeValue: z.string().nullish(),
  secret: z.string().nullish(),
  dates: DatesEntitySchema,
  meta: z.array(z.unknown()),
  state: z.string(),
  status: z.string(),
  dateCreated: z.string(),
  lastUpdated: z.string(),
  mobileWallet: z.string(),
});

export const WalletTransactionEntityObjectValueSchema = z.object({
  walletTransactionId: z.string(),
  parentWalletTransactionId: z.string(),
  walletId: z.string(),
  reference: z.string(),
  transactionDateTime: z.string(),
  transactionDateTimeOffset: z.string(),
  identityId: z.string().nullish(),
  identity: z.string().nullish(),
  type: z.string(),
  status: z.string(),
  meta: MetaEntitySchema.nullish(),
  state: z.string(),
  expiryDate: z.string().nullish(),
  accounts: z.array(
    z.object({
      accountId: z.string(),
      accountTransactionId: z.string(),
    }),
  ),
  basket: WalletTransactionBasketEntitySchema,
  channel: z.string(),
  location: z
    .object({
      storeId: z.string().nullish(),
      storeParentId: z.string().nullish(),
    })
    .nullish(),
  dateCreated: z.string(),
  lastUpdated: z.string(),
});

export type WalletTransactionEntityObjectValue = z.infer<
  typeof WalletTransactionEntityObjectValueSchema
>;
