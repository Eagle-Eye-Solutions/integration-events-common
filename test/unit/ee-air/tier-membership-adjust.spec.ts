import {
  EeAirOutboundEventSchema,
  getTierMembershipAdjustEventData,
  TierMembershipAdjustEventData,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('getTierMembershipAdjustEventData', () => {
  it('extracts tier data from a TIER.MEMBERSHIP.ADJUST event (1)', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.TIER_MEMBERSHIP_ADJUST_NEGATIVE,
    );

    const expectedOutput: TierMembershipAdjustEventData = {
      tier: {
        tierId: '179',
        tierBalancesPoints: 12001,
        tierBalancesSpend: 8000,
        tierBalancesTransactions: 6,
        tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
      },
    };

    // Act
    const output = getTierMembershipAdjustEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });

  it('extracts tier data from a TIER.MEMBERSHIP.ADJUST event (2)', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.TIER_MEMBERSHIP_ADJUST_POSITIVE,
    );

    const expectedOutput: TierMembershipAdjustEventData = {
      tier: {
        tierId: '179',
        tierBalancesPoints: 13001,
        tierBalancesSpend: 9000,
        tierBalancesTransactions: 7,
        tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
      },
    };

    // Act
    const output = getTierMembershipAdjustEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
