import {WalletTransactionEntity, StoreLocationAttributes} from '../../../types';

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
