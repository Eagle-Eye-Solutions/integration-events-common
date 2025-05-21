import {WalletAccountTransactionEntityUpdateRedeemEcoupon} from '../../../src';

const entity: WalletAccountTransactionEntityUpdateRedeemEcoupon = {
  objectType: 'walletAccountTransactionEntity',
  operationType: 'UPDATE',
  objectValue: {
    accountTransactionId: '7909471162',
    parentAccountTransactionId: '',
    accountId: '4093853179',
    account: {
      accountId: '4093853179',
      walletId: '216396239',
      campaignId: '100641542',
      type: 'ECOUPON',
      clientType: 'OFFER',
      status: 'USED',
      state: 'LOADED',
      dates: {
        start: '2025-01-29T20:23:00+00:00',
        end: '2025-12-31T23:59:00+00:00',
      },
      meta: [],
      dateCreated: '2025-01-29T20:23:00+00:00',
      lastUpdated: '2025-01-29T20:37:03+00:00',
      overrides: [],
      balances: {
        available: 0,
        refundable: 0,
      },
      relationships: [],
      mobileWallet: 'https://sb.uk.mypass.is/a/4093853179/7e4c9ba080030bd',
    },
    event: 'REDEEM',
    value: 100,
    source: 1,
    balancesBefore: {
      available: 0,
      refundable: 0,
    },
    balancesAfter: {
      available: 0,
      refundable: 0,
    },
    transactionDetails: {
      numberOfRewards: 1,
      merchant_store_id: 'outlet1',
      merchant_store_parent_id: 'banner1',
    },
    properties: [],
    dateCreated: '2025-01-29T20:37:03+00:00',
    lastUpdated: '2025-01-29T20:37:03+00:00',
  },
};

export default entity;
