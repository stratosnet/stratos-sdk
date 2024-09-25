export interface SdkEnvironmentConfig {
    ppNodeUrl?: string;
    ppNodePort?: string;
    restRedisUrl?: string;
    gatewayToken?: string;
}
export default class Sdk {
    static environment: {
        ppNodeUrl?: string | undefined;
        ppNodePort?: string | undefined;
        restRedisUrl?: string | undefined;
        gatewayToken?: string | undefined;
    };
    static init(sdkEnv: SdkEnvironmentConfig): void;
    static reset(): void;
}
