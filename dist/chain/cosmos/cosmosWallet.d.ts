import { StratosDirectSecp256k1HdWallet } from '../../crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet';
import { PubKey } from './cosmosTypes';
export declare const deserializeEncryptedWallet: (serializedWallet: string, password: string) => Promise<StratosDirectSecp256k1HdWallet>;
export declare const serializeWallet: (wallet: StratosDirectSecp256k1HdWallet, password: string) => Promise<string>;
export declare function createWalletAtPath(hdPathIndex: number, mnemonic: string): Promise<StratosDirectSecp256k1HdWallet>;
export declare const getMasterKeySeedPriveKey: (masterKeySeed: Uint8Array) => Uint8Array;
export declare const getPublicKeyFromPrivKey: (privkey: Uint8Array) => Promise<PubKey>;
export declare const getMasterKeySeedPublicKey: (masterKeySeed: Uint8Array) => Promise<PubKey>;
export declare const getMasterKeySeedPublicKeyWithKeccak: (masterKeySeed: Uint8Array) => Promise<Uint8Array>;
