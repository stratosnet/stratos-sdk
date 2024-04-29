import * as NetworkTypes from '../../../../network/networkTypes';
import * as Types from '../types';
import { isDelegateTxBodyMessage } from '../utils';
import { formatBaseTx } from './formatBaseTx';
import { formatTxSingleAmount } from './formatTxAmounts';

export const formatTxMsgDelegate = (
  txResponseItemTxBodyMessage: NetworkTypes.RestTxBodyMessage,
  txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog,
): Types.FormattedBlockChainTxMessage => {
  const baseTx = formatBaseTx(txResponseItemTxBodyMessage, txResponseItemLogEntry);

  if (!isDelegateTxBodyMessage(txResponseItemTxBodyMessage)) {
    return baseTx;
  }

  const { delegator_address, validator_address, amount } = txResponseItemTxBodyMessage;

  const amounts = formatTxSingleAmount(amount);

  return {
    ...baseTx,
    sender: delegator_address,
    to: validator_address,
    amounts,
  };
};
