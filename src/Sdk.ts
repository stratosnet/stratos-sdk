import {
  masterkey as masterkeyDefault,
  bip44purpose as bip44purposeDefault,
  bip39Password as bip39PasswordDefault,
  stratosCoinType as stratosCoinTypeDefault,
  keyPath as keyPathDefault,
} from './config/hdVault';

export interface SdkEnvironmentConfig {
  restUrl: string;
  rpcUrl: string;
  chainId: string;
  explorerUrl: string;
  ppNodeUrl?: string;
  ppNodePort?: string;
  faucetUrl?: string;
  nodeProtocolVersion?: string;
  isNewProtocol?: boolean;
  keyPathParameters?: {
    masterkey: string;
    bip44purpose: string;
    stratosCoinType: string;
    bip39Password: string;
  };
  keyPath?: string;
}

const SdkDefaultEnvironment: SdkEnvironmentConfig = {
  restUrl: 'https://rest-test.thestratos.org',
  rpcUrl: 'https://rpc-test.thestratos.org',
  chainId: 'test-chain-1',
  explorerUrl: 'https://explorer-test.thestratos.org',
  ppNodeUrl: '',
  ppNodePort: '',
  faucetUrl: '',
  isNewProtocol: true,
  keyPathParameters: {
    masterkey: masterkeyDefault,
    bip44purpose: bip44purposeDefault,
    stratosCoinType: stratosCoinTypeDefault,
    bip39Password: bip39PasswordDefault,
  },
  keyPath: keyPathDefault,
};

export default class Sdk {
  public static environment = { ...SdkDefaultEnvironment };

  public static init(sdkEnv: SdkEnvironmentConfig): void {
    Sdk.environment = { ...Sdk.environment, ...sdkEnv };
  }

  public static reset(): void {
    Sdk.environment = { ...SdkDefaultEnvironment };
  }
}
