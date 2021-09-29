"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxdDefault = void 0;
var formatTxdDefault = function (msg, sender) {
    var _a, _b, _c, _d;
    var msgSender = (_a = msg === null || msg === void 0 ? void 0 : msg.value) === null || _a === void 0 ? void 0 : _a.sender;
    var msgReporter = (_b = msg === null || msg === void 0 ? void 0 : msg.value) === null || _b === void 0 ? void 0 : _b.reporter;
    var msgDelegatorAddress = (_c = msg === null || msg === void 0 ? void 0 : msg.value) === null || _c === void 0 ? void 0 : _c.delegator_address;
    var msgFrom = (_d = msg === null || msg === void 0 ? void 0 : msg.value) === null || _d === void 0 ? void 0 : _d.from_address;
    var resolvedSender = sender || msgSender || msgReporter || msgDelegatorAddress || msgFrom;
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
exports.formatTxdDefault = formatTxdDefault;
//# sourceMappingURL=formatTxdDefault.js.map