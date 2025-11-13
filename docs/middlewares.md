# Middlewares (Express JS)

Express.js middlewares enable the execution of shared logic across all incoming HTTP requests or specific subsets of routes handled by the connector. They facilitate tasks such as request preprocessing, response handling, logging, and performance monitoring.

For additional information, refer to the official Express.js documentation: [Using middleware](https://expressjs.com/en/guide/using-middleware.html).

---

## New Relic Middleware

**File:** `integration-events-common/src/common/newrelic-middleware.ts`

### Purpose

The New Relic middleware enhances observability and end-to-end traceability of service interactions by adding custom attributes to New Relic transactions and managing unique identifiers across request/response cycles.

### Key Features

#### 1. Conditional Activation

The middleware can be enabled or disabled through environment configuration:
- **Environment Variable:** `ENABLE_NEW_RELIC`
- **Behavior:** When set to `'true'`, the middleware is active. Otherwise, it acts as a pass-through, allowing requests to proceed without processing.

#### 2. Request Header Extraction

The middleware extracts two critical headers from each incoming HTTP request:

- **`called-unique-id`**  
  A unique identifier for the current request. If not provided by the caller, the middleware automatically generates one using UUID v4.

- **`caller-unique-id`**  
  A unique identifier representing the external application or service that initiated the request. If not provided, it defaults to an empty string.

#### 3. Custom New Relic Attributes

The extracted header values are added as custom attributes to the New Relic transaction using the same names as the headers:
- `called-unique-id`
- `caller-unique-id`

These attributes enable enhanced monitoring, filtering, and distributed tracing capabilities within New Relic dashboards and queries.

#### 4. Response Header Propagation

The middleware sets the same unique identifiers as response headers, allowing downstream services or clients to track the request lifecycle:
- Response header: `called-unique-id`
- Response header: `caller-unique-id`

#### 5. Error Handling

If any error occurs during the middleware execution (e.g., while adding custom attributes), it is logged using the request logger, ensuring that failures do not interrupt the request flow.

### Benefits

- **End-to-End Traceability:** Track requests across multiple services and systems using consistent unique identifiers.
- **Enhanced Observability:** Custom New Relic attributes enable advanced filtering, querying, and visualization of application behavior.
- **Automatic ID Generation:** Ensures every request has a unique identifier, even when not provided by the caller.
- **Flexible Configuration:** Easy to enable or disable based on environment needs without code changes.

---
