import { type TxHistoryUserType } from '../services/network/types';
import { ParsedTxData } from '../services/transformers/transactions/types';
import * as TxTypes from '../transactions/types';
export interface OtherBalanceCardMetrics {
    ozone?: string;
    detailedBalance?: any;
}
export interface BalanceCardMetrics {
    available: string;
    delegated: string;
    unbounding: string;
    reward: string;
    detailedBalance?: any;
}
export declare const increaseBalance: (walletAddress: string, faucetUrl: string, denom?: string) => Promise<{
    result: boolean;
    errorMessage: string;
} | {
    result: boolean;
    errorMessage?: undefined;
}>;
export declare const getBalance: (keyPairAddress: string, requestedDenom: string, decimals?: number) => Promise<string>;
export declare const formatBalanceFromWei: (amount: string, requiredPrecision: number, appendDenom?: boolean) => string;
export declare const getOtherBalanceCardMetrics: (keyPairAddress: string) => Promise<OtherBalanceCardMetrics>;
export declare const getBalanceCardMetrics: (keyPairAddress: string) => Promise<BalanceCardMetrics>;
export declare const getMaxAvailableBalance: (keyPairAddress: string, requestedDenom: string, decimals?: number) => Promise<string>;
export declare const getAccountSenderTrasactions: (address: string, type?: TxTypes.HistoryTxType, page?: number, pageLimit?: number) => Promise<ParsedTxData>;
export declare const getAccountReceiverTrasactions: (address: string, type?: TxTypes.HistoryTxType, page?: number, pageLimit?: number) => Promise<ParsedTxData>;
export declare const getAccountTrasactions: (address: string, type?: TxTypes.HistoryTxType, page?: number, pageLimit?: number, userType?: TxHistoryUserType) => Promise<ParsedTxData>;
