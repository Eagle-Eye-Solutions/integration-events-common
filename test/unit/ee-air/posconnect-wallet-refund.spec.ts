import {
  EeAirOutboundEventSchema,
  getPosConnectWalletRefundEventData,
  POSConnectWalletRefundEventData,
  Logger,
  BaseOutConnectorConfig,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
} as unknown as Logger;

describe('getPosConnectWalletRefundEventData', () => {
  it.each([
    {
      eventName: 'POSCONNECT.WALLET.REFUND (partial)',
      event: sampleEvents.POSCONNECT_WALLET_REFUND_PARTIAL,
      expectedOutput: {
        points: {
          pointsBalance: 1371,
        },
        tier: {
          tierId: '177',
          tierBalancesPoints: 171,
          tierBalancesSpend: 14100,
          tierBalancesTransactions: 0,
          tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
        },
        currencyCode: 'USD',
        redeemedCoupons: [
          {
            accountId: '4126000957',
            campaignId: '100792525',
            type: 'ECOUPON',
            clientType: 'OFFER',
            state: 'LOADED',
            status: 'USED',
            dateStart: new Date('2025-02-10T21:59:36.000Z'),
            dateEnd: new Date('2025-02-10T22:00:58.000Z'),
            value: 500,
            relationships: [],
          },
        ],
        unredeemedCoupons: [
          {
            accountId: '4126000957',
            campaignId: '100792525',
            type: 'ECOUPON',
            clientType: 'OFFER',
            state: 'LOADED',
            status: 'ACTIVE',
            dateStart: new Date('2025-02-10T21:59:36.000Z'),
            dateEnd: new Date('2025-02-10T22:00:58.000Z'),
            value: 700,
            relationships: [],
          },
        ],
        transaction: {
          products: [
            {
              description: 'Lemonade',
              itemUnitCost: 1000,
              itemUnitCount: 2,
              totalUnitCost: 2000,
              totalUnitCostAfterDiscount: 2000,
              upc: '245874',
            },
          ],
          storeLocation: {
            storeId: 'outlet1',
            storeParentId: 'banner1',
          },
          totalBasketValueAfterDiscount: 1800,
          totalPointsDeducted: 18,
          transactionReference: 'RefundTransactionReferencefeb10c',
        },
      },
    },
    {
      eventName: 'POSCONNECT.WALLET.REFUND (full)',
      event: sampleEvents.POSCONNECT_WALLET_REFUND_FULL,
      expectedOutput: {
        points: {
          pointsBalance: 1326,
        },
        tier: {
          tierId: '177',
          tierBalancesPoints: 126,
          tierBalancesSpend: 12600,
          tierBalancesTransactions: 0,
          tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
        },
        currencyCode: 'USD',
        redeemedCoupons: [],
        unredeemedCoupons: [],
        transaction: {
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
          storeLocation: {
            storeId: 'outlet1',
            storeParentId: 'banner1',
          },
          totalBasketValueAfterDiscount: 7000,
          totalPointsDeducted: 63,
          transactionReference: 'RefundTransactionReferencefeb10b',
        },
      },
    },
  ] as Array<{
    eventName: string;
    event: unknown;
    expectedOutput: POSConnectWalletRefundEventData;
  }>)('handles an initial $eventName event', ({event, expectedOutput}) => {
    // Arrange
    const eeAirOutboundEvent = EeAirOutboundEventSchema.parse(event);
    const configuration = {
      currency: 'USD',
    };

    // Act
    const output = getPosConnectWalletRefundEventData(eeAirOutboundEvent, {
      connectorConfig: {
        configuration,
      } as BaseOutConnectorConfig,
      logger: mockLogger,
    });

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
