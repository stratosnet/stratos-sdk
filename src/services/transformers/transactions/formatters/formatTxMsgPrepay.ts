import * as NetworkTypes from '../../../network/types';
import * as Types from '../types';
import { isPrepayTxBodyMessage } from '../utils';
import { formatBaseTx } from './formatBaseTx';
import { formatTxMultipleAmounts } from './formatTxAmounts';

const findPrepayReciever = (txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog): string => {
  let receiver = '';
  const eventWithReceivedCoins = txResponseItemLogEntry?.events?.find(logEvent => {
    const { type: evetnType } = logEvent;
    return evetnType === 'coin_received';
  });

  if (!eventWithReceivedCoins) {
    return receiver;
  }

  const { attributes } = eventWithReceivedCoins;

  if (!Array.isArray(attributes)) {
    return receiver;
  }

  attributes.forEach(element => {
    if (!receiver && element.key === 'receiver') {
      receiver = `${element.value.trim()}`;
    }
  });

  return receiver;
};

export const formatTxMsgPrepay = (
  txResponseItemTxBodyMessage: NetworkTypes.RestTxBodyMessage,
  txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog,
): Types.FormattedBlockChainTxMessage => {
  const baseTx = formatBaseTx(txResponseItemTxBodyMessage, txResponseItemLogEntry);

  if (!isPrepayTxBodyMessage(txResponseItemTxBodyMessage)) {
    return baseTx;
  }

  const { sender, amount: coins } = txResponseItemTxBodyMessage;

  const amounts = formatTxMultipleAmounts(coins);
  const toAddress = findPrepayReciever(txResponseItemLogEntry);

  console.log('prepay amounts', amounts);

  return {
    ...baseTx,
    sender,
    to: toAddress,
    amounts,
  };
};
