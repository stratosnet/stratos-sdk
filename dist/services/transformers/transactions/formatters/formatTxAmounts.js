"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxFee = exports.formatTxAmounts = void 0;
var hdVault_1 = require("../../../../config/hdVault");
var tokens_1 = require("../../../../config/tokens");
var bigNumber_1 = require("../../../../services/bigNumber");
var caclulateAmount = function (singleAmount) {
    var balanceInWei = (0, bigNumber_1.create)(singleAmount);
    var txAmount = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(4, bigNumber_1.ROUND_DOWN);
    var currentAmount = txAmount + " " + hdVault_1.stratosTopDenom.toUpperCase();
    return currentAmount || '0';
};
var formatTxAmounts = function (txItem) {
    var _a, _b, _c, _d, _e;
    var msg = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.msg[0];
    var singleAmount = (_d = (_c = msg.value) === null || _c === void 0 ? void 0 : _c.amount) === null || _d === void 0 ? void 0 : _d.amount;
    var multipleAmounts = (_e = msg.value) === null || _e === void 0 ? void 0 : _e.amount;
    if (singleAmount) {
        var currentAmount_1 = caclulateAmount("" + singleAmount);
        return currentAmount_1 || '0';
    }
    if (!Array.isArray(multipleAmounts)) {
        return '0';
    }
    var amounts = multipleAmounts.map(function (element) {
        var currentAmount = caclulateAmount("" + element.amount);
        return currentAmount || '0';
    });
    var currentAmount = amounts.join(' ').trim();
    return currentAmount || '0';
};
exports.formatTxAmounts = formatTxAmounts;
var formatTxFee = function (txItem) {
    var _a, _b;
    var fee = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.fee;
    var multipleFees = fee === null || fee === void 0 ? void 0 : fee.amount;
    if (!Array.isArray(multipleFees)) {
        return '0';
    }
    var amounts = multipleFees.map(function (element) {
        var currentAmount = caclulateAmount("" + element.amount);
        return currentAmount || '0';
    });
    var currentAmount = amounts.join(' ').trim();
    return currentAmount || '0';
};
exports.formatTxFee = formatTxFee;
//# sourceMappingURL=formatTxAmounts.js.map