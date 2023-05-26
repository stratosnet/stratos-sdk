import { ethers } from 'ethers';
export declare const decimalPrecision = 18;
export declare const minGasPrice: ethers.utils.BigNumber;
export declare const gasAdjustment = 2;
export declare const decimalShortPrecision = 4;
export declare const perMsgGasAmount = 100000;
export declare const baseGasAmount = 500000;
export declare const defaultGasAmount: number;
export declare const standardFeeAmount: (gas?: number) => number;
