import { type AvailableBalanceResponse, type AvailableBalanceResponseN, type AvailableBalanceResponseO, type RestPagination } from './networkTypes';
export declare const getNewProtocolFlag: (currentVersion: string, minRequiredNewVersion: string) => boolean;
export declare const isNewBalanceVersion: (response: AvailableBalanceResponse) => response is AvailableBalanceResponseN;
export declare const isOldBalanceVersion: (response: AvailableBalanceResponse) => response is AvailableBalanceResponseO;
export declare const isValidPagination: (pagination: RestPagination | null) => pagination is RestPagination;
