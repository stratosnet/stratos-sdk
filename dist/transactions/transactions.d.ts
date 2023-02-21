import { GeneratedType } from '@cosmjs/proto-signing';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import * as Types from './types';
export declare const getStratosTransactionRegistryTypes: () => readonly [string, GeneratedType][];
declare global {
    interface Window {
        encoder: any;
    }
    namespace NodeJS {
        interface Global {
            encoder: any;
        }
    }
}
export declare const broadcast: (signedTx: TxRaw) => Promise<DeliverTxResponse>;
export declare const getStandardFee: (signerAddress: string, txMessages: Types.TxMessage[], memo?: string) => Promise<Types.TransactionFee>;
export declare const sign: (address: string, txMessages: Types.TxMessage[], memo?: string, givenFee?: Types.TransactionFee) => Promise<TxRaw>;
export declare const getStandardAmount: (amounts: number[]) => Types.AmountType[];
export declare const getSendTx: (keyPairAddress: string, sendPayload: Types.SendTxPayload[]) => Promise<Types.SendTxMessage[]>;
export declare const getDelegateTx: (delegatorAddress: string, delegatePayload: Types.DelegateTxPayload[]) => Promise<Types.DelegateTxMessage[]>;
export declare const getUnDelegateTx: (delegatorAddress: string, unDelegatePayload: Types.UnDelegateTxPayload[]) => Promise<Types.UnDelegateTxMessage[]>;
export declare const getWithdrawalRewardTx: (delegatorAddress: string, withdrawalPayload: Types.WithdrawalRewardTxPayload[]) => Promise<Types.WithdrawalRewardTxMessage[]>;
export declare const getWithdrawalAllRewardTx: (delegatorAddress: string) => Promise<Types.WithdrawalRewardTxMessage[]>;
export declare const getSdsPrepayTx: (senderAddress: string, prepayPayload: Types.SdsPrepayTxPayload[]) => Promise<Types.SdsPrepayTxMessage[]>;
