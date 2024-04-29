import { type KeyPairInfo } from './hdVaultTypes';
export declare const deriveKeyPair: (keyIndex: number, password: string, encryptedMasterKeySeed: string) => Promise<KeyPairInfo | false>;
export declare const deriveKeyPairFromMnemonic: (givenMnemonic: string, hdPathIndex?: number, password?: string) => Promise<false | KeyPairInfo>;
