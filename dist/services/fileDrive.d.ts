import { type KeyPairInfo } from 'crypto/hdVault/hdVaultTypes';
export declare const verifyDataSignature: (derivedKeyPair: KeyPairInfo, data: string, dataSignature: string) => Promise<boolean>;
export declare const getSignedData: (derivedKeyPair: KeyPairInfo, data: string) => Promise<string>;
export declare const decryptDataItem: (encryptedEncodedData: string, password: string) => Promise<unknown>;
export declare const getEncodingPassword: (derivedKeyPair: KeyPairInfo) => string;
export declare const getDataItemKey: (derivedKeyPair: KeyPairInfo) => Promise<string>;
export declare const encryptGivedDataItem: <T>(sampleData: T, password: string) => string;
export declare const getSignedDataItemKey: (derivedKeyPair: KeyPairInfo) => Promise<string>;
export declare const buildEncryptedDataEntity: <T>(sampleData: T, derivedKeyPair: KeyPairInfo) => Promise<{
    key: string;
    data: string;
    dataSig: string;
}>;
export declare const sendDataToRedis: <T>(derivedKeyPair: KeyPairInfo, sampleData: T) => Promise<string | undefined>;
export declare const getDataFromRedis: (derivedKeyPair: KeyPairInfo) => Promise<unknown>;
