import {
  EeAirOutboundEventSchema,
  getWalletAccountCreateCampaignEventData,
  WalletAccountCreateCampaignEventData,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('getWalletAccountCreateCampaignEventData', () => {
  it('returns the data extracted from a WALLET.ACCOUNT.CREATE.CAMPAIGN event with a single ECOUPON', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.WALLET_ACCOUNT_CREATE_CAMPAIGN_SINGLE,
    );

    const expectedOutput: WalletAccountCreateCampaignEventData = {
      coupons: [
        {
          accountId: '4083750088',
          campaignId: '100641679',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'ACTIVE',
          dateStart: new Date('2025-01-22T20:08:38+00:00'),
          dateEnd: new Date('2025-12-31T23:59:00+00:00'),
        },
      ],
      continuityAccounts: [],
      questAccounts: [],
      stampCards: [],
    };

    // Act
    const output = getWalletAccountCreateCampaignEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });

  it('returns the data extracted from a WALLET.ACCOUNT.CREATE.CAMPAIGN event with multiple ECOUPONs', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.WALLET_ACCOUNT_CREATE_CAMPAIGN_MULTIPLE,
    );

    const expectedOutput: WalletAccountCreateCampaignEventData = {
      coupons: [
        {
          accountId: '4083750093',
          campaignId: '100641542',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'ACTIVE',
          dateStart: new Date('2025-01-22T20:09:14+00:00'),
          dateEnd: new Date('2025-12-31T23:59:00+00:00'),
        },
        {
          accountId: '4083750094',
          campaignId: '100641543',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'ACTIVE',
          dateStart: new Date('2025-01-22T20:09:14Z'),
          dateEnd: new Date('2025-12-31T23:59:00Z'),
        },
        {
          accountId: '4083750095',
          campaignId: '100641544',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'ACTIVE',
          dateStart: new Date('2025-01-22T20:09:14Z'),
          dateEnd: new Date('2025-12-31T23:59:00Z'),
        },
      ],
      continuityAccounts: [],
      questAccounts: [],
      stampCards: [],
    };

    // Act
    const output = getWalletAccountCreateCampaignEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
