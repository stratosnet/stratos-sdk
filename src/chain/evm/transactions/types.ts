export enum MsgTypes {
  EvmMsgEthereumTx = '/stratos.evm.v1.MsgEthereumTx',
  EvmDynamicFeeTx = '/stratos.evm.v1.DynamicFeeTx',
  EvmExtensionOptionsEthereumTx = '/stratos.evm.v1.ExtensionOptionsEthereumTx',
}

export enum TxTypes {
  Eip1559 = 2,
}

export const maxGas = 1_000_000_000;

export { MsgEthereumTx, DynamicFeeTx, ExtensionOptionsEthereumTx } from '../proto/stratos/v1/tx';

export { AccessTuple } from '../proto/stratos/v1/evm';
