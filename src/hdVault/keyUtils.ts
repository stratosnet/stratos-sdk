import { encodeAminoPubkey, pubkeyToAddress } from '@cosmjs/amino';
import { Bip39, EnglishMnemonic, Hmac, Secp256k1, Sha512, Slip10Curve } from '@cosmjs/crypto';
import { Bech32, fromBase64, toAscii, toBase64 } from '@cosmjs/encoding';
import BN from 'bn.js';
import sjcl from 'sjcl';
import nacl from 'tweetnacl';

import { bip39Password, stratosAddressPrefix, stratosPubkeyPrefix } from '../config/hdVault';
import { convertArrayToString, MnemonicPhrase } from './mnemonic';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

// @todo - move it
interface Slip10Result {
  readonly chainCode: Uint8Array;
  readonly privkey: Uint8Array;
}

export interface PubKey {
  type: string;
  value: string;
}

// @todo - move it
const isZero = (privkey: Uint8Array): boolean => {
  return privkey.every(byte => byte === 0);
};

// @todo - move it
const n = (curve: Slip10Curve): BN => {
  switch (curve) {
    case Slip10Curve.Secp256k1:
      return new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
    default:
      throw new Error('curve not supported');
  }
};

// @todo - move it
const isGteN = (curve: Slip10Curve, privkey: Uint8Array): boolean => {
  const keyAsNumber = new BN(privkey);
  return keyAsNumber.gte(n(curve));
};

// @todo - move it
const getMasterKeyInfo = (curve: Slip10Curve, seed: Uint8Array): Slip10Result => {
  const i = new Hmac(Sha512, toAscii(curve)).update(seed).digest();
  const il = i.slice(0, 32);
  const ir = i.slice(32, 64);

  if (curve !== Slip10Curve.Ed25519 && (isZero(il) || isGteN(curve, il))) {
    return getMasterKeyInfo(curve, i);
  }

  return {
    chainCode: ir,
    privkey: il,
  };
};

/**
 * @todo add unit test
 */
export const generateMasterKeySeed = async (phrase: MnemonicPhrase): Promise<Uint8Array> => {
  const stringMnemonic = convertArrayToString(phrase);

  const mnemonicChecked = new EnglishMnemonic(stringMnemonic);

  const seed = await Bip39.mnemonicToSeed(mnemonicChecked, bip39Password);

  return seed;
};

/**
 * @todo add unit test
 */
export const getMasterKeySeedPriveKey = (masterKeySeed: Uint8Array): Uint8Array => {
  const masterKeyInfo = getMasterKeyInfo(Slip10Curve.Secp256k1, masterKeySeed);

  const { privkey } = masterKeyInfo;

  return privkey;
};

export const getPublicKeyFromPrivKey = async (privkey: Uint8Array): Promise<PubKey> => {
  const { pubkey } = await Secp256k1.makeKeypair(privkey);

  const compressedPub = Secp256k1.compressPubkey(pubkey);

  const pubkeyMine = {
    type: 'tendermint/PubKeySecp256k1',
    value: toBase64(compressedPub),
  };

  return pubkeyMine;
};

export const getAminoPublicKey = async (pubkey: PubKey): Promise<Uint8Array> => {
  const encodedAminoPub = encodeAminoPubkey(pubkey);

  return encodedAminoPub;
};

export const getAddressFromPubKey = (pubkey: PubKey): string => {
  const address = pubkeyToAddress(pubkey, stratosAddressPrefix);
  return address;
};

export const getEncodedPublicKey = async (encodedAminoPub: Uint8Array): Promise<string> => {
  const encodedPubKey = Bech32.encode(stratosPubkeyPrefix, encodedAminoPub);

  return encodedPubKey;
};

export const getMasterKeySeedPublicKey = async (masterKeySeed: Uint8Array): Promise<PubKey> => {
  const privkey = getMasterKeySeedPriveKey(masterKeySeed);

  const pubkey = await getPublicKeyFromPrivKey(privkey);

  return pubkey;
};

export const encryptMasterKeySeed = (
  password: string,
  masterKeySeed: Uint8Array,
): sjcl.SjclCipherEncrypted => {
  const strMasterKey = toBase64(masterKeySeed);
  const saltBits = sjcl.random.randomWords(4);
  const encryptParams = {
    v: 1,
    iter: 1000,
    ks: 128,
    mode: 'gcm',
    adata: '',
    cipher: 'aes',
    salt: saltBits,
    iv: saltBits,
  };
  return sjcl.encrypt(password, strMasterKey, encryptParams);
};

export const decryptMasterKeySeed = async (
  password: string,
  encryptedMasterKeySeed: string,
): Promise<Uint8Array | false> => {
  try {
    const decrypteCypherText = sjcl.decrypt(password, encryptedMasterKeySeed);
    const decryptedMasterKeySeed = fromBase64(decrypteCypherText);
    return decryptedMasterKeySeed;
  } catch (err) {
    return Promise.reject(false);
  }
};

export const unlockMasterKeySeed = async (
  password: string,
  encryptedMasterKeySeed: string,
): Promise<boolean> => {
  try {
    await decryptMasterKeySeed(password, encryptedMasterKeySeed);
    return true;
  } catch (e) {
    return false;
  }
};

export const getMasterKeySeed = async (
  password: string,
  encryptedMasterKeySeed: string,
): Promise<Uint8Array> => {
  let decryptedMasterKeySeed;

  try {
    decryptedMasterKeySeed = await decryptMasterKeySeed(password, encryptedMasterKeySeed);
  } catch (e) {
    return Promise.reject(false);
  }

  if (!decryptedMasterKeySeed) {
    return Promise.reject(false);
  }

  return decryptedMasterKeySeed;
};

export const sign = async (message: string, privateKey: string): Promise<string> => {
  try {
    const decodedMessage = fromBase64(message);
    const decodedPrivateKey = fromBase64(privateKey);

    const signature = nacl.sign.detached(Uint8Array.from(decodedMessage), decodedPrivateKey);
    const ecodedSignature = toBase64(signature);

    return ecodedSignature;
  } catch (error) {
    return Promise.reject(false);
  }
};

export const verifySignature = async (
  message: string,
  signature: string,
  publicKey: string,
): Promise<boolean> => {
  try {
    const convertedMessage = fromBase64(message);
    const formattedMessage = Uint8Array.from(convertedMessage);

    const convertedSignature = fromBase64(signature);
    const convertedPubKey = fromBase64(publicKey);

    const verifyResult = nacl.sign.detached.verify(formattedMessage, convertedSignature, convertedPubKey);
    return verifyResult;
  } catch (err) {
    return Promise.reject(false);
  }
};
