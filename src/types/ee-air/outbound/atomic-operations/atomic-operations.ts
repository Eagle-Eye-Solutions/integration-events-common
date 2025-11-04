import {z} from 'zod';
import {
  TierMembershipEntityObjectValueSchema,
  TierMembershipTransactionEntityObjectValueSchema,
  WalletAccountEntityObjectValueSchema,
  WalletAccountTransactionEntityObjectValueSchema,
  WalletIdentityEntityObjectValueSchema,
  WalletTransactionEntityObjectValueSchema,
} from './components';

export const AtomicOperationTypeSchema = z.enum([
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
]);

export type AtomicOperationType = z.infer<typeof AtomicOperationTypeSchema>;

export const CampaignEntitySchema = z.object({
  objectType: z.literal('campaignEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const PlanEntitySchema = z.object({
  objectType: z.literal('planEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const SchemeEntitySchema = z.object({
  objectType: z.literal('schemeEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const FundEntitySchema = z.object({
  objectType: z.literal('fundEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const FundTransactionEntitySchema = z.object({
  objectType: z.literal('fundTransactionEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const PointsRewardBankEntitySchema = z.object({
  objectType: z.literal('pointsRewardBankEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const PointsRewardBankRewardEntitySchema = z.object({
  objectType: z.literal('pointsRewardBankRewardEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const PointsRewardBankWalletLinkEntitySchema = z.object({
  objectType: z.literal('pointsRewardBankWalletLinkEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const SupplierUnitEntitySchema = z.object({
  objectType: z.literal('supplierUnitEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const TierMembershipEntitySchema = z.object({
  objectType: z.literal('tierMembershipEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: TierMembershipEntityObjectValueSchema.passthrough(),
});

export const TierMembershipTransactionEntitySchema = z.object({
  objectType: z.literal('tierMembershipTransactionEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: TierMembershipTransactionEntityObjectValueSchema.passthrough(),
});

export const WalletAccountEntitySchema = z.object({
  objectType: z.literal('walletAccountEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: WalletAccountEntityObjectValueSchema.passthrough(),
});

export const WalletAccountTransactionEntitySchema = z.object({
  objectType: z.literal('walletAccountTransactionEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: WalletAccountTransactionEntityObjectValueSchema.passthrough(),
});

export const WalletConsumerEntitySchema = z.object({
  objectType: z.literal('walletConsumerEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const WalletEntitySchema = z.object({
  objectType: z.literal('walletEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const WalletIdentityEntitySchema = z.object({
  objectType: z.literal('walletIdentityEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: WalletIdentityEntityObjectValueSchema.passthrough(),
});

export const WalletInviteEntitySchema = z.object({
  objectType: z.literal('walletInviteEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: z.object({}).passthrough(),
});

export const WalletTransactionEntitySchema = z.object({
  objectType: z.literal('walletTransactionEntity'),
  operationType: AtomicOperationTypeSchema,
  objectValue: WalletTransactionEntityObjectValueSchema.passthrough(),
});

export type CampaignEntity = z.infer<typeof CampaignEntitySchema>;
export type PlanEntity = z.infer<typeof PlanEntitySchema>;
export type SchemeEntity = z.infer<typeof SchemeEntitySchema>;
export type FundEntity = z.infer<typeof FundEntitySchema>;
export type FundTransactionEntity = z.infer<typeof FundTransactionEntitySchema>;
export type PointsRewardBankEntity = z.infer<
  typeof PointsRewardBankEntitySchema
>;
export type PointsRewardBankRewardEntity = z.infer<
  typeof PointsRewardBankRewardEntitySchema
>;
export type PointsRewardBankWalletLinkEntity = z.infer<
  typeof PointsRewardBankWalletLinkEntitySchema
>;
export type SupplierUnitEntity = z.infer<typeof SupplierUnitEntitySchema>;
export type TierMembershipEntity = z.infer<typeof TierMembershipEntitySchema>;
export type TierMembershipTransactionEntity = z.infer<
  typeof TierMembershipTransactionEntitySchema
>;
export type WalletAccountEntity = z.infer<typeof WalletAccountEntitySchema>;
export type WalletAccountTransactionEntity = z.infer<
  typeof WalletAccountTransactionEntitySchema
>;
export type WalletConsumerEntity = z.infer<typeof WalletConsumerEntitySchema>;
export type WalletEntity = z.infer<typeof WalletEntitySchema>;
export type WalletIdentityEntity = z.infer<typeof WalletIdentityEntitySchema>;
export type WalletInviteEntity = z.infer<typeof WalletInviteEntitySchema>;
export type WalletTransactionEntity = z.infer<
  typeof WalletTransactionEntitySchema
>;
export type WalletTransactionEntityCreate = WalletTransactionEntity & {
  operationType: 'CREATE';
};
export type WalletTransactionEntityUpdate = WalletTransactionEntity & {
  operationType: 'UPDATE';
};
export type WalletTransactionEntityUpdateSettleSettled =
  WalletTransactionEntityUpdate & {
    objectValue: WalletTransactionEntityUpdate['objectValue'] & {
      type: 'SETTLE';
      status: 'SETTLED';
    };
  };

/* WalletAccountTransactionEntity sub-types */

export type WalletAccountTransactionEntityCreate =
  WalletAccountTransactionEntity & {
    operationType: 'CREATE';
  };

export type WalletAccountTransactionEntityUpdate =
  WalletAccountTransactionEntity & {
    operationType: 'UPDATE';
  };

export type WalletAccountTransactionEntityCreatePoints =
  WalletAccountTransactionEntityCreate & {
    objectValue: WalletAccountTransactionEntityCreate['objectValue'] & {
      account: WalletAccountTransactionEntityCreate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

export type WalletAccountTransactionEntityRedeemBehavioralAction =
  WalletAccountTransactionEntityCreate & {
    objectValue: WalletAccountTransactionEntityCreate['objectValue'] & {
      account: WalletAccountTransactionEntityCreate['objectValue']['account'] & {
        type: 'BEHAVIOURAL_ACTION';
      };
      event: 'REDEEM';
    };
  };

export type WalletAccountTransactionEntityCreateEcoupon =
  WalletAccountTransactionEntityCreate & {
    objectValue: WalletAccountTransactionEntityCreate['objectValue'] & {
      account: WalletAccountTransactionEntityCreate['objectValue']['account'] & {
        type: 'ECOUPON' | 'BEHAVIOURAL_ACTION';
        clientType: string;
      };
    };
  };

export type WalletAccountTransactionEntityCreateEcouponEntitlement =
  WalletAccountTransactionEntityCreate & {
    objectValue: WalletAccountTransactionEntityCreate['objectValue'] & {
      account: WalletAccountTransactionEntityCreate['objectValue']['account'] & {
        type: 'ECOUPON';
        clientType: 'ENTITLEMENT';
      };
    };
  };

export type WalletAccountTransactionEntityUpdateEcouponEntitlement =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'ECOUPON';
        clientType: 'ENTITLEMENT';
      };
    };
  };

export type WalletAccountTransactionEntityCreateStandardSubscription =
  WalletAccountTransactionEntityCreate & {
    objectValue: WalletAccountTransactionEntityCreate['objectValue'] & {
      account: WalletAccountTransactionEntityCreate['objectValue']['account'] & {
        type: 'STANDARD_SUBSCRIPTION';
      };
    };
  };

export type WalletAccountTransactionEntityCreateContinuity =
  WalletAccountTransactionEntityCreate & {
    objectValue: WalletAccountTransactionEntityCreate['objectValue'] & {
      account: WalletAccountTransactionEntityCreate['objectValue']['account'] & {
        type: 'CONTINUITY';
        balances: {
          totalSpend: number;
          currentSpend: number;
          transactionCount: number;
          currentTransactions: number;
          totalUnits: number;
          currentUnits: number;
        };
      };
    };
  };

export type WalletAccountTransactionEntityCreateQuest =
  WalletAccountTransactionEntityCreate & {
    objectValue: WalletAccountTransactionEntityCreate['objectValue'] & {
      account: WalletAccountTransactionEntityCreate['objectValue']['account'] & {
        type: 'QUEST';
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
    };
  };

export type WalletAccountTransactionEntityCreateStampCard =
  WalletAccountTransactionEntityCreate & {
    objectValue: WalletAccountTransactionEntityCreate['objectValue'] & {
      account: WalletAccountTransactionEntityCreate['objectValue']['account'] & {
        type: 'COUPON_STAMP_CARD';
        balances: {
          available: number;
          refundable: number;
        };
      };
    };
  };

// UPDATE operations for Continuity accounts
export type WalletAccountTransactionEntityUpdateContinuity =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'CONTINUITY';
        balances: {
          totalSpend: number;
          currentSpend: number;
          transactionCount: number;
          currentTransactions: number;
          totalUnits: number;
          currentUnits: number;
        };
      };
    };
  };

export type WalletAccountTransactionEntityUpdateCreditContinuity =
  WalletAccountTransactionEntityUpdateContinuity & {
    objectValue: WalletAccountTransactionEntityUpdateContinuity['objectValue'] & {
      event: 'CREDIT';
    };
  };

export type WalletAccountTransactionEntityUpdateRedeemContinuity =
  WalletAccountTransactionEntityUpdateContinuity & {
    objectValue: WalletAccountTransactionEntityUpdateContinuity['objectValue'] & {
      event: 'REDEEM';
    };
  };

// UPDATE operations for Quest accounts
export type WalletAccountTransactionEntityUpdateQuest =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'QUEST';
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
    };
  };

export type WalletAccountTransactionEntityUpdateRedeemQuest =
  WalletAccountTransactionEntityUpdateQuest & {
    objectValue: WalletAccountTransactionEntityUpdateQuest['objectValue'] & {
      event: 'REDEEM';
    };
  };

// UPDATE operations for Stamp Card accounts
export type WalletAccountTransactionEntityUpdateStampCard =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'COUPON_STAMP_CARD';
        balances: {
          available: number;
          refundable: number;
        };
      };
    };
  };

export type WalletAccountTransactionEntityUpdateCreditStampCard =
  WalletAccountTransactionEntityUpdateStampCard & {
    objectValue: WalletAccountTransactionEntityUpdateStampCard['objectValue'] & {
      event: 'CREDIT';
    };
  };

export type WalletAccountTransactionEntityUpdateRedeemStampCard =
  WalletAccountTransactionEntityUpdateStampCard & {
    objectValue: WalletAccountTransactionEntityUpdateStampCard['objectValue'] & {
      event: 'REDEEM';
    };
  };

export type WalletAccountTransactionEntityUpdateStandardSubscription =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'STANDARD_SUBSCRIPTION';
      };
    };
  };

export type WalletAccountTransactionEntityUpdateEcoupon =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'ECOUPON' | 'BEHAVIOURAL_ACTION';
        clientType: string;
      };
    };
  };

export type WalletAccountTransactionEntityUpdateEarnPoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'EARN';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

export type WalletAccountTransactionEntityUpdateCreditPoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'CREDIT';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

export type WalletAccountTransactionEntityUpdateRedeemEcoupon =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'REDEEM';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'ECOUPON';
        clientType: string;
      };
    };
  };

