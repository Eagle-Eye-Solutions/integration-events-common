import {
  EeAirOutboundEventSchema,
  getTierMembershipMoveEventData,
  TierMembershipMoveEventData,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('getTierMembershipMoveEventData', () => {
  it('extracts tier data from a TIER.MEMBERSHIP.MOVE event (1)', () => {
    // Arrange
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.TIER_MEMBERSHIP_MOVE,
    );

    const expectedOutput: TierMembershipMoveEventData = {
      tier: {
        tierId: '177',
        tierBalancesPoints: 12001,
        tierBalancesSpend: 8000,
        tierBalancesTransactions: 6,
        tierBalancesResetDate: new Date('2031-01-31T23:59:59.000Z'),
      },
    };

    // Act
    const output = getTierMembershipMoveEventData(event);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
