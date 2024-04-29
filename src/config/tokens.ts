import { ethers } from 'ethers';

// 1 STOS = 10^18 wei = 10^9Gwei for new denom of stchain

export const decimalPrecision = 18;

export const minGasPrice = ethers.utils.parseUnits('1', 9);

export const gasAdjustment = 2; // adjustment for gas mult as non deterministic simulate

export const decimalShortPrecision = 4;

export const perMsgGasAmount = 100_000;
export const baseGasAmount = 500_000;
export const defaultGasAmount = baseGasAmount + perMsgGasAmount * 1;

export const standardFeeAmount = (gas = defaultGasAmount): number => {
  return minGasPrice.mul(gas).toNumber();
};