export type WalletAccountTransactionEntityUpdateUnredeemEcoupon =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'UNREDEEM';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'ECOUPON';
        clientType: string;
      };
    };
  };

export type WalletAccountTransactionEntityUpdateRefundDebitPoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'REFUND_DEBIT';
      type: 'POINTS';
    };
  };

// Points balance increasing events
export type WalletAccountTransactionEntityUpdateDonateInPoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'DONATE_IN';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

export type WalletAccountTransactionEntityUpdateGiftInPoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'GIFT_IN';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

export type WalletAccountTransactionEntityUpdateGoodwillPoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'GOODWILL';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

// Points balance decreasing events
export type WalletAccountTransactionEntityUpdateDebitPoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'DEBIT';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

export type WalletAccountTransactionEntityUpdateDonatePoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'DONATE';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

export type WalletAccountTransactionEntityUpdateGiftPoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'GIFT';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

export type WalletAccountTransactionEntityUpdateSpendPoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'SPEND';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

export type WalletAccountTransactionEntityUpdateAutoReducePoints =
  WalletAccountTransactionEntityUpdate & {
    objectValue: WalletAccountTransactionEntityUpdate['objectValue'] & {
      event: 'AUTO_REDUCE';
      account: WalletAccountTransactionEntityUpdate['objectValue']['account'] & {
        type: 'POINTS';
      };
    };
  };

