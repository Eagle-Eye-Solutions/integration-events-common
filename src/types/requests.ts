import {z} from 'zod';

export const CdpOutboundRequestBodySchema = z.object({
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

export type CdpOutboundRequestBody = z.infer<
  typeof CdpOutboundRequestBodySchema
>;
