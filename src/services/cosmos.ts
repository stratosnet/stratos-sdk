import cosmosjs from '@cosmostation/cosmosjs';

import { chainId, restUrl } from '../config/network';
import { SignedTransaction, BroadcastResult, Transaction, TransactionMessage } from '../transactions/types';
import { AccountsData } from '../accounts/types';

export interface CosmosInstance {
  url: string;
  chainId: string;
  path: string;
  bech32MainPrefix: string;
  broadcast(signedTx: SignedTransaction): Promise<BroadcastResult>;
  newStdMsg(tx: Transaction): TransactionMessage;
  sign(txMessage: TransactionMessage, pkey: Buffer): SignedTransaction;
  getAccounts(address: string): Promise<AccountsData>;
}

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
