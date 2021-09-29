import * as CosmosCrypto from '@cosmjs/crypto';
import { MnemonicPhrase } from './mnemonic';
export interface KeyPair {
    address: string;
    publicKey: Uint8Array;
    encodedPublicKey: string;
    privateKey: string;
}
export declare type KeyPairCurve = CosmosCrypto.Slip10Curve.Ed25519 | CosmosCrypto.Slip10Curve.Secp256k1;
export declare const deriveAddressFromPhrase: (phrase: MnemonicPhrase) => Promise<string>;
export declare const deriveKeyPairFromPrivateKeySeed: (privkey: Uint8Array) => Promise<KeyPair>;
export declare const getSlip10: () => typeof CosmosCrypto.Slip10;
export declare const derivePrivateKeySeed: (masterKey: Uint8Array, keyPath: string, curve?: KeyPairCurve) => Uint8Array;
