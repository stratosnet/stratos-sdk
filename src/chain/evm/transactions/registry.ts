import { GeneratedType } from '@cosmjs/proto-signing';
import { DynamicFeeTx, ExtensionOptionsEthereumTx, MsgEthereumTx, MsgTypes } from './types';

export const registryTypes: ReadonlyArray<[string, GeneratedType]> = [
  [MsgTypes.EvmMsgEthereumTx, MsgEthereumTx],
  [MsgTypes.EvmDynamicFeeTx, DynamicFeeTx],
  [MsgTypes.EvmExtensionOptionsEthereumTx, ExtensionOptionsEthereumTx],
];
