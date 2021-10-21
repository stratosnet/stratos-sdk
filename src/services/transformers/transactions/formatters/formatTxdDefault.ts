import * as Types from '../types';
import * as NetworkTypes from '../../../network/types';

import { formatBaseTx } from './formatBaseTx';

export const formatTxdDefault = (txItem: NetworkTypes.BlockChainTx): Types.FormattedBlockChainTx => {
  const baseTx = formatBaseTx(txItem);

  const msg = txItem.tx?.value?.msg[0];

  const from = msg.value?.from;
  const fromAddress = msg.value?.from_address;
  const senderAddress = msg.value?.sender;
  const reporterAddress = msg.value?.reporter;
  const delegatorAddress = msg.value?.delegator_address;
  const addressAddress = msg.value?.address;
  const toAddress = msg.value?.to_address;
  const validatorAddress = msg.value?.validator_address;

  const msgFrom =
    from ||
    fromAddress ||
    senderAddress ||
    reporterAddress ||
    delegatorAddress ||
    addressAddress ||
    baseTx.eventSender ||
    baseTx.sender;

  const msgTo = toAddress || validatorAddress || baseTx.to;

  return {
    ...baseTx,
    sender: msgFrom,
    to: msgTo,
  };
};
