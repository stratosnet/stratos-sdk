import { encodeAminoPubkey } from '@cosmjs/amino';
import { Bip39, EnglishMnemonic } from '@cosmjs/crypto';
import { Hmac, Secp256k1, Sha512, Slip10Curve } from '@cosmjs/crypto';
import { Bech32, toAscii, toBase64, fromBase64 } from '@cosmjs/encoding';
import * as bech32 from 'bech32';
import BN from 'bn.js';
import sjcl from 'sjcl';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

import { bip39Password } from '../config/hdVault';
import { stratosPubkeyPrefix } from '../config/hdVault';
import { convertArrayToString, MnemonicPhrase } from './mnemonic';
import { bufferToUint8Array, hexStrToUint8Array, uint8ArrayToBuffer, uint8arrayToHexStr } from './utils';

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

export const generateMasterKeySeed = async (phrase: MnemonicPhrase): Promise<Uint8Array> => {
  const stringMnemonic = convertArrayToString(phrase);

  const mnemonicChecked = new EnglishMnemonic(stringMnemonic);

  // console.log('mnemonicChecked', mnemonicChecked);

  const seed = await Bip39.mnemonicToSeed(mnemonicChecked, bip39Password);
  // const seedInHex = uint8arrayToHexStr(seed);

  // console.log('seedInHex!!', seedInHex);

  return seed;

  // return mnemonicToSeedSync(boo, pass);
};

export const getMasterKeySeedPriveKey = (masterKeySeed: Uint8Array): Uint8Array => {
  const masterKeyInfo = getMasterKeyInfo(Slip10Curve.Secp256k1, masterKeySeed);

  const { privkey } = masterKeyInfo;
  // const privateKeyString = uint8arrayToHexStr(privkey);
  // const chainCodeString = uint8arrayToHexStr(chainCode);

  // console.log('master privateKey', privateKeyString);
  // console.log('master chainCodeString', chainCodeString);
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

export const getEncodedPublicKey = async (encodedAminoPub: Uint8Array): Promise<string> => {
  const encodedPubKey = Bech32.encode(stratosPubkeyPrefix, encodedAminoPub);
  console.log('encodedPubKey ', encodedPubKey);

  return encodedPubKey;
};

export const getMasterKeySeedPublicKey = async (masterKeySeed: Uint8Array): Promise<PubKey> => {
  const privkey = getMasterKeySeedPriveKey(masterKeySeed);

  const pubkey = await getPublicKeyFromPrivKey(privkey);

  return pubkey;
  // const publicKey = await getEncodedPublicKey(privkey);
  // const publicKey = uint8arrayToHexStr(nacl.sign.keyPair.fromSeed(privkey).publicKey);

  // const keyPath = "m/44'/606'/0'/0/1";
  // console.log('keyPath!!!', keyPath);

  // const convertedPath = stringToPath(keyPath);

  // const derived = Slip10.derivePath(Slip10Curve.Secp256k1, masterKeySeed, convertedPath);

  // const f = Secp256k1.makeKeypair(derived.privkey).then(data => {
  //   const aa = uint8arrayToHexStr(data.privkey);
  //   console.log('kp pkey in hex', aa);

  //   const compressed = Secp256k1.compressPubkey(data.pubkey);

  //   const manuallyAlteredPub = Uint8Array.from([235, 90, 233, 135, 33]);

  //   const mergedArray = new Uint8Array(manuallyAlteredPub.length + compressed.length);

  //   mergedArray.set(manuallyAlteredPub);
  //   mergedArray.set(compressed, manuallyAlteredPub.length);

  //   const encodedWithManuallyAddedAmino = Bech32.encode('stpub', mergedArray);

  //   console.log('encodedWithManuallyAddedAmino', encodedWithManuallyAddedAmino);

  //   const toHash = '1addwnpepqfsph5qz4p5mgzxuexmsm5pf4he0yrtuqhmymf9mdq3u4us8enggsr86vg3';

  //   const pubkeyData = compressed;
  //   const anAddress = ripemd160(sha256(pubkeyData));

  //   console.log('anAddress!', anAddress);

  //   const alexA = 'st125xdz856vfkzdhwapzzhklz7m6w063cylqjh8w';

  //   const decodedA = Bech32.decode(alexA);
  //   console.log('decoded Alex!', decodedA);

  //   const hexA = uint8arrayToHexStr(decodedA.data);
  //   console.log('hex of uint alex', hexA);
  // });

  // return publicKey;
};

export const encryptMasterKeySeed = (
  password: string,
  masterKeySeed: Uint8Array,
): sjcl.SjclCipherEncrypted => {
  // const strMasterKey = naclUtil.encodeBase64(bufferToUint8Array(masterKeySeed));
  // const strMasterKey = naclUtil.encodeBase64(masterKeySeed);/
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
  let decryptedMasterKeySeed;

  try {
    const decrypteCypherText = sjcl.decrypt(password, encryptedMasterKeySeed);
    // decryptedMasterKeySeed = uint8ArrayToBuffer(naclUtil.decodeBase64(decrypteCypherText));
    // decryptedMasterKeySeed = naclUtil.decodeBase64(decrypteCypherText);
    decryptedMasterKeySeed = fromBase64(decrypteCypherText);
  } catch (err) {
    return Promise.reject(false);
  }

  if (decryptedMasterKeySeed) {
    return decryptedMasterKeySeed;
  }

  return Promise.reject(false);
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

  // const masterKeySeed = bufferToUint8Array(decryptedMasterKeySeed);

  return decryptedMasterKeySeed;
};

export const sign = async (message: string, privateKey: string): Promise<string> => {
  try {
    // const decodedMessage = naclUtil.decodeBase64(message);
    // const decodedPrivateKey = naclUtil.decodeBase64(privateKey);

    const decodedMessage = fromBase64(message);
    const decodedPrivateKey = fromBase64(privateKey);

    const signature = nacl.sign.detached(Uint8Array.from(decodedMessage), decodedPrivateKey);
    // const ecodedSignature = naclUtil.encodeBase64(signature);
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
    const verifyResult = nacl.sign.detached.verify(
      Uint8Array.from(fromBase64(message)),
      fromBase64(signature),
      fromBase64(publicKey),
    );
    // Uint8Array.from(naclUtil.decodeBase64(message)),
    // naclUtil.decodeBase64(signature),
    // naclUtil.decodeBase64(publicKey),
    return verifyResult;
  } catch (err) {
    return Promise.reject(false);
  }
};
