"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evmExtensionOptions = void 0;
const any_1 = require("cosmjs-types/google/protobuf/any");
const types_1 = require("./types");
exports.evmExtensionOptions = [
    any_1.Any.fromPartial({
        value: types_1.ExtensionOptionsEthereumTx.encode({}).finish(),
        typeUrl: types_1.MsgTypes.EvmExtensionOptionsEthereumTx,
    }),
];
//# sourceMappingURL=extensions.js.map