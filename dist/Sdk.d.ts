export interface SdkEnvironmentConfig {
    restUrl: string;
    rpcUrl: string;
    chainId: string;
    explorerUrl: string;
    ppNodeUrl?: string;
    ppNodePort?: string;
}
export default class Sdk {
    static environment: {
        restUrl: string;
        rpcUrl: string;
        chainId: string;
        explorerUrl: string;
        ppNodeUrl: string;
        ppNodePort: string;
    };
    static init(sdkEnv: SdkEnvironmentConfig): void;
    static reset(): void;
}
