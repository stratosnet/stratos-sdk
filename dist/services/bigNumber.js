"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minus = exports.plus = exports.totalSum = exports.create = exports.calDecimalPrecision = exports.fromWei = exports.toWei = exports.ROUND_DOWN = exports.ROUND_UP = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const config_1 = require("../config");
exports.ROUND_UP = bignumber_js_1.default.ROUND_UP;
exports.ROUND_DOWN = bignumber_js_1.default.ROUND_DOWN;
const toWei = (value, precision = config_1.tokens.decimalPrecision) => {
    return new bignumber_js_1.default(value).times(10 ** precision);
};
exports.toWei = toWei;
const fromWei = (value, precision = config_1.tokens.decimalPrecision) => {
    return new bignumber_js_1.default(value).div(10 ** precision);
};
exports.fromWei = fromWei;
const calDecimalPrecision = (val, num) => {
    const x = new bignumber_js_1.default(val);
    const y = new bignumber_js_1.default(10 ** num);
    const newAmount = x.dividedBy(y).toFixed();
    return newAmount;
};
exports.calDecimalPrecision = calDecimalPrecision;
const create = (value) => new bignumber_js_1.default(value);
exports.create = create;
const totalSum = (amounts) => {
    let amount = new bignumber_js_1.default(0);
    amounts.forEach(currentAmount => {
        amount = new bignumber_js_1.default(currentAmount).plus(amount);
    });
    return amount;
};
exports.totalSum = totalSum;
const plus = (currentValue, valueToAdd) => new bignumber_js_1.default(currentValue).plus(valueToAdd);
exports.plus = plus;
const minus = (currentValue, valueToSubstract) => new bignumber_js_1.default(currentValue).minus(valueToSubstract);
exports.minus = minus;
//# sourceMappingURL=bigNumber.js.map