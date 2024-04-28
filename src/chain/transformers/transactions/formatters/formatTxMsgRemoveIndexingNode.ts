import * as NetworkTypes from '../../../../network/networkTypes';
import * as Types from '../types';
import { formatBaseTx } from './formatBaseTx';

export const formatTxMsgRemoveIndexingNode = (
  txResponseItemTxBodyMessage: NetworkTypes.RestTxBodyMessage,
  txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog,
): Types.FormattedBlockChainTxMessage => {
  const baseTx = formatBaseTx(txResponseItemTxBodyMessage, txResponseItemLogEntry);

  const toAddress = 'n/a';

  const msgFrom = baseTx.eventSender || baseTx.sender || 'n/a';

  return {
    ...baseTx,
    sender: msgFrom,
    to: toAddress,
  };
};
