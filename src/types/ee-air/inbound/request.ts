import {z} from 'zod';

export type EeApiErrorType =
  | 'EE_API_UNAVAILABLE'
  | 'EE_API_TIMEOUT'
  | 'EE_API_DISCONNECTED'
  | 'EE_IDENTITY_NOT_FOUND'
  | 'EE_BAD_REQUEST'
  | 'EE_UNEXPECTED_ERROR';

export const EeAirRequestParamsSchema = z.object({
  method: z.enum(['POST', 'PUT', 'PATCH', 'GET']),
  url: z.string(),
  headers: z.record(z.string(), z.string()),
  body: z.string().optional(),
});

export type EeAirRequestParams = z.infer<typeof EeAirRequestParamsSchema>;
