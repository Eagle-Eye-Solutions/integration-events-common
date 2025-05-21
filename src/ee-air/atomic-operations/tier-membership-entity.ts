import {parseISO} from 'date-fns';
import {TierMembershipEntity, TierAttributes} from '../../types';

export function getTierAttributesFromTierMembershipEntity(
  tierMembershipEntity: TierMembershipEntity,
): TierAttributes {
  return {
    tierId: tierMembershipEntity.objectValue.tierId,
    tierBalancesPoints: tierMembershipEntity.objectValue.balances.points,
    tierBalancesSpend: tierMembershipEntity.objectValue.balances.spend,
    tierBalancesTransactions:
      tierMembershipEntity.objectValue.balances.transactions,
    tierBalancesResetDate: tierMembershipEntity.objectValue
      .tierBalancesResetDate
      ? parseISO(tierMembershipEntity.objectValue.tierBalancesResetDate)
      : null,
  };
}
export default {
  getTierAttributes: getTierAttributesFromTierMembershipEntity,
};
