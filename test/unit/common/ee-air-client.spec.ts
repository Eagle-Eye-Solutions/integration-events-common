import fetchMock from 'jest-fetch-mock';
import {EeAirClient} from '../../../src/common';
import {
  PermanentDeliveryFailure,
  SilentAcknowledgement,
} from '../../../src/exceptions';
import {Logger} from '../../../src/logger';

fetchMock.enableMocks();

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
} as unknown as Logger;

describe('EeAirClient', () => {
  describe('makeApiRequest', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });

    it('includes X-EES-CALLER-UNIQUE-ID in outbound headers when callerUniqueId is supplied', async () => {
      const client = new EeAirClient(
        'some-client-id',
        'some-client-secret',
        {
          wallet: 'https://example.org/wallet',
          pos: 'https://example.org/pos',
          resources: 'https://example.org/resources',
        },
        mockLogger,
      );

      fetchMock.mockResponseOnce(JSON.stringify({ok: true}), {
        headers: {'Content-Type': 'application/json'},
      });

      await client.makeApiRequest({
        method: 'POST',
        url: 'https://example.org/wallet/services/trigger',
        headers: {'Content-Type': 'application/json'},
        body: '{}',
        callerUniqueId: 'my-caller-id',
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [, options] = (fetchMock as unknown as jest.Mock).mock.calls[0];
      expect(options.headers['X-EES-CALLER-UNIQUE-ID']).toBe('my-caller-id');
    });

    it('throws SilentAcknowledgement when AIR returns 404', async () => {
      const client = new EeAirClient(
        'some-client-id',
        'some-client-secret',
        {
          wallet: 'https://example.org/wallet',
          pos: 'https://example.org/pos',
          resources: 'https://example.org/resources',
        },
        mockLogger,
      );

      fetchMock.mockResponseOnce('Not Found', {status: 404});

      await expect(
        client.makeApiRequest({
          method: 'POST',
          url: 'https://example.org/wallet/services/trigger',
          headers: {'Content-Type': 'application/json'},
          body: '{}',
        }),
      ).rejects.toThrow(SilentAcknowledgement);
    });

    it('sends an empty X-EES-CALLER-UNIQUE-ID when callerUniqueId is not supplied', async () => {
      const client = new EeAirClient(
        'some-client-id',
        'some-client-secret',
        {
          wallet: 'https://example.org/wallet',
          pos: 'https://example.org/pos',
          resources: 'https://example.org/resources',
        },
        mockLogger,
      );

      fetchMock.mockResponseOnce(JSON.stringify({ok: true}), {
        headers: {'Content-Type': 'application/json'},
      });

      await client.makeApiRequest({
        method: 'POST',
        url: 'https://example.org/wallet/services/trigger',
        headers: {'Content-Type': 'application/json'},
        body: '{}',
      });

      const [, options] = (fetchMock as unknown as jest.Mock).mock.calls[0];
      expect(options.headers['X-EES-CALLER-UNIQUE-ID']).toBe('');
    });
  });

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

    it('throws PermanentDeliveryFailure (not SilentAcknowledgement) when AIR returns 404', async () => {
      fetchMock.mockResponseOnce('Not Found', {status: 404});

      await expect(
        eeAirClient.getWalletTransactionById(
          'some-wallet-id',
          'some-transaction-id',
        ),
      ).rejects.toThrow(PermanentDeliveryFailure);
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
