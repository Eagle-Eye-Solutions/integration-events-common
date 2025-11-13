export * from './ee-air-client';
export * from './newrelic-middleware';

import {EeAirOutboundEvent, AirIdentity} from '../types';

export function getAirIdentities(event: EeAirOutboundEvent): AirIdentity[] {
  if (event.enrichmentData) {
    return Object.values(event.enrichmentData).reduce((allData, data) => {
      allData = allData.concat(data.identities as AirIdentity[]);
      return allData;
    }, [] as AirIdentity[]);
  } else {
    return event.atomicOperations
      .filter(operation => operation.objectType === 'walletIdentityEntity')
      .map(operation => {
        const identityObject = operation.objectValue;
        return {
          identityId: identityObject.identityId,
          walletId: identityObject.walletId,
          type: identityObject.type,
          status: identityObject.status,
          value: identityObject.value,
          state: identityObject.state,
        };
      }) as AirIdentity[];
  }
}
