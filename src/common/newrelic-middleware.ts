import {Request, Response, NextFunction, RequestHandler} from 'express';
import {v4 as uuidv4} from 'uuid';
import newrelic from 'newrelic';
import '../types/express-augmentations';

function setTraceIds(
  req: Request,
  res: Response,
  originUniqueId: string | undefined,
  callerUniqueId: string | undefined,
  calledUniqueId: string,
): void {
  req.traceIds = {originUniqueId, callerUniqueId, calledUniqueId};

  // NR custom attributes are gated; header/log propagation always runs
  if (process.env.ENABLE_NEW_RELIC === 'true') {
    try {
      if (originUniqueId)
        newrelic.addCustomAttribute('origin-unique-id', originUniqueId);
      if (callerUniqueId)
        newrelic.addCustomAttribute('caller-unique-id', callerUniqueId);
      newrelic.addCustomAttribute('called-unique-id', calledUniqueId);
    } catch (error: any) {
      req.log.error('Error adding New Relic custom attributes', error);
    }
  }

  const logFields: Record<string, string> = {
    'called-unique-id': calledUniqueId,
  };
  if (originUniqueId) logFields['origin-unique-id'] = originUniqueId;
  if (callerUniqueId) logFields['caller-unique-id'] = callerUniqueId;
  req.log = req.log.child(logFields);

  if (originUniqueId) res.set('origin-unique-id', originUniqueId);
  if (callerUniqueId) res.set('caller-unique-id', callerUniqueId);
  res.set('called-unique-id', calledUniqueId);
}

// For /in/ routes — External Connector receiving from a CDP platform.
// origin-unique-id is only set when the external platform provides it;
// caller-unique-id mirrors it at the first hop.
export function createExternalInboundNrMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const originUniqueId = req.get('origin-unique-id') || undefined;
    const callerUniqueId = originUniqueId;
    const calledUniqueId = uuidv4();
    setTraceIds(req, res, originUniqueId, callerUniqueId, calledUniqueId);
    next();
  };
}

// For /out/ routes — Internal Connector receiving from AIR.
// origin-unique-id and caller-unique-id are both set to eesEventId from the event.
export function createOutboundNrMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const originUniqueId =
      (req.body?.headers?.eesEventId as string) || undefined;
    const callerUniqueId = originUniqueId;
    const calledUniqueId = uuidv4();
    setTraceIds(req, res, originUniqueId, callerUniqueId, calledUniqueId);
    next();
  };
}

// For internal/PubSub routes — the second hop in either flow.
// Reads origin-unique-id and the previous step's called-unique-id from
// PubSub message attributes and generates a fresh called-unique-id.
export function createPubSubNrMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const attrs: Record<string, string> = req.body?.message?.attributes ?? {};
    const originUniqueId = attrs['origin-unique-id'] || undefined;
    const callerUniqueId = attrs['called-unique-id'] || undefined;
    const calledUniqueId = uuidv4();
    setTraceIds(req, res, originUniqueId, callerUniqueId, calledUniqueId);
    next();
  };
}
