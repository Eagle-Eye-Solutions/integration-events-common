import connector from './connector';
import {env} from './env';

connector()
  .then(app => {
    app.listen(env.PORT, () => {
      console.log(`Listening on port ${env.PORT}`);
    });
  })
  .catch(err => {
    console.error(`Failed to start application: ${err.toString()}`);
  });
