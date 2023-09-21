"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTuple = exports.ExtensionOptionsEthereumTx = exports.DynamicFeeTx = exports.MsgEthereumTx = exports.maxGas = exports.TxTypes = exports.MsgTypes = void 0;
var MsgTypes;
(function (MsgTypes) {
    MsgTypes["EvmMsgEthereumTx"] = "/stratos.evm.v1.MsgEthereumTx";
    MsgTypes["EvmDynamicFeeTx"] = "/stratos.evm.v1.DynamicFeeTx";
    MsgTypes["EvmExtensionOptionsEthereumTx"] = "/stratos.evm.v1.ExtensionOptionsEthereumTx";
})(MsgTypes = exports.MsgTypes || (exports.MsgTypes = {}));
var TxTypes;
(function (TxTypes) {
    TxTypes[TxTypes["Eip1559"] = 2] = "Eip1559";
})(TxTypes = exports.TxTypes || (exports.TxTypes = {}));
exports.maxGas = 1000000000;
var tx_1 = require("../../proto/stratos/evm/v1/tx");
Object.defineProperty(exports, "MsgEthereumTx", { enumerable: true, get: function () { return tx_1.MsgEthereumTx; } });
Object.defineProperty(exports, "DynamicFeeTx", { enumerable: true, get: function () { return tx_1.DynamicFeeTx; } });
Object.defineProperty(exports, "ExtensionOptionsEthereumTx", { enumerable: true, get: function () { return tx_1.ExtensionOptionsEthereumTx; } });
var evm_1 = require("../../proto/stratos/evm/v1/evm");
Object.defineProperty(exports, "AccessTuple", { enumerable: true, get: function () { return evm_1.AccessTuple; } });
//# sourceMappingURL=types.js.map