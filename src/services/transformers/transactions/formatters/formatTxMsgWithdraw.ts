import * as NetworkTypes from '../../../network/types';
import * as Types from '../types';
import { formatBaseTx } from './formatBaseTx';

export const formatTxMsgWithdraw = (
  txResponseItemTxBodyMessage: NetworkTypes.RestTxBodyMessage,
  txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog,
): Types.FormattedBlockChainTxMessage => {
  // const msgFrom = msg?.value?.reporter || baseTx.eventSender || '';

  const baseTx = formatBaseTx(txResponseItemTxBodyMessage, txResponseItemLogEntry);

  const toAddress = 'n/a';

  const msgFrom = baseTx.eventSender || baseTx.sender || 'n/a';

  return {
    ...baseTx,
    sender: msgFrom,
    to: toAddress,
  };
};
