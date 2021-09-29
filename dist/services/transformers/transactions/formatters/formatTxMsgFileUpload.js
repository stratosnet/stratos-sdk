"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgFileUpload = void 0;
var formatTxMsgFileUpload = function (msg, sender) {
    var _a;
    var msgReporter = (_a = msg === null || msg === void 0 ? void 0 : msg.value) === null || _a === void 0 ? void 0 : _a.reporter;
    var resolvedSender = sender || msgReporter;
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
exports.formatTxMsgFileUpload = formatTxMsgFileUpload;
//# sourceMappingURL=formatTxMsgFileUpload.js.map