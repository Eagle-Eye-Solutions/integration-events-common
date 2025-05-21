import {WalletTransactionEntityCreate, ProductAttributes} from '../../../types';

export function getProductAttributes(
  entity: WalletTransactionEntityCreate,
): ProductAttributes[] {
  if (entity.objectValue.basket.contents) {
    const products: ProductAttributes[] =
      entity.objectValue.basket.contents.map(product => {
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

export function getTotalBasketValueAfterDiscount(
  entity: WalletTransactionEntityCreate,
): number {
  // Rather than using the totalBasketValue (which includes all
  // products, even those that have not yet been fulfilled) we
  // sum up the totalUnitCostAfterDiscount for all fulfilled
  // products.
  return entity.objectValue.basket.contents?.reduce(
    (totalBasketValue, product) => {
      return totalBasketValue + product.totalUnitCostAfterDiscount;
    },
    0,
  );
}

export function getDiscountsReceived(
  entity: WalletTransactionEntityCreate,
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

export function getTotalPointsEarned(
  entity: WalletTransactionEntityCreate,
): number {
  return entity.objectValue.basket.summary?.results?.points.earn ?? 0;
}
