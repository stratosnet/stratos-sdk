"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgDelegate = void 0;
var formatTxMsgDelegate = function (msg, sender) {
    var _a;
    var msgDelegatorAdress = (_a = msg === null || msg === void 0 ? void 0 : msg.value) === null || _a === void 0 ? void 0 : _a.delegator_address;
    var resolvedSender = sender || msgDelegatorAdress;
    if (!resolvedSender) {
        // throw new Error('Sender was not found') since tx must have a sender
        return null;
    }
    return {
        sender: resolvedSender,
        nonce: null,
        data: (msg === null || msg === void 0 ? void 0 : msg.value) || null,
        msg: msg,
    };
};
exports.formatTxMsgDelegate = formatTxMsgDelegate;
//# sourceMappingURL=formatTxMsgDelegate.js.map