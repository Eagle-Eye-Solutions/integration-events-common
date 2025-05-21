/*
 * Used for both ee-air-inbound-event and cdp-outbound-event.
 * This is due to test cross-contamination and the no-op
 * nature of this generic code.
 */
export const eeAirInboundPayload = {
  method: 'POST',
  url: 'https://wallet.sandbox.uk.eagleeye.com/services/wallet/accounts',
  headers: {},
  body: {
    state: 'DEFAULT',
    status: 'ACTIVE',
    type: 'CONSUMER',
    consumer: {
      friendlyName: 'Test Wallet',
      type: 'INDIVIDUAL',
      status: 'ACTIVE',
      data: {
        personal: {
          firstName: 'Test',
          lastName: 'Wallet',
          preferredName: 'Test',
          language: 'English',
          gender: 'M',
          birthDate: '1980-01-01',
        },
        address: [
          {
            name: 'default',
            type: 'local',
            line1: 'line1',
            line2: 'line2',
            line3: 'line3',
            city: 'Toronto',
            county: '',
            postcode: 'M1M1M1',
            state: 'ON',
            country: 'Canada',
          },
        ],
        contact: [
          {
            type: 'email',
            name: 'default',
            value: 'example@example.com',
          },
          {
            type: 'phone',
            name: 'default',
            value: '01234567890',
          },
        ],
        communication: [
          {
            type: 'default',
            optin: {
              admin: true,
              marketing: false,
            },
          },
        ],
      },
    },
    identities: [
      {
        state: 'DEFAULT',
        status: 'ACTIVE',
        type: 'CUSTOMER_ID',
        value: 'CID_0123456',
      },
    ],
    accounts: {
      campaign: [
        {
          campaignTag: 'initialoffer',
          state: 'LOADED',
        },
      ],
      scheme: [
        {
          status: 'ACTIVE',
          schemeId: 100620987,
          state: 'LOADED',
        },
      ],
    },
  },
};
