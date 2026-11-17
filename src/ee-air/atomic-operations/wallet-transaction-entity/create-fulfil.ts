import {parseISO} from 'date-fns';
import {Logger} from '../../../logger';
import {
  TransactionAttributes,
  WalletTransactionEntityCreateFulfilFulfilled,
} from '../../../types';
import {getStoreLocationAttributes} from './common';
import {
  getProductAttributes,
  getTotalBasketValueAfterDiscount,
  getDiscountsReceived,
  getTotalPointsEarned,
} from './create-common';

export function getTransactionAttributesFromWalletTransactionEntityCreateFulfil(
  entity: WalletTransactionEntityCreateFulfilFulfilled,
  logger?: Logger,
): TransactionAttributes {
  const transactionAttributes: TransactionAttributes = {
    storeLocation: getStoreLocationAttributes(entity),
    products: getProductAttributes(entity, logger),
    totalBasketValueAfterDiscount: getTotalBasketValueAfterDiscount(entity),
    discountsReceived: getDiscountsReceived(entity),
    totalPointsEarned: getTotalPointsEarned(entity),
    transactionReference: entity.objectValue.reference,
    transactionDate: parseISO(entity.objectValue.transactionDateTime),
  };
  return transactionAttributes;
}
