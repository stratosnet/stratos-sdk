import * as Types from '../types';
import { formatBaseTx } from './formatBaseTx';
import * as NetworkTypes from '../../../network/types';

export const formatTxMsgCreateValidator = (
  txItem: NetworkTypes.BlockChainTx,
): Types.FormattedBlockChainTx => {
  const baseTx = formatBaseTx(txItem);

  const msg = txItem.tx?.value?.msg[0];

  const msgFrom = msg?.value?.delegator_address || baseTx.eventSender || '';
  const msgTo = msg?.value?.validator_address || baseTx.to;

  return {
    ...baseTx,
    sender: msgFrom,
    to: msgTo,
  };
};
