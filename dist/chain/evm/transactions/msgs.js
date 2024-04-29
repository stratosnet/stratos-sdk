"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvmMsgs = void 0;
const any_1 = require("cosmjs-types/google/protobuf/any");
const types_1 = require("./types");
const getEvmMsgs = (payload) => {
    const data = any_1.Any.fromPartial({
        value: types_1.DynamicFeeTx.encode(payload).finish(),
        typeUrl: types_1.MsgTypes.EvmDynamicFeeTx,
    });
    const value = types_1.MsgEthereumTx.fromJSON({
        data,
        // NOTE: Just keeping for reference, but in actual it does not impact on validation on the server
        // as will be overriden by erecover from tx payload and sigs
        // from: '0x' + toHex(fromBech32(senderAddress).data),
    });
    return [
        {
            typeUrl: types_1.MsgTypes.EvmMsgEthereumTx,
            value,
        },
    ];
};
exports.getEvmMsgs = getEvmMsgs;
//# sourceMappingURL=msgs.js.map