import {
  EeAirOutboundEventSchema,
  getTierMembershipCreateEventData,
  TierMembershipCreateEventData,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('getTierMembershipCreateEventData', () => {
  it('extracts tier data from a TIER.MEMBERSHIP.CREATE event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.TIER_MEMBERSHIP_CREATE,
    );

    const expectedOutput: TierMembershipCreateEventData = {
      tier: {
        tierId: '177',
        tierBalancesPoints: 0,
        tierBalancesSpend: 0,
        tierBalancesTransactions: 0,
        tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
      },
    };

    // Act
    const output = getTierMembershipCreateEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
