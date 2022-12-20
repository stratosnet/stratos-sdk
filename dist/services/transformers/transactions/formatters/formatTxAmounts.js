"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxFee = exports.formatTxAmounts = void 0;
const hdVault_1 = require("../../../../config/hdVault");
const tokens_1 = require("../../../../config/tokens");
const bigNumber_1 = require("../../../../services/bigNumber");
const caclulateAmount = (singleAmount) => {
    const balanceInWei = (0, bigNumber_1.create)(singleAmount);
    const txAmount = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(4, bigNumber_1.ROUND_DOWN);
    const currentAmount = `${txAmount} ${hdVault_1.stratosTopDenom.toUpperCase()}`;
    return currentAmount || '0';
};
const formatTxAmounts = (txItem) => {
    var _a, _b, _c, _d, _e;
    const msg = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.msg[0];
    const singleAmount = (_d = (_c = msg.value) === null || _c === void 0 ? void 0 : _c.amount) === null || _d === void 0 ? void 0 : _d.amount;
    const multipleAmounts = (_e = msg.value) === null || _e === void 0 ? void 0 : _e.amount;
    if (singleAmount) {
        const currentAmount = caclulateAmount(`${singleAmount}`);
        return currentAmount || '0';
    }
    if (!Array.isArray(multipleAmounts)) {
        return '0';
    }
    const amounts = multipleAmounts.map(element => {
        const currentAmount = caclulateAmount(`${element.amount}`);
        return currentAmount || '0';
    });
    const currentAmount = amounts.join(' ').trim();
    return currentAmount || '0';
};
exports.formatTxAmounts = formatTxAmounts;
const formatTxFee = (txItem) => {
    var _a, _b;
    const fee = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.fee;
    const multipleFees = fee === null || fee === void 0 ? void 0 : fee.amount;
    if (!Array.isArray(multipleFees)) {
        return '0';
    }
    const amounts = multipleFees.map(element => {
        const currentAmount = caclulateAmount(`${element.amount}`);
        return currentAmount || '0';
    });
    const currentAmount = amounts.join(' ').trim();
    return currentAmount || '0';
};
exports.formatTxFee = formatTxFee;
//# sourceMappingURL=formatTxAmounts.js.map