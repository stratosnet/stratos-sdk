import { pathToString, stringToPath } from '@cosmjs/crypto';
import {
  // Bip39,
  // EnglishMnemonic,
  // HdPath,
  Hmac, // ripemd160,
  Secp256k1, // Secp256k1Signature,
  // sha256,
  Sha512,
  Slip10Curve, // Slip10RawIndex,
  // stringToPath,
} from '@cosmjs/crypto';
import { fromBase64, toAscii, toBase64 } from '@cosmjs/encoding';
import { fromUtf8, toUtf8 } from '@cosmjs/encoding';
// import { DirectSecp256k1HdWalletOptions } from '@cosmjs/proto-signing';
import { assert, isNonNullObject } from '@cosmjs/utils';
import BN from 'bn.js';
import sjcl from 'sjcl';
import StratosDirectSecp256k1HdWallet, {
  Secp256k1Derivation, // defaultOptions as hdWalletDefaultOptions,
  // makeStratosHubPath,
} from '../../crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet';
import { type DerivationInfoJson, type DirectSecp256k1HdWalletData } from './cosmosTypes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto_1 = require('@cosmjs/crypto');

function isDerivationJson(thing: unknown): thing is DerivationInfoJson {
  if (!isNonNullObject(thing)) return false;
  if (typeof (thing as DerivationInfoJson).hdPath !== 'string') return false;
  if (typeof (thing as DerivationInfoJson).prefix !== 'string') return false;
  return true;
}

export const isZero = (privkey: Uint8Array): boolean => {
  return privkey.every(byte => byte === 0);
};

export const n = (curve: Slip10Curve): BN => {
  switch (curve) {
    case Slip10Curve.Secp256k1:
      return new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
    default:
      throw new Error('curve not supported');
  }
};

export const isGteN = (curve: Slip10Curve, privkey: Uint8Array): boolean => {
  const keyAsNumber = new BN(privkey);
  return keyAsNumber.gte(n(curve));
};

// used in keymanager
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

// export function encrypt(password: string, plaintext: Uint8Array): sjcl.SjclCipherEncrypted {
function encrypt(password: string, plaintext: Uint8Array): sjcl.SjclCipherEncrypted {
  const encripted = encryptMasterKeySeed(password, plaintext);
  return encripted;
}

// export function decrypt(password: string, encryptedMasterKeySeed: string): Uint8Array {
function decrypt(password: string, encryptedMasterKeySeed: string): Uint8Array {
  const decrypteCypherText = sjcl.decrypt(password, encryptedMasterKeySeed);
  const decryptedMasterKeySeed = fromBase64(decrypteCypherText); // switch (config.algorithm) {
  return decryptedMasterKeySeed;
}

export const deserializeWithEncryptionKey = async (
  password: string,
  serialization: string,
): Promise<StratosDirectSecp256k1HdWallet> => {
  const root = JSON.parse(serialization);
  if (!isNonNullObject(root)) throw new Error('Root document is not an object.');
  const untypedRoot: any = root;
  const decryptedBytes = decrypt(password, untypedRoot.data);
  const decryptedDocument = JSON.parse(fromUtf8(decryptedBytes));
  const { mnemonic, accounts } = decryptedDocument;
  assert(typeof mnemonic === 'string');
  if (!Array.isArray(accounts)) throw new Error("Property 'accounts' is not an array");
  if (!accounts.every(account => isDerivationJson(account))) {
    throw new Error('Account is not in the correct format.');
  }
  const firstPrefix = accounts[0].prefix;
  if (!accounts.every(({ prefix }) => prefix === firstPrefix)) {
    throw new Error('Accounts do not all have the same prefix');
  }
  const hdPaths: typeof crypto_1.HdPath = (accounts as Secp256k1Derivation[]).map(({ hdPath }) =>
    stringToPath(hdPath),
  );

  const options = {
    prefix: firstPrefix,
    hdPaths,
  };

  return StratosDirectSecp256k1HdWallet.fromMnemonic(mnemonic, options);
};

export const serializeWithEncryptionKey = (
  password: string,
  wallet: StratosDirectSecp256k1HdWallet,
): string => {
  const walletAccounts = wallet['myAccounts'] as Secp256k1Derivation[];

  const dataToEncrypt: DirectSecp256k1HdWalletData = {
    mnemonic: wallet.mnemonic,
    accounts: walletAccounts.map(({ hdPath, prefix }) => ({
      hdPath: pathToString(hdPath),
      prefix: prefix,
    })),
  };

  const dataToEncryptRaw = toUtf8(JSON.stringify(dataToEncrypt));

  const encryptedData = encrypt(password, dataToEncryptRaw);

  const out = {
    data: encryptedData.toString(),
  };
  return JSON.stringify(out);
};

// export async function createWalletAtPath(
//   hdPathIndex: number,
//   mnemonic: string,
// ): Promise<StratosDirectSecp256k1HdWallet> {
//   const hdPaths = [makeStratosHubPath(hdPathIndex)];
//
//   const options: DirectSecp256k1HdWalletOptions = { ...hdWalletDefaultOptions, hdPaths };
//
//   const wallet = await StratosDirectSecp256k1HdWallet.fromMnemonic(mnemonic, options);
//
//   return wallet;
// }
