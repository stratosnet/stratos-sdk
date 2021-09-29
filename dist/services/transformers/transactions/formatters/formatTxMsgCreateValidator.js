"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgCreateValidator = void 0;
var formatTxMsgCreateValidator = function (msg, sender) {
    var _a;
    var msgDelegatorAddress = (_a = msg === null || msg === void 0 ? void 0 : msg.value) === null || _a === void 0 ? void 0 : _a.delegator_address;
    var resolvedSender = sender || msgDelegatorAddress;
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
exports.formatTxMsgCreateValidator = formatTxMsgCreateValidator;
//# sourceMappingURL=formatTxMsgCreateValidator.js.map