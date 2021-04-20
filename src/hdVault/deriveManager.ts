import { Slip10, Slip10Curve, stringToPath } from '@cosmjs/crypto';
import * as bech32 from 'bech32';
import sjcl from 'sjcl';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

import { stratosAddressPrefix } from '../config/hdVault';
import { generateMasterKeySeed, getMasterKeySeedPublicKey } from './keyUtils';
import { MnemonicPhrase } from './mnemonic';
import { hexStrToUint8Array, uint8ArrayToBuffer } from './utils';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export type KeyPairCurve = Slip10Curve.Ed25519 | Slip10Curve.Secp256k1;

export const deriveAddress = (publicKey: string): string => {
  const base64PublicKey = sjcl.codec.base64.toBits(publicKey);
  const hash = new sjcl.hash.sha256();
  hash.update(base64PublicKey);
  const hashResult = hash.finalize();
  const hashedData = sjcl.codec.hex.fromBits(hashResult);
  hash.reset();
  const data = hexStrToUint8Array(hashedData.substring(0, 40));
  const address = bech32.encode(stratosAddressPrefix, bech32.toWords(data));

  return address;
};

export const deriveAddressFromPhrase = (phrase: MnemonicPhrase): string => {
  const masterKeySeed = generateMasterKeySeed(phrase);
  return deriveAddress(getMasterKeySeedPublicKey(masterKeySeed));
};

export const deriveKeyPairFromPrivateKeySeed = async (privateKeySeed: Buffer): Promise<KeyPair> => {
  try {
    const result = nacl.sign.keyPair.fromSeed(privateKeySeed);
    const { publicKey, secretKey } = result;

    return {
      publicKey: naclUtil.encodeBase64(publicKey),
      privateKey: naclUtil.encodeBase64(secretKey),
    };
  } catch (e) {
    return Promise.reject(false);
  }
};

export const derivePrivateKeySeed = (
  masterKey: Uint8Array,
  keyPath: string,
  curve: KeyPairCurve = Slip10Curve.Secp256k1,
): Buffer => {
  const convertedPath = stringToPath(keyPath);

  const derived = Slip10.derivePath(curve, masterKey, convertedPath);

  const { privkey } = derived;

  const privateKeySeed = uint8ArrayToBuffer(privkey);

  return privateKeySeed;
};
