import {
  Bip39,
  EnglishMnemonic,
  HdPath,
  Hmac,
  ripemd160,
  Secp256k1,
  Secp256k1Signature,
  sha256,
  Sha512,
  Slip10Curve,
  Slip10RawIndex,
  stringToPath,
} from '@cosmjs/crypto';
import { fromBase64, toAscii, toBase64 } from '@cosmjs/encoding';
import BN from 'bn.js';
import sjcl from 'sjcl';

export const cosmjsSalt = toAscii('The CosmJS salt.');

// @todo - move it
export interface Slip10Result {
  readonly chainCode: Uint8Array;
  readonly privkey: Uint8Array;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}
export interface PubKey {
  type: string;
  value: string;
}
// export interface KdfConfiguration {
//   /**
//    * An algorithm identifier, such as "argon2id" or "scrypt".
//    */
//   readonly algorithm: string;
//   /** A map of algorithm-specific parameters */
//   readonly params: Record<string, unknown>;
// }

// @todo merge with keyUtils
export const encryptMasterKeySeed = (password: string, plaintext: Uint8Array): sjcl.SjclCipherEncrypted => {
  const strMasterKey = toBase64(plaintext);
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

export function encrypt(password: string, plaintext: Uint8Array): sjcl.SjclCipherEncrypted {
  const encripted = encryptMasterKeySeed(password, plaintext);
  return encripted;
}

export function decrypt(password: string, encryptedMasterKeySeed: string): Uint8Array {
  const decrypteCypherText = sjcl.decrypt(password, encryptedMasterKeySeed);
  const decryptedMasterKeySeed = fromBase64(decrypteCypherText); // switch (config.algorithm) {
  return decryptedMasterKeySeed;
}
// @todo - move it - used in getMasterKeyInfo
const isZero = (privkey: Uint8Array): boolean => {
  return privkey.every(byte => byte === 0);
};

// @todo - move it =  used in isGteN
const n = (curve: Slip10Curve): BN => {
  switch (curve) {
    case Slip10Curve.Secp256k1:
      return new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
    default:
      throw new Error('curve not supported');
  }
};

// @todo - move it - used in getMasterKeyInfo
const isGteN = (curve: Slip10Curve, privkey: Uint8Array): boolean => {
  const keyAsNumber = new BN(privkey);
  return keyAsNumber.gte(n(curve));
};

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

export const getMasterKeySeedPriveKey = (masterKeySeed: Uint8Array): Uint8Array => {
  const masterKeyInfo = getMasterKeyInfo(Slip10Curve.Secp256k1, masterKeySeed);

  const { privkey } = masterKeyInfo;

  return privkey;
};

export const getPublicKeyFromPrivKey = async (privkey: Uint8Array): Promise<PubKey> => {
  const { pubkey } = await Secp256k1.makeKeypair(privkey);

  // const pubkeyHex = Buffer.from(pubkey).toString('hex');

  // console.log('get pub full pubkey ', pubkey);
  // console.log('get pub pubkeyHex ', pubkeyHex);

  const compressedPub = Secp256k1.compressPubkey(pubkey);
  // const compressedPubHex = Buffer.from(compressedPub).toString('hex');

  // console.log('get pub compressedPub ', compressedPub);
  // console.log('get pub compressedPub compressedPubHex ', compressedPubHex);

  const pubkeyMine = {
    // type: 'tendermint/PubKeySecp256k1',
    type: 'stratos/PubKeyEthSecp256k1',
    value: toBase64(compressedPub),
  };

  console.log('get full pub pubkeyMine', pubkeyMine);

  return pubkeyMine;
};

export const getMasterKeySeedPublicKey = async (masterKeySeed: Uint8Array): Promise<PubKey> => {
  const privkey = getMasterKeySeedPriveKey(masterKeySeed);

  const pubkey = await getPublicKeyFromPrivKey(privkey);

  return pubkey;
};

export const getMasterKeySeedPublicKeyWithKeccak = async (masterKeySeed: Uint8Array): Promise<Uint8Array> => {
  const privkey = getMasterKeySeedPriveKey(masterKeySeed);

  const { pubkey } = await Secp256k1.makeKeypair(privkey);

  // console.log(' get m pub full pub ', pubkey);
  return pubkey;
};
