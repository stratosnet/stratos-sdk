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
}

const SdkDefaultEnvironment: SdkEnvironmentConfig = {
  restUrl: 'https://rest-test.thestratos.org',
  rpcUrl: 'https://rpc-test.thestratos.org',
  chainId: 'test-chain-1',
  explorerUrl: 'https://explorer-test.thestratos.org',
  ppNodeUrl: '',
  ppNodePort: '',
  faucetUrl: '',
};

export default class Sdk {
  public static environment = { ...SdkDefaultEnvironment };

  public static init(sdkEnv: SdkEnvironmentConfig): void {
    Sdk.environment = { ...Sdk.environment, ...sdkEnv };
  }

  public static reset(): void {
    Sdk.environment = { ...SdkDefaultEnvironment };
  }

  public static getNewProtocolFlag(currentVersion: string, minRequiredNewVersion: string) {
    console.log('current protocol version ', currentVersion);
    const [pVer, pSubVer, pPatch] = currentVersion.split('.');
    const [minVer, minSubVer, minPatch] = minRequiredNewVersion.split('.');

    const isVerOld = +pVer < +minVer;
    const isSubVerOld = +pSubVer < +minSubVer;
    const isPatchOld = +pPatch < +minPatch;

    const isOldProtocol = isVerOld && isSubVerOld && isPatchOld;

    return !isOldProtocol;
  }
}
