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
  };

  public static init(sdkEnv: SdkEnvironmentConfig): void {
    Sdk.environment = { ...Sdk.environment, ...sdkEnv };
  }
}
