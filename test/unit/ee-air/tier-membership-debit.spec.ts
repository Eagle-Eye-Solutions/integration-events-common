import {
  EeAirOutboundEventSchema,
  getTierMembershipDebitEventData,
  TierMembershipDebitEventData,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('getTierMembershipDebitEventData', () => {
  it('extracts tier data from a TIER.MEMBERSHIP.DEBIT event', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.TIER_MEMBERSHIP_DEBIT,
    );

    const expectedOutput: TierMembershipDebitEventData = {
      tier: {
        tierId: '178',
        tierBalancesPoints: 13001,
        tierBalancesSpend: 9000,
        tierBalancesTransactions: 7,
        tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
      },
    };

    // Act
    const output = getTierMembershipDebitEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
