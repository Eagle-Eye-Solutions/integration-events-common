import {
  EeAirOutboundEvent,
  CouponWithValueAttributes,
  PointsAttributes,
  TierAttributes,
  TransactionAttributes,
  POSConnectWalletFulfilEventData,
} from '..';
import {BaseEventHandlerOpts} from './types';
import AtomicOperations, {
  isTierMembershipEntity,
  isWalletAccountTransactionEntityUpdateCreditPoints,
  isWalletAccountTransactionEntityUpdateEarnPoints,
  isWalletAccountTransactionEntityUpdateRedeemEcoupon,
  isWalletTransactionEntityCreateFulfilFulfilled,
  isWalletTransactionEntityUpdateSettleFulfilling,
  isWalletTransactionEntityUpdateSettleSettled,
} from './atomic-operations';

function isInitialPosConnectWalletFulfil(event: EeAirOutboundEvent): boolean {
  if (event.headers.eventName === 'POSCONNECT.WALLET.FULFIL') {
    if (event.request.body) {
      let reqBodyObj;
      if (typeof event.request.body === 'string') {
        reqBodyObj = JSON.parse(event.request.body);
      } else {
        reqBodyObj = event.request.body;
      }

      if (!reqBodyObj.basket) {
        return true;
      }
    }
  }
  return false;
}

function isFinalPosConnectWalletFulfil(event: EeAirOutboundEvent): boolean {
  if (event.headers.eventName === 'POSCONNECT.WALLET.FULFIL') {
    if (event.request.body) {
      let reqBodyObj;
      if (typeof event.request.body === 'string') {
        reqBodyObj = JSON.parse(event.request.body);
      } else {
        reqBodyObj = event.request.body;
      }

      if (reqBodyObj.finalise) {
        return true;
      }
    }
  }
  return false;
}

function mergeTransactionAttributes(
  to: TransactionAttributes,
  from: Partial<TransactionAttributes>,
) {
  if (from.storeLocation !== undefined) {
    to.storeLocation = from.storeLocation;
  }
  if (from.products !== undefined) {
    to.products = from.products;
  }
  if (from.totalBasketValueAfterDiscount !== undefined) {
    to.totalBasketValueAfterDiscount = from.totalBasketValueAfterDiscount;
  }
  if (from.discountsReceived !== undefined) {
    to.discountsReceived = from.discountsReceived;
  }
  if (from.totalPointsEarned !== undefined) {
    to.totalPointsEarned = from.totalPointsEarned;
  }
  if (from.transactionReference !== undefined) {
    to.transactionReference = from.transactionReference;
  }
  if (from.transactionDate !== undefined) {
    to.transactionDate = from.transactionDate;
  }
}

function getPosConnectWalletFulfilInitialEventData(
  event: EeAirOutboundEvent,
  opts: BaseEventHandlerOpts,
): POSConnectWalletFulfilEventData {
  let transactionAttributes: TransactionAttributes | null = null;
  let pointsAttributes: PointsAttributes | null = null;
  let tierAttributes: TierAttributes | null = null;

  const redeemedCoupons: CouponWithValueAttributes[] = [];

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityUpdateCreditPoints(op)) {
      pointsAttributes =
        AtomicOperations.WalletAccountTransactionEntity.UpdateCreditPoints.getPointsAttributes(
          op,
        );
    } else if (isTierMembershipEntity(op)) {
      tierAttributes =
        AtomicOperations.TierMembershipEntity.getTierAttributes(op);
    } else if (isWalletAccountTransactionEntityUpdateRedeemEcoupon(op)) {
      redeemedCoupons.push(
        AtomicOperations.WalletAccountTransactionEntity.UpdateRedeemEcoupon.getCouponAttributes(
          op,
        ),
      );
    } else if (isWalletTransactionEntityUpdateSettleFulfilling(op)) {
      transactionAttributes =
        AtomicOperations.WalletTransactionEntity.UpdateSettleFulfilling.getTransactionAttributes(
          op,
        );
    }
  }

  if (transactionAttributes === null) {
    throw new RangeError(
      'WalletTransactionEntity/Update/Settle/Settled not found in POSCONNECT.WALLET.SETTLE',
    );
  }

  const posConnectWalletSettleEventData: POSConnectWalletFulfilEventData = {
    ...(pointsAttributes ? {points: pointsAttributes} : {}),
    ...(tierAttributes ? {tier: tierAttributes} : {}),
    ...(transactionAttributes ? {transaction: transactionAttributes} : {}),
    redeemedCoupons,
    currencyCode: opts.connectorConfig.configuration.currency,
    initial: true,
    final: false,
  };

  return posConnectWalletSettleEventData;
}

