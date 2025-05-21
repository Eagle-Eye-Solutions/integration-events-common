import {
  EeAirOutboundEventSchema,
  getWalletAccountCreatePlanEventData,
  WalletAccountCreatePlanEventData,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('getWalletAccountCreatePlanEventData', () => {
  it('returns Coupon Redeemed events and an Order Completed event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.WALLET_ACCOUNT_CREATE_PLAN,
    );

    const expectedOutput: WalletAccountCreatePlanEventData = {
      account: {
        accountId: '4083796503',
        campaignId: '100767004',
        type: 'STANDARD_SUBSCRIPTION',
        clientType: null,
        state: 'LOADED',
        status: 'ACTIVE',
        dateStart: new Date('2025-01-22T21:36:54.000Z'),
        dateEnd: new Date('2038-01-19T03:14:07.000Z'),
      },
      entitlements: [
        {
          accountId: '4083796504',
          campaignId: '100767002',
          type: 'ECOUPON',
          clientType: 'ENTITLEMENT',
          state: 'LOADED',
          status: 'ACTIVE',
          dateStart: new Date('2025-01-22T21:36:54.000Z'),
          dateEnd: new Date('2026-12-31T23:59:00.000Z'),
        },
        {
          accountId: '4083796505',
          campaignId: '100767003',
          type: 'ECOUPON',
          clientType: 'ENTITLEMENT',
          state: 'LOADED',
          status: 'ACTIVE',
          dateStart: new Date('2025-01-22T21:36:54.000Z'),
          dateEnd: new Date('2026-12-31T23:59:00.000Z'),
        },
      ],
    };

    // Act
    const output = getWalletAccountCreatePlanEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
