import * as TxTypes from '../../../../transactions/types';
import * as NetworkTypes from '../../../network/types';
import * as Types from '../../transactions/types';
// import * as TxTypes from '../types';
import { emptyAmounts } from './formatTxAmounts';

const findSenderFromLogEvents = (txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog): string => {
  let eventSender = '';

  if (!txResponseItemLogEntry) {
    return eventSender;
  }

  txResponseItemLogEntry.events.forEach(({ attributes }) => {
    if (Array.isArray(attributes)) {
      attributes.forEach(element => {
        if (!eventSender && element.key === 'sender') {
          eventSender = element.value;
        }
      });
    }
  });

  return eventSender;
};

export const formatBaseTx = (
  txResponseItemTxBodyMessage: NetworkTypes.RestTxBodyMessage,
  txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog,
): Types.FormattedBlockChainTxMessage => {
  const eventSender = findSenderFromLogEvents(txResponseItemLogEntry);
  const sender = '';
  const msgTo = '';
  const txType = txResponseItemTxBodyMessage['@type'];
  console.log('txType', txType);
  const resolvedType = TxTypes.TxHistoryTypesMap.get(txType) || TxTypes.HistoryTxType.All;
  console.log('resolvedType', resolvedType);

  const res = {
    eventSender,
    sender,
    to: msgTo,
    type: resolvedType,
    txType,
    amounts: emptyAmounts,
  };

  return res;
};
