import {Logger} from '../logger';
import {BaseOutConnectorConfig} from '../types';

export type BaseEventHandlerOpts = {
  connectorConfig: BaseOutConnectorConfig;
  logger: Logger;
};
