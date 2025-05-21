import {WalletAccountTransactionEntityUpdateEcouponEntitlement} from '../../../src';

export default {
  objectType: 'walletAccountTransactionEntity',
  operationType: 'UPDATE',
  objectValue: {
    accountTransactionId: '7877376471',
    parentAccountTransactionId: '7877376470',
    accountId: '4083796504',
    account: {
      accountId: '4083796504',
      walletId: '216245571',
      campaignId: '100767002',
      type: 'ECOUPON',
      clientType: 'ENTITLEMENT',
      status: 'CANCELLED',
      state: 'LOADED',
      dates: {
        start: '2025-01-22T21:36:54+00:00',
        end: '2026-12-31T23:59:00+00:00',
      },
      meta: [],
      dateCreated: '2025-01-22T21:36:54+00:00',
      lastUpdated: '2025-01-22T21:42:21+00:00',
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
      mobileWallet: 'https://sb.uk.mypass.is/a/4083796504/58d90b80452201e',
    },
    event: 'CANCEL',
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
    dateCreated: '2025-01-22T21:42:21+00:00',
    lastUpdated: '2025-01-22T21:42:21+00:00',
  },
} as WalletAccountTransactionEntityUpdateEcouponEntitlement;
