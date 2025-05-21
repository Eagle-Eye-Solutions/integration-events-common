import fetchMock from 'jest-fetch-mock';
import {EeAirClient} from '../../../src/common';
import {Logger} from '../../../src/logger';

fetchMock.enableMocks();

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
} as unknown as Logger;

describe('EeAirClient', () => {
  const eeAirClient = new EeAirClient(
    'some-client-id',
    'some-client-secret',
    {
      wallet: 'https://example.org/wallet',
      pos: 'https://example.org/pos',
      resources: 'https://example.org/resources',
    },
    mockLogger,
  );

  describe('getWalletTransactionById', () => {
    it('returns a parsed walletTransaction object if successful', async () => {
      // Arrange
      fetchMock.mockResponseOnce(
        JSON.stringify({
          walletTransactionId: '437907485',
          parentWalletTransactionId: '0',
          walletId: '216245571',
          reference: 'TransactionReferenceJan22abc333',
          transactionDateTime: '2025-01-22T21:10:56+00:00',
          transactionDateTimeOffset: '+00:00',
          identityId: '186980856',
          identity: null,
          type: 'SETTLE',
          status: 'ACTIVE',
          meta: null,
          state: 'ORIGINAL',
          expiryDate: null,
          accounts: [],
          basket: {
            contents: null,
            summary: null,
            payment: null,
          },
          channel: 'api',
          location: {
            storeId: null,
            storeParentId: null,
          },
          dateCreated: '2025-01-22T21:10:56+00:00',
          lastUpdated: '2025-01-22T21:10:56+00:00',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Act
      const output = await eeAirClient.getWalletTransactionById(
        'some-wallet-id',
        'some-transaction-id',
      );

      // Assert
      expect(output).toEqual({
        accounts: [],
        basket: {
          contents: null,
          payment: null,
          summary: null,
        },
        channel: 'api',
        dateCreated: '2025-01-22T21:10:56+00:00',
        expiryDate: null,
        identity: null,
        identityId: '186980856',
        lastUpdated: '2025-01-22T21:10:56+00:00',
        location: {
          storeId: null,
          storeParentId: null,
        },
        meta: null,
        parentWalletTransactionId: '0',
        reference: 'TransactionReferenceJan22abc333',
        state: 'ORIGINAL',
        status: 'ACTIVE',
        transactionDateTime: '2025-01-22T21:10:56+00:00',
        transactionDateTimeOffset: '+00:00',
        type: 'SETTLE',
        walletId: '216245571',
        walletTransactionId: '437907485',
      });
    });

    it('throws an error if parsing of the response fails', async () => {
      // Arrange
      fetchMock.mockResponseOnce(
        JSON.stringify({
          some: 'unexpected',
          response: 'value',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Act
      const output = eeAirClient.getWalletTransactionById(
        'some-wallet-id',
        'some-transaction-id',
      );

      // Assert
      await expect(output).rejects.toThrow();
    });
  });
});
