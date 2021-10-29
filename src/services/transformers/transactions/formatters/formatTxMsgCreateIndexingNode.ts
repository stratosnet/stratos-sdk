import * as Types from '../types';
import { formatBaseTx } from './formatBaseTx';
import * as NetworkTypes from '../../../network/types';

export const formatTxMsgCreateIndexingNode = (
  txItem: NetworkTypes.BlockChainTx,
): Types.FormattedBlockChainTx => {
  const baseTx = formatBaseTx(txItem);

  const msg = txItem.tx?.value?.msg[0];

  const msgFrom = msg?.value?.reporter || baseTx.eventSender || '';

  return {
    ...baseTx,
    sender: msgFrom,
  };
};
