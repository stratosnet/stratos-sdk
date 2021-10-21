import * as TxTypes from '../../../transactions/types';
import * as Types from '../transactions/types';
import * as Formatters from './formatters';
import * as NetworkTypes from '../../network/types';

export const TxHistoryTypesMap = new Map<string, Types.TxFormatter>([
  [TxTypes.TxMsgTypes.SdsAll, Formatters.formatTxdDefault], // default.
  [TxTypes.TxMsgTypes.Account, Formatters.formatTxdDefault], // default.
  [TxTypes.TxMsgTypes.Send, Formatters.formatTxMsgSend],
  [TxTypes.TxMsgTypes.Delegate, Formatters.formatTxMsgDelegate],
  [TxTypes.TxMsgTypes.Undelegate, Formatters.formatTxMsgUndelegate],
  [TxTypes.TxMsgTypes.WithdrawRewards, Formatters.formatTxMsgWithdrawDelegationReward],
  [TxTypes.TxMsgTypes.CreateValidator, Formatters.formatTxMsgCreateValidator],
  [TxTypes.TxMsgTypes.SdsPrepay, Formatters.formatTxMsgPrepay],
  [TxTypes.TxMsgTypes.SdsFileUpload, Formatters.formatTxMsgFileUpload],
  [TxTypes.TxMsgTypes.PotVolumeReport, Formatters.formatTxMsgVolumeReport],
  [TxTypes.TxMsgTypes.PotFoundationDeposit, Formatters.formatTxMsgFoundationDeposit],
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

export const transformTx = (txItem: NetworkTypes.BlockChainTx) => {
  const transactionType = txItem.tx?.value?.msg[0]?.type as TxTypes.TxMsgTypes;
  const transactionTransformer = getTransformer(transactionType);

  let transformedTransaction;

  try {
    transformedTransaction = transactionTransformer(txItem);
  } catch (err) {
    console.log(`Could not parse txItem with hash "${txItem.txhash}"`, (err as Error).message);
    throw new Error(`Could not parse txItem with hash "${txItem.txhash}"`);
  }

  return transformedTransaction;
};
