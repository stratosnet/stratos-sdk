import * as Types from '../types';

// @todo remove return null and add proper error catch
export const formatTxMsgSend = (msg: Types.TxMessage | null, sender?: string): Types.ReturnT | null => {
  const msgFrom = msg?.value?.from_address;
  const msgTo = msg?.value?.to_address;
  const msgAmount = msg?.value?.amount;

  const resolvedSender = sender || msgFrom;

  if (!resolvedSender) {
    // throw new Error('Sender was not found') since Send must have a sender
    return null;
  }

  if (!msgTo) {
    // throw new Error('Addressat was not found') since Send must have a receiver
    return null;
  }

  if (!Array.isArray(msgAmount)) {
    // throw new Error since Send tx must an array of amounts
    return null;
  }

  const amounts = msgAmount.map(element => ({
    amount: element.amount,
    denom: element.denom,
  }));

  return {
    sender: resolvedSender,
    nonce: null,
    data: {
      to: msgTo,
      amount: amounts,
    },
  };
};
