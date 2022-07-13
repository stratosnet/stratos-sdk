/// <reference types="sjcl" />
import { MnemonicPhrase } from './mnemonic';
export interface LegacyMasterKeyInfo {
    readonly encryptedMasterKeySeed: sjcl.SjclCipherEncrypted;
    readonly masterKeySeedAddress: string;
    readonly masterKeySeedPublicKey: Uint8Array;
    readonly masterKeySeedEncodedPublicKey: string;
}
export interface MasterKeyInfo extends LegacyMasterKeyInfo {
    readonly encryptedMasterKeySeed: sjcl.SjclCipherEncrypted;
    readonly masterKeySeedAddress: string;
    readonly masterKeySeedPublicKey: Uint8Array;
    readonly masterKeySeedEncodedPublicKey: string;
    readonly encryptedWalletInfo: string;
}
export declare const createMasterKeySeed: (phrase: MnemonicPhrase, password: string, hdPathIndex?: number) => Promise<MasterKeyInfo>;
export declare const createMasterKeySeedFromGivenSeed: (derivedMasterKeySeed: Uint8Array, password: string) => Promise<LegacyMasterKeyInfo>;
export declare const unlockMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<boolean>;
export declare const getSerializedWalletFromPhrase: (userMnemonic: string, password: string, hdPathIndex?: number) => Promise<string>;
