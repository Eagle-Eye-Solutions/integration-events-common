import {parseISO} from 'date-fns';
import {Logger} from '../../../logger';
import {
  ProductAttributes,
  StoreLocationAttributes,
  TransactionAttributes,
  WalletTransactionEntityUpdateSettleSettled,
  WalletTransactionEntityUpdateSettleFulfilling,
} from '../../../types';
import {capBasketContents} from './common';

function getStoreLocationAttributes(
  entity:
    | WalletTransactionEntityUpdateSettleSettled
    | WalletTransactionEntityUpdateSettleFulfilling,
): StoreLocationAttributes | undefined {
  if (
    (entity.objectValue.location?.storeId !== undefined &&
      entity.objectValue.location?.storeId !== null) ||
    (entity.objectValue.location?.storeParentId !== undefined &&
      entity.objectValue.location?.storeParentId !== null)
  ) {
    return {
      storeId: entity.objectValue.location.storeId ?? null,
      storeParentId: entity.objectValue.location.storeParentId ?? null,
    };
  } else {
    return undefined;
  }
}

function getProductAttributes(
  entity:
    | WalletTransactionEntityUpdateSettleSettled
    | WalletTransactionEntityUpdateSettleFulfilling,
  logger?: Logger,
): ProductAttributes[] {
  if (entity.objectValue.basket.contents) {
    const products: ProductAttributes[] = capBasketContents(
      entity.objectValue.basket.contents,
      logger,
      {transactionReference: entity.objectValue.reference},
    ).map(product => {
      return {
        upc: product.upc,
        description: product.description,
        itemUnitCost: product.itemUnitCost,
        totalUnitCostAfterDiscount: product.totalUnitCostAfterDiscount,
        totalUnitCost: product.totalUnitCost,
        itemUnitCount: product.itemUnitCount,
      };
    });

    return products;
  } else {
    return [];
  }
}

function getTotalBasketValueAfterDiscount(
  entity:
    | WalletTransactionEntityUpdateSettleSettled
    | WalletTransactionEntityUpdateSettleFulfilling,
): number {
  return entity.objectValue.basket.summary?.totalBasketValue ?? 0;
}

function getDiscountsReceived(
  entity:
    | WalletTransactionEntityUpdateSettleSettled
    | WalletTransactionEntityUpdateSettleFulfilling,
): number {
  if (entity.objectValue.basket.summary?.totalDiscountAmount) {
    const values = Object.values(
      entity.objectValue.basket.summary.totalDiscountAmount,
    ).filter((x): x is number => Number.isInteger(x));

    const discountReceived = values.reduce((total, value) => {
      return total + value;
    }, 0);

    return discountReceived;
  } else {
    return 0;
  }
}

function getTotalPointsEarned(
  entity:
    | WalletTransactionEntityUpdateSettleSettled
    | WalletTransactionEntityUpdateSettleFulfilling,
): number {
  return (
    entity.objectValue.basket.summary?.results?.points.totalPointsGiven ?? 0
  );
}

export function getTransactionAttributesFromWalletTransactionEntityUpdate(
  entity:
    | WalletTransactionEntityUpdateSettleSettled
    | WalletTransactionEntityUpdateSettleFulfilling,
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
