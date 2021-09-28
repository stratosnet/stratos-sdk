"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgSend = void 0;
// @todo remove return null and add proper error catch
var formatTxMsgSend = function (msg, sender) {
    var _a, _b, _c;
    var msgFrom = (_a = msg === null || msg === void 0 ? void 0 : msg.value) === null || _a === void 0 ? void 0 : _a.from_address;
    var msgTo = (_b = msg === null || msg === void 0 ? void 0 : msg.value) === null || _b === void 0 ? void 0 : _b.to_address;
    var msgAmount = (_c = msg === null || msg === void 0 ? void 0 : msg.value) === null || _c === void 0 ? void 0 : _c.amount;
    var resolvedSender = sender || msgFrom;
    if (!resolvedSender) {
        // throw new Error('Sender was not found') since Send must have a sender
        return null;
    }
    if (!msgTo) {
        // throw new Error('Addressat was not found') since Send must have a receiver
        return null;
    }
    if (!Array.isArray(msgAmount)) {
        // throw new Error since Send tx must an array of amounts
        return null;
    }
    var amounts = msgAmount.map(function (element) { return ({
        amount: element.amount,
        denom: element.denom,
    }); });
    return {
        sender: resolvedSender,
        nonce: null,
        data: {
            to: msgTo,
            amount: amounts,
        },
    };
};
exports.formatTxMsgSend = formatTxMsgSend;
//# sourceMappingURL=formatTxMsgSend.js.map