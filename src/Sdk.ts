export interface SdkEnvironmentConfig {
  restUrl: string;
  rpcUrl: string;
  chainId: string;
  explorerUrl: string;
}

export default class Sdk {
  public static environment = {
    restUrl: 'https://rest.dev.qsnetwork.info',
    rpcUrl: 'https://rpc.dev.qsnetwork.info',
    chainId: 'dev-chain-2',
    explorerUrl: 'https://explorer.dev.qsnetwork.info',

    // restUrl: 'https://rest-test.thestratos.org',
    // rpcUrl: 'https://rpc-test.thestratos.org',
    // chainId: 'test-chain-1',
    // explorerUrl: 'https://explorer-test.thestratos.org',
  };

  public static init(sdkEnv: SdkEnvironmentConfig): void {
    console.log('🚀 ~ file: Sdk.ts ~ line 22 ~ Sdk ~ init ~ sdkEnv', sdkEnv);
    Sdk.environment = { ...Sdk.environment, ...sdkEnv };
  }
}
