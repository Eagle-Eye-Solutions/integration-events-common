import {z} from 'zod';

export const BaseConnectorConfigSchema = z
  .object({
    unit_id: z.string(),
    credentials: z.object({
      clientId: z.string(),
      secret: z.string(),
    }),
    connection_url: z.string().url(),
    platform: z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      config: z.any({}).nullable(),
      description: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    }),
    domains: z.object({
      wallet: z.string().url(),
      resources: z.string().url(),
      pos: z.string().url(),
    }),
  })
  .passthrough();

export type BaseConnectorConfig = z.infer<typeof BaseConnectorConfigSchema>;

export const BaseOutConnectorConfigSchema = BaseConnectorConfigSchema.extend({
  configuration: z
    .object({
      identityType: z.string(),
      currency: z.string(),
    })
    .passthrough(),
});

export type BaseOutConnectorConfig = z.infer<
  typeof BaseOutConnectorConfigSchema
>;
