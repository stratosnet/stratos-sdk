import {
  type AvailableBalanceResponse,
  type AvailableBalanceResponseO,
  type AvailableBalanceResponseN,
} from './network/types';

export const isNewBalanceVersion = (
  response: AvailableBalanceResponse,
): response is AvailableBalanceResponseN => {
  return 'balances' in response;
};

export const isOldBalanceVersion = (
  response: AvailableBalanceResponse,
): response is AvailableBalanceResponseO => {
  return 'result' in response;
};
