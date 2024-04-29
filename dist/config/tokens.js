"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardFeeAmount = exports.defaultGasAmount = exports.baseGasAmount = exports.perMsgGasAmount = exports.decimalShortPrecision = exports.gasAdjustment = exports.minGasPrice = exports.decimalPrecision = void 0;
const ethers_1 = require("ethers");
// 1 STOS = 10^18 wei = 10^9Gwei for new denom of stchain
exports.decimalPrecision = 18;
exports.minGasPrice = ethers_1.ethers.utils.parseUnits('1', 9);
exports.gasAdjustment = 2; // adjustment for gas mult as non deterministic simulate
exports.decimalShortPrecision = 4;
exports.perMsgGasAmount = 100000;
exports.baseGasAmount = 500000;
exports.defaultGasAmount = exports.baseGasAmount + exports.perMsgGasAmount * 1;
const standardFeeAmount = (gas = exports.defaultGasAmount) => {
    return exports.minGasPrice.mul(gas).toNumber();
};
exports.standardFeeAmount = standardFeeAmount;
//# sourceMappingURL=tokens.js.map