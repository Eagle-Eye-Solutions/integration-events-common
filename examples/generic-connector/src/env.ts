import {cleanEnv, str, json, port, testOnly} from 'envalid';
import {env as baseEnv} from '../../../src/env';

const env = {
  ...baseEnv,
  ...cleanEnv(process.env, {
    PORT: port({default: 8080}),
    PLATFORM: str({choices: ['GCP'], devDefault: testOnly('GCP')}),
    GCP_PROJECT_ID: str({
      requiredWhen: env => env.PLATFORM === 'GCP',
      devDefault: testOnly('test-project'),
    }),
    GCP_INTERNAL_MESSAGES_TOPIC_NAME: str({
      requiredWhen: env => env.PLATFORM === 'GCP',
      devDefault: testOnly('internal-messages'),
    }),
    GCP_CDP_DEAD_LETTER_QUEUE_TOPIC_NAME: str({
      requiredWhen: env => env.PLATFORM === 'GCP',
      devDefault: testOnly('internal-messages-dlq'),
    }),
    GCP_PUBSUB_AUTHENTICATED_PUSH_SERVICE_ACCOUNT: str({
      requiredWhen: env => env.PLATFORM === 'GCP',
      devDefault: testOnly('fake@example.org'),
    }),
    GCP_PUBSUB_AUTHENTICATED_PUSH_AUDIENCE: str({
      requiredWhen: env => env.PLATFORM === 'GCP',
      devDefault: testOnly('https://example.org/internal'),
    }),
    CONFIG_PLATFORM: str({devDefault: testOnly('GENERIC')}),
    CONFIG_URL: str({
      devDefault: testOnly('https://connect.sandbox.uk.eagleeye.com'),
    }),
    CONFIG_OVERRIDE: json({default: undefined}),
  }),
};

export {env};
export default env;
