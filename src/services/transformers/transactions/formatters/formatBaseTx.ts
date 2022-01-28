import * as TxTypes from '../../../../transactions/types';
import * as NetworkTypes from '../../../network/types';
import * as Types from '../../transactions/types';
import { formatTxAmounts, formatTxFee } from './formatTxAmounts';

export const formatBaseTx = (txItem: NetworkTypes.BlockChainTx): Types.FormattedBlockChainTx => {
  const msg = txItem.tx?.value?.msg[0];

  if (!msg) {
    throw Error('There is no single message in the transaction!');
  }

  const block = txItem.height;
  const hash = txItem.txhash;
  const time = txItem.timestamp;

  const dateTimeString = new Date(time).toLocaleString();

  const attributes = txItem?.logs[0]?.events[0]?.attributes;

  let eventSender = '';

  if (Array.isArray(attributes)) {
    attributes.forEach(element => {
      if (!eventSender && element.key === 'sender') {
        eventSender = element.value;
      }
    });
  }

  const txType = msg.type;

  const resolvedType = TxTypes.TxHistoryTypesMap.get(txType) || TxTypes.HistoryTxType.All;

  const txAmount = formatTxAmounts(txItem);
  const txFee = formatTxFee(txItem);

  const msgTo = msg?.value?.to_address || '';

  return {
    eventSender,
    sender: '',
    to: msgTo,
    type: resolvedType,
    txType,
    block: `${block}`,
    amount: txAmount,
    time: dateTimeString,
    hash,
    txFee,
    originalTransactionData: txItem,
  };
};
