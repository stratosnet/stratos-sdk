import * as NetworkTypes from '../../../network/types';
import * as Types from '../types';
import { formatBaseTx } from './formatBaseTx';

export const formatTxMsgCreateValidator = (
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
  // const msgFrom = msg?.value?.delegator_address || baseTx.eventSender || '';
  // const msgTo = msg?.value?.validator_address || baseTx.to;
  //
  // return {
  //   ...baseTx,
  //   sender: msgFrom,
  //   to: msgTo,
  // };
};
