import { HdPath } from '@cosmjs/crypto';
import { PubKey } from '../../chain/cosmos/cosmosTypes';
import { MnemonicPhrase } from './mnemonic';
export declare const generateMasterKeySeed: (phrase: MnemonicPhrase) => Promise<Uint8Array>;
export declare const getAminoPublicKey: (pubkey: PubKey) => Promise<Uint8Array>;
export declare const getAddressFromPubKeyWithKeccak: (pubkey: Uint8Array) => string;
export declare const convertNativeToEvmAddress: (nativeAddress: string) => string;
export declare const convertEvmToNativeToAddress: (evmAddress: string) => string;
export declare const getEncodedPublicKey: (encodedAminoPub: Uint8Array) => Promise<string>;
export declare const unlockMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<boolean>;
export declare const getMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<Uint8Array>;
export type PathBuilder = (account_index: number) => HdPath;
export declare function makePathBuilder(pattern: string): PathBuilder;
export declare const encodeSignatureMessage: (message: string) => Uint8Array;
export declare const signWithPrivateKey: (signMessageString: string, privateKey: string) => Promise<string>;
export declare const verifySignature: (signatureMessage: string, signature: string, publicKey: string) => Promise<boolean>;
