import {connector} from '../../../src';
import appConfig from './config';

export default async function genericConnector() {
  const app = connector(appConfig);
  return app;
}
