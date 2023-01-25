"use strict";
// 1 STOS = 10^18 wei = 10^9Gwei for new denom of stchain
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseGasAmount = exports.perMsgGasAmount = exports.standardFeeAmount = exports.decimalShortPrecision = exports.decimalPrecision = void 0;
// WEI and GWEI
exports.decimalPrecision = 18;
// export const decimalPrecisionShort = 9;
// USTOS
// export const decimalPrecision = 9;
// ui
exports.decimalShortPrecision = 4;
// export const standardFeeAmount = 20_000_000_000_000; // in ustos (wei) // devnet
exports.standardFeeAmount = 20000000000000000; // in ustos (wei) // tropos
exports.perMsgGasAmount = 100000;
exports.baseGasAmount = 500000;
//# sourceMappingURL=tokens.js.map