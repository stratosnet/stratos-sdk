import * as NetworkTypes from '../../../network/networkTypes';
import * as TxTypesPrepay from '../../../sds/transactions/types';
import * as TxTypes from '../../transactions/types';
import * as Types from '../transactions/types';
import * as Formatters from './formatters';
import { formatTxFee } from './formatters/formatTxAmounts';

export const TxHistoryTypesMap = new Map<string, Types.TxFormatter>([
  [TxTypes.TxMsgTypes.All, Formatters.formatTxdDefault], // default.
  [TxTypes.TxMsgTypes.Account, Formatters.formatTxdDefault], // default.
  [TxTypes.TxMsgTypes.Send, Formatters.formatTxMsgSend],
  [TxTypes.TxMsgTypes.Delegate, Formatters.formatTxMsgDelegate],
  [TxTypes.TxMsgTypes.BeginRedelegate, Formatters.formatTxMsgBeginRedelegate],
  [TxTypes.TxMsgTypes.Undelegate, Formatters.formatTxMsgUndelegate],
  [TxTypes.TxMsgTypes.WithdrawRewards, Formatters.formatTxMsgWithdrawDelegationReward],
  [TxTypes.TxMsgTypes.CreateValidator, Formatters.formatTxMsgCreateValidator],
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
  [TxTypesPrepay.TxMsgTypes.SdsPrepay, Formatters.formatTxMsgPrepay],
  [TxTypesPrepay.TxMsgTypes.SdsFileUpload, Formatters.formatTxMsgFileUpload],
]);

export const getTransformer = (txType: TxTypes.TxMsgTypes): Types.TxFormatter => {
  return TxHistoryTypesMap.get(txType) || Formatters.formatTxdDefault;
};

export const transformTx = (txResponseItem: NetworkTypes.RestTxResponse): Types.FormattedBlockChainTx => {
  const { code, tx, logs, height: block, txhash: hash, timestamp: time } = txResponseItem;
  const {
    body,
    auth_info: { fee },
  } = tx;

  const { memo } = body;

  const dateTimeString = new Date(time).toLocaleString();

  const transformedTransactionMessages = body.messages.map((bodyMessage, messageIndex) => {
    const transactionType = bodyMessage['@type'] as TxTypes.TxMsgTypes;
    const transactionTransformer = getTransformer(transactionType);

    const messageLogEntry = logs.find(logEntry => {
      return `${logEntry.msg_index}` === `${messageIndex}`;
    });
    const transformedTransactionMessage = transactionTransformer(bodyMessage, messageLogEntry);

    return transformedTransactionMessage;
  });

  const txFee = formatTxFee(fee);

  return {
    statusCode: code,
    block,
    time: dateTimeString,
    hash,
    txFee,
    memo,
    originalTransactionData: tx,
    originalTxResponse: txResponseItem,
    txMessages: transformedTransactionMessages,
  };
};
