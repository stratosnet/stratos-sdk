export type KeyPathParameters = {
    masterkey?: string;
    bip44purpose?: string;
    stratosCoinType?: string;
    fullKeyPath?: string;
    bip39Password?: string;
    slip10RawIndexes: number[];
};
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
    keyPathParameters?: KeyPathParameters;
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
        keyPathParameters?: KeyPathParameters | undefined;
    };
    static init(sdkEnv: SdkEnvironmentConfig): void;
    static reset(): void;
}
