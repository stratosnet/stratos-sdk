import BigNumber from 'bignumber.js';
import { tokens } from '../config';

export type BigNumberValue = BigNumber.Value;
export type BigNumberType = BigNumber;

export const ROUND_UP = BigNumber.ROUND_UP;
export const ROUND_DOWN = BigNumber.ROUND_DOWN;

export const toWei = (value: BigNumberValue, precision = tokens.decimalPrecision): BigNumber => {
  return new BigNumber(value).times(10 ** precision);
};

export const fromWei = (value: BigNumberValue, precision = tokens.decimalPrecision): BigNumber => {
  return new BigNumber(value).div(10 ** precision);
};

export const calDecimalPrecision = (val: BigNumberValue, num: number): string => {
  const x = new BigNumber(val);
  const y = new BigNumber(10 ** num);
  const newAmount = x.dividedBy(y).toFormat();
  return newAmount;
};

export const create = (value: BigNumberValue): BigNumber => new BigNumber(value);

export const totalSum = (amounts: BigNumberValue[]): BigNumber => {
  let amount = new BigNumber(0);

  amounts.forEach(currentAmount => {
    amount = new BigNumber(currentAmount).plus(amount);
  });

  return amount;
};

export const plus = (currentValue: BigNumberValue, valueToAdd: BigNumberValue): BigNumberValue =>
  new BigNumber(currentValue).plus(valueToAdd);

export const minus = (currentValue: BigNumberValue, valueToSubstract: BigNumberValue): BigNumberValue =>
  new BigNumber(currentValue).minus(valueToSubstract);
