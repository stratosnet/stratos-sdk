import { GeneratedType } from '@cosmjs/proto-signing';
import { MsgTypes, MsgEthereumTx, DynamicFeeTx, ExtensionOptionsEthereumTx } from './types';

export const registryTypes: ReadonlyArray<[string, GeneratedType]> = [
  [MsgTypes.EvmMsgEthereumTx, MsgEthereumTx],
  [MsgTypes.EvmDynamicFeeTx, DynamicFeeTx],
  [MsgTypes.EvmExtensionOptionsEthereumTx, ExtensionOptionsEthereumTx],
];
