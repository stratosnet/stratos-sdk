"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxFee = exports.formatTxAmounts = exports.formatTxSingleAmount = exports.formatTxMultipleAmounts = exports.caclulateAmount = exports.emptyAmounts = void 0;
const hdVault_1 = require("../../../../config/hdVault");
const tokens_1 = require("../../../../config/tokens");
const bigNumber_1 = require("../../../../services/bigNumber");
exports.emptyAmounts = [{ amount: '0', denom: 'n/a' }];
const caclulateAmount = (singleAmount) => {
    const balanceInWei = (0, bigNumber_1.create)(singleAmount);
    const txAmount = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(4, bigNumber_1.ROUND_DOWN);
    const currentAmount = `${txAmount} ${hdVault_1.stratosTopDenom.toUpperCase()}`;
    return currentAmount || '0';
};
exports.caclulateAmount = caclulateAmount;
const formatTxMultipleAmounts = (multipleAmounts) => {
    if (!Array.isArray(multipleAmounts)) {
        return exports.emptyAmounts;
    }
    const amounts = multipleAmounts.map((element) => {
        const currentAmount = (0, exports.caclulateAmount)(`${element.amount}`);
        const calculatedAmount = currentAmount || '0';
        return { amount: calculatedAmount.trim(), denom: element.denom };
    });
    return amounts.length ? amounts : exports.emptyAmounts;
};
exports.formatTxMultipleAmounts = formatTxMultipleAmounts;
const formatTxSingleAmount = (singleAmount) => {
    const { amount, denom } = singleAmount;
    const calculatedAmount = (0, exports.caclulateAmount)(`${amount}`);
    return [{ amount: calculatedAmount.trim(), denom }];
};
exports.formatTxSingleAmount = formatTxSingleAmount;
const formatTxAmounts = (txItem) => {
    var _a, _b, _c, _d, _e;
    const msg = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.msg[0];
    const singleAmount = (_d = (_c = msg.value) === null || _c === void 0 ? void 0 : _c.amount) === null || _d === void 0 ? void 0 : _d.amount;
    const multipleAmounts = (_e = msg.value) === null || _e === void 0 ? void 0 : _e.amount;
    if (singleAmount) {
        const currentAmount = (0, exports.caclulateAmount)(`${singleAmount}`);
        return currentAmount || '0';
    }
    if (!Array.isArray(multipleAmounts)) {
        return '0';
    }
    const amounts = multipleAmounts.map(element => {
        const currentAmount = (0, exports.caclulateAmount)(`${element.amount}`);
        return currentAmount || '0';
    });
    const currentAmount = amounts.join(' ').trim();
    return currentAmount || '0';
};
exports.formatTxAmounts = formatTxAmounts;
const formatTxFee = (feeInfo) => {
    const { amount } = feeInfo;
    const multipleFees = amount;
    if (!Array.isArray(multipleFees)) {
        return ['0'];
    }
    const amounts = multipleFees.map(element => {
        const currentAmount = (0, exports.caclulateAmount)(`${element.amount}`);
        return currentAmount || '0';
    });
    return amounts;
};
exports.formatTxFee = formatTxFee;
//# sourceMappingURL=formatTxAmounts.js.map