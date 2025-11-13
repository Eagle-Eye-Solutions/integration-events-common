import {Request, Response, NextFunction, RequestHandler} from 'express';
import {v4 as uuidv4} from 'uuid';
import newrelic from 'newrelic';

export function createNewRelicMiddleware(): RequestHandler {
  const isEnabled = process.env.ENABLE_NEW_RELIC === 'true';
  if (!isEnabled) {
    return (_req: Request, _res: Response, next: NextFunction) => next();
  }

  return (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Adding New Relic custom attributes');

    try {
      const calledUniqueId = req.get('called-unique-id') || uuidv4();
      const callerUniqueId = req.get('caller-unique-id') || '';

      newrelic.addCustomAttribute('called-unique-id', calledUniqueId);
      newrelic.addCustomAttribute('caller-unique-id', callerUniqueId);

      res.set('called-unique-id', calledUniqueId);
      res.set('caller-unique-id', callerUniqueId);
    } catch (error: any) {
      req.log.error('Error adding New Relic custom attributes', error);
    }

    next();
  };
}
