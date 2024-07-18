import { type KeyPairInfo } from 'crypto/hdVault/hdVaultTypes';
export declare const uint8arrayToBase64Str: (input: Uint8Array) => string;
export declare const getDataKey: (derivedKeyPair: KeyPairInfo) => Promise<string>;
