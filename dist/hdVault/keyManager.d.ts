/// <reference types="sjcl" />
import { MnemonicPhrase } from './mnemonic';
export interface MasterKeyInfo {
    readonly encryptedMasterKeySeed: sjcl.SjclCipherEncrypted;
    readonly masterKeySeedAddress: string;
    readonly masterKeySeedPublicKey: Uint8Array;
    readonly masterKeySeedEncodedPublicKey: string;
}
export declare const createMasterKeySeed: (phrase: MnemonicPhrase, password: string) => Promise<MasterKeyInfo>;
export declare const unlockMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<boolean>;