function getPosConnectWalletFulfilMiddleEventData(
  event: EeAirOutboundEvent,
  opts: BaseEventHandlerOpts,
): POSConnectWalletFulfilEventData {
  const transactionAttributes: TransactionAttributes = {
    products: [],
  };
  let pointsAttributes: PointsAttributes | null = null;
  let tierAttributes: TierAttributes | null = null;

  const redeemedCoupons: CouponWithValueAttributes[] = [];

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityUpdateCreditPoints(op)) {
      pointsAttributes =
        AtomicOperations.WalletAccountTransactionEntity.UpdateCreditPoints.getPointsAttributes(
          op,
        );
      opts.logger.warn({pointsAttributes});
    } else if (isTierMembershipEntity(op)) {
      tierAttributes =
        AtomicOperations.TierMembershipEntity.getTierAttributes(op);
    } else if (isWalletAccountTransactionEntityUpdateRedeemEcoupon(op)) {
      redeemedCoupons.push(
        AtomicOperations.WalletAccountTransactionEntity.UpdateRedeemEcoupon.getCouponAttributes(
          op,
        ),
      );
    } else if (isWalletTransactionEntityCreateFulfilFulfilled(op)) {
      const fulfilledTransactionAttributes =
        AtomicOperations.WalletTransactionEntity.CreateFulfilFulfilled.getTransactionAttributes(
          op,
        );

      mergeTransactionAttributes(transactionAttributes, {
        storeLocation: fulfilledTransactionAttributes.storeLocation,
        products: fulfilledTransactionAttributes.products,
        totalBasketValueAfterDiscount:
          fulfilledTransactionAttributes.totalBasketValueAfterDiscount,
        transactionReference:
          fulfilledTransactionAttributes.transactionReference,
      });
    } else if (isWalletTransactionEntityUpdateSettleFulfilling(op)) {
      const completeTransactionAttributes =
        AtomicOperations.WalletTransactionEntity.UpdateSettleFulfilling.getTransactionAttributes(
          op,
        );

      mergeTransactionAttributes(transactionAttributes, {
        discountsReceived: completeTransactionAttributes.discountsReceived,
        totalPointsEarned: completeTransactionAttributes.totalPointsEarned,
        // We want the date of the original transaction, rather than when
        // this fulfil is triggered.
        transactionDate: completeTransactionAttributes.transactionDate,
      });
    } else {
      opts.logger.warn(`unknown atomic operation: ${JSON.stringify({op})}`);
    }
  }

  if (transactionAttributes === null) {
    throw new RangeError(
      'WalletTransactionEntity/Update/Settle/Settled not found in POSCONNECT.WALLET.SETTLE',
    );
  }

  const posConnectWalletSettleEventData: POSConnectWalletFulfilEventData = {
    ...(pointsAttributes ? {points: pointsAttributes} : {}),
    ...(tierAttributes ? {tier: tierAttributes} : {}),
    ...(transactionAttributes ? {transaction: transactionAttributes} : {}),
    redeemedCoupons,
    currencyCode: opts.connectorConfig.configuration.currency,
    initial: false,
    final: false,
  };

  return posConnectWalletSettleEventData;
}

