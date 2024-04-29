import * as CosmosCrypto from '@cosmjs/crypto';

export interface KeyPairInfo {
  keyIndex: number;
  address: string;
  publicKey: string;
  privateKey: string;
}

export interface KeyPair {
  address: string;
  publicKey: Uint8Array;
  encodedPublicKey: string;
  privateKey: string;
}

export type KeyPairCurve = CosmosCrypto.Slip10Curve.Ed25519 | CosmosCrypto.Slip10Curve.Secp256k1;

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
