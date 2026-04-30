import {
  EeAirOutboundEventSchema,
  collectPointsAccountSnapshotsFromAtomicOperations,
} from '../../../src';
import {sampleEvents} from '../../fixtures';

describe('collectPointsAccountSnapshotsFromAtomicOperations', () => {
  it('dedupes multiple UPDATE POINTS ops for the same account (last wins)', () => {
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.POSCONNECT_WALLET_SETTLE,
    );
    const {pointsAccounts, points} =
      collectPointsAccountSnapshotsFromAtomicOperations(
        event.atomicOperations,
        'pointsUpdatesOnly',
      );
    expect(pointsAccounts).toHaveLength(1);
    expect(pointsAccounts[0].accountId).toBe('4093853182');
    expect(pointsAccounts[0].pointsBalance).toBe(663);
    expect(points?.pointsBalance).toBe(663);
  });

  it('collects multiple distinct POINTS accounts on SERVICE.WALLET.ACCOUNTS.CREATE', () => {
    const event = EeAirOutboundEventSchema.parse(
      sampleEvents.SERVICE_WALLET_ACCOUNTS_CREATE,
    );
    const {pointsAccounts, points} =
      collectPointsAccountSnapshotsFromAtomicOperations(
        event.atomicOperations,
        'pointsCreatesOnly',
      );
    expect(pointsAccounts).toHaveLength(1);
    expect(points?.pointsBalance).toBe(0);
  });
});
