import { Registry } from '@cosmjs/proto-signing';
import { AccountsData } from '../accounts/types';
import StratosDirectSecp256k1HdWallet from '../hdVault/StratosDirectSecp256k1HdWallet';
import { StratosSigningStargateClient } from '../hdVault/StratosSigningStargateClient';
import { accountFromAnyStratos } from '../hdVault/StratosStargateAccounts';
import { deserializeEncryptedWallet } from '../hdVault/wallet';
import Sdk from '../Sdk';
import { getStratosTransactionRegistryTypes } from '../transactions/transactions';

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

const getCosmosClient = async (
  rpcEndpoint: string,
  deserializedWallet: StratosDirectSecp256k1HdWallet,
): Promise<StratosSigningStargateClient> => {
  const clientRegistryTypes = getStratosTransactionRegistryTypes();

  const clientRegistry = new Registry(clientRegistryTypes);

  const options = {
    registry: clientRegistry,
    // in order to be able to decode `ethSecp256k1` pubkey
    accountParser: accountFromAnyStratos,
  };

  try {
    const client = await StratosSigningStargateClient.connectWithSigner(
      rpcEndpoint,
      deserializedWallet,
      options,
    );
    return client;
  } catch (error) {
    throw new Error(`Can not connect with a signer (cosmos). ${(error as Error).message}`);
  }
};

export class StratosCosmos {
  public static cosmosInstance: StratosSigningStargateClient | null;

  public static async init(serialized: string, password: string): Promise<void> {
    if (!serialized) {
      throw new Error('encripted wallet must be provided for the client initialization');
    }

    const { rpcUrl: rpcEndpoint } = Sdk.environment;

    let deserializedWallet;

    try {
      deserializedWallet = await deserializeEncryptedWallet(serialized, password);
    } catch (error) {
      throw new Error(`Can not deserialize encrypted wallet (cosmos). ${(error as Error).message}`);
    }

    try {
      const client = await getCosmosClient(rpcEndpoint, deserializedWallet);
      StratosCosmos.cosmosInstance = client;
    } catch (error) {
      throw new Error(`Can not get cosmos client (cosmos). ${(error as Error).message}`);
    }
  }

  public static reset(): void {
    StratosCosmos.cosmosInstance = null;
  }
}

export const resetCosmos = () => {
  StratosCosmos.reset();
};

export const getCosmos = async (serialized = '', password = ''): Promise<StratosSigningStargateClient> => {
  if (!StratosCosmos.cosmosInstance) {
    try {
      await StratosCosmos.init(serialized, password);
    } catch (error) {
      throw new Error(`Can not initialize cosmos (cosmos). ${(error as Error).message}`);
    }
  }

  return StratosCosmos.cosmosInstance!;
};
