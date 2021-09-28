"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgPrepay = void 0;
var formatTxMsgPrepay = function (msg, sender) {
    var _a;
    var msgSender = (_a = msg === null || msg === void 0 ? void 0 : msg.value) === null || _a === void 0 ? void 0 : _a.sender;
    var resolvedSender = sender || msgSender;
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
exports.formatTxMsgPrepay = formatTxMsgPrepay;
//# sourceMappingURL=formatTxMsgPrepay.js.map