export type WalletTransactionEntityUpdateSettleFulfilling =
  WalletTransactionEntityUpdate & {
    objectValue: WalletTransactionEntityUpdate['objectValue'] & {
      type: 'SETTLE';
      status: 'FULFILLING';
    };
  };

export type WalletTransactionEntityCreateFulfilFulfilled =
  WalletTransactionEntityCreate & {
    objectValue: WalletTransactionEntityCreate['objectValue'] & {
      type: 'FULFIL';
      status: 'FULFILLED';
    };
  };

export type WalletTransactionEntityCreateRefundSettled =
  WalletTransactionEntityCreate & {
    objectValue: WalletTransactionEntityCreate['objectValue'] & {
      type: 'REFUND';
      status: 'SETTLED';
    };
  };

export type WalletTransactionEntityUpdateSpend =
  WalletTransactionEntityUpdate & {
    objectValue: WalletTransactionEntityUpdate['objectValue'] & {
      type: 'SPEND';
    };
  };

export type WalletTransactionEntityUpdateSpendVoided =
  WalletTransactionEntityUpdate & {
    objectValue: WalletTransactionEntityUpdate['objectValue'] & {
      type: 'SPEND';
      status: 'VOIDED';
    };
  };

export const AtomicOperationSchema = z.discriminatedUnion('objectType', [
  CampaignEntitySchema,
  PlanEntitySchema,
  SchemeEntitySchema,
  FundEntitySchema,
  FundTransactionEntitySchema,
  PointsRewardBankEntitySchema,
  PointsRewardBankRewardEntitySchema,
  PointsRewardBankWalletLinkEntitySchema,
  SupplierUnitEntitySchema,
  TierMembershipEntitySchema,
  TierMembershipTransactionEntitySchema,
  WalletAccountEntitySchema,
  WalletAccountTransactionEntitySchema,
  WalletConsumerEntitySchema,
  WalletEntitySchema,
  WalletIdentityEntitySchema,
  WalletInviteEntitySchema,
  WalletTransactionEntitySchema,
]);

export type AtomicOperation = z.infer<typeof AtomicOperationSchema>;
