import {
  TransactionAttributes,
  WalletTransactionEntityCreateRefundSettled,
} from '../../../types';
import {getStoreLocationAttributes} from './common';
import {
  getProductAttributes,
  getTotalBasketValueAfterDiscount,
} from './create-common';

function getTotalPointsDeducted(
  entity: WalletTransactionEntityCreateRefundSettled,
) {
  return (
    (entity.objectValue.basket.summary?.results?.points.totalPointsTaken ?? 0) -
    (entity.objectValue.basket.summary?.results?.points.totalPointsGiven ?? 0)
  );
}

export function getTransactionAttributesFromWalletTransactionEntityCreatRefund(
  entity: WalletTransactionEntityCreateRefundSettled,
): TransactionAttributes {
  const transactionAttributes: TransactionAttributes = {
    storeLocation: getStoreLocationAttributes(entity),
    products: getProductAttributes(entity),
    totalBasketValueAfterDiscount: getTotalBasketValueAfterDiscount(entity),
    totalPointsDeducted: getTotalPointsDeducted(entity),
    transactionReference: entity.objectValue.reference,
  };
  return transactionAttributes;
}
