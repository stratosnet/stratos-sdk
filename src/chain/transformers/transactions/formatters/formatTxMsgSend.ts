import * as NetworkTypes from '../../../../network/networkTypes';
import * as Types from '../types';
import { isSendTxBodyMessage } from '../utils';
import { formatBaseTx } from './formatBaseTx';
import { formatTxMultipleAmounts } from './formatTxAmounts';

export const formatTxMsgSend = (
  txResponseItemTxBodyMessage: NetworkTypes.RestTxBodyMessage,
  txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog,
): Types.FormattedBlockChainTxMessage => {
  const baseTx = formatBaseTx(txResponseItemTxBodyMessage, txResponseItemLogEntry);

  if (!isSendTxBodyMessage(txResponseItemTxBodyMessage)) {
    return baseTx;
  }

  const { from_address, to_address, amount } = txResponseItemTxBodyMessage;

  const amounts = formatTxMultipleAmounts(amount);

  return {
    ...baseTx,
    sender: from_address,
    to: to_address,
    amounts,
  };
};
