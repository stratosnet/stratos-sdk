import * as transactionsCommon from '../../common/transactions';
import { dirLog } from '../../services/helpers';
import * as Types from './types';

export const getSdsPrepayTx = async (
  senderAddress: string,
  prepayPayload: Types.SdsPrepayTxPayload[],
): Promise<Types.SdsPrepayTxMessage[]> => {
  const payloadToProcess = transactionsCommon.payloadGenerator(prepayPayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.SdsPrepayTxMessage[] = [];

  while (iteratedData.value) {
    const { amount } = iteratedData.value as Types.SdsPrepayTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.SdsPrepay,
      value: {
        sender: senderAddress,
        beneficiary: senderAddress,
        amount: transactionsCommon.getStandardAmount([amount]),
      },
    };

    dirLog('sds prepay message to be signed', message);

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  return messagesList;
};
