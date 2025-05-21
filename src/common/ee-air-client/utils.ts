import {createHash} from 'crypto';
import {BaseConnectorConfig} from '../../types';
import {Logger} from 'pino';

export function generateAuthenticationHash(
  clientSecret: string,
  requestUrl: string,
  requestBody: string,
): string {
  const url = new URL(requestUrl);
  const preHashedString =
    `${url.pathname}${url.search}` + (requestBody ?? '') + clientSecret;
  return createHash('sha256').update(preHashedString).digest('hex');
}

export function getEesCalledUniqueIdHeader(res: Response): string | null {
  const header = 'x-ees-called-unique-id';
  return res.headers ? res.headers.get(header) || null : null;
}

type Details = {
  path: string;
  domain: 'wallet' | 'resources' | 'pos';
};

export function getAirUrl(
  connectorConfig: BaseConnectorConfig,
  type: string,
  logger: Logger,
  substitutions?: Record<string, string>,
) {
  const pathMap: Record<string, Details> = {
    'services/trigger': {
      path: 'services/trigger',
      domain: 'wallet',
    },
    'wallet/walletId/transaction/transactionId': {
      path: 'wallet/walletId/transaction/transactionId',
      domain: 'wallet',
    },
    'wallet/walletId/accounts': {
      path: 'wallet/walletId/accounts',
      domain: 'wallet',
    },
  };

  const details = pathMap[type];
  if (substitutions) {
    Object.keys(substitutions).forEach(sub => {
      details.path = details.path.replace(sub, substitutions[sub]);
    });
  }

  if (details) {
    const baseUrl = new URL(connectorConfig.domains[details.domain]);

    const url = new URL(details.path, baseUrl);
    return url;
  } else {
    const error = new Error(`Unrecognised type: ${type}`);
    logger.error(error);
    throw error;
  }
}
