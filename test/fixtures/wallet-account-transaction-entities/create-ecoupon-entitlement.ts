import {WalletAccountTransactionEntityCreateEcouponEntitlement} from '../../../src';

export default {
  objectType: 'walletAccountTransactionEntity',
  operationType: 'CREATE',
  objectValue: {
    accountTransactionId: '7877376442',
    parentAccountTransactionId: '7877376440',
    accountId: '4083796505',
    account: {
      accountId: '4083796505',
      walletId: '216245571',
      campaignId: '100767003',
      type: 'ECOUPON',
      clientType: 'ENTITLEMENT',
      status: 'ACTIVE',
      state: 'LOADED',
      dates: {
        start: '2025-01-22T21:36:54+00:00',
        end: '2026-12-31T23:59:00+00:00',
      },
      meta: [],
      dateCreated: '2025-01-22T21:36:54+00:00',
      lastUpdated: '2025-01-22T21:36:54+00:00',
      overrides: [],
      balances: {
        available: 0,
        refundable: 0,
      },
      relationships: {
        ENTITLEMENT_OF: {
          STANDARD_SUBSCRIPTION: [
            {
              accountId: '4083796503',
              dateCreated: '2025-01-22T21:36:54+00:00',
            },
          ],
        },
      },
      mobileWallet: null,
    },
    event: 'CREATE',
    value: 0,
    source: 1,
    balancesBefore: {
      available: 0,
      refundable: 0,
    },
    balancesAfter: {
      available: 0,
      refundable: 0,
    },
    transactionDetails: [],
    properties: [],
    dateCreated: '2025-01-22T21:36:54+00:00',
    lastUpdated: '2025-01-22T21:36:54+00:00',
  },
} as WalletAccountTransactionEntityCreateEcouponEntitlement;
