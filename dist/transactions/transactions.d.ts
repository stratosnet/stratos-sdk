import * as Types from './types';
export declare const broadcast: (signedTx: Types.SignedTransaction) => Promise<Types.BroadcastResult>;
export declare const sign: (txMessage: Types.TransactionMessage, privateKey: string) => Types.SignedTransaction;
export declare const getStandardFee: (numberOfMessages?: number) => Types.TransactionFee;
export declare const getStandardAmount: (amounts: number[]) => Types.AmountType[];
export declare const getBaseTx: (keyPairAddress: string, memo?: string, numberOfMessages?: number) => Promise<Types.BaseTransaction>;
export declare const getSendTx: (keyPairAddress: string, sendPayload: Types.SendTxPayload[], memo?: string) => Promise<Types.TransactionMessage>;
export declare const getDelegateTx: (delegatorAddress: string, delegatePayload: Types.DelegateTxPayload[], memo?: string) => Promise<Types.TransactionMessage>;
export declare const getUnDelegateTx: (delegatorAddress: string, unDelegatePayload: Types.UnDelegateTxPayload[], memo?: string) => Promise<Types.TransactionMessage>;
export declare const getWithdrawalRewardTx: (delegatorAddress: string, withdrawalPayload: Types.WithdrawalRewardTxPayload[], memo?: string) => Promise<Types.TransactionMessage>;
export declare const getWithdrawalAllRewardTx: (delegatorAddress: string, memo?: string) => Promise<Types.TransactionMessage>;
/** @todo add unit test */
export declare const getSdsPrepayTx: (senderAddress: string, prepayPayload: Types.SdsPrepayTxPayload[], memo?: string) => Promise<Types.TransactionMessage>;
