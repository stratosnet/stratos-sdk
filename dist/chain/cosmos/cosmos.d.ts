import { StratosSigningStargateClient } from '../../crypto/stratos-proto-signing/StratosSigningStargateClient';
export declare class StratosCosmos {
    static cosmosInstance: StratosSigningStargateClient | null;
    static init(serialized: string, password: string): Promise<void>;
    static create(userMnemonic: string, hdPathIndex: number): Promise<void>;
    static reset(): void;
}
export declare const resetCosmos: () => void;
export declare const getCosmos: (serialized?: string, password?: string) => Promise<StratosSigningStargateClient>;
export declare const create: (userMnemonic?: string, hdPathIndex?: number) => Promise<StratosSigningStargateClient>;
