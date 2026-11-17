import {getTransactionAttributesFromWalletTransactionEntityUpdate} from '../../../../../src/ee-air/atomic-operations/wallet-transaction-entity/update-settle';
import {MAX_BASKET_PRODUCTS} from '../../../../../src/ee-air/atomic-operations/wallet-transaction-entity/common';
import {WalletTransactionEntityUpdateSettleSettled} from '../../../../../src/types';
import {Logger} from '../../../../../src/logger';

function makeEntity(
  basketContentsLength: number,
): WalletTransactionEntityUpdateSettleSettled {
  return {
    objectType: 'walletTransactionEntity',
    operationType: 'UPDATE',
    objectValue: {
      reference: 'R-X-462d9de320f840af9f01044a24e19f54',
      transactionDateTime: '2026-09-27T02:02:42+00:00',
      type: 'SETTLE',
      event: 'SETTLED',
      basket: {
        contents: Array.from({length: basketContentsLength}, (_, i) => ({
          upc: `${i}`,
          description: `item ${i}`,
          itemUnitCost: 100,
          totalUnitCostAfterDiscount: 100,
          totalUnitCost: 100,
          itemUnitCount: 1,
        })),
        summary: {},
      },
      location: {},
    },
  } as unknown as WalletTransactionEntityUpdateSettleSettled;
}

function makeLogger() {
  return {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger;
}

describe('getTransactionAttributesFromWalletTransactionEntityUpdate', () => {
  it('maps every product when the basket is under the cap', () => {
    const entity = makeEntity(17);

    const result =
      getTransactionAttributesFromWalletTransactionEntityUpdate(entity);

    expect(result.products).toHaveLength(17);
  });

  it('caps the mapped products and logs a warning for an oversized basket, mirroring EESD-41s 79-item sample', () => {
    const entity = makeEntity(79);
    const logger = makeLogger();

    const result = getTransactionAttributesFromWalletTransactionEntityUpdate(
      entity,
      logger,
    );

    expect(result.products).toHaveLength(MAX_BASKET_PRODUCTS);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionReference: 'R-X-462d9de320f840af9f01044a24e19f54',
        basketSize: 79,
        cap: MAX_BASKET_PRODUCTS,
      }),
      expect.stringContaining('Basket contents exceed'),
    );
  });
});
