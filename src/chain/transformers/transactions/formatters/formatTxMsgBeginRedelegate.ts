import * as NetworkTypes from '../../../../network/networkTypes';
import * as Types from '../types';
import { isBeginRedelegateTxBodyMessage } from '../utils';
import { formatBaseTx } from './formatBaseTx';
import { formatTxSingleAmount } from './formatTxAmounts';

export const formatTxMsgBeginRedelegate = (
  txResponseItemTxBodyMessage: NetworkTypes.RestTxBodyMessage,
  txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog,
): Types.FormattedBlockChainTxMessage => {
  const baseTx = formatBaseTx(txResponseItemTxBodyMessage, txResponseItemLogEntry);

  if (!isBeginRedelegateTxBodyMessage(txResponseItemTxBodyMessage)) {
    return baseTx;
  }

  const { delegator_address, validator_src_address, validator_dst_address, amount } =
    txResponseItemTxBodyMessage;

  const amounts = formatTxSingleAmount(amount);

  return {
    ...baseTx,
    sender: delegator_address,
    to: validator_dst_address,
    from: validator_src_address,
    amounts,
  };
};
