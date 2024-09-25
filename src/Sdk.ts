// import {
//   masterkey as masterkeyDefault,
//   bip44purpose as bip44purposeDefault,
//   bip39Password as bip39PasswordDefault,
//   stratosCoinType as stratosCoinTypeDefault,
//   keyPath as keyPathDefault,
//   slip10RawIndexes,
// } from './config/hdVault';

// export type KeyPathParameters = {
//   masterkey?: string;
//   bip44purpose?: string;
//   stratosCoinType?: string;
//   fullKeyPath?: string;
//   bip39Password?: string;
//   slip10RawIndexes: number[];
// };

export interface SdkEnvironmentConfig {
  // restUrl: string;
  // rpcUrl: string;
  // chainId: string;
  // explorerUrl: string;
  ppNodeUrl?: string;
  ppNodePort?: string;
  restRedisUrl?: string;
  gatewayToken?: string;
  // faucetUrl?: string;
  // nodeProtocolVersion?: string;
  // isNewProtocol?: boolean;
  // keyPathParameters?: KeyPathParameters;
}

const SdkDefaultEnvironment: SdkEnvironmentConfig = {
  // restUrl: 'https://rest-test.thestratos.org',
  // rpcUrl: 'https://rpc-test.thestratos.org',
  // chainId: 'test-chain-1',
  // explorerUrl: 'https://explorer-test.thestratos.org',
  ppNodeUrl: '',
  ppNodePort: '',
  // faucetUrl: '',
  restRedisUrl: 'http://localhost:8080',
  gatewayToken: '',
  // isNewProtocol: true,
  // keyPathParameters: {
  //   masterkey: masterkeyDefault(),
  //   bip44purpose: bip44purposeDefault(),
  //   stratosCoinType: stratosCoinTypeDefault(),
  //   bip39Password: bip39PasswordDefault(),
  //   fullKeyPath: keyPathDefault(),
  //   slip10RawIndexes,
  // },
};

export default class Sdk {
  public static environment = { ...SdkDefaultEnvironment };

  public static init(sdkEnv: SdkEnvironmentConfig): void {
    // const { keyPathParameters } = sdkEnv;

    // if (!keyPathParameters) {
    Sdk.environment = { ...Sdk.environment, ...sdkEnv };
    // return;
    // }

    // const { slip10RawIndexes, masterkey, bip39Password } = keyPathParameters;

    // if (!slip10RawIndexes) {
    //   const errMsg1 =
    //     'if keyPathParameters is given to the SDK init and it must contain "slip10RawIndexes" field ';
    //
    //   throw Error(`${errMsg1}`);
    // }

    // const updatedSdkEnv = {
    // ...sdkEnv,
    // keyPathParameters: {
    //   masterkey: masterkeyDefault(masterkey),
    //   bip39Password: bip39PasswordDefault(bip39Password),
    //   bip44purpose: bip44purposeDefault(slip10RawIndexes),
    //   stratosCoinType: stratosCoinTypeDefault(slip10RawIndexes),
    //   fullKeyPath: keyPathDefault(slip10RawIndexes),
    //   slip10RawIndexes,
    // },
    // };

    // Sdk.environment = { ...Sdk.environment, ...updatedSdkEnv };
  }

  public static reset(): void {
    Sdk.environment = { ...SdkDefaultEnvironment };
  }
}
