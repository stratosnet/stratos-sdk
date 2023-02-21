"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardFeeAmount = exports.defaultGasAmount = exports.baseGasAmount = exports.perMsgGasAmount = exports.decimalShortPrecision = exports.gasDelta = exports.minGasPrice = exports.decimalPrecision = void 0;
// eslint-disable-next-line import/no-cycle
const bigNumber_1 = require("../services/bigNumber");
// 1 STOS = 10^18 wei = 10^9Gwei for new denom of stchain
// WEI and GWEI
exports.decimalPrecision = 18;
exports.minGasPrice = (0, bigNumber_1.toWei)('1', 9); // wei or 1gwei for tropos
exports.gasDelta = 10000; // delta for gas addition as non deterministic simulate
// ui
exports.decimalShortPrecision = 4;
exports.perMsgGasAmount = 100000;
exports.baseGasAmount = 500000;
exports.defaultGasAmount = exports.baseGasAmount + exports.perMsgGasAmount * 1;
// NOTE: Candidate on removal
const standardFeeAmount = (gas = exports.defaultGasAmount) => {
    return exports.minGasPrice.multipliedBy(gas).toNumber();
};
exports.standardFeeAmount = standardFeeAmount;
//# sourceMappingURL=tokens.js.map