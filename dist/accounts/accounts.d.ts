import * as TxTypes from '../chain/transactions/types';
import { ParsedTxData } from '../chain/transformers/transactions/types';
import { networkTypes } from '../network';
import { type BigNumberType } from '../services/bigNumber';
import { type BalanceCardMetrics, type OtherBalanceCardMetrics } from './accountsTypes';
export declare const increaseBalance: (walletAddress: string, faucetUrl: string, denom?: string) => Promise<{
    result: boolean;
    errorMessage: string;
} | {
    result: boolean;
    errorMessage?: undefined;
}>;
export declare const getBalanceInWei: (keyPairAddress: string, requestedDenom: string) => Promise<BigNumberType>;
export declare const getBalance: (keyPairAddress: string, requestedDenom: string, decimals?: number) => Promise<string>;
export declare const formatBalanceFromWei: (amount: string, requiredPrecision: number, appendDenom?: boolean) => string;
export declare const getOtherBalanceCardMetrics: (keyPairAddress: string) => Promise<OtherBalanceCardMetrics>;
export declare const getBalanceCardMetrics: (keyPairAddress: string) => Promise<BalanceCardMetrics>;
export declare const getMaxAvailableBalance: (keyPairAddress: string, requestedDenom: string, decimals?: number) => Promise<string>;
export declare const getAccountTrasactions: (address: string, type?: TxTypes.HistoryTxType, page?: number, pageLimit?: number, userType?: networkTypes.TxHistoryUserType) => Promise<ParsedTxData>;
