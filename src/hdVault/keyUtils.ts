import { HdPath, Slip10RawIndex, stringToPath } from '@cosmjs/crypto';

import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1HdWalletOptions,
  OfflineSigner,
} from '@cosmjs/proto-signing';

import {
  Bip39,
  EnglishMnemonic,
  Hmac,
  ripemd160,
  Secp256k1,
  sha256,
  Sha512,
  Slip10Curve,
} from '@cosmjs/crypto';
import { fromBase64, fromHex, toAscii, toBase64, toBech32 } from '@cosmjs/encoding';
import BN from 'bn.js';
import sjcl from 'sjcl';

import { bip39Password, keyPathPattern, stratosAddressPrefix, stratosPubkeyPrefix } from '../config/hdVault';
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

/**
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
export function makeStratosHubPath(a: number): HdPath {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(606),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(a),
  ];
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

// @todo - move it - used in getMasterKeySeedPriveKey
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

  const seed = await Bip39.mnemonicToSeed(mnemonicChecked, bip39Password);

  return seed;
};

// helper, not used?
export const getMasterKeySeedPriveKey = (masterKeySeed: Uint8Array): Uint8Array => {
  const masterKeyInfo = getMasterKeyInfo(Slip10Curve.Secp256k1, masterKeySeed);

  const { privkey } = masterKeyInfo;

  return privkey;
};

// used in derriveManager - deriveKeyPairFromPrivateKeySeed
export const getPublicKeyFromPrivKey = async (privkey: Uint8Array): Promise<PubKey> => {
  const { pubkey } = await Secp256k1.makeKeypair(privkey);

  const compressedPub = Secp256k1.compressPubkey(pubkey);

  const pubkeyMine = {
    type: 'tendermint/PubKeySecp256k1',
    value: toBase64(compressedPub),
  };

  return pubkeyMine;
};

const encodeStratosPubkey = (pubkey: PubKey) => {
  const pubkeyAminoPrefixSecp256k1 = fromHex('eb5ae987' + '21');
  const pubkeyAminoPrefixSecp256k1Converted = Array.from(pubkeyAminoPrefixSecp256k1);

  const ecodedPubkey = fromBase64(pubkey.value);
  const ecodedPubkeyConverted = Array.from(ecodedPubkey);

  const encodedFullPubKey = new Uint8Array([
    ...pubkeyAminoPrefixSecp256k1Converted,
    ...ecodedPubkeyConverted,
  ]);

  return encodedFullPubKey;
};

// amino pubkeyToAddress - dep 1 - solved
export const getAminoPublicKey = async (pubkey: PubKey): Promise<Uint8Array> => {
  const encodedAminoPub = encodeStratosPubkey(pubkey);

  return encodedAminoPub;
};

function rawSecp256k1PubkeyToRawAddress(pubkeyData: Uint8Array) {
  if (pubkeyData.length !== 33) {
    throw new Error(`Invalid Secp256k1 pubkey length (compressed): ${pubkeyData.length}`);
  }
  return ripemd160(sha256(pubkeyData));
}

function pubkeyToRawAddress(pubkey: PubKey) {
  const pubkeyData = fromBase64(pubkey.value);
  return rawSecp256k1PubkeyToRawAddress(pubkeyData);
}

// amino pubkeyToAddress - dep 2 - solved
export const getAddressFromPubKey = (pubkey: PubKey): string => {
  // const address = pubkeyToAddress(pubkey, stratosAddressPrefix); // obsolete - { pubkeyToAddress } from '@cosmjs/amino';

  const prefix = stratosAddressPrefix;
  const address = toBech32(prefix, pubkeyToRawAddress(pubkey));

  return address;
};

export const getEncodedPublicKey = async (encodedAminoPub: Uint8Array): Promise<string> => {
  const encodedPubKey = toBech32(stratosPubkeyPrefix, encodedAminoPub);

  return encodedPubKey;
};

export const getMasterKeySeedPublicKey = async (masterKeySeed: Uint8Array): Promise<PubKey> => {
  const privkey = getMasterKeySeedPriveKey(masterKeySeed);

  const pubkey = await getPublicKeyFromPrivKey(privkey);

  return pubkey;
};

// only used in keyManager
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

// used in unlockMasterKeySeed and getMasterKeySeed - here
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

// used in keyManager to call unlockMasterKeySeed
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

// used in wallet.ts to deriveKeyPair
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

export type PathBuilder = (account_index: number) => HdPath;

export function makePathBuilder(pattern: string): PathBuilder {
  if (pattern.indexOf('a') === -1) throw new Error('Missing account index variable `a` in pattern.');
  if (pattern.indexOf('a') !== pattern.lastIndexOf('a')) {
    throw new Error('More than one account index variable `a` in pattern.');
  }

  const builder: PathBuilder = function (a: number): HdPath {
    const path = pattern.replace('a', a.toString());
    return stringToPath(path);
  };

  // test builder
  const _path = builder(0);

  return builder;
}

export async function createWalletAtPath(
  hdPathIndex: number,
  mnemonic: string,
): Promise<DirectSecp256k1HdWallet> {
  const addressPrefix = stratosAddressPrefix;

  // works - way 1
  const hdPaths = [makeStratosHubPath(hdPathIndex)];
  const options: DirectSecp256k1HdWalletOptions = {
    bip39Password: '',
    prefix: addressPrefix,
    hdPaths,
  };

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, options);

  // const accounts = await wallet.getAccounts();
  // console.log('🚀 ~ file: keyUtils.ts ~ line 279 ~ hdPathIndex', hdPathIndex);
  // console.log('🚀 ~ file: keyUtils.ts ~ line 288 ~ accounts createWalletAtPath ', accounts);
  // works - way 2
  // const pathBuilder = makePathBuilder(keyPathPattern);
  // const path = pathBuilder(hdPathIndex);
  // const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
  //   hdPaths: [path],
  //   prefix: addressPrefix,
  // });

  return wallet;
}

export async function createWallets(
  mnemonic: string,
  pathBuilder: PathBuilder,
  addressPrefix: string,
  numberOfDistributors: number,
): Promise<ReadonlyArray<readonly [string, OfflineSigner]>> {
  const wallets = new Array<readonly [string, OfflineSigner]>();

  // first account is the token holder
  const numberOfIdentities = 1 + numberOfDistributors;

  for (let i = 0; i < numberOfIdentities; i++) {
    const path = pathBuilder(i);
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [path],
      prefix: addressPrefix,
    });

    const [account] = await wallet.getAccounts();
    const { address } = account;

    wallets.push([address, wallet]);
  }

  return wallets;
}

export async function generateWallets(
  quantity: number,
  mnemonic: string,
): Promise<ReadonlyArray<readonly [string, OfflineSigner]>> {
  const pathBuilder = makePathBuilder(keyPathPattern);

  const wallets = await createWallets(mnemonic, pathBuilder, stratosAddressPrefix, quantity);

  return wallets;
}

// export const sign = async (message: string, privateKey: string): Promise<string> => {
//   try {
//     const decodedMessage = fromBase64(message);
//     const decodedPrivateKey = fromBase64(privateKey);

//     const signature = nacl.sign.detached(Uint8Array.from(decodedMessage), decodedPrivateKey);
//     const ecodedSignature = toBase64(signature);

//     return ecodedSignature;
//   } catch (error) {
//     return Promise.reject(false);
//   }
// };

// export const verifySignature = async (
//   message: string,
//   signature: string,
//   publicKey: string,
// ): Promise<boolean> => {
//   try {
//     const convertedMessage = fromBase64(message);
//     const formattedMessage = Uint8Array.from(convertedMessage);

//     const convertedSignature = fromBase64(signature);
//     const convertedPubKey = fromBase64(publicKey);

//     const verifyResult = nacl.sign.detached.verify(formattedMessage, convertedSignature, convertedPubKey);
//     return verifyResult;
//   } catch (err) {
//     return Promise.reject(false);
//   }
// };
