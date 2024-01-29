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
export default class Sdk {
    static environment: {
        restUrl: string;
        rpcUrl: string;
        chainId: string;
        explorerUrl: string;
        ppNodeUrl?: string | undefined;
        ppNodePort?: string | undefined;
        faucetUrl?: string | undefined;
        nodeProtocolVersion?: string | undefined;
        isNewProtocol?: boolean | undefined;
    };
    static init(sdkEnv: SdkEnvironmentConfig): void;
    static reset(): void;
    static getNewProtocolFlag(currentVersion: string, minRequiredNewVersion: string): boolean;
}
