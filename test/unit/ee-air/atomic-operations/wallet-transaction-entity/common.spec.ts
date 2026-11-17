import {
  capBasketContents,
  MAX_BASKET_PRODUCTS,
} from '../../../../../src/ee-air/atomic-operations/wallet-transaction-entity/common';
import {Logger} from '../../../../../src/logger';

function makeLogger() {
  return {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger;
}

describe('capBasketContents', () => {
  it('returns the contents unchanged when under the cap', () => {
    const contents = Array.from({length: 5}, (_, i) => ({upc: `${i}`}));
    const logger = makeLogger();

    const result = capBasketContents(contents, logger);

    expect(result).toEqual(contents);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('returns the contents unchanged when exactly at the cap', () => {
    const contents = Array.from({length: MAX_BASKET_PRODUCTS}, (_, i) => ({
      upc: `${i}`,
    }));
    const logger = makeLogger();

    const result = capBasketContents(contents, logger);

    expect(result).toHaveLength(MAX_BASKET_PRODUCTS);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('truncates and logs a warning when over the cap', () => {
    const contents = Array.from({length: 79}, (_, i) => ({upc: `${i}`}));
    const logger = makeLogger();

    const result = capBasketContents(contents, logger, {
      transactionReference: 'R-X-462d9de320f840af9f01044a24e19f54',
    });

    expect(result).toHaveLength(MAX_BASKET_PRODUCTS);
    expect(result).toEqual(contents.slice(0, MAX_BASKET_PRODUCTS));
    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionReference: 'R-X-462d9de320f840af9f01044a24e19f54',
        basketSize: 79,
        cap: MAX_BASKET_PRODUCTS,
      }),
      expect.stringContaining('Basket contents exceed'),
    );
  });

  it('works without a logger (logger is optional)', () => {
    const contents = Array.from({length: 79}, (_, i) => ({upc: `${i}`}));

    const result = capBasketContents(contents);

    expect(result).toHaveLength(MAX_BASKET_PRODUCTS);
  });
});
