import {
  EeAirOutboundEventSchema,
  getPosConnectWalletSpendVoidEventData,
  POSConnectWalletSpendVoidEventData,
  Logger,
  BaseOutConnectorConfig,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

const logger = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
} as unknown as Logger;

const mockAirClient = {
  getWalletTransactionById: jest.fn(),
};

jest.mock('../../../src/common/ee-air-client/ee-air-client', () => {
  return {
    EeAirClient: jest.fn().mockImplementation(() => mockAirClient),
  };
});

describe('getPosConnectWalletSpendVoidEventData', () => {
  it('returns Coupon Redeemed events and an Order Completed event', async () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.SPEND_POSCONNECT_WALLET_SPEND_VOID,
    );

    const connectorConfig: BaseOutConnectorConfig = {
      credentials: {
        clientId: 'some-client-id',
        secret: 'some-secret',
      },
      configuration: {
        currency: 'USD',
      },
      domains: {},
    } as BaseOutConnectorConfig;

    mockAirClient.getWalletTransactionById.mockResolvedValue({
      reference: 'MockedOriginalTransactionReference',
    });

    const expectedOutput: POSConnectWalletSpendVoidEventData = {
      points: {
        pointsBalance: 56340,
      },
      tier: 0,
      transaction: {
        pointsSpent: 0,
        pointsBalance: 56340,
        transactionReference: 'SpendTransactionReferenceFeb26b',
        originalTransactionReference: 'MockedOriginalTransactionReference',
      },
      voided: true,
    };

    // Act
    const output = await getPosConnectWalletSpendVoidEventData(event, {
      connectorConfig,
      logger,
    });

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
