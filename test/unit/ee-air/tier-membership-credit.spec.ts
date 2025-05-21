import {
  EeAirOutboundEventSchema,
  getTierMembershipCreditEventData,
  TierMembershipCreditEventData,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('getTierMembershipCreditEventData', () => {
  it('extracts tier data from a TIER.MEMBERSHIP.CREDIT event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.TIER_MEMBERSHIP_CREDIT,
    );

    const expectedOutput: TierMembershipCreditEventData = {
      tier: {
        tierId: '178',
        tierBalancesPoints: 14001,
        tierBalancesSpend: 10000,
        tierBalancesTransactions: 8,
        tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
      },
    };

    // Act
    const output = getTierMembershipCreditEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
