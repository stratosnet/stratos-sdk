"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minus = exports.plus = exports.totalSum = exports.create = exports.calDecimalPrecision = exports.fromWei = exports.toWei = exports.ROUND_DOWN = exports.ROUND_UP = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var config_1 = require("../config");
exports.ROUND_UP = bignumber_js_1.default.ROUND_UP;
exports.ROUND_DOWN = bignumber_js_1.default.ROUND_DOWN;
var toWei = function (value, precision) {
    if (precision === void 0) { precision = config_1.tokens.decimalPrecision; }
    return new bignumber_js_1.default(value).times(Math.pow(10, precision));
};
exports.toWei = toWei;
var fromWei = function (value, precision) {
    if (precision === void 0) { precision = config_1.tokens.decimalPrecision; }
    return new bignumber_js_1.default(value).div(Math.pow(10, precision));
};
exports.fromWei = fromWei;
var calDecimalPrecision = function (val, num) {
    var x = new bignumber_js_1.default(val);
    var y = new bignumber_js_1.default(Math.pow(10, num));
    var newAmount = x.dividedBy(y).toFormat();
    return newAmount;
};
exports.calDecimalPrecision = calDecimalPrecision;
var create = function (value) { return new bignumber_js_1.default(value); };
exports.create = create;
var totalSum = function (amounts) {
    var amount = new bignumber_js_1.default(0);
    amounts.forEach(function (currentAmount) {
        amount = new bignumber_js_1.default(currentAmount).plus(amount);
    });
    return amount;
};
exports.totalSum = totalSum;
var plus = function (currentValue, valueToAdd) {
    return new bignumber_js_1.default(currentValue).plus(valueToAdd);
};
exports.plus = plus;
var minus = function (currentValue, valueToSubstract) {
    return new bignumber_js_1.default(currentValue).minus(valueToSubstract);
};
exports.minus = minus;
//# sourceMappingURL=bigNumber.js.map