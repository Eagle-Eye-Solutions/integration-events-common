import {WalletAccountTransactionEntityCreatePoints} from '../../../src';

const entity: WalletAccountTransactionEntityCreatePoints = {
  objectType: 'walletAccountTransactionEntity',
  operationType: 'CREATE',
  objectValue: {
    accountTransactionId: '7909470725',
    parentAccountTransactionId: null,
    accountId: '4093853182',
    account: {
      accountId: '4093853182',
      walletId: '216396239',
      campaignId: '100620987',
      type: 'POINTS',
      clientType: 'RETAILPOINTS',
      status: 'ACTIVE',
      state: 'LOADED',
      dates: {
        start: '2025-01-29T20:23:01+00:00',
        end: '2038-01-19T03:14:07+00:00',
      },
      meta: [],
      dateCreated: '2025-01-29T20:23:01+00:00',
      lastUpdated: '2025-01-29T20:23:01+00:00',
      overrides: [],
      balances: {
        current: 0,
        usable: 0,
        locked: 0,
        lifetime: 0,
        lifetimeSpend: 0,
        lifetimeSpendValue: 0,
        pending: 0,
      },
      relationships: [],
      mobileWallet: 'https://sb.uk.mypass.is/a/4093853182/8955b70dd1bff59',
    },
    event: 'CREATE',
    value: 0,
    source: 1,
    balancesBefore: {
      current: 0,
      lifetime: 0,
    },
    balancesAfter: {
      current: 0,
      lifetime: 0,
    },
    transactionDetails: [],
    properties: [],
    dateCreated: '2025-01-29T20:23:01+00:00',
    lastUpdated: '2025-01-29T20:23:01+00:00',
  },
};

export default entity;
