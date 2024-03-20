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
        keyPathParameters?: {
            masterkey: string;
            bip44purpose: string;
            stratosCoinType: string;
            bip39Password: string;
        } | undefined;
        keyPath?: string | undefined;
    };
    static init(sdkEnv: SdkEnvironmentConfig): void;
    static reset(): void;
}
