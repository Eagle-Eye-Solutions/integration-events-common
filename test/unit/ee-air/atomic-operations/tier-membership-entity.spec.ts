import {
  TierMembershipEntity,
  getTierAttributesFromTierMembershipEntity,
} from '../../../../src';

const tierMembershipEntity: TierMembershipEntity = {
  objectType: 'tierMembershipEntity',
  operationType: 'CREATE',
  objectValue: {
    tierMembershipId: '1291031',
    tierId: '177',
    status: 'ACTIVE',
    accountIds: ['4093853182'],
    balances: {
      points: 0,
      spend: 0,
      transactions: 0,
    },
    expiryDate: '2025-07-31T23:59:59+00:00',
    tierBalancesResetDate: '2031-01-31T23:59:59+00:00',
    dateCreated: '2025-01-29T20:23:01+00:00',
    lastUpdated: '2025-01-29T20:23:01+00:00',
  },
};

describe('getCouponAttributesFromWalletAccountTransactionEntity', () => {
  it('returns the coupon attributes when both start and end dates are present', () => {
    // Arrange
    const input = tierMembershipEntity;

    // Act
    const output = getTierAttributesFromTierMembershipEntity(input);

    // Assert
    expect(output).toEqual({
      tierId: '177',
      tierBalancesPoints: 0,
      tierBalancesSpend: 0,
      tierBalancesTransactions: 0,
      tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
    });
  });
});
