import cosmosjs from '@cosmostation/cosmosjs';

import { chainId, restUrl } from '../config/network';
import { CosmosInstance } from './types';

class StratosCosmos {
  public static cosmosInstance: CosmosInstance;

  public static init(): void {
    StratosCosmos.cosmosInstance = cosmosjs.network(restUrl, chainId);
  }
}

export const getCosmos = (): CosmosInstance => {
  if (!StratosCosmos.cosmosInstance) {
    StratosCosmos.init();
  }

  return StratosCosmos.cosmosInstance;
};
