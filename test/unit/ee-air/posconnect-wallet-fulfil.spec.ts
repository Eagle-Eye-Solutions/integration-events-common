import {
  EeAirOutboundEventSchema,
  getPosConnectWalletFulfilEventData,
  POSConnectWalletFulfilEventData,
  Logger,
  BaseOutConnectorConfig,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

const logger = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
} as unknown as Logger;

describe('getPosConnectWalletFulfilEventData', () => {
  it.each([
    {
      eventName: 'POSCONNECT.WALLET.FULFIL (initial)',
      event: sampleEvents.POSCONNECT_WALLET_FULFIL_INITIAL,
      expectedOutput: {
        currencyCode: 'USD',
        redeemedCoupons: [],
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
          totalBasketValueAfterDiscount: 6300,
          totalPointsEarned: 63,
          transactionReference: 'TransactionReferenceFeb10e',
          transactionDate: new Date('2025-02-11T04:40:59.000Z'),
        },
        initial: true,
        final: false,
      },
    },
    {
      eventName: 'POSCONNECT.WALLET.FULFIL (middle)',
      event: sampleEvents.POSCONNECT_WALLET_FULFIL_MIDDLE,
      expectedOutput: {
        currencyCode: 'USD',
        redeemedCoupons: [],
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
          ],
          storeLocation: {
            storeId: 'outlet1',
            storeParentId: 'banner1',
          },
          totalBasketValueAfterDiscount: 2000,
          totalPointsEarned: 63,
          transactionReference: 'Middle_TransactionReferenceFeb10e',
          transactionDate: new Date('2025-02-11T04:42:51.000Z'),
          originalTransactionReference: 'TransactionReferenceFeb10e',
          originalTransactionDate: new Date('2025-02-11T04:40:59.000Z'),
        },
        initial: false,
        final: false,
      },
    },
    {
      eventName: 'POSCONNECT.WALLET.FULFIL (final)',
      event: sampleEvents.POSCONNECT_WALLET_FULFIL_FINAL,
      expectedOutput: {
        points: {
          pointsBalance: 1389,
        },
        currencyCode: 'USD',
        redeemedCoupons: [],
        transaction: {
          discountsReceived: 0,
          products: [
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
          totalBasketValueAfterDiscount: 5000,
          totalPointsEarned: 18,
          transactionReference: 'Final_TransactionReferenceFeb10e',
          transactionDate: new Date('2025-02-11T04:46:41.000Z'),
          originalTransactionReference: 'TransactionReferenceFeb10e',
          originalTransactionDate: new Date('2025-02-11T04:40:59.000Z'),
        },
        initial: false,
        final: true,
      },
    },
  ] as Array<{
    eventName: string;
    event: unknown;
    expectedOutput: POSConnectWalletFulfilEventData;
  }>)('handles an initial $eventName event', ({event, expectedOutput}) => {
    // Arrange
    const eeAirOutboundEvent = EeAirOutboundEventSchema.parse(event);

    const connectorConfig: BaseOutConnectorConfig = {
      configuration: {
        currency: 'USD',
      },
    } as BaseOutConnectorConfig;

    // Act
    const output = getPosConnectWalletFulfilEventData(eeAirOutboundEvent, {
      connectorConfig,
      logger,
    });

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
