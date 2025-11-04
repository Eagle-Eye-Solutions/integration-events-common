import {
  EeAirOutboundEventSchema,
  getWalletAccountUpdateEventData,
  WalletAccountUpdateEventData,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('getWalletAccountUpdateEventData', () => {
  it('returns Coupon Redeemed events and an Order Completed event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.WALLET_ACCOUNT_UPDATE,
    );

    const expectedOutput: WalletAccountUpdateEventData = {
      account: {
        accountId: '4083796503',
        campaignId: '100767004',
        type: 'STANDARD_SUBSCRIPTION',
        clientType: null,
        state: 'LOADED',
        status: 'CANCELLED',
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
          status: 'CANCELLED',
          dateStart: new Date('2025-01-22T21:36:54.000Z'),
          dateEnd: new Date('2026-12-31T23:59:00.000Z'),
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
        },
        {
          accountId: '4083796505',
          campaignId: '100767003',
          type: 'ECOUPON',
          clientType: 'ENTITLEMENT',
          state: 'LOADED',
          status: 'CANCELLED',
          dateStart: new Date('2025-01-22T21:36:54.000Z'),
          dateEnd: new Date('2026-12-31T23:59:00.000Z'),
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
        },
      ],
    };

    // Act
    const output = getWalletAccountUpdateEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
