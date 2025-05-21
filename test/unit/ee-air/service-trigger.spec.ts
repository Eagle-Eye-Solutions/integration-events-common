import {
  EeAirOutboundEventSchema,
  getServiceTriggerEventData,
  ServiceTriggerEventData,
} from '../../../src';
import {} from '../../../src/ee-air/service-trigger';
import {sampleEvents} from '../../fixtures';

describe('getServiceTriggerData', () => {
  it('extracts tier data from a SERVICE.TRIGGER (coupon) event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.SERVICE_TRIGGER_COUPON,
    );

    const expectedOutput: ServiceTriggerEventData = {
      awardedCoupons: [
        {
          accountId: '',
          campaignId: '100641678',
          clientType: 'OFFER',
          dateEnd: new Date('2025-12-31T23:59:00.000Z'),
          dateStart: new Date('2025-02-03T20:47:41.000Z'),
          state: 'LOADED',
          status: 'ACTIVE',
          type: 'ECOUPON',
        },
      ],
      awardedPoints: {
        accountId: '4103598328',
        campaignId: '100633085',
        points: 0,
      },
    };

    // Act
    const output = getServiceTriggerEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });

  it('extracts tier data from a SERVICE.TRIGGER (points) event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.SERVICE_TRIGGER_POINTS,
    );

    const expectedOutput: ServiceTriggerEventData = {
      points: {
        pointsBalance: 400,
      },
      awardedCoupons: [],
      awardedPoints: {
        accountId: '4103598394',
        campaignId: '100641681',
        points: 400,
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
    const output = getServiceTriggerEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
