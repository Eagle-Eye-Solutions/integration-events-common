import {
  EeAirOutboundEventSchema,
  getWalletAccountCreateSchemeEventData,
  WalletAccountCreateSchemeEventData,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('getWalletAccountCreateSchemeEventData', () => {
  it('returns the data extracted from a WALLET.ACCOUNT.CREATE.SCHEME event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.WALLET_ACCOUNT_CREATE_SCHEME,
    );

    const expectedOutput: WalletAccountCreateSchemeEventData = {
      pointsAccounts: [
        {
          accountId: '4093853258',
          campaignId: '100620987',
          walletId: '216396269',
          pointsBalance: 0,
          type: 'POINTS',
          clientType: 'RETAILPOINTS',
          status: 'ACTIVE',
          state: 'EARNBURN',
        },
      ],
      points: {
        pointsBalance: 0,
      },
      tier: {
        tierBalancesPoints: 0,
        tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
        tierBalancesSpend: 0,
        tierBalancesTransactions: 0,
        tierId: '177',
      },
    };

    // Act
    const output = getWalletAccountCreateSchemeEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
