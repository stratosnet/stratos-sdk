import sjcl from 'sjcl';
import { MnemonicPhrase } from './mnemonic';
export interface KeyPair {
    publicKey: string;
    privateKey: string;
}
export interface PubKey {
    type: string;
    value: string;
}
/**
 * @todo add unit test
 */
export declare const generateMasterKeySeed: (phrase: MnemonicPhrase) => Promise<Uint8Array>;
/**
 * @todo add unit test
 */
export declare const getMasterKeySeedPriveKey: (masterKeySeed: Uint8Array) => Uint8Array;
export declare const getPublicKeyFromPrivKey: (privkey: Uint8Array) => Promise<PubKey>;
export declare const getAminoPublicKey: (pubkey: PubKey) => Promise<Uint8Array>;
export declare const getAddressFromPubKey: (pubkey: PubKey) => string;
export declare const getEncodedPublicKey: (encodedAminoPub: Uint8Array) => Promise<string>;
export declare const getMasterKeySeedPublicKey: (masterKeySeed: Uint8Array) => Promise<PubKey>;
export declare const encryptMasterKeySeed: (password: string, masterKeySeed: Uint8Array) => sjcl.SjclCipherEncrypted;
export declare const decryptMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<Uint8Array | false>;
export declare const unlockMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<boolean>;
export declare const getMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<Uint8Array>;
export declare const sign: (message: string, privateKey: string) => Promise<string>;
export declare const verifySignature: (message: string, signature: string, publicKey: string) => Promise<boolean>;
