import {
  EeAirOutboundEventSchema,
  getPosConnectWalletSettleEventData,
  POSConnectWalletSettleEventData,
  Logger,
  BaseOutConnectorConfig,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

const logger = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
} as unknown as Logger;

describe('getPosConnectWalletSettleEventData', () => {
  it('returns Coupon Redeemed events and an Order Completed event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.POSCONNECT_WALLET_SETTLE,
    );

    const connectorConfig: BaseOutConnectorConfig = {
      configuration: {
        currency: 'USD',
      },
    } as BaseOutConnectorConfig;

    const expectedOutput: POSConnectWalletSettleEventData = {
      currencyCode: 'USD',
      redeemedCoupons: [
        {
          accountId: '4093853356',
          campaignId: '100792525',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'USED',
          dateEnd: new Date('2025-01-29T20:37:03.000Z'),
          dateStart: new Date('2025-01-29T20:35:43.000Z'),
          value: 700,
        },
        {
          accountId: '4093853180',
          campaignId: '100641543',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'USED',
          dateEnd: new Date('2025-12-31T23:59:00.000Z'),
          dateStart: new Date('2025-01-29T20:23:00.000Z'),
          value: 200,
        },
        {
          accountId: '4093853179',
          campaignId: '100641542',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'USED',
          dateEnd: new Date('2025-12-31T23:59:00.000Z'),
          dateStart: new Date('2025-01-29T20:23:00.000Z'),
          value: 100,
        },
        {
          accountId: '4093853181',
          campaignId: '100641544',
          type: 'ECOUPON',
          clientType: 'OFFER',
          state: 'LOADED',
          status: 'USED',
          dateEnd: new Date('2025-12-31T23:59:00.000Z'),
          dateStart: new Date('2025-01-29T20:23:01.000Z'),
          value: 300,
        },
      ],
      points: {
        pointsBalance: 663,
      },
      tier: {
        tierBalancesPoints: 63,
        tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
        tierBalancesSpend: 6300,
        tierBalancesTransactions: 0,
        tierId: '177',
      },
      transaction: {
        discountsReceived: 700,
        products: [
          {
            description: 'Lemonade',
            itemUnitCost: 1000,
            itemUnitCount: 2,
            totalUnitCost: 2000,
            totalUnitCostAfterDiscount: 2000,
            upc: '245874',
          },
          {
            description: 'Coffee',
            itemUnitCost: 1000,
            itemUnitCount: 1,
            totalUnitCost: 1000,
            totalUnitCostAfterDiscount: 1000,
            upc: '245875',
          },
          {
            description: 'Oranges',
            itemUnitCost: 1000,
            itemUnitCount: 1,
            totalUnitCost: 1000,
            totalUnitCostAfterDiscount: 1000,
            upc: '245887',
          },
          {
            description: 'Carrot',
            itemUnitCost: 1000,
            itemUnitCount: 1,
            totalUnitCost: 1000,
            totalUnitCostAfterDiscount: 1000,
            upc: '245886',
          },
          {
            description: 'Pizza',
            itemUnitCost: 1000,
            itemUnitCount: 1,
            totalUnitCost: 1000,
            totalUnitCostAfterDiscount: 1000,
            upc: '245868',
          },
          {
            description: 'Wine',
            itemUnitCost: 1000,
            itemUnitCount: 1,
            totalUnitCost: 1000,
            totalUnitCostAfterDiscount: 1000,
            upc: '245872',
          },
        ],
        storeLocation: {storeId: 'outlet1', storeParentId: 'banner1'},
        totalBasketValueAfterDiscount: 6300,
        totalPointsEarned: 663,
        transactionReference: 'NSTEST123pos2225',
        transactionDate: new Date('2025-01-29T20:37:03.000Z'),
      },
    };

    // Act
    const output = getPosConnectWalletSettleEventData(event, {
      connectorConfig,
      logger,
    });

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
