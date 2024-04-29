import { type KeyPair, type KeyPairCurve } from './hdVaultTypes';
import { MnemonicPhrase } from './mnemonic';
export declare const deriveAddressFromPhrase: (phrase: MnemonicPhrase) => Promise<string>;
export declare const deriveKeyPairFromPrivateKeySeed: (privkey: Uint8Array) => Promise<KeyPair>;
export declare const derivePrivateKeySeed: (masterKey: Uint8Array, keyPath: string, curve?: KeyPairCurve) => Uint8Array;
