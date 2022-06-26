// import cosmosjs from '@cosmostation/cosmosjs';
import { AccountsData } from '../accounts/types';
import Sdk from '../Sdk';
import { BroadcastResult, SignedTransaction, Transaction, TransactionMessage } from '../transactions/types';

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

export class StratosCosmos {
  public static cosmosInstance: CosmosInstance;

  public static init(): void {
    const { restUrl: envRestUrl, chainId: envChainId } = Sdk.environment;

    // StratosCosmos.cosmosInstance = cosmosjs.network(envRestUrl, envChainId);
  }
}

export const getCosmos = (): CosmosInstance => {
  if (!StratosCosmos.cosmosInstance) {
    StratosCosmos.init();
  }

  return StratosCosmos.cosmosInstance;
};
