import {Logger} from '../../../logger';
import {WalletTransactionEntity, StoreLocationAttributes} from '../../../types';

// Braze's /users/track has a documented object-count cap (75 combined,
// standard tier) and a request body size cap (4MB); an itemized POS basket
// has no inherent upper bound, so an unusually large basket can make a
// single event's mapped payload oversized on its own, independent of any
// cross-user batching. See EESD-41.
export const MAX_BASKET_PRODUCTS = 50;

export function capBasketContents<T>(
  contents: T[],
  logger?: Logger,
  context?: Record<string, unknown>,
): T[] {
  if (contents.length <= MAX_BASKET_PRODUCTS) {
    return contents;
  }
  logger?.warn(
    {...context, basketSize: contents.length, cap: MAX_BASKET_PRODUCTS},
    'Basket contents exceed the configured product cap; truncating before mapping to the CDP payload',
  );
  return contents.slice(0, MAX_BASKET_PRODUCTS);
}

export function getStoreLocationAttributes(
  entity: WalletTransactionEntity,
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
