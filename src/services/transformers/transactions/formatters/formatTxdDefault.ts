import * as Types from '../types';

export const formatTxdDefault = (msg: Types.TxMessage, sender?: string): Types.ReturnT | null => {
  const msgSender = msg?.value?.sender;
  const msgReporter = msg?.value?.reporter;
  const msgDelegatorAddress = msg?.value?.delegator_address;
  const msgFrom = msg?.value?.from_address;

  const resolvedSender = sender || msgSender || msgReporter || msgDelegatorAddress || msgFrom;

  if (!resolvedSender) {
    // throw new Error('Sender was not found') since tx must have a sender
    return null;
  }

  return {
    sender: resolvedSender,
    nonce: null,
    data: msg?.value || null,
    msg: msg,
  };
};
