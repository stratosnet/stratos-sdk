// eslint-disable-next-line import/no-cycle
import { toWei } from '../services/bigNumber';

// 1 STOS = 10^18 wei = 10^9Gwei for new denom of stchain

// WEI and GWEI
export const decimalPrecision = 18;

export const minGasPrice = toWei('1', 9); // wei or 1gwei for tropos

export const gasDelta = 10_000; // delta for gas addition as non deterministic simulate

// ui
export const decimalShortPrecision = 4;

export const perMsgGasAmount = 100_000;
export const baseGasAmount = 500_000;
export const defaultGasAmount = baseGasAmount + perMsgGasAmount * 1;

// NOTE: Candidate on removal
export const standardFeeAmount = (gas = defaultGasAmount): number => {
  return minGasPrice.multipliedBy(gas).toNumber();
};
