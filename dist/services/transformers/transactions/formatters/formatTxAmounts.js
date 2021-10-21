"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxAmounts = void 0;
var bigNumber_1 = require("../../../../services/bigNumber");
var tokens_1 = require("../../../../config/tokens");
var hdVault_1 = require("../../../../config/hdVault");
var caclulateAmount = function (singleAmount) {
    var balanceInWei = (0, bigNumber_1.create)(singleAmount);
    var txAmount = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(4, bigNumber_1.ROUND_DOWN);
    var currentAmount = txAmount + " " + hdVault_1.stratosTopDenom.toUpperCase();
    return currentAmount || '0';
};
var caclulateEventAmount = function (txItem) {
    var _a, _b;
    var attributes = (_b = (_a = txItem === null || txItem === void 0 ? void 0 : txItem.logs[0]) === null || _a === void 0 ? void 0 : _a.events[0]) === null || _b === void 0 ? void 0 : _b.attributes;
    // console.log(
    //   '🚀 ~ file: formatTxAmounts.ts ~ line 17 ~ caclulateEventAmount ~ events',
    //   JSON.stringify(txItem?.logs[0]?.events, null, 2),
    // );
    var eventAmount = '';
    if (Array.isArray(attributes)) {
        attributes.forEach(function (element) {
            if (!eventAmount && element.key === 'amount') {
                eventAmount = element.value;
            }
        });
    }
    if (!eventAmount) {
        return '0';
    }
    var currentAmount = caclulateAmount(eventAmount);
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
//# sourceMappingURL=formatTxAmounts.js.map