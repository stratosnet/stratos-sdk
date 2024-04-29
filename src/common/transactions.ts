import { stratosDenom } from '../config/hdVault';
import { decimalPrecision } from '../config/tokens';
import { toWei } from '../services/bigNumber';
import * as CommonTypes from './types/transactionTypes';

declare global {
  interface Window {
    encoder: any;
  }
  /* eslint-disable-next-line @typescript-eslint/no-namespace */
  namespace NodeJS {
    interface Global {
      encoder: any;
    }
  }
}

export const getStandardAmount = (amounts: number[]): CommonTypes.AmountType[] => {
  const result = amounts.map(amount => ({
    amount: toWei(amount, decimalPrecision).toFixed(),
    denom: stratosDenom,
  }));

  return result;
};

export function* payloadGenerator<T>(dataList: T[]) {
  while (dataList.length) {
    yield dataList.shift();
  }
}
