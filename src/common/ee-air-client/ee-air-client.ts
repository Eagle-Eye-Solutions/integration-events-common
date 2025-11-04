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
  ): Promise<{data: unknown; calledUniqueId: string | null}> {
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

    const calledUniqueId = getEesCalledUniqueIdHeader(response);

    this.logger.info(
      `${requestParams.method} ${requestParams.url}: ${response.status} ${response.statusText} (${t1 - t0}ms)`,
    );

    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      let data: unknown;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        this.logger.debug(`Response Body: ${JSON.stringify(data)}`);
      } else {
        data = await response.text();
      }

      return {data, calledUniqueId};
    } else {
      const errorContext = {
        url: requestParams.url,
        body: requestParams.body,
        data: await response.text(),
        headers: JSON.stringify(headers),
      } as const;

      // In pino v9 the logger's methods accept (obj?, msg?, ...args). Avoid
      // passing multiple non-object params; include details in the object.
      this.logger.error(
        {
          context: errorContext,
          status: response.status,
          statusText: response.statusText,
          uniqueCallId: getEesCalledUniqueIdHeader(response),
          scope: EeAirClient.name,
        },
        `EE API returned error`,
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

    const {data: walletTransaction} = await this.makeApiRequest(
      getWalletTransactionByIdRequest,
    );

    return WalletTransactionEntityObjectValueSchema.parse(walletTransaction);
  }
}
