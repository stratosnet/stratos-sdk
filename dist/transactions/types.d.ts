export declare enum TxMsgTypes {
    Account = "cosmos-sdk/Account",
    Send = "cosmos-sdk/MsgSend",
    Delegate = "cosmos-sdk/MsgDelegate",
    Undelegate = "cosmos-sdk/MsgUndelegate",
    WithdrawRewards = "cosmos-sdk/MsgWithdrawDelegationReward",
    CreateValidator = "osmos-sdk/MsgCreateValidator"
}
export declare enum TxMsgTypes {
    SdsAll = "",
    SdsPrepay = "sds/MsgPrepay",
    SdsFileUpload = "sds/MsgFileUpload"
}
export declare enum TxMsgTypes {
    PotVolumeReport = "pot/MsgVolumeReport",
    PotWithdraw = "pot/MsgWithdraw"
}
export declare enum TxMsgTypes {
    RegisterCreateResourceNode = "register/MsgCreateResourceNode",
    RegisterRemoveResourceNode = "register/MsgRemoveResourceNode",
    RegisterCreateIndexingNode = "register/MsgCreateIndexingNode",
    RegisterRemoveIndexingNode = "register/MsgRemoveIndexingNode",
    RegisterIndexingNodeRegistrationVote = "register/MsgIndexingNodeRegistrationVote"
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
    RegisterIndexingNodeRegistrationVote = 15
}
export declare const TxMsgTypesMap: Map<number, string>;
export declare const TxHistoryTypesMap: Map<string, number>;
export interface EmptyObject {
    [key: string]: any;
}
export interface ParsedTxItem {
    sender: string;
    to: string;
    type: HistoryTxType;
    txType: string;
    block: string;
    amount: string;
    time: string;
    hash: string;
    originalTransactionData?: EmptyObject;
}
export interface ParsedTxData {
    data: ParsedTxItem[];
    total: number;
    page: number;
}
export interface BroadcastResult {
    height: string;
    txhash: string;
    raw_log?: string;
    error?: string;
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
    from_address: string;
    to_address: string;
}
export interface DelegateTransactionValue extends TransactionValue {
    delegator_address: string;
    validator_address: string;
}
export interface SdsPrepayValue extends TransactionValue {
    sender: string;
    coins: AmountType[];
}
declare type TransactionValueType = SendTransactionValue | DelegateTransactionValue | SdsPrepayValue;
export interface TransactionMessage {
    type: TxMsgTypes;
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
export interface SignedTransaction {
    tx: {
        msg: any[];
        fee: any;
        signatures: any[];
        memo: string;
    };
    mode: 'sync';
}
export interface SendTxMessage {
    type: TxMsgTypes;
    value: {
        amount: AmountType[];
        from_address: string;
        to_address: string;
    };
}
export interface DelegateTxMessage {
    type: TxMsgTypes;
    value: {
        amount: AmountType;
        delegator_address: string;
        validator_address: string;
    };
}
export interface UnDelegateTxMessage extends DelegateTxMessage {
}
export interface WithdrawalRewardTxMessage {
    type: TxMsgTypes;
    value: {
        delegator_address: string;
        validator_address: string;
    };
}
export interface SdsPrepayTxMessage {
    type: TxMsgTypes;
    value: {
        sender: string;
        coins: AmountType[];
    };
}
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
export declare type TxPayload = SendTxPayload | DelegateTxPayload | UnDelegateTxPayload | WithdrawalRewardTxPayload | SdsPrepayTxPayload;
export {};