function getPosConnectWalletFulfilFinalEventData(
  event: EeAirOutboundEvent,
  opts: BaseEventHandlerOpts,
): POSConnectWalletFulfilEventData {
  const transactionAttributes: TransactionAttributes = {
    products: [],
  };
  let pointsAttributes: PointsAttributes | null = null;
  let tierAttributes: TierAttributes | null = null;

  const redeemedCoupons: CouponWithValueAttributes[] = [];

  for (const op of event.atomicOperations) {
    if (isWalletAccountTransactionEntityUpdateEarnPoints(op)) {
      pointsAttributes =
        AtomicOperations.WalletAccountTransactionEntity.UpdateCreditPoints.getPointsAttributes(
          op,
        );
    } else if (isTierMembershipEntity(op)) {
      tierAttributes =
        AtomicOperations.TierMembershipEntity.getTierAttributes(op);
    } else if (isWalletAccountTransactionEntityUpdateRedeemEcoupon(op)) {
      redeemedCoupons.push(
        AtomicOperations.WalletAccountTransactionEntity.UpdateRedeemEcoupon.getCouponAttributes(
          op,
        ),
      );
    } else if (isWalletTransactionEntityUpdateSettleSettled(op)) {
      // For the final FULFIL, we want to include the transaction reference
      // and timestamp from the atomic operation that updates the wallet transaction when
      // it is SETTLED, as this matches the reference used in initial / middle
      // FULFILs.
      const {transactionReference, transactionDate} =
        AtomicOperations.WalletTransactionEntity.UpdateSettleSettled.getTransactionAttributes(
          op,
        );
      mergeTransactionAttributes(transactionAttributes, {
        transactionReference,
        transactionDate,
      });
    } else if (isWalletTransactionEntityCreateFulfilFulfilled(op)) {
      const fulfilledTransactionAttributes =
        AtomicOperations.WalletTransactionEntity.CreateFulfilFulfilled.getTransactionAttributes(
          op,
        );

      mergeTransactionAttributes(transactionAttributes, {
        storeLocation: fulfilledTransactionAttributes.storeLocation,
        products: fulfilledTransactionAttributes.products,
        totalBasketValueAfterDiscount:
          fulfilledTransactionAttributes.totalBasketValueAfterDiscount,
        discountsReceived: fulfilledTransactionAttributes.discountsReceived,
        totalPointsEarned: fulfilledTransactionAttributes.totalPointsEarned,
      });
    }
  }

  if (transactionAttributes === null) {
    throw new RangeError(
      'WalletTransactionEntity/Create/Fulfil/Fulfilled not found in POSCONNECT.WALLET.SETTLE',
    );
  }

  const posConnectWalletSettleEventData: POSConnectWalletFulfilEventData = {
    ...(pointsAttributes ? {points: pointsAttributes} : {}),
    ...(tierAttributes ? {tier: tierAttributes} : {}),
    ...(transactionAttributes ? {transaction: transactionAttributes} : {}),
    redeemedCoupons,
    currencyCode: opts.connectorConfig.configuration.currency,
    initial: false,
    final: true,
  };

  return posConnectWalletSettleEventData;
}

/**
 * Returns an array of events derived from a POSCONNECT.WALLET.FULFIL event.
 *
 * In some cases, multiple similar atomic operations may be included per event.
 * particularly when considering POSCONNECT.WALLET.FULFIL events that differ
 * depending on whether they are the first, intermediate or final FULFIL in
 * the sequence.
 *
 * The three functions that handle either first, intermediate or final FULFIL
 * events are configured to pick the relevant data (discount amounts, products,
 * etc) from the appropriate WalletTransactionEntity atomic operations.
 *
 * In general, a single WalletTransactionEntity is used to derive the content
 * of the TransactionAttributes that are returned in the output of this function,
 * however for intermediate FULFIL events the TransactionAttributes are derived
 * from multiple atomic operations and merged.
 *
 * @param event
 * @param configuration
 * @returns
 */
export function getPosConnectWalletFulfilEventData(
  event: EeAirOutboundEvent,
  opts: BaseEventHandlerOpts,
): POSConnectWalletFulfilEventData {
  if (isInitialPosConnectWalletFulfil(event)) {
    return getPosConnectWalletFulfilInitialEventData(event, opts);
  } else if (isFinalPosConnectWalletFulfil(event)) {
    return getPosConnectWalletFulfilFinalEventData(event, opts);
  } else {
    return getPosConnectWalletFulfilMiddleEventData(event, opts);
  }
}
