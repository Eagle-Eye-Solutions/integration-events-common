import AtomicOperations from '../../../../src/ee-air/atomic-operations';
import fixtures from '../../../fixtures/wallet-account-transaction-entities';

describe('AtomicOperations.WalletAccountTransactionEntity.CreateEcoupon.getCouponAttributes', () => {
  it('returns the coupon attributes when both start and end dates are present', () => {
    // Arrange
    const input = fixtures.ecoupon.create.offer;

    // Act
    const output =
      AtomicOperations.WalletAccountTransactionEntity.CreateEcoupon.getCouponAttributes(
        input,
      );

    // Assert
    expect(output).toEqual({
      accountId: '4093853181',
      campaignId: '100641544',
      type: 'ECOUPON',
      clientType: 'OFFER',
      state: 'LOADED',
      status: 'ACTIVE',
      dateStart: new Date('2025-01-29T20:23:01.000Z'),
      dateEnd: new Date('2025-12-31T23:59:00.000Z'),
      relationships: [],
    });
  });

  it('returns the attributes for an ECOUPON with client type ENTITLEMENT', () => {
    // Arrange
    const input = fixtures.ecoupon.create.entitlement;

    // Act
    const output =
      AtomicOperations.WalletAccountTransactionEntity.CreateEcoupon.getCouponAttributes(
        input,
      );

    // Assert
    expect(output).toEqual({
      accountId: '4083796505',
      campaignId: '100767003',
      type: 'ECOUPON',
      clientType: 'ENTITLEMENT',
      state: 'LOADED',
      status: 'ACTIVE',
      dateEnd: new Date('2026-12-31T23:59:00.000Z'),
      dateStart: new Date('2025-01-22T21:36:54.000Z'),
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
    });
  });

  it.each([
    {
      start: '2025-01-29T20:23:01+00:00',
      end: undefined,
    },
    {
      start: '2025-01-29T20:23:01+00:00',
      end: null,
    },
  ])(
    'returns the coupon attributes when start date is present and end date is %1',
    dates => {
      // Arrange
      const input = structuredClone(fixtures.ecoupon.create.offer);
      input.objectValue.account.dates = dates;

      // Act
      const output =
        AtomicOperations.WalletAccountTransactionEntity.CreateEcoupon.getCouponAttributes(
          input,
        );

      // Assert
      expect(output).toEqual({
        accountId: '4093853181',
        campaignId: '100641544',
        type: 'ECOUPON',
        clientType: 'OFFER',
        state: 'LOADED',
        status: 'ACTIVE',
        dateStart: new Date('2025-01-29T20:23:01.000Z'),
        dateEnd: null,
        relationships: [],
      });
    },
  );
});

describe('AtomicOperations.WalletAccountTransactionEntity.UpdateRedeemEcoupon.getCouponAttributes', () => {
  it('returns the redeemed coupon attributes', () => {
    // Arrange
    const input = fixtures.ecoupon.update.redeem;

    // Act
    const output =
      AtomicOperations.WalletAccountTransactionEntity.UpdateRedeemEcoupon.getCouponAttributes(
        input,
      );

    // Assert
    expect(output).toEqual({
      accountId: '4093853179',
      campaignId: '100641542',
      clientType: 'OFFER',
      dateEnd: new Date('2025-12-31T23:59:00.000Z'),
      dateStart: new Date('2025-01-29T20:23:00.000Z'),
      state: 'LOADED',
      status: 'USED',
      type: 'ECOUPON',
      value: 100,
      relationships: [],
    });
  });
});

describe('AtomicOperations.WalletAccountTransactionEntity.CreateStandardSubscription.getSubscriptionAttributes', () => {
  it('returns the subscription attributes', () => {
    // Arrange
    const input = fixtures.standardSubscription.create;

    // Act
    const output =
      AtomicOperations.WalletAccountTransactionEntity.CreateStandardSubscription.getStandardSubscriptionAttributes(
        input,
      );

    // Assert
    expect(output).toEqual({
      accountId: '4083796503',
      campaignId: '100767004',
      clientType: null,
      dateEnd: new Date('2038-01-19T03:14:07.000Z'),
      dateStart: new Date('2025-01-22T21:36:54.000Z'),
      state: 'LOADED',
      status: 'ACTIVE',
      type: 'STANDARD_SUBSCRIPTION',
    });
  });
});

describe('AtomicOperations.WalletAccountTransactionEntity.UpdateStandardSubscription.getSubscriptionAttributes', () => {
  it('returns the subscription attributes', () => {
    // Arrange
    const input = fixtures.standardSubscription.update;

    // Act
    const output =
      AtomicOperations.WalletAccountTransactionEntity.UpdateStandardSubscription.getStandardSubscriptionAttributes(
        input,
      );

    // Assert
    expect(output).toEqual({
      accountId: '4083796503',
      campaignId: '100767004',
      clientType: null,
      dateEnd: new Date('2038-01-19T03:14:07.000Z'),
      dateStart: new Date('2025-01-22T21:36:54.000Z'),
      state: 'LOADED',
      status: 'CANCELLED',
      type: 'STANDARD_SUBSCRIPTION',
    });
  });
});
