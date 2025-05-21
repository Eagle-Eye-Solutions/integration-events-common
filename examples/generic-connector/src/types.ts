import {z} from 'zod';
import {InternalMessage, BaseConnectorConfigSchema} from '../../../src';

export const GenericOutConnectorConfigSchema = BaseConnectorConfigSchema.extend(
  {
    configuration: z
      .object({
        identityType: z.string(),
        cdpBaseUrl: z.string(),
        cdpApiKey: z.string(),
      })
      .passthrough(),
  },
);

export type GenericOutConnectorConfig = z.infer<
  typeof GenericOutConnectorConfigSchema
>;

export const GenericInConnectorConfigSchema = BaseConnectorConfigSchema.extend({
  configuration: z.any(),
});

export type GenericInConnectorConfig = z.infer<
  typeof GenericInConnectorConfigSchema
>;

export const GenericConnectorConfigSchema = z.union([
  GenericOutConnectorConfigSchema,
  GenericInConnectorConfigSchema,
]);

export type GenericConnectorConfig = z.infer<
  typeof GenericConnectorConfigSchema
>;

export const GenericConnectorInternalMessagePayloadSchema = z.object({
  method: z.literal('POST').or(z.literal('PUT')).or(z.literal('PATCH')),
  url: z.string(),
  headers: z.record(z.string(), z.string()),
  body: z.string(),
});

export type GenericConnectorInternalMessagePayload = z.infer<
  typeof GenericConnectorInternalMessagePayloadSchema
>;

export type InternalCompoundMessage = InternalMessage & {
  connectorConfig: GenericConnectorConfig;
  payload: GenericConnectorInternalMessagePayload;
};

export const GenericConnectorCdpOutboundEventSchema = z.object({
  baseUrl: z.string(),
  body: z.unknown(),
});

export type GenericConnectorCdpOutboundEvent = z.infer<
  typeof GenericConnectorCdpOutboundEventSchema
>;
