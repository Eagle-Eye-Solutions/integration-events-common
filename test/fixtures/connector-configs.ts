import {BaseConnectorConfig, BaseOutConnectorConfig} from '../../src';

export const mockOutConnectorConfig: BaseOutConnectorConfig = {
  unit_id: '12345',
  credentials: {
    clientId: 'some-client-id',
    secret: 'some-secret',
  },
  configuration: {
    currency: 'USD',
    identityType: 'CARD',
  },
  connection_url: 'https://example.org',
  platform: {
    id: '123',
    name: 'some-name',
    slug: 'some-slug',
    config: null,
    description: 'some-description',
    created_at: 'some-create-at-time',
    updated_at: 'some-updated-at-time',
  },
  domains: {
    wallet: 'https://wallet.sandbox.uk.eagleeye.com',
    resources: 'https://resources.sandbox.uk.eagleeye.com',
    pos: 'https://pos.sandbox.uk.eagleeye.com',
  },
};

export const mockInConnectorConfig: BaseConnectorConfig = {
  unit_id: '12345',
  credentials: {
    clientId: 'some-client-id',
    secret: 'some-secret',
  },
  connection_url: 'https://example.org',
  platform: {
    id: '123',
    name: 'some-name',
    slug: 'some-slug',
    config: null,
    description: 'some-description',
    created_at: 'some-create-at-time',
    updated_at: 'some-updated-at-time',
  },
  domains: {
    wallet: 'https://wallet.sandbox.uk.eagleeye.com',
    resources: 'https://resources.sandbox.uk.eagleeye.com',
    pos: 'https://pos.sandbox.uk.eagleeye.com',
  },
};
