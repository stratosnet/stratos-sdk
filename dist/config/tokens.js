"use strict";
// 1 STOS = 10^18 wei = 10^9Gwei for new denom of stchain
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardFeeAmount = exports.defaultGasAmount = exports.baseGasAmount = exports.perMsgGasAmount = exports.decimalShortPrecision = exports.minGasPrice = exports.decimalPrecision = void 0;
// WEI and GWEI
exports.decimalPrecision = 18;
// export const minGasPrice = 10_000_000; // wei or 0.01gwei for chain itself
// export const minGasPrice = 100_000_000; // wei or 0.1gwei for chain itself
exports.minGasPrice = 10000000000; // wei or 1gwei for tropos
// ui
exports.decimalShortPrecision = 4;
exports.perMsgGasAmount = 100000;
exports.baseGasAmount = 500000;
exports.defaultGasAmount = exports.baseGasAmount + exports.perMsgGasAmount * 1;
// export const standardFeeAmount = 20_000_000_000_000; // in ustos (wei) // devnet
const standardFeeAmount = (gas = exports.defaultGasAmount) => {
    return exports.minGasPrice * gas;
};
exports.standardFeeAmount = standardFeeAmount;
//# sourceMappingURL=tokens.js.map