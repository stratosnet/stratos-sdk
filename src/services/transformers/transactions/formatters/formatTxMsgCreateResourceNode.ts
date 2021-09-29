import * as Types from '../types';

export const formatTxMsgCreateResourceNode = (
  msg: Types.TxMessage,
  sender?: string,
): Types.ReturnT | null => {
  const msgReporter = msg?.value?.reporter;
  const resolvedSender = sender || msgReporter;

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
