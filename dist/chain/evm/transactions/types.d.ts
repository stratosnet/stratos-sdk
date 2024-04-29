export declare enum MsgTypes {
    EvmMsgEthereumTx = "/stratos.evm.v1.MsgEthereumTx",
    EvmDynamicFeeTx = "/stratos.evm.v1.DynamicFeeTx",
    EvmExtensionOptionsEthereumTx = "/stratos.evm.v1.ExtensionOptionsEthereumTx"
}
export declare enum TxTypes {
    Eip1559 = 2
}
export declare const maxGas = 1000000000;
export { MsgEthereumTx, DynamicFeeTx, ExtensionOptionsEthereumTx } from '../proto/stratos/v1/tx';
export { AccessTuple } from '../proto/stratos/v1/evm';
