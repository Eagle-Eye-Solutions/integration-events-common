import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    traceIds?: {
      originUniqueId?: string;
      callerUniqueId?: string;
      calledUniqueId: string;
    };
  }
}
