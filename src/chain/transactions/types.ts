import { DecodedTxRaw } from '@cosmjs/proto-signing';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { type AmountType, type TransactionValue } from '../../common/types/transactionTypes';
import { sdsTxTypes } from '../../sds/transactions';

export enum TxMsgTypes {
  All = '',
  Account = '/cosmos.auth.v1beta1.BaseAccount', // Account 10
  Send = '/cosmos.bank.v1beta1.MsgSend', // Transfer 1
  Delegate = '/cosmos.staking.v1beta1.MsgDelegate', // Delegate 2
  Undelegate = '/cosmos.staking.v1beta1.MsgUndelegate', // Undelegate 3
  WithdrawRewards = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward', // GetReward 4
  CreateValidator = '/cosmos.staking.v1beta1.MsgCreateValidator', // CreateValidator 9
  BeginRedelegate = '/cosmos.staking.v1beta1.MsgBeginRedelegate', // BeginRedelegate 17
}

export enum TxMsgTypes {
  PotVolumeReport = '/stratos.pot.v1.MsgVolumeReport', // PotVolumeReport 7
  PotWithdraw = '/stratos.pot.v1.MsgWithdraw', // PotWithdraw 8
  PotFoundationDeposit = '/stratos.pot.v1.MsgFoundationDeposit', // PotFoundationDeposit 16
}

export enum TxMsgTypes {
  RegisterCreateResourceNode = '/stratos.register.v1.MsgCreateResourceNode', // 11 RegisterCreateResourceNode
  RegisterRemoveResourceNode = '/stratos.register.v1.MsgRemoveResourceNode', // 12 RegisterRemoveResourceNode
  RegisterCreateIndexingNode = '/stratos.register.v1.MsgCreateMetaNode', // 13 RegisterCreateIndexingNode
  RegisterRemoveIndexingNode = '/stratos.register.v1.MsgRemoveMetaNode', // 14  RegisterRemoveIndexingNode
  RegisterIndexingNodeRegistrationVote = '/stratos.register.v1.MsgIndexingNodeRegistrationVote', // 15 RegisterIndexingNodeRegistrationVote
}

export enum HistoryTxType {
  All = 0,
  Transfer = 1,
  Delegate = 2,
  Undelegate = 3,
  GetReward = 4,
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
  BeginRedelegate = 17,
}

export const TxMsgTypesMap = new Map<number, string>([
  [HistoryTxType.All, TxMsgTypes.All],
  [HistoryTxType.Account, TxMsgTypes.Account],
  [HistoryTxType.Transfer, TxMsgTypes.Send],
  [HistoryTxType.Delegate, TxMsgTypes.Delegate],
  [HistoryTxType.BeginRedelegate, TxMsgTypes.BeginRedelegate],
  [HistoryTxType.Undelegate, TxMsgTypes.Undelegate],
  [HistoryTxType.GetReward, TxMsgTypes.WithdrawRewards],
  [HistoryTxType.CreateValidator, TxMsgTypes.CreateValidator],
  [HistoryTxType.PotVolumeReport, TxMsgTypes.PotVolumeReport],
  [HistoryTxType.PotFoundationDeposit, TxMsgTypes.PotFoundationDeposit],
  [HistoryTxType.PotWithdraw, TxMsgTypes.PotWithdraw],
  [HistoryTxType.RegisterCreateResourceNode, TxMsgTypes.RegisterCreateResourceNode],
  [HistoryTxType.RegisterRemoveResourceNode, TxMsgTypes.RegisterRemoveResourceNode],
  [HistoryTxType.RegisterCreateIndexingNode, TxMsgTypes.RegisterCreateIndexingNode],
  [HistoryTxType.RegisterRemoveIndexingNode, TxMsgTypes.RegisterRemoveIndexingNode],
  [HistoryTxType.RegisterIndexingNodeRegistrationVote, TxMsgTypes.RegisterIndexingNodeRegistrationVote],
  [sdsTxTypes.HistoryTxType.SdsPrepay, sdsTxTypes.TxMsgTypes.SdsPrepay],
  [sdsTxTypes.HistoryTxType.SdsFileUpload, sdsTxTypes.TxMsgTypes.SdsFileUpload],
]);

export const BlockChainTxMsgTypesMap = new Map<number, string>([
  [HistoryTxType.All, TxMsgTypes.All],
  [HistoryTxType.Transfer, TxMsgTypes.Send],
  [HistoryTxType.Delegate, TxMsgTypes.Delegate],
  [HistoryTxType.BeginRedelegate, TxMsgTypes.BeginRedelegate],
  [HistoryTxType.Undelegate, TxMsgTypes.Undelegate],
  [HistoryTxType.GetReward, TxMsgTypes.WithdrawRewards],
  [sdsTxTypes.HistoryTxType.SdsPrepay, sdsTxTypes.TxMsgTypes.SdsPrepay],
]);

export const TxHistoryTypesMap = new Map<string, number>([
  [TxMsgTypes.All, HistoryTxType.All],
  [TxMsgTypes.Send, HistoryTxType.Transfer],
  [TxMsgTypes.Delegate, HistoryTxType.Delegate],
  [TxMsgTypes.BeginRedelegate, HistoryTxType.BeginRedelegate],
  [TxMsgTypes.Undelegate, HistoryTxType.Undelegate],
  [TxMsgTypes.WithdrawRewards, HistoryTxType.GetReward],
  [sdsTxTypes.TxMsgTypes.SdsPrepay, sdsTxTypes.HistoryTxType.SdsPrepay],
]);

export interface BroadcastResult extends DeliverTxResponse {}

export interface SignedTransaction extends TxRaw {}
export interface DecodedSignedTransaction extends DecodedTxRaw {}

export interface TransactionFee {
  amount: AmountType[];
  gas: string;
}

export interface SendTransactionValue extends TransactionValue {
  fromAddress: string;
  toAddress: string;
}

export interface DelegateTransactionValue extends TransactionValue {
  delegatorAddress: string;
  validatorAddress: string;
}

type TransactionValueType = SendTransactionValue | DelegateTransactionValue | sdsTxTypes.SdsPrepayValue;

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

export interface BeginRedelegateTxMessage {
  typeUrl: TxMsgTypes;
  value: {
    amount: AmountType;
    delegatorAddress: string;
    validatorSrcAddress: string;
    validatorDstAddress: string;
  };
}

export interface UnDelegateTxMessage extends DelegateTxMessage {}

export interface WithdrawalRewardTxMessage {
  typeUrl: TxMsgTypes;
  value: {
    delegatorAddress: string;
    validatorAddress: string;
  };
}

export type TxMessage =
  | SendTxMessage
  | DelegateTxMessage
  | WithdrawalRewardTxMessage
  | sdsTxTypes.SdsPrepayTxMessage
  | BeginRedelegateTxMessage;

export interface SendTxPayload {
  amount: number;
  toAddress: string;
}

export interface DelegateTxPayload {
  amount: number;
  validatorAddress: string;
}

export interface BeginRedelegateTxPayload {
  amount: number;
  validatorSrcAddress: string;
  validatorDstAddress: string;
}

export interface UnDelegateTxPayload extends DelegateTxPayload {}

export interface WithdrawalRewardTxPayload {
  validatorAddress: string;
}

export type TxPayload =
  | SendTxPayload
  | DelegateTxPayload
  | BeginRedelegateTxPayload
  | UnDelegateTxPayload
  | WithdrawalRewardTxPayload
  | sdsTxTypes.SdsPrepayTxPayload;
