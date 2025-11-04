import {
  EeAirOutboundEventSchema,
  getServiceWalletAccountsCreateEventData,
  ServiceWalletAccountsCreateEventData,
} from '../../../src';
import '../../../src/ee-air/service-trigger';
import {sampleEvents} from '../../fixtures';

describe('getServiceWalletAccountsCreateEventData', () => {
  it('extracts data from a SERVICE.WALLET.ACCOUNTS.CREATE event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.SERVICE_WALLET_ACCOUNTS_CREATE,
    );

    const expectedOutput: ServiceWalletAccountsCreateEventData = {
      points: {
        pointsBalance: 0,
      },
      tier: {
        tierId: '177',
        tierBalancesPoints: 0,
        tierBalancesSpend: 0,
        tierBalancesTransactions: 0,
        tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
      },
      coupons: [
        {
          accountId: '4093853179',
          campaignId: '100641542',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'ACTIVE',
          dateStart: new Date('2025-01-29T20:23:00.000Z'),
          dateEnd: new Date('2025-12-31T23:59:00.000Z'),
          relationships: [],
        },
        {
          accountId: '4093853180',
          campaignId: '100641543',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'ACTIVE',
          dateStart: new Date('2025-01-29T20:23:00.000Z'),
          dateEnd: new Date('2025-12-31T23:59:00.000Z'),
          relationships: [],
        },
        {
          accountId: '4093853181',
          campaignId: '100641544',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'ACTIVE',
          dateStart: new Date('2025-01-29T20:23:01.000Z'),
          dateEnd: new Date('2025-12-31T23:59:00.000Z'),
          relationships: [],
        },
      ],
      continuityAccounts: [],
      questAccounts: [],
      stampCards: [],
    };

    // Act
    const output = getServiceWalletAccountsCreateEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });

  it('handles SERVICE.WALLET.ACCOUNTS.CREATE without accounts.scheme in request', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.SERVICE_WALLET_ACCOUNTS_CREATE_NO_SCHEME,
    );

    // Act
    const output = getServiceWalletAccountsCreateEventData(event);

    // Assert: still parses from atomic operations and doesn’t throw
    expect(output.coupons.length).toBeGreaterThanOrEqual(0);
    // points and tier are optional; just assert structure exists
    expect(output).toHaveProperty('continuityAccounts');
    expect(output).toHaveProperty('questAccounts');
    expect(output).toHaveProperty('stampCards');
  });
});
