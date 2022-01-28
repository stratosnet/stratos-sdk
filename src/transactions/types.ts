import { FormattedBlockChainTx } from '../services/transformers/transactions/types';

export enum TxMsgTypes {
  Account = 'cosmos-sdk/Account', // Account 10
  Send = 'cosmos-sdk/MsgSend', // Transfer 1
  Delegate = 'cosmos-sdk/MsgDelegate', // Delegate 2
  Undelegate = 'cosmos-sdk/MsgUndelegate', // Undelegate 3
  WithdrawRewards = 'cosmos-sdk/MsgWithdrawDelegationReward', // GetReward 4
  CreateValidator = 'osmos-sdk/MsgCreateValidator', // CreateValidator 9
}

export enum TxMsgTypes {
  SdsAll = '', // All 0
  SdsPrepay = 'sds/MsgPrepay', // SdsPrepay 5
  SdsFileUpload = 'sds/MsgFileUpload', // SdsFileUpload 6
}

export enum TxMsgTypes {
  PotVolumeReport = 'pot/MsgVolumeReport', // PotVolumeReport 7
  PotWithdraw = 'pot/MsgWithdraw', // PotWithdraw 8
  PotFoundationDeposit = 'pot/MsgFoundationDeposit', // PotFoundationDeposit 16
}

export enum TxMsgTypes {
  RegisterCreateResourceNode = 'register/MsgCreateResourceNode', // 11 RegisterCreateResourceNode
  RegisterRemoveResourceNode = 'register/MsgRemoveResourceNode', // 12 RegisterRemoveResourceNode
  RegisterCreateIndexingNode = 'register/MsgCreateIndexingNode', // 13 RegisterCreateIndexingNode
  RegisterRemoveIndexingNode = 'register/MsgRemoveIndexingNode', // 14  RegisterRemoveIndexingNode
  RegisterIndexingNodeRegistrationVote = 'register/MsgIndexingNodeRegistrationVote', // 15 RegisterIndexingNodeRegistrationVote
}

export enum HistoryTxType {
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
  PotFoundationDeposit = 16,
}

export const TxMsgTypesMap = new Map<number, string>([
  [HistoryTxType.All, TxMsgTypes.SdsAll],
  [HistoryTxType.Account, TxMsgTypes.Account],
  [HistoryTxType.Transfer, TxMsgTypes.Send],
  [HistoryTxType.Delegate, TxMsgTypes.Delegate],
  [HistoryTxType.Undelegate, TxMsgTypes.Undelegate],
  [HistoryTxType.GetReward, TxMsgTypes.WithdrawRewards],
  [HistoryTxType.CreateValidator, TxMsgTypes.CreateValidator],
  [HistoryTxType.SdsPrepay, TxMsgTypes.SdsPrepay],
  [HistoryTxType.SdsFileUpload, TxMsgTypes.SdsFileUpload],
  [HistoryTxType.PotVolumeReport, TxMsgTypes.PotVolumeReport],
  [HistoryTxType.PotFoundationDeposit, TxMsgTypes.PotFoundationDeposit],
  [HistoryTxType.PotWithdraw, TxMsgTypes.PotWithdraw],
  [HistoryTxType.RegisterCreateResourceNode, TxMsgTypes.RegisterCreateResourceNode],
  [HistoryTxType.RegisterRemoveResourceNode, TxMsgTypes.RegisterRemoveResourceNode],
  [HistoryTxType.RegisterCreateIndexingNode, TxMsgTypes.RegisterCreateIndexingNode],
  [HistoryTxType.RegisterRemoveIndexingNode, TxMsgTypes.RegisterRemoveIndexingNode],
  [HistoryTxType.RegisterIndexingNodeRegistrationVote, TxMsgTypes.RegisterIndexingNodeRegistrationVote],
]);

export const BlockChainTxMsgTypesMap = new Map<number, string>([
  [HistoryTxType.All, TxMsgTypes.SdsAll],
  [HistoryTxType.Transfer, 'send'],
  [HistoryTxType.Delegate, 'delegate'],
  [HistoryTxType.Undelegate, 'begin_unbonding'],
  [HistoryTxType.GetReward, 'withdraw_delegator_reward'],
  [HistoryTxType.SdsPrepay, 'SdsPrepayTx'],
]);

export const TxHistoryTypesMap = new Map<string, number>([
  [TxMsgTypes.SdsAll, HistoryTxType.All],
  [TxMsgTypes.Account, HistoryTxType.Account],
  [TxMsgTypes.Send, HistoryTxType.Transfer],
  [TxMsgTypes.Delegate, HistoryTxType.Delegate],
  [TxMsgTypes.Undelegate, HistoryTxType.Undelegate],
  [TxMsgTypes.WithdrawRewards, HistoryTxType.GetReward],
  [TxMsgTypes.CreateValidator, HistoryTxType.CreateValidator],
  [TxMsgTypes.SdsPrepay, HistoryTxType.SdsPrepay],
  [TxMsgTypes.SdsFileUpload, HistoryTxType.SdsFileUpload],
  [TxMsgTypes.PotVolumeReport, HistoryTxType.PotVolumeReport],
  [TxMsgTypes.PotWithdraw, HistoryTxType.PotWithdraw],
  [TxMsgTypes.RegisterCreateResourceNode, HistoryTxType.RegisterCreateResourceNode],
  [TxMsgTypes.RegisterRemoveResourceNode, HistoryTxType.RegisterRemoveResourceNode],
  [TxMsgTypes.RegisterCreateIndexingNode, HistoryTxType.RegisterCreateIndexingNode],
  [TxMsgTypes.RegisterRemoveIndexingNode, HistoryTxType.RegisterRemoveIndexingNode],
  [TxMsgTypes.RegisterIndexingNodeRegistrationVote, HistoryTxType.RegisterIndexingNodeRegistrationVote],
]);

export interface EmptyObject {
  [key: string]: any;
}

export interface ParsedTxItem extends FormattedBlockChainTx {}

export interface ParsedTxData {
  data: FormattedBlockChainTx[];
  total: string;
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

export interface UnDelegateTxMessage extends DelegateTxMessage {}

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

export interface UnDelegateTxPayload extends DelegateTxPayload {}

export interface WithdrawalRewardTxPayload {
  validatorAddress: string;
}

export interface SdsPrepayTxPayload {
  amount: number;
}

export type TxPayload =
  | SendTxPayload
  | DelegateTxPayload
  | UnDelegateTxPayload
  | WithdrawalRewardTxPayload
  | SdsPrepayTxPayload;
