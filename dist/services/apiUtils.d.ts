import { type AvailableBalanceResponse, type AvailableBalanceResponseO, type AvailableBalanceResponseN, type RestPagination } from './network/types';
export declare const isNewBalanceVersion: (response: AvailableBalanceResponse) => response is AvailableBalanceResponseN;
export declare const isOldBalanceVersion: (response: AvailableBalanceResponse) => response is AvailableBalanceResponseO;
export declare const isValidPagination: (pagination: RestPagination | null) => pagination is RestPagination;
