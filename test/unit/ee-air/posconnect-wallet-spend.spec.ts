import {
  EeAirOutboundEventSchema,
  getPosConnectWalletSpendEventData,
  POSConnectWalletSpendEventData,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('getPosConnectWalletSpendEventData', () => {
  it('returns Coupon Redeemed events and an Order Completed event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.SPEND_POSCONNECT_WALLET_SPEND,
    );

    const expectedOutput: POSConnectWalletSpendEventData = {
      points: {
        pointsBalance: 25670,
      },
      tier: 0,
      transaction: {
        pointsBalance: 5670,
        pointsSpent: 20000,
        transactionReference: 'NSSpendTestabc123',
        originalTransactionReference: 'TransactionReferenceJan22abc333',
        storeLocation: {
          storeId: 'outlet1',
          storeParentId: 'banner1',
        },
      },
    };

    // Act
    const output = getPosConnectWalletSpendEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
