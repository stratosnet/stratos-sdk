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
exports.formatTxdDefault = void 0;
var formatBaseTx_1 = require("./formatBaseTx");
var formatTxdDefault = function (txItem) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var baseTx = (0, formatBaseTx_1.formatBaseTx)(txItem);
    var msg = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.msg[0];
    var from = (_c = msg.value) === null || _c === void 0 ? void 0 : _c.from;
    var fromAddress = (_d = msg.value) === null || _d === void 0 ? void 0 : _d.from_address;
    var senderAddress = (_e = msg.value) === null || _e === void 0 ? void 0 : _e.sender;
    var reporterAddress = (_f = msg.value) === null || _f === void 0 ? void 0 : _f.reporter;
    var delegatorAddress = (_g = msg.value) === null || _g === void 0 ? void 0 : _g.delegator_address;
    var addressAddress = (_h = msg.value) === null || _h === void 0 ? void 0 : _h.address;
    var toAddress = (_j = msg.value) === null || _j === void 0 ? void 0 : _j.to_address;
    var validatorAddress = (_k = msg.value) === null || _k === void 0 ? void 0 : _k.validator_address;
    var msgFrom = from ||
        fromAddress ||
        senderAddress ||
        reporterAddress ||
        delegatorAddress ||
        addressAddress ||
        baseTx.eventSender ||
        baseTx.sender;
    var msgTo = toAddress || validatorAddress || baseTx.to;
    return __assign(__assign({}, baseTx), { sender: msgFrom, to: msgTo });
};
exports.formatTxdDefault = formatTxdDefault;
//# sourceMappingURL=formatTxdDefault.js.map