"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgFoundationDeposit = void 0;
var formatBaseTx_1 = require("./formatBaseTx");
var formatTxMsgFoundationDeposit = function (txItem) {
    var _a, _b, _c;
    var baseTx = (0, formatBaseTx_1.formatBaseTx)(txItem);
    var msg = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.msg[0];
    var msgFrom = ((_c = msg === null || msg === void 0 ? void 0 : msg.value) === null || _c === void 0 ? void 0 : _c.from) || baseTx.eventSender || '';
    return __assign(__assign({}, baseTx), { sender: msgFrom });
};
exports.formatTxMsgFoundationDeposit = formatTxMsgFoundationDeposit;
//# sourceMappingURL=formatTxMsgFoundationDeposit.js.map