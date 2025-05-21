import createPoints from './create-points';
import createEcouponOffer from './create-ecoupon-offer';
import createEcouponEntitlement from './create-ecoupon-entitlement';
import updateRedeemEcoupon from './update-redeem-ecoupon';
import createStandardSubscription from './create-standard-subscription';
import updateEcouponEntitlement from './update-ecoupon-entitlement';
import updateStandardSubscription from './update-standard-subscription';

const fixtures = {
  standardSubscription: {
    create: createStandardSubscription,
    update: updateStandardSubscription,
  },
  points: {
    create: createPoints,
  },
  ecoupon: {
    create: {
      offer: createEcouponOffer,
      entitlement: createEcouponEntitlement,
    },
    update: {
      redeem: updateRedeemEcoupon,
      entitlement: updateEcouponEntitlement,
    },
  },
};

export default fixtures;
