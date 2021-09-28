import * as TxTypes from '../transactions/types';
import * as Types from './types';
export interface BalanceCardMetrics {
    available: string;
    delegated: string;
    unbounding: string;
    reward: string;
}
export declare const getAccountsData: (keyPairAddress: string) => Promise<Types.AccountsData>;
export declare const increaseBalance: (walletAddress: string, faucetUrl: string) => Promise<{
    result: boolean;
    errorMessage: string;
} | {
    result: boolean;
    errorMessage?: undefined;
}>;
export declare const getBalance: (keyPairAddress: string, requestedDenom: string, decimals?: number) => Promise<string>;
export declare const formatBalanceFromWei: (amount: string, requiredPrecision: number, appendDenom?: boolean) => string;
export declare const getBalanceCardMetricValue: (denom?: string | undefined, amount?: string | undefined) => string;
export declare const getBalanceCardMetrics: (keyPairAddress: string) => Promise<BalanceCardMetrics>;
export declare const getMaxAvailableBalance: (keyPairAddress: string, requestedDenom: string, decimals?: number) => Promise<string>;
export declare const getAccountTrasactions: (address: string, type?: TxTypes.HistoryTxType, page?: number | undefined) => Promise<TxTypes.ParsedTxData>;
