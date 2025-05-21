import {z} from 'zod';
import {BaseConnectorConfigSchema} from './connector-config';

export const InternalMessageTypeSchema = z.enum([
  'cdp-inbound-event',
  'cdp-outbound-event',
  'ee-air-inbound-event',
  'ee-air-outbound-event',
]);

export type InternalMessageType = z.infer<typeof InternalMessageTypeSchema>;

export const InternalMessageSchema = z.object({
  type: InternalMessageTypeSchema,
  connectorConfig: BaseConnectorConfigSchema,
  payload: z.unknown(),
});

export type InternalMessage = z.infer<typeof InternalMessageSchema>;

// Inbound internal messages - cdp-outbound-event and ee-air-inbound-event

export const CdpOutboundEventPayloadSchema = z.object({
  type: z.literal('services/trigger'),
  body: z.object({
    identityValue: z.string().min(1),
    walletTransaction: z.object({
      reference: z.string().min(1),
    }),
    triggers: z
      .array(
        z.object({
          reference: z.string().min(1),
        }),
      )
      .min(1),
  }),
});

export const CdpOutboundEventSchema = InternalMessageSchema.extend({
  type: z.literal('cdp-outbound-event'),
  payload: CdpOutboundEventPayloadSchema,
});

export type CdpOutboundEvent = z.infer<typeof CdpOutboundEventSchema>;

export const EeAirInboundEventPayloadSchema = z.object({
  url: z.string().url(),
  method: z.enum(['POST', 'PUT', 'PATCH']),
  headers: z.record(z.string(), z.string()),
  body: z.string(),
});

export const EeAirInboundEventSchema = InternalMessageSchema.extend({
  type: z.literal('ee-air-inbound-event'),
  payload: EeAirInboundEventPayloadSchema,
});

export type EeAirInboundEvent = z.infer<typeof EeAirInboundEventSchema>;
