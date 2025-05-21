import {
  EeAirOutboundEventSchema,
  getServiceWalletCreateEventData,
  ServiceWalletCreateEventData,
} from '../../../src';
import {} from '../../../src/ee-air/service-trigger';
import {sampleEvents} from '../../fixtures';

describe('getServiceWalletCreateEventData', () => {
  it('extracts data from a SERVICE.WALLET.CREATE event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.SERVICE_WALLET_CREATE,
    );

    const expectedOutput: ServiceWalletCreateEventData = {};

    // Act
    const output = getServiceWalletCreateEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
