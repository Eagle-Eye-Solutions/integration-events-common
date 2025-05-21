import {z} from 'zod';
import {AtomicOperationSchema} from './atomic-operations';

const AirIdentitySchema = z.object({
  identityId: z.string(),
  walletId: z.string(),
  type: z.string(),
  value: z.string(),
  state: z.string(),
  status: z.string(),
});

export type AirIdentity = z.infer<typeof AirIdentitySchema>;

export const EeAirEventNameSchema = z.enum([
  'POSCONNECT.WALLET.FULFIL',
  'POSCONNECT.WALLET.OPEN',
  'POSCONNECT.WALLET.REFUND',
  'POSCONNECT.WALLET.SETTLE',
  'POSCONNECT.WALLET.SPEND.VOID',
  'POSCONNECT.WALLET.SPEND',
  'SERVICE.TRIGGER',
  'SERVICE.WALLET.ACCOUNTS.CREATE',
  'SERVICE.WALLET.CREATE',
  'SERVICE.WALLET.DELETE',
  'TIER.MEMBERSHIP.ADJUST',
  'TIER.MEMBERSHIP.CREATE',
  'TIER.MEMBERSHIP.CREDIT',
  'TIER.MEMBERSHIP.DEBIT',
  'TIER.MEMBERSHIP.MOVE',
  'WALLET.ACCOUNT.CREATE.CAMPAIGN',
  'WALLET.ACCOUNT.CREATE.PLAN',
  'WALLET.ACCOUNT.CREATE.SCHEME',
  'WALLET.ACCOUNT.UPDATE',
  'WALLET.CONSUMER.CREATE',
  'WALLET.CONSUMER.UPDATE',
]);

export type EeAirEventName = z.infer<typeof EeAirEventNameSchema>;

export const EeAirOutboundEventSchema = z.object({
  headers: z
    .object({
      eventName: EeAirEventNameSchema,
      eventDate: z.string(),
      eesEventId: z.string(),
    })
    .passthrough(),
  request: z.record(z.string(), z.unknown()),
  response: z.object({
    code: z.number(),
    contentType: z.string(),
    body: z.unknown(),
  }),
  atomicOperations: z.array(AtomicOperationSchema),
  enrichmentData: z
    .record(
      z.string(),
      z.object({
        identities: z.array(AirIdentitySchema),
      }),
    )
    .optional(),
});

export type EeAirOutboundEvent = z.infer<typeof EeAirOutboundEventSchema>;
