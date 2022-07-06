import { DirectSecp256k1HdWallet, Registry } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';
import { AccountsData } from '../accounts/types';
import { deserializeEncryptedWallet } from '../hdVault/wallet';
import Sdk from '../Sdk';
import { getStratosTransactionRegistryTypes } from '../transactions/transactions';
// import { BroadcastResult, SignedTransaction, Transaction, TransactionMessage } from '../transactions/types';

// @todo clean up this interface
export interface CosmosInstance {
  url: string;
  chainId: string;
  path: string;
  bech32MainPrefix: string;
  // broadcast(signedTx: SignedTransaction): Promise<BroadcastResult>;
  // newStdMsg(tx: Transaction): TransactionMessage;
  // sign(txMessage: TransactionMessage, pkey: Buffer): SignedTransaction;
  getAccounts(address: string): Promise<AccountsData>;
}

export class StratosCosmos {
  public static cosmosInstance: SigningStargateClient;

  public static async init(serialized: string, password: string): Promise<void> {
    if (!serialized) {
      throw new Error('encripted wallet must be provided for the client initialization');
    }

    const { rpcUrl: rpcEndpoint } = Sdk.environment;

    const deserializedWallet = await deserializeEncryptedWallet(serialized, password);

    const client = await getCosmosClient(rpcEndpoint, deserializedWallet);

    StratosCosmos.cosmosInstance = client;
  }
}

export const getCosmos = async (serialized = '', password = ''): Promise<SigningStargateClient> => {
  if (!StratosCosmos.cosmosInstance) {
    await StratosCosmos.init(serialized, password);
  }

  return StratosCosmos.cosmosInstance;
};

const getCosmosClient = async (rpcEndpoint: string, deserializedWallet: DirectSecp256k1HdWallet) => {
  const clientRegistryTypes = getStratosTransactionRegistryTypes();

  const clientRegistry = new Registry(clientRegistryTypes);

  const options = {
    registry: clientRegistry,
  };

  const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, deserializedWallet, options);

  return client;
};
