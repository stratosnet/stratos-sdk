export enum TxMsgTypes {
  Account = 'cosmos-sdk/Account',
  Send = 'cosmos-sdk/MsgSend',
  Delegate = 'cosmos-sdk/MsgDelegate',
  Undelegate = 'cosmos-sdk/MsgUndelegate',
  WithdrawRewards = 'cosmos-sdk/MsgWithdrawDelegationReward',
}

export enum TxMsgTypes {
  SdsPrepay = 'sds/MsgPrepay',
  SdsAll = '',
}

export enum HistoryTxType {
  All = 0,
  Transfer = 1,
  Delegate = 2,
  Undelegate = 3,
  GetReward = 4,
}

export const TxMsgTypesMap = new Map<number, string>([
  [HistoryTxType.All, TxMsgTypes.SdsAll],
  [HistoryTxType.Transfer, TxMsgTypes.Send],
  [HistoryTxType.Delegate, TxMsgTypes.Delegate],
  [HistoryTxType.Undelegate, TxMsgTypes.Undelegate],
  [HistoryTxType.GetReward, TxMsgTypes.WithdrawRewards],
]);

export const TxHistoryTypesMap = new Map<string, number>([
  [TxMsgTypes.Send, HistoryTxType.Transfer],
  [TxMsgTypes.Delegate, HistoryTxType.Delegate],
  [TxMsgTypes.Undelegate, HistoryTxType.Undelegate],
  [TxMsgTypes.WithdrawRewards, HistoryTxType.GetReward],
]);

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

type TransactionValueType = SendTransactionValue | DelegateTransactionValue | SdsPrepayValue;

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
