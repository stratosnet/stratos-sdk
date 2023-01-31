import sjcl from 'sjcl';
export declare const cosmjsSalt: Uint8Array;
export interface Slip10Result {
    readonly chainCode: Uint8Array;
    readonly privkey: Uint8Array;
}
export interface KeyPair {
    publicKey: string;
    privateKey: string;
}
export interface PubKey {
    type: string;
    value: string;
}
export declare const encryptMasterKeySeed: (password: string, plaintext: Uint8Array) => sjcl.SjclCipherEncrypted;
export declare function encrypt(password: string, plaintext: Uint8Array): sjcl.SjclCipherEncrypted;
export declare function decrypt(password: string, encryptedMasterKeySeed: string): Uint8Array;
export declare const getMasterKeySeedPriveKey: (masterKeySeed: Uint8Array) => Uint8Array;
export declare const getPublicKeyFromPrivKey: (privkey: Uint8Array) => Promise<PubKey>;
export declare const getMasterKeySeedPublicKey: (masterKeySeed: Uint8Array) => Promise<PubKey>;
export declare const getMasterKeySeedPublicKeyWithKeccak: (masterKeySeed: Uint8Array) => Promise<Uint8Array>;
