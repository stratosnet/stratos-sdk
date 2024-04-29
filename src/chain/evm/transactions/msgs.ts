import { EncodeObject } from '@cosmjs/proto-signing';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { MsgTypes, DynamicFeeTx, MsgEthereumTx } from './types';

export const getEvmMsgs = (payload: DynamicFeeTx): readonly EncodeObject[] => {
  const data = Any.fromPartial({
    value: DynamicFeeTx.encode(payload).finish(),
    typeUrl: MsgTypes.EvmDynamicFeeTx,
  });
  const value = MsgEthereumTx.fromJSON({
    data,
    // NOTE: Just keeping for reference, but in actual it does not impact on validation on the server
    // as will be overriden by erecover from tx payload and sigs
    // from: '0x' + toHex(fromBech32(senderAddress).data),
  });
  return [
    {
      typeUrl: MsgTypes.EvmMsgEthereumTx,
      value,
    },
  ];
};
