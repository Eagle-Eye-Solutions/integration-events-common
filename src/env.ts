import {cleanEnv, num, str} from 'envalid';
import {debugLevels} from './types';

const DEFAULT_CONFIG_API_RESPONSE_TTL_MS = 600000; // 10 minutes

const env = cleanEnv(process.env, {
  LOG_LEVEL: str({choices: debugLevels, default: 'info'}),
  CONFIG_API_RESPONSE_TTL_MS: num({
    default: DEFAULT_CONFIG_API_RESPONSE_TTL_MS,
  }),
});

export {env};
export default env;
