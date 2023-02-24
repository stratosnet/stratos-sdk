import { ethers } from 'ethers';

// 1 STOS = 10^18 wei = 10^9Gwei for new denom of stchain

// WEI and GWEI
export const decimalPrecision = 18;

export const minGasPrice = ethers.utils.parseUnits('1', 9); // wei or 1gwei for tropos

export const gasAdjustment = 1.4; // adjustment for gas mult as non deterministic simulate

// ui
export const decimalShortPrecision = 4;

export const perMsgGasAmount = 100_000;
export const baseGasAmount = 500_000;
export const defaultGasAmount = baseGasAmount + perMsgGasAmount * 1;

export const standardFeeAmount = (gas = defaultGasAmount): number => {
  return minGasPrice.mul(gas).toNumber();
};
