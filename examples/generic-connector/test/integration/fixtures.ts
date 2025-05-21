import {
  GenericInConnectorConfig,
  GenericOutConnectorConfig,
} from '../../src/types';

export const defaultInConnectorConfig: GenericInConnectorConfig = {
  unit_id: 'some-unit-id',
  credentials: {
    clientId: 'some-client-id',
    secret: 'some-secret',
  },
  connection_url: 'https://some/connection/url',
  configuration: {
    cdpBaseUrl: 'https://cdp.url',
    cdpApiKey: '495745ac-feba-4499-9026-1738029d7e82',
  },
  platform: {
    id: '9df9b683-c652-4ba7-a5ec-d43ca510f12a',
    name: 'Braze',
    slug: 'braze',
    config: null,
    description: 'Braze is a marketing automation platform',
    created_at: '2025-01-24T14:05:33.000000Z',
    updated_at: '2025-01-24T14:05:33.000000Z',
  },
  domains: {
    wallet: 'https://wallet.sandbox.uk.eagleeye.com',
    resources: 'https://resources.sandbox.uk.eagleeye.com',
    pos: 'https://pos.sandbox.uk.eagleeye.com',
  },
};

export const defaultOutConnectorConfig: GenericOutConnectorConfig = {
  unit_id: '197332',
  credentials: {
    clientId: 'removed for security',
    secret: 'removed for security',
  },
  connection_url:
    'https://connect.sandbox.uk.eagleeye.com/out/braze/9e203d6b-99b7-4f02-8428-0973e672a343',
  configuration: {
    connectorConfigValidation: {
      out: {
        'config.restApiKey': 'required|string',
        'config.identityType': 'required|string',
        'config.restEndpoint': 'required|url',
        'config.currency': 'required|string|size:3',
        'config.brazeAppId': 'required|string',
      },
    },
    currency: 'USD',
    cdpBaseUrl: 'https://cdp.url',
    cdpApiKey: '7661b053-d1e7-48f4-9e1d-6c650650474f',
    identityType: 'CARD',
  },
  platform: {
    id: '9df9b683-c652-4ba7-a5ec-d43ca510f12a',
    name: 'Generic',
    slug: 'generic',
    config: {
      connectorConfigValidation: {
        out: {
          'config.restApiKey': 'required|string',
          'config.identityType': 'required|string',
          'config.restEndpoint': 'required|url',
          'config.currency': 'required|string|size:3',
          'config.brazeAppId': 'required|string',
        },
      },
    },
    description: 'some decritpion',
    created_at: '2025-01-24T14:05:33.000000Z',
    updated_at: '2025-01-24T14:05:33.000000Z',
  },
  domains: {
    wallet: 'https://wallet.sandbox.uk.eagleeye.com',
    resources: 'https://resources.sandbox.uk.eagleeye.com',
    pos: 'https://pos.sandbox.uk.eagleeye.com',
  },
};
