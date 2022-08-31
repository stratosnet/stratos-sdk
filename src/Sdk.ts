export interface SdkEnvironmentConfig {
  restUrl: string;
  rpcUrl: string;
  chainId: string;
  explorerUrl: string;
  ppNodeUrl?: string;
  ppNodePort?: string;
}

const SdkDefaultEnvironment = {
  restUrl: 'https://rest-test.thestratos.org',
  rpcUrl: 'https://rpc-test.thestratos.org',
  chainId: 'test-chain-1',
  explorerUrl: 'https://explorer-test.thestratos.org',
  ppNodeUrl: 'http://52.14.150.146',
  ppNodePort: '8153',
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
