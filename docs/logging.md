# Logging

The framework uses [Pino](https://github.com/pinojs/pino) for structured, high-performance logging. When applications built on this framework run in GCP Cloud Run, log entries are automatically enriched with a trace ID. This enables filtering all logs related to a specific input event.

## Outbound Events

For outbound events received from Eagle Eye AIR, the `eesEventId` found in the `headers` object of the request body is used as the trace ID. In the [GCP Logs Explorer](https://console.cloud.google.com/logs), you can filter logs by this value using a query like:

```json
jsonPayload.req.id="5e617054-cf27-4149-a79c-e9f2c49f7eb5"
```

Replace the UUID above with the actual `eesEventId` you wish to trace.

## Inbound Events

Inbound events received from a CDP are similarly tagged with an ID value for traceability. By default, the framework generates a new UUID when an inbound request is received. This ID is attached to all subsequent logs associated with that request.

If your CDP includes a unique identifier in the request payload, you can override the default behavior by supplying a custom middleware function via the `customCdpRequestIdMiddleware` field in the `ApplicationConfig` object. For example:

```typescript
const applicationConfig: ApplicationConfig = {
  ...
  customCdpRequestIdMiddleware: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (req?.body?.id) {
      req.id = `${req.body.id}`;
    } else {
      req.id = uuidv4();
    }
    next();
  },
  ...
}
```

In this example, the middleware checks for an `id` field in the request body. If present, it uses that value as the trace ID; otherwise, it generates a new UUID. This approach is particularly useful when integrating with platforms like mParticle, which include a consistent unique identifier in every message.

Refer to the [mParticle connector](https://github.com/Eagle-Eye-Solutions/integration-mparticle) for an implementation example.
