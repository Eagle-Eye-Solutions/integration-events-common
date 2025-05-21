import {
  BaseConnectorConfig,
  EeAirRequestParams,
  WalletTransactionEntityObjectValue,
  WalletTransactionEntityObjectValueSchema,
} from '../../types';
import {
  PermanentDeliveryFailure,
  TemporaryDeliveryFailure,
} from '../../exceptions';
import {generateAuthenticationHash, getEesCalledUniqueIdHeader} from './utils';
import {Logger} from '../../logger';

export class EeAirClient {
  private clientId: string;
  private clientSecret: string;
  private domains: BaseConnectorConfig['domains'];
  private logger: Logger;

  constructor(
    clientId: string,
    clientSecret: string,
    domains: BaseConnectorConfig['domains'],
    logger: Logger,
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.domains = domains;
    this.logger = logger;
  }

  public async makeApiRequest(
    requestParams: EeAirRequestParams,
  ): Promise<unknown> {
    const headers = {
      'Content-Type': 'application/json',
      'X-EES-AUTH-CLIENT-ID': this.clientId,
      'X-EES-AUTH-HASH': generateAuthenticationHash(
        this.clientSecret,
        requestParams.url,
        requestParams.body ?? '',
      ),
      ...requestParams.headers,
    };

    const t0 = performance.now();
    const response = await fetch(requestParams.url, {
      method: requestParams.method,
      body: requestParams.body,
      headers,
    });
    const t1 = performance.now();

    this.logger.info(
      `${requestParams.method} ${requestParams.url}: ${response.status} ${response.statusText} (${t1 - t0}ms)`,
    );

    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const responseJson = await response.json();
        this.logger.debug(`Response Body: ${JSON.stringify(responseJson)}`);
        return responseJson;
      } else {
        return await response.text();
      }
    } else {
      this.logger.error(
        `EE API returned error with status: ${
          response.status
        } and Unique Call ID: ${getEesCalledUniqueIdHeader(response)}`,
        {
          url: requestParams.url,
          body: requestParams.body,
          data: await response.text(),
          headers: JSON.stringify(headers),
        },
        EeAirClient.name,
      );
      // May need tweaking based on endpoints handled and their expected errors.
      switch (response.status) {
        case 404:
          throw new PermanentDeliveryFailure(
            "The customer identity doesn't exist in EE AIR Platform.",
          );
        case 401:
          throw new PermanentDeliveryFailure('401 Unauthorized');
        case 400:
          throw new PermanentDeliveryFailure(
            'The request could not be processed by the EE AIR Platform.',
          );
        default:
          throw new TemporaryDeliveryFailure(
            'The request failed to be processed by the EE AIR Platform due to an unexpected error.',
          );
      }
    }
  }

  async getWalletTransactionById(
    walletId: string,
    transactionId: string,
  ): Promise<WalletTransactionEntityObjectValue> {
    const getWalletTransactionByIdRequest = {
      method: 'GET',
      url: new URL(
        `/wallet/${walletId}/transaction/${transactionId}`,
        this.domains['wallet'],
      ).href,
      headers: {},
    } as EeAirRequestParams;

    const walletTransaction = await this.makeApiRequest(
      getWalletTransactionByIdRequest,
    );

    return WalletTransactionEntityObjectValueSchema.parse(walletTransaction);
  }
}
