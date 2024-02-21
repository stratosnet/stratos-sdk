import {
  type AvailableBalanceResponse,
  type AvailableBalanceResponseO,
  type AvailableBalanceResponseN,
  type RestPagination,
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

export const isValidPagination = (pagination: RestPagination | null): pagination is RestPagination => {
  return !!pagination && 'total' in pagination;
};
