"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgVolumeReport = void 0;
var formatTxMsgVolumeReport = function (msg, sender) {
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
exports.formatTxMsgVolumeReport = formatTxMsgVolumeReport;
//# sourceMappingURL=formatTxMsgVolumeReport.js.map