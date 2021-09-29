import * as TxTypes from '../../../transactions/types';
import * as Types from '../transactions/types';
import * as Formatters from './formatters';

export const TxHistoryTypesMap = new Map<string, Types.TxFormatter>([
  [TxTypes.TxMsgTypes.SdsAll, Formatters.formatTxdDefault], // default.
  [TxTypes.TxMsgTypes.Account, Formatters.formatTxdDefault], // default.
  [TxTypes.TxMsgTypes.Send, Formatters.formatTxMsgSend],
  [TxTypes.TxMsgTypes.Delegate, Formatters.formatTxMsgDelegate],
  [TxTypes.TxMsgTypes.Undelegate, Formatters.formatTxdDefault], // Default !! formatter is missing
  [TxTypes.TxMsgTypes.WithdrawRewards, Formatters.formatTxdDefault], // Default !! formatter is missing
  [TxTypes.TxMsgTypes.CreateValidator, Formatters.formatTxMsgCreateValidator],
  [TxTypes.TxMsgTypes.SdsPrepay, Formatters.formatTxMsgPrepay],
  [TxTypes.TxMsgTypes.SdsFileUpload, Formatters.formatTxMsgFileUpload],
  [TxTypes.TxMsgTypes.PotVolumeReport, Formatters.formatTxMsgVolumeReport],
  [TxTypes.TxMsgTypes.PotWithdraw, Formatters.formatTxMsgWithdraw],
  [TxTypes.TxMsgTypes.RegisterCreateResourceNode, Formatters.formatTxMsgCreateResourceNode],
  [TxTypes.TxMsgTypes.RegisterRemoveResourceNode, Formatters.formatTxMsgRemoveResourceNode],
  [TxTypes.TxMsgTypes.RegisterCreateIndexingNode, Formatters.formatTxMsgCreateIndexingNode],
  [TxTypes.TxMsgTypes.RegisterRemoveIndexingNode, Formatters.formatTxMsgRemoveIndexingNode],
  [
    TxTypes.TxMsgTypes.RegisterIndexingNodeRegistrationVote,
    Formatters.formatTxMsgIndexingNodeRegistrationVote,
  ],
]);

export const getTransformer = (txType: TxTypes.TxMsgTypes): Types.TxFormatter => {
  return TxHistoryTypesMap.get(txType) || Formatters.formatTxdDefault;
};
