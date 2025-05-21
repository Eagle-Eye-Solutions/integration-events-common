# @eagleeye-solutions/integration-events-common - Framework Tutorial

Welcome to the **@eagleeye/integration-events-common** tutorial. This guide will walk you through building a custom Connector using the @eagleeye/integration-events-common framework and deploying it to Google Cloud Run. The Connector enables seamless integration between Eagle Eye’s AIR platform and third-party Customer Data Platform (CDP) applications.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Writing Your Connector](#writing-your-connector)
4. [Handling Events](#handling-events)
5. [Deployment](#deployment)
6. [Testing Your Connector](#testing-your-connector)

---

## Prerequisites

### Required Software
- **Node.js** (v22)
- **Docker**
- **gcloud** CLI (authenticated, with access to your GCP project)
- **curl**
- **jq**

### GCP Resources Setup

Create base resources for Cloud Run deployment. Save and edit the following script as `create-base-resources.sh`:

```bash
#!/usr/bin/env bash
#
# Usage:
#   Save this script as `create-base-resources.sh` and update the environment
#   variables below.
#
#   Then execute it to provision the base GCP resources required for connector
#   deployment.
#
#   To run:
# sh ./create-base-resources.sh
#

# Name of the connector service. This will be used as a prefix for all GCP resources.
SERVICE_NAME=my-connector

# Google Cloud project ID where resources will be provisioned.
GCP_PROJECT_ID=gcp-ldn-prj-pfm-snd

# GCP region where the resources will be created.
GCP_REGION=europe-west2

# Create the primary Pub/Sub topic for internal connector messaging.
gcloud --project=${GCP_PROJECT_ID} pubsub topics create ${SERVICE_NAME}

# Create a Pub/Sub dead-letter topic to handle undeliverable messages.
gcloud --project=${GCP_PROJECT_ID} pubsub topics create ${SERVICE_NAME}-dlq

# Create a dedicated service account for authenticating Pub/Sub push requests.
gcloud --project=${GCP_PROJECT_ID} iam service-accounts create ${SERVICE_NAME}

# Create an Artifact Registry repository to store Docker images for the connector.
gcloud --project=${GCP_PROJECT_ID} artifacts repositories create ${SERVICE_NAME} \
  --repository-format=docker \
  --location=${GCP_REGION}
```

### Configuration

If the Eagle Eye Configuration API is not set up for your platform, you can use a static configuration override. Copy and edit `scripts/config-override.json.example` to your needs. Set the `CONFIG_OVERRIDE` environment variable to the path or contents of this file when deploying.

---

## Project Setup

1. **Initialize Your Project**
   ```bash
   mkdir my-connector
   cd my-connector
   git init # optional
   npm init -y
   ```

2. **Install Dependencies**
   ```bash
   npm install --save @eagleeye-solutions/integration-events-common
   npm install --save-dev @types/node arg gts tsx typescript
   ```

3. **Configure TypeScript**
   ```bash
   npx tsc --init
   ```
   Edit `tsconfig.json` to include:
   ```json
   {
     "compilerOptions": {
       ...
       "resolveJsonModule": true,
       "outDir": "./build",
       ...
     }
   }
   ```

---

## Writing Your Connector

Create `src/index.ts`:

```typescript
import {
  connector,
  ApplicationConfig,
  InternalMessageHandler,
  getAirIdentities,
  getInternalMessageFromRequest,
  sendInternalMessageToDlq,
  Logger,
  DEFAULT_TRACE_ID_NAME,
  DEFAULT_INCLUDE_TRACE_ID_IN_HTTP_RESPONSE_HEADERS,
} from '@eagleeye-solutions/integration-events-common';
import * as packageJson from '../package.json';

const SERVICE_NAME = 'my-connector';
const GCP_PROJECT_ID = 'my-gcp-project';
const GCP_REGION = 'europe-west2';
const CONFIG_PLATFORM = 'my-platform';

const GCP_INTERNAL_MESSAGES_TOPIC_NAME = SERVICE_NAME;
const GCP_INTERNAL_MESSAGES_DLQ_TOPIC_NAME = `${SERVICE_NAME}-dlq`;
const GCP_PUBSUB_AUTHENTICATED_PUSH_SERVICE_ACCOUNT = `${SERVICE_NAME}@${GCP_PROJECT_ID}.iam.gserviceaccount.com`;
const GCP_PUBSUB_AUTHENTICATED_PUSH_AUDIENCE = `${SERVICE_NAME}-${GCP_REGION}`;
const CONFIG_URL = 'https://config-api.example.org';
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

const handleEeAirOutboundEvent: InternalMessageHandler = async (
  appConfig,
  connectorConfig,
  message,
  attributes,
  logger
) => {};

const handleCdpInboundEvent: InternalMessageHandler = async (
  appConfig,
  connectorConfig,
  message,
  attributes,
  logger
) => {};

const handleCdpOutboundEvent: InternalMessageHandler = async (
  appConfig,
  connectorConfig,
  message,
  attributes,
  logger
) => {};

const handleEeAirInboundEvent: InternalMessageHandler = async (
  appConfig,
  connectorConfig,
  message,
  attributes,
  logger
) => {};

const handlePermanentMessageDeliveryFailure = async (
  appConfig: ApplicationConfig,
  connectorConfig: unknown,
  message: unknown,
  attributes: Record<string, string>,
  logger: Logger
) => {
  await sendInternalMessageToDlq(appConfig, message, attributes, logger);
};

const appConfig: ApplicationConfig = {
  platformConfig: {
    platform: 'GCP',
    projectId: GCP_PROJECT_ID,
    internalMessagesTopicName: GCP_INTERNAL_MESSAGES_TOPIC_NAME,
    cdpDeadLetterQueue: GCP_INTERNAL_MESSAGES_DLQ_TOPIC_NAME,
    pubSubAuthenticatedPushServiceAccount:
      GCP_PUBSUB_AUTHENTICATED_PUSH_SERVICE_ACCOUNT,
    pubSubAuthenticatedPushAudience: GCP_PUBSUB_AUTHENTICATED_PUSH_AUDIENCE,
  },
  configPlatform: CONFIG_PLATFORM,
  configOverride: process.env.CONFIG_OVERRIDE
    ? JSON.parse(process.env.CONFIG_OVERRIDE)
    : undefined,
  configUrl: CONFIG_URL,
  routes: {
    internal: {
      path: '/internal',
      getInternalMessageFromRequest,
      handlers: {
        'ee-air-outbound-event': handleEeAirOutboundEvent,
        'cdp-inbound-event': handleCdpInboundEvent,
        'cdp-outbound-event': handleCdpOutboundEvent,
        'ee-air-inbound-event': handleEeAirInboundEvent,
      },
    },
  },
  appMetadata: {
    name: packageJson.name,
    version: packageJson.version,
    tagline: 'Sample API Connector',
  },
  handlePermanentMessageDeliveryFailure,
  traceIdName: DEFAULT_TRACE_ID_NAME,
  includeTraceIdInHttpResponseHeaders:
    DEFAULT_INCLUDE_TRACE_ID_IN_HTTP_RESPONSE_HEADERS,
};

connector(appConfig)
  .then(app => {
    app.listen(PORT);
  })
  .catch(error => {
    console.error(error);
  });
```

**Tip:** Ensure constants (`SERVICE_NAME`, etc.) match your GCP resource setup.

---

## Handling Events

### Outbound Events from AIR

Update `handleEeAirOutboundEvent` to process AIR events and forward them as internal messages:

```typescript
const handleEeAirOutboundEvent: InternalMessageHandler = async (
  appConfig,
  connectorConfig,
  message,
  attributes,
  logger
) => {
  const eeAirOutboundEvent = EeAirOutboundEventSchema.parse(message);
  const outConnectorConfig = BaseOutConnectorConfigSchema.parse(connectorConfig);
  logger.info(`handleEeAirOutboundEvent: ${eeAirOutboundEvent.headers.eventName}`);
  const identities = getAirIdentities(eeAirOutboundEvent);
  const userId = identities.find(
    identity => identity.type === outConnectorConfig.configuration.identityType
  );
  switch (eeAirOutboundEvent.headers.eventName) {
    case 'SERVICE.WALLET.ACCOUNTS.CREATE': {
      const eventData = getServiceWalletAccountsCreateEventData(eeAirOutboundEvent);
      await sendInternalMessage(
        appConfig,
        {
          type: 'cdp-inbound-event',
          connectorConfig,
          payload: { userId, eventData }
        },
        attributes,
        logger
      );
      break;
    }
    default:
      logger.error(`Unhandled event: ${eeAirOutboundEvent.headers.eventName}`);
  }
};
```

### Inbound Events to CDP

Update `handleCdpInboundEvent` to log or forward the received data:

```typescript
export async function handleCdpInboundEvent(
  appConfig,
  connectorConfig,
  message,
  attributes,
  logger
) {
  logger.info(`handleCdpInboundEvent: ${JSON.stringify(message)}`);
}
```

### Inbound Events from CDP to AIR

```typescript
export async function handleCdpOutboundEvent(
  appConfig,
  connectorConfig,
  message,
  attributes,
  logger
) {
  const inConnectorConfig = BaseConnectorConfigSchema.parse(connectorConfig);
  const cdpOutboundEventPayload = CdpOutboundEventPayloadSchema.parse(message);
  const url = getAirUrl(inConnectorConfig, cdpOutboundEventPayload.type, logger);
  const eeAirInboundEvent: EeAirInboundEvent = {
    type: 'ee-air-inbound-event',
    connectorConfig,
    payload: {
      url: url.href,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cdpOutboundEventPayload),
    },
  };
  await sendInternalMessage(appConfig, eeAirInboundEvent, attributes, logger);
}
```

```typescript
export async function handleEeAirInboundEvent(
  appConfig,
  connectorConfig,
  message,
  attributes,
  logger
) {
  const eeAirInboundEventPayload = EeAirInboundEventPayloadSchema.parse(message);
  const airClient = new EeAirClient(
    connectorConfig.credentials.clientId,
    connectorConfig.credentials.secret,
    connectorConfig.domains,
    logger
  );
  await airClient.makeApiRequest(eeAirInboundEventPayload);
}
```

---

## Deployment

Deploy to GCP Cloud Run using the provided example script `scripts/deploy.sh.example`. Copy and update it as `deploy.sh` with your environment variables. If using a config override, ensure `config-override.json` is present.

```bash
./deploy.sh
```

Once deployed, the service URL will be printed, e.g.:
```
Service [my-connector] revision [my-connector-00011-7j9] has been deployed and is serving 100 percent of traffic.
Service URL: https://my-connector-123456789012.europe-west2.run.app
```

---

## Testing Your Connector

### Health Check

Replace `my-platform` and the service URL as appropriate:

```bash
curl https://my-connector-123456789012.europe-west2.run.app/in/my-platform/status
curl https://my-connector-123456789012.europe-west2.run.app/out/my-platform/status
```

### Send an Outbound Event (AIR to CDP)

Set environment variables for your OUT connector:

```bash
export OUT_CONNECTOR_ID="<YOUR-OUT-CONNECTOR-ID"
export OUT_EXTERNAL_KEY="<YOUR-OUT-EXTERNAL-KEY>"
export SERVICE_URL=https://my-connector-123456789012.europe-west2.run.app

curl ${SERVICE_URL}/out/my-platform/${OUT_CONNECTOR_ID} \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: ${OUT_EXTERNAL_KEY}" \
  --data-binary "@node_modules/integration-events-common/build/test/fixtures/ee-air-outbound-events/sample-events/SERVICE.WALLET.ACCOUNTS.CREATE.json"
```

### Send an Inbound Event (CDP to AIR)

Set environment variables for your IN connector:
```bash
export OUT_CONNECTOR_ID="<YOUR-IN-CONNECTOR-ID"
export OUT_EXTERNAL_KEY="<YOUR-IN-EXTERNAL-KEY>"
export SERVICE_URL=https://my-connector-123456789012.europe-west2.run.app

curl ${SERVICE_URL}/in/my-platform/${IN_CONNECTOR_ID} \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: ${IN_EXTERNAL_KEY}" \
  --data-binary @- <<EOF
{
  "type": "services/trigger",
  "body": {
    "walletTransaction": {
      "reference": "some-random-reference"
    },
    "triggers": [{
      "reference": "some-trigger-reference"
    }],
    "identityValue": "some-identity-value"
  }
}
EOF
```

---

## Next Steps

- Explore additional utilities, schemas, and helper functions provided by the `integration-events-common` framework to support advanced use cases.
- Review the [sample event fixtures](../test/fixtures/ee-air-outbound-events/sample-events/) for examples of typical AIR event formats.
- Examine the [minimal connector example](../examples/minimal-connector/) for a minimal, working implementation.
- Examine the [generic connector example](../examples/generic-connector/) for a more complete implementation, complete with automated tests.
- Set up automated testing and CI/CD for your connector to streamline deployment and reduce manual error.
- Review logging and error handling practices using the [Logging Guide](./logging.md).
- Monitor your deployed service using Cloud Run logs and metrics via the GCP Console.
- Ensure proper cleanup of unused GCP resources (e.g. Pub/Sub topics, service accounts, Cloud Run revisions) to control costs.

---
