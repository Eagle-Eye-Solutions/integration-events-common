# @eagleeye-solutions/integration-events-common

This package provides a framework for building integrations (Connectors) between the [Eagle Eye AIR](https://eagleeye.com/air-platform) platform and third-party Customer Data Platforms.

Applications built with this framework are intended to be deployed to GCP Cloud Run as container images. GCP Pub/Sub is used to facilitate intra-process communication.

## Documentation

- [Architecture ⇗](./docs/architecture.md)
- [Identity Management ⇗](./docs/identity-management.md)
- [Logging ⇗](./docs/logging.md)
- [Tutorial ⇗](./docs/tutorial.md)

## Installation

### npm

```
npm install @eagleeye-solutions/integration-events-common
```

## Getting Started

Create an instance of the connector based on a supplied configuration object - note that the connector is a standard express.js application:

```typescript
import {connector, ApplicationConfig} from '@eagleeye-solutions/integration-events-common';

const applicationConfig: ApplicationConfig = {
  platformConfig: {
    platform: 'GCP',
    projectId: 'my-project',
    internalMessagesTopicName: 'internal-messages',
    cdpDeadLetterQueue: 'internal-messages-dlq',
    pubSubAuthenticatedPushServiceAccount: 'some-service-account',
    pubSubAuthenticatedPushAudience: 'my-connector-europe-west2',
  },
  configPlatform: 'my-platform',
  configOverride: process.env.CONFIG_OVERRIDE
    ? JSON.parse(process.env.CONFIG_OVERRIDE)
    : undefined,
  configUrl: 'https://config-api.example.org',
  routes: {
    internal: {
      path: '/internal',
      getInternalMessageFromRequest,
      handlers: {
        'cdp-outbound-event': handleCdpOutboundEvent,
        'cdp-inbound-event': handleCdpInboundEvent,
        'ee-air-inbound-event': handleEeAirInboundEvent,
        'ee-air-outbound-event': handleEeAirOutboundEvent,
      },
    },
  },
  appMetadata: {
    name: packageJson.name,
    version: packageJson.version,
    tagline: 'Sample API Connector',
  },
  handlePermanentMessageDeliveryFailure,
  traceIdName: 'x-ees-connector-trace-id',
  includeTraceIdInHttpResponseHeaders: true,
};

connector(applicationConfig)
    .then(app => {
        app.listen(8080, () => {
            console.log('Listening on port 8080');
        });
    })
    .catch(err => {
        console.error(`Failed to start application: ${err.toString()}`);
    });
```

## License

This project is MIT licensed.

```
MIT License

Copyright (c) 2024 Eagle Eye Solutions Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
