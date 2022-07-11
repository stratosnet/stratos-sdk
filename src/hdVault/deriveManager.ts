import * as CosmosCrypto from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';

import {
  generateMasterKeySeed,
  getAddressFromPubKey,
  getAminoPublicKey,
  getEncodedPublicKey,
  getMasterKeySeedPublicKey,
  getPublicKeyFromPrivKey,
} from './keyUtils';
import { MnemonicPhrase } from './mnemonic';

export interface KeyPair {
  address: string;
  publicKey: Uint8Array;
  encodedPublicKey: string;
  privateKey: string;
}

export type KeyPairCurve = CosmosCrypto.Slip10Curve.Ed25519 | CosmosCrypto.Slip10Curve.Secp256k1;

export const deriveAddressFromPhrase = async (phrase: MnemonicPhrase): Promise<string> => {
  const masterKeySeed = await generateMasterKeySeed(phrase);
  const pubkey = await getMasterKeySeedPublicKey(masterKeySeed);
  return getAddressFromPubKey(pubkey);
};

export const deriveKeyPairFromPrivateKeySeed = async (privkey: Uint8Array): Promise<KeyPair> => {
  const pubkeyMine = await getPublicKeyFromPrivKey(privkey);

  const encodeAminoPub = await getAminoPublicKey(pubkeyMine); // 1 amino dep - amino encodeAminoPubkey

  const address = getAddressFromPubKey(pubkeyMine); // 2 amino dep - amino pubkeyToAddress

  const encodedPublicKey = await getEncodedPublicKey(encodeAminoPub);

  return {
    address,
    publicKey: encodeAminoPub,
    encodedPublicKey,
    privateKey: toHex(privkey),
  };
};

export const getSlip10 = () => {
  return CosmosCrypto.Slip10;
};

export const derivePrivateKeySeed = (
  masterKey: Uint8Array,
  keyPath: string,
  curve: KeyPairCurve = CosmosCrypto.Slip10Curve.Secp256k1,
): Uint8Array => {
  const convertedPath = CosmosCrypto.stringToPath(keyPath);

  const { privkey } = getSlip10().derivePath(curve, masterKey, convertedPath);

  return privkey;
};
