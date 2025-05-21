# Identity Handling

When sending data to a Customer Data Platform (CDP), a single identifier is typically used to associate the event with the appropriate user profile. Events received from Eagle Eye AIR are enriched with identity data related to the end user. These identities are included in the `enrichmentData` field and may represent various identifiers such as customer IDs, card numbers, or mobile phone numbers.

An example structure is shown below:

```json
{
  "headers": {
    ...
  },
  "request": {
    ...
  },
  "response": {
    ...
  },
  "atomicOperations": [
    ...
  ],
  "enrichmentData": {
    "walletEntity_123456789": {
      "identities": [
        {
          "identityId": "202597919",
          "walletId": "087452501",
          "type": "CUSTOMER_ID",
          "friendlyName": null,
          "value": "2570746687365543",
          "safeValue": null,
          "secret": null,
          "dates": {
            "start": "2025-01-29T20:23:00+00:00",
            "end": null
          },
          "meta": [],
          "state": "DEFAULT",
          "status": "ACTIVE",
          "dateCreated": "2025-01-29T20:23:00+00:00",
          "lastUpdated": "2025-01-29T20:23:00+00:00",
          "mobileWallet": "https:\/\/sb.uk.mypass.is\/identity\/151892\/087452501\/202597919\/be7684dd0075893348ec88374208b789ddc3598c1cf4edaeb8de5d9c1b206720"
        },
        {
          "identityId": "843717346",
          "walletId": "087452501",
          "type": "CARD",
          "friendlyName": null,
          "value": "0819783971346739",
          "safeValue": null,
          "secret": null,
          "dates": {
            "start": "2025-01-29T20:23:00+00:00",
            "end": null
          },
          "meta": [],
          "state": "DEFAULT",
          "status": "ACTIVE",
          "dateCreated": "2025-01-29T20:23:00+00:00",
          "lastUpdated": "2025-01-29T20:23:00+00:00",
          "mobileWallet": "https:\/\/sb.uk.mypass.is\/identity\/151892\/087452501\/843717346\/1e133265e1041e850e5eba136efe2b5ba643357049a06d4c4c7298352e0d3095"
        },
        {
          "identityId": "507055892",
          "walletId": "087452501",
          "type": "MOBILE",
          "friendlyName": null,
          "value": "+1(920)-781-3504",
          "safeValue": null,
          "secret": null,
          "dates": {
            "start": "2025-01-29T20:23:00+00:00",
            "end": null
          },
          "meta": [],
          "state": "DEFAULT",
          "status": "ACTIVE",
          "dateCreated": "2025-01-29T20:23:00+00:00",
          "lastUpdated": "2025-01-29T20:23:00+00:00",
          "mobileWallet": "https:\/\/sb.uk.mypass.is\/identity\/151892\/087452501\/507055892\/94267819aea4d75ae86027c9762acf87126aa1c9149e15acf89c54b6d51f060b"
        }
      ]
    }
  }
}
```

To ensure that the correct identifier is used when integrating with a CDP, the connector must be configured with an `identityType` setting. This configuration value should match the `type` field of the identity you wish to use (e.g., `CUSTOMER_ID`, `CARD`, `MOBILE`). The connector will then extract and use the appropriate identifier when processing outbound events.