import * as Types from '../types';

export const formatTxMsgDelegate = (msg: Types.TxMessage, sender?: string): Types.ReturnT | null => {
  const msgDelegatorAdress = msg?.value?.delegator_address;
  const resolvedSender = sender || msgDelegatorAdress;

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
