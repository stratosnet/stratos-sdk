import { DecodedTxRaw } from '@cosmjs/proto-signing';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
export declare enum TxMsgTypes {
    Account = "/cosmos.auth.v1beta1.BaseAccount",
    Send = "/cosmos.bank.v1beta1.MsgSend",
    Delegate = "/cosmos.staking.v1beta1.MsgDelegate",
    Undelegate = "/cosmos.staking.v1beta1.MsgUndelegate",
    WithdrawRewards = "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
    CreateValidator = "/cosmos.staking.v1beta1.MsgCreateValidator"
}
export declare enum TxMsgTypes {
    SdsAll = "",
    SdsPrepay = "/stratos.sds.v1.MsgPrepay",
    SdsFileUpload = "/stratos.sds.v1.MsgFileUpload"
}
export declare enum TxMsgTypes {
    PotVolumeReport = "/stratos.pot.v1.MsgVolumeReport",
    PotWithdraw = "/stratos.pot.v1.MsgWithdraw",
    PotFoundationDeposit = "/stratos.pot.v1.MsgFoundationDeposit"
}
export declare enum TxMsgTypes {
    RegisterCreateResourceNode = "/stratos.register.v1.MsgCreateResourceNode",
    RegisterRemoveResourceNode = "/stratos.register.v1.MsgRemoveResourceNode",
    RegisterCreateIndexingNode = "/stratos.register.v1.MsgCreateMetaNode",
    RegisterRemoveIndexingNode = "/stratos.register.v1.MsgRemoveMetaNode",
    RegisterIndexingNodeRegistrationVote = "/stratos.register.v1.MsgIndexingNodeRegistrationVote"
}
export declare enum HistoryTxType {
    All = 0,
    Transfer = 1,
    Delegate = 2,
    Undelegate = 3,
    GetReward = 4,
    SdsPrepay = 5,
    SdsFileUpload = 6,
    PotVolumeReport = 7,
    PotWithdraw = 8,
    CreateValidator = 9,
    Account = 10,
    RegisterCreateResourceNode = 11,
    RegisterRemoveResourceNode = 12,
    RegisterCreateIndexingNode = 13,
    RegisterRemoveIndexingNode = 14,
    RegisterIndexingNodeRegistrationVote = 15,
    PotFoundationDeposit = 16
}
export declare enum TxHistoryTypes {
    SdsAll = "",
    Transfer = "cosmos-sdk/MsgSend",
    Delegate = "cosmos-sdk/MsgDelegate",
    Undelegate = "cosmos-sdk/MsgUndelegate",
    GetReward = "cosmos-sdk/MsgWithdrawDelegationReward",
    SdsPrepay = "sds/PrepayTx"
}
export declare const TxMsgTypesMap: Map<number, string>;
export declare const BlockChainTxMsgTypesMap: Map<number, string>;
export declare const TxHistoryTypesMap: Map<string, number>;
export interface EmptyObject {
    [key: string]: any;
}
export interface BroadcastResult extends DeliverTxResponse {
}
export interface SignedTransaction extends TxRaw {
}
export interface DecodedSignedTransaction extends DecodedTxRaw {
}
export interface AmountType {
    amount: string;
    denom: string;
}
export interface TransactionFee {
    amount: AmountType[];
    gas: string;
}
export interface TransactionValue {
    amount?: AmountType | AmountType[];
}
export interface SendTransactionValue extends TransactionValue {
    fromAddress: string;
    toAddress: string;
}
export interface DelegateTransactionValue extends TransactionValue {
    delegatorAddress: string;
    validatorAddress: string;
}
export interface SdsPrepayValue extends TransactionValue {
    sender: string;
    coins: AmountType[];
}
type TransactionValueType = SendTransactionValue | DelegateTransactionValue | SdsPrepayValue;
export interface TransactionMessage {
    typeUrl: TxMsgTypes;
    value: TransactionValueType;
}
export interface BaseTransaction {
    chain_id: string;
    account_number: string;
    sequence: string;
    memo: string;
    fee: TransactionFee;
}
export interface Transaction extends BaseTransaction {
    msgs: TransactionMessage[];
}
export interface SendTxMessage {
    typeUrl: TxMsgTypes;
    value: {
        amount: AmountType[];
        fromAddress: string;
        toAddress: string;
    };
}
export interface DelegateTxMessage {
    typeUrl: TxMsgTypes;
    value: {
        amount: AmountType;
        delegatorAddress: string;
        validatorAddress: string;
    };
}
export interface UnDelegateTxMessage extends DelegateTxMessage {
}
export interface WithdrawalRewardTxMessage {
    typeUrl: TxMsgTypes;
    value: {
        delegatorAddress: string;
        validatorAddress: string;
    };
}
export interface SdsPrepayTxMessage {
    typeUrl: TxMsgTypes;
    value: {
        sender: string;
        amount: AmountType[];
    };
}
export type TxMessage = SendTxMessage | DelegateTxMessage | WithdrawalRewardTxMessage | SdsPrepayTxMessage;
export interface SendTxPayload {
    amount: number;
    toAddress: string;
}
export interface DelegateTxPayload {
    amount: number;
    validatorAddress: string;
}
export interface UnDelegateTxPayload extends DelegateTxPayload {
}
export interface WithdrawalRewardTxPayload {
    validatorAddress: string;
}
export interface SdsPrepayTxPayload {
    amount: number;
}
export type TxPayload = SendTxPayload | DelegateTxPayload | UnDelegateTxPayload | WithdrawalRewardTxPayload | SdsPrepayTxPayload;
export {};
