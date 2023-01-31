import { AccountsData } from '../accounts/types';
import { StratosSigningStargateClient } from '../hdVault/StratosSigningStargateClient';
export interface CosmosInstance {
    url: string;
    chainId: string;
    path: string;
    bech32MainPrefix: string;
    getAccounts(address: string): Promise<AccountsData>;
}
export declare class StratosCosmos {
    static cosmosInstance: StratosSigningStargateClient | null;
    static init(serialized: string, password: string): Promise<void>;
    static reset(): void;
}
export declare const resetCosmos: () => void;
export declare const getCosmos: (serialized?: string, password?: string) => Promise<StratosSigningStargateClient>;
