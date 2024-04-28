import * as NetworkTypes from '../../../network/types';
import * as Types from '../types';
import { isUndelegateTxBodyMessage } from '../utils';
import { formatBaseTx } from './formatBaseTx';
import { formatTxSingleAmount } from './formatTxAmounts';

export const formatTxMsgUndelegate = (
  txResponseItemTxBodyMessage: NetworkTypes.RestTxBodyMessage,
  txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog,
): Types.FormattedBlockChainTxMessage => {
  const baseTx = formatBaseTx(txResponseItemTxBodyMessage, txResponseItemLogEntry);

  if (!isUndelegateTxBodyMessage(txResponseItemTxBodyMessage)) {
    return baseTx;
  }

  const { delegator_address, validator_address, amount } = txResponseItemTxBodyMessage;

  const amounts = formatTxSingleAmount(amount);

  return {
    ...baseTx,
    sender: validator_address,
    to: delegator_address,
    amounts,
  };
};
