import { HdPath } from '@cosmjs/crypto';
import { DirectSecp256k1HdWallet, OfflineSigner } from '@cosmjs/proto-signing';
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
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
export declare function makeStratosHubPath(a: number): HdPath;
export declare const generateMasterKeySeed: (phrase: MnemonicPhrase) => Promise<Uint8Array>;
export declare const getMasterKeySeedPriveKey: (masterKeySeed: Uint8Array) => Uint8Array;
export declare const getPublicKeyFromPrivKey: (privkey: Uint8Array) => Promise<PubKey>;
export declare const getEncryptionKey: (password: string) => Promise<Uint8Array>;
export declare const getAminoPublicKey: (pubkey: PubKey) => Promise<Uint8Array>;
export declare const getAddressFromPubKey: (pubkey: PubKey) => string;
export declare const getEncodedPublicKey: (encodedAminoPub: Uint8Array) => Promise<string>;
export declare const getMasterKeySeedPublicKey: (masterKeySeed: Uint8Array) => Promise<PubKey>;
export declare const encryptMasterKeySeed: (password: string, masterKeySeed: Uint8Array) => sjcl.SjclCipherEncrypted;
export declare const decryptMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<Uint8Array | false>;
export declare const unlockMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<boolean>;
export declare const getMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<Uint8Array>;
export declare type PathBuilder = (account_index: number) => HdPath;
export declare function makePathBuilder(pattern: string): PathBuilder;
export declare const serializeWallet: (wallet: DirectSecp256k1HdWallet, password: string) => Promise<string>;
export declare function createWalletAtPath(hdPathIndex: number, mnemonic: string): Promise<DirectSecp256k1HdWallet>;
export declare function createWallets(mnemonic: string, pathBuilder: PathBuilder, addressPrefix: string, numberOfDistributors: number): Promise<ReadonlyArray<readonly [string, OfflineSigner]>>;
export declare function generateWallets(quantity: number, mnemonic: string): Promise<ReadonlyArray<readonly [string, OfflineSigner]>>;
export declare const encodeSignatureMessage: (message: string) => Uint8Array;
export declare const signWithPrivateKey: (signMessageString: string, privateKey: string) => Promise<string>;
export declare const verifySignature: (signatureMessage: string, signature: string, publicKey: string) => Promise<boolean>;
