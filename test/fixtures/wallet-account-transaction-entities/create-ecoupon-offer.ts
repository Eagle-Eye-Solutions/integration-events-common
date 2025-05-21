import {WalletAccountTransactionEntityCreateEcoupon} from '../../../src';

const entity: WalletAccountTransactionEntityCreateEcoupon = {
  objectType: 'walletAccountTransactionEntity',
  operationType: 'CREATE',
  objectValue: {
    accountTransactionId: '7909470724',
    parentAccountTransactionId: null,
    accountId: '4093853181',
    account: {
      accountId: '4093853181',
      walletId: '216396239',
      campaignId: '100641544',
      type: 'ECOUPON',
      clientType: 'OFFER',
      status: 'ACTIVE',
      state: 'LOADED',
      dates: {
        start: '2025-01-29T20:23:01+00:00',
        end: '2025-12-31T23:59:00+00:00',
      },
      meta: [],
      dateCreated: '2025-01-29T20:23:01+00:00',
      lastUpdated: '2025-01-29T20:23:01+00:00',
      overrides: [],
      balances: {
        available: 0,
        refundable: 0,
      },
      relationships: [],
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
    dateCreated: '2025-01-29T20:23:01+00:00',
    lastUpdated: '2025-01-29T20:23:01+00:00',
  },
};

export default entity;
