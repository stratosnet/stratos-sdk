import { Registry } from '@cosmjs/proto-signing';
// import { AccountsData } from '../accounts/types';
import StratosDirectSecp256k1HdWallet from '../../crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet';
import { getStratosTransactionRegistryTypes } from '../../crypto/stratos-proto-signing/StratosRegistry';
import { StratosSigningStargateClient } from '../../crypto/stratos-proto-signing/StratosSigningStargateClient';
import { accountFromAnyStratos } from '../../crypto/stratos-proto-signing/StratosStargateAccounts';
import Sdk from '../../Sdk';
import { deserializeEncryptedWallet, createWalletAtPath } from './cosmosWallet';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const proto_signing_1 = require('@cosmjs/proto-signing');

// @todo clean up this interface
// export interface CosmosInstance {
//   url: string;
//   chainId: string;
//   path: string;
//   bech32MainPrefix: string;
//   getAccounts(address: string): Promise<AccountsData>;
// }

const getCosmosClient = async (
  rpcEndpoint: string,
  deserializedWallet: StratosDirectSecp256k1HdWallet,
): Promise<StratosSigningStargateClient> => {
  const clientRegistryTypes = getStratosTransactionRegistryTypes();

  const clientRegistry = new Registry(clientRegistryTypes);

  const options: typeof proto_signing_1.SigningStargateClientOptions = {
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

  public static async create(userMnemonic: string, hdPathIndex: number): Promise<void> {
    if (!userMnemonic) {
      throw new Error('userMnemonic wallet must be provided for the client initialization');
    }

    const deserializedWallet = await createWalletAtPath(hdPathIndex, userMnemonic);

    const { rpcUrl: rpcEndpoint } = Sdk.environment;

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

export const create = async (userMnemonic = '', hdPathIndex = 0): Promise<StratosSigningStargateClient> => {
  StratosCosmos.reset();

  try {
    await StratosCosmos.create(userMnemonic, hdPathIndex);
  } catch (error) {
    throw new Error(`Can not initialize cosmos (cosmos). ${(error as Error).message}`);
  }

  return StratosCosmos.cosmosInstance!;
};
