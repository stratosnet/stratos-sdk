import * as CommonTypes from './types/transactionTypes';
declare global {
    interface Window {
        encoder: any;
    }
    namespace NodeJS {
        interface Global {
            encoder: any;
        }
    }
}
export declare const getStandardAmount: (amounts: number[]) => CommonTypes.AmountType[];
export declare function payloadGenerator<T>(dataList: T[]): Generator<T | undefined, void, unknown>;
