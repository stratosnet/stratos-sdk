import { Any } from 'cosmjs-types/google/protobuf/any';
import { ExtensionOptionsEthereumTx, MsgTypes } from './types';

export const evmExtensionOptions = [
  Any.fromPartial({
    value: ExtensionOptionsEthereumTx.encode({}).finish(),
    typeUrl: MsgTypes.EvmExtensionOptionsEthereumTx,
  }),
];
