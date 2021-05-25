import cosmosjs from '@cosmostation/cosmosjs';

import { chainId, lcdUrl, restPort } from '../config/network';
import { CosmosInstance } from './types';

class StratosCosmos {
  public static cosmosInstance: CosmosInstance;

  public static init(): void {
    StratosCosmos.cosmosInstance = cosmosjs.network(`${lcdUrl}:${restPort}`, chainId);
  }
}

export const getCosmos = (): CosmosInstance => {
  if (!StratosCosmos.cosmosInstance) {
    StratosCosmos.init();
  }

  return StratosCosmos.cosmosInstance;
};
