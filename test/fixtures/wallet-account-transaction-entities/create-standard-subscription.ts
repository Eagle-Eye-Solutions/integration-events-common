import {WalletAccountTransactionEntityCreateStandardSubscription} from '../../../src';

export default {
  objectType: 'walletAccountTransactionEntity',
  operationType: 'CREATE',
  objectValue: {
    accountTransactionId: '7877376440',
    parentAccountTransactionId: null,
    accountId: '4083796503',
    account: {
      accountId: '4083796503',
      walletId: '216245571',
      campaignId: '100767004',
      type: 'STANDARD_SUBSCRIPTION',
      clientType: null,
      status: 'ACTIVE',
      state: 'LOADED',
      dates: {
        start: '2025-01-22T21:36:54+00:00',
        end: '2038-01-19T03:14:07+00:00',
      },
      meta: [],
      dateCreated: '2025-01-22T21:36:54+00:00',
      lastUpdated: '2025-01-22T21:36:54+00:00',
      overrides: [],
      balances: null,
      relationships: {
        ENTITLEMENT: {
          ECOUPON: [
            {
              accountId: '4083796504',
              dateCreated: '2025-01-22T21:36:54+00:00',
            },
            {
              accountId: '4083796505',
              dateCreated: '2025-01-22T21:36:54+00:00',
            },
          ],
        },
      },
      mobileWallet: 'https://sb.uk.mypass.is/a/4083796503/16a489d91a2544a',
    },
    event: 'CREATE',
    value: 0,
    source: 1,
    balancesBefore: [],
    balancesAfter: [],
    transactionDetails: [],
    properties: [],
    dateCreated: '2025-01-22T21:36:54+00:00',
    lastUpdated: '2025-01-22T21:36:54+00:00',
  },
} as WalletAccountTransactionEntityCreateStandardSubscription;
