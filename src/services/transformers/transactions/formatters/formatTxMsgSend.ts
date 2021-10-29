import * as Types from '../types';
import * as NetworkTypes from '../../../network/types';
import { formatBaseTx } from './formatBaseTx';

export const formatTxMsgSend = (txItem: NetworkTypes.BlockChainTx): Types.FormattedBlockChainTx => {
  const baseTx = formatBaseTx(txItem);

  const msg = txItem.tx?.value?.msg[0];

  const msgFrom = msg?.value?.from_address || baseTx.eventSender || '';

  return {
    ...baseTx,
    sender: msgFrom,
  };
};
