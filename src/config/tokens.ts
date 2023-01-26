// 1 STOS = 10^18 wei = 10^9Gwei for new denom of stchain

// WEI and GWEI
export const decimalPrecision = 18;

// export const minGasPrice = 10_000_000; // wei or 0.01gwei for chain itself
export const minGasPrice = 10_000_000_000; // wei or 1gwei for tropos

// ui
export const decimalShortPrecision = 4;

export const perMsgGasAmount = 100_000;
export const baseGasAmount = 500_000;
export const defaultGasAmount = baseGasAmount + perMsgGasAmount * 1;

export const standardFeeAmount = (gas = defaultGasAmount): number => {
  return minGasPrice * gas;
};
