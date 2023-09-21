import { HdPath } from '@cosmjs/crypto';
import sjcl from 'sjcl';
import StratosDirectSecp256k1HdWallet from '../hdVault/StratosDirectSecp256k1HdWallet';
import { PubKey } from './cosmosWallet';
import { MnemonicPhrase } from './mnemonic';
/**
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
export declare function makeStratosHubPath(a: number): HdPath;
export declare const generateMasterKeySeed: (phrase: MnemonicPhrase) => Promise<Uint8Array>;
export declare const getEncryptionKey: (password: string) => Promise<Uint8Array>;
export declare const getAminoPublicKey: (pubkey: PubKey) => Promise<Uint8Array>;
export declare const getAddressFromPubKey: (pubkey: PubKey) => string;
export declare const getAddressFromPubKeyWithKeccak: (pubkey: Uint8Array) => string;
export declare const convertNativeToEvmAddress: (nativeAddress: string) => string;
export declare const convertEvmToNativeToAddress: (evmAddress: string) => string;
export declare const getEncodedPublicKey: (encodedAminoPub: Uint8Array) => Promise<string>;
export declare const encryptMasterKeySeed: (password: string, masterKeySeed: Uint8Array) => sjcl.SjclCipherEncrypted;
export declare const decryptMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<Uint8Array | false>;
export declare const unlockMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<boolean>;
export declare const getMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<Uint8Array>;
export type PathBuilder = (account_index: number) => HdPath;
export declare function makePathBuilder(pattern: string): PathBuilder;
export declare const serializeWallet: (wallet: StratosDirectSecp256k1HdWallet, password: string) => Promise<string>;
export declare function createWalletAtPath(hdPathIndex: number, mnemonic: string): Promise<StratosDirectSecp256k1HdWallet>;
export declare const encodeSignatureMessage: (message: string) => Uint8Array;
export declare const signWithPrivateKey: (signMessageString: string, privateKey: string) => Promise<string>;
export declare const verifySignature: (signatureMessage: string, signature: string, publicKey: string) => Promise<boolean>;
