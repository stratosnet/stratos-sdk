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
import { fromBase64, fromHex, toAscii, toBase64, toBech32, toHex } from '@cosmjs/encoding';
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1HdWalletOptions,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import BN from 'bn.js';
import CryptoJS from 'crypto-js';
import sjcl from 'sjcl';
import {
  bip39Password,
  encryptionIterations,
  encryptionKeyLength,
  kdfConfiguration,
  keyPathPattern,
  stratosAddressPrefix,
  stratosPubkeyPrefix,
} from '../config/hdVault';
import { log } from '../services/helpers';
import { serializeWithEncryptionKey } from './cosmosUtils';
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
  // console.log('🚀 ~ file: keyUtils.ts ~ line 107 ~ generateMasterKeySeed ~ stringMnemonic', stringMnemonic);

  const mnemonicChecked = new EnglishMnemonic(stringMnemonic);
  // console.log('🚀 ~ file: keyUtils.ts ~ line 110 ~ generateMasterKeySeed ~ mnemonicChecked', mnemonicChecked);

  const seed = await Bip39.mnemonicToSeed(mnemonicChecked, bip39Password);
  // console.log('🚀 ~ file: keyUtils.ts ~ line 113 ~ generateMasterKeySeed ~ seed', seed);

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

// used in wallet serialization and desirialization
// meant to replace cosmos.js encryption key generation, which uses executeKdf
// and that is using libsodium, (wasm) which is extremelly slow on mobile devices
export const getEncryptionKey = async (password: string) => {
  const base64SaltBits = 'my salt';

  let cryptoJsKey;

  try {
    cryptoJsKey = CryptoJS.PBKDF2(password, base64SaltBits, {
      keySize: encryptionKeyLength / 4,
      iterations: encryptionIterations,
      hasher: CryptoJS.algo.SHA256,
    });
  } catch (error) {
    throw new Error(`Could not call PBKDF2. Error - ${(error as Error).message}`);
  }

  const cryptoJsKeyEncoded = cryptoJsKey.toString(CryptoJS.enc.Base64);

  const keyBuffer = Buffer.from(cryptoJsKeyEncoded, 'base64');
  const encryptionKey = new Uint8Array(keyBuffer);
  return encryptionKey;
};

const getTendermintPrefixBytes = () => {
  const pubkeyAminoPrefixSecp256k1 = fromHex('eb5ae987' + '21');
  const pubkeyAminoPrefixSecp256k1Converted = Array.from(pubkeyAminoPrefixSecp256k1);

  return pubkeyAminoPrefixSecp256k1Converted;
};

const encodeStratosPubkey = (pubkey: PubKey, appendAminoPreffix = false) => {
  const ecodedPubkey = fromBase64(pubkey.value);
  const ecodedPubkeyConverted = Array.from(ecodedPubkey);

  const pubkeyAminoPrefixSecp256k1Converted: number[] = appendAminoPreffix ? getTendermintPrefixBytes() : [];

  const encodedFullPubKey = new Uint8Array([
    ...pubkeyAminoPrefixSecp256k1Converted,
    ...ecodedPubkeyConverted,
  ]);

  return encodedFullPubKey;
};

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

// @todo clena up this function and extract different encryption methods into helper functions
export const serializeWallet = async (wallet: DirectSecp256k1HdWallet, password: string) => {
  log('Beginning serializing..');

  let encryptedWalletInfoFour;

  try {
    encryptedWalletInfoFour = await serializeWithEncryptionKey(password, wallet);
    log('Serialization with prepared cryptoJs data Uint8 is done. ');
  } catch (error) {
    throw new Error(
      `Could not serialize a wallet with the encryption key. Error4 - ${(error as Error).message}`,
    );
  }

  // return encryptedWalletInfo;
  return encryptedWalletInfoFour;
};

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

export const encodeSignatureMessage = (message: string) => {
  const messageHash = CryptoJS.SHA256(message).toString();
  const signHashBuf = Buffer.from(messageHash, `hex`);
  const encodedMessage = Uint8Array.from(signHashBuf);
  return encodedMessage;
};

export const signWithPrivateKey = async (signMessageString: string, privateKey: string): Promise<string> => {
  const defaultPrivkey = fromHex(privateKey);

  const encodedMessage = encodeSignatureMessage(signMessageString);

  const signature = await Secp256k1.createSignature(encodedMessage, defaultPrivkey);

  const signatureBytes = signature.toFixedLength().slice(0, -1);

  const sigString = toHex(signatureBytes);

  return sigString;
};

export const verifySignature = async (
  signatureMessage: string,
  signature: string,
  publicKey: string,
): Promise<boolean> => {
  try {
    const compressedPubkey = fromBase64(publicKey);

    const encodedMessage = encodeSignatureMessage(signatureMessage);
    const signatureData = fromHex(signature);

    const restoredSignature = Secp256k1Signature.fromFixedLength(signatureData);

    const verifyResult = await Secp256k1.verifySignature(restoredSignature, encodedMessage, compressedPubkey);
    return verifyResult;
  } catch (err) {
    return Promise.reject(false);
  }
};
