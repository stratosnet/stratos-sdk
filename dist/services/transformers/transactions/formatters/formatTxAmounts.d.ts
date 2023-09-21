import * as NetworkTypes from '../../../network/types';
export declare const emptyAmounts: {
    amount: string;
    denom: string;
}[];
export declare const caclulateAmount: (singleAmount: string) => string;
export declare const formatTxMultipleAmounts: (multipleAmounts: NetworkTypes.Amount[]) => NetworkTypes.Amount[];
export declare const formatTxSingleAmount: (singleAmount: NetworkTypes.Amount) => NetworkTypes.Amount[];
export declare const formatTxAmounts: (txItem: NetworkTypes.BlockChainTx) => string;
export declare const formatTxFee: (feeInfo: NetworkTypes.RestTxFeeInfo) => string[];
