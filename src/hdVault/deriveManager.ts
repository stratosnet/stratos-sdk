import { Slip10, Slip10Curve, stringToPath } from '@cosmjs/crypto';
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

export type KeyPairCurve = Slip10Curve.Ed25519 | Slip10Curve.Secp256k1;

export const deriveAddressFromPhrase = async (phrase: MnemonicPhrase): Promise<string> => {
  const masterKeySeed = await generateMasterKeySeed(phrase);
  const pubkey = await getMasterKeySeedPublicKey(masterKeySeed);
  return getAddressFromPubKey(pubkey);
};

export const deriveKeyPairFromPrivateKeySeed = async (privkey: Uint8Array): Promise<KeyPair> => {
  const pubkeyMine = await getPublicKeyFromPrivKey(privkey);

  const encodeAminoPub = await getAminoPublicKey(pubkeyMine);

  const encodedPublicKey = await getEncodedPublicKey(encodeAminoPub);

  const address = getAddressFromPubKey(pubkeyMine);

  return {
    address,
    publicKey: encodeAminoPub,
    encodedPublicKey,
    privateKey: toHex(privkey),
  };
};

export const derivePrivateKeySeed = (
  masterKey: Uint8Array,
  keyPath: string,
  curve: KeyPairCurve = Slip10Curve.Secp256k1,
): Uint8Array => {
  const convertedPath = stringToPath(keyPath);

  const { privkey } = Slip10.derivePath(curve, masterKey, convertedPath);

  return privkey;
};
