import { stringToPath } from '@cosmjs/crypto';
import {
  Bip39,
  EnglishMnemonic,
  HdPath, // ripemd160,
  Secp256k1,
  Secp256k1Signature, // sha256, // Slip10RawIndex,
} from '@cosmjs/crypto';
import { fromBase64, fromHex, toBase64, toBech32, toHex, fromBech32 } from '@cosmjs/encoding';
// import CryptoJS from 'crypto-js';
import createKeccakHash from 'keccak';
import sjcl from 'sjcl';
import { PubKey } from '../../chain/cosmos/cosmosTypes';
import {
  bip39Password as bip39PasswordDefault, // encryptionIterations,
  // encryptionKeyLength,
  stratosAddressPrefix,
  stratosPubkeyPrefix,
} from '../../config/hdVault';
import { pubkeyToRawAddressWithKeccak } from '../../crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet';
import Sdk from '../../Sdk';
import { convertArrayToString, MnemonicPhrase } from './mnemonic';

export const generateMasterKeySeed = async (phrase: MnemonicPhrase): Promise<Uint8Array> => {
  const stringMnemonic = convertArrayToString(phrase);

  const mnemonicChecked = new EnglishMnemonic(stringMnemonic);

  const seed = await Bip39.mnemonicToSeed(
    mnemonicChecked,
    bip39PasswordDefault(Sdk.environment.keyPathParameters?.bip39Password),
  );

  return seed;
};

const getTendermintPrefixBytes = () => {
  const pubkeyAminoPrefixSecp256k1 = fromHex('eb5ae987' + '21');
  const pubkeyAminoPrefixSecp256k1Converted = Array.from(pubkeyAminoPrefixSecp256k1);

  return pubkeyAminoPrefixSecp256k1Converted;
};

const encodeStratosPubkey = (pubkey: PubKey, appendAminoPreffix = false): Uint8Array => {
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

export const getAddressFromPubKeyWithKeccak = (pubkey: Uint8Array): string => {
  const prefix = stratosAddressPrefix;

  const addressChunkOfBytes = pubkeyToRawAddressWithKeccak(pubkey);
  // console.log('addressChunkOfBytes', addressChunkOfBytes);

  // const hexAddress = toHex(addressChunkOfBytes);
  // console.log('kk hex address', hexAddress);

  const address = toBech32(prefix, addressChunkOfBytes);
  // console.log('kk bench32 address', address);
  // const fAddress = fromBech32(address);
  // console.log('fAddress', fAddress);
  return address;
};

export const convertNativeToEvmAddress = (nativeAddress: string): string => {
  const evmAddress = '0x' + toHex(fromBech32(nativeAddress).data);
  return evmAddress;
};

export const convertEvmToNativeToAddress = (evmAddress: string): string => {
  const nativeAddress = toBech32(stratosAddressPrefix, fromHex(evmAddress.replace('0x', '')));
  return nativeAddress;
};

export const getEncodedPublicKey = async (encodedAminoPub: Uint8Array): Promise<string> => {
  const encodedPubKey = toBech32(stratosPubkeyPrefix, encodedAminoPub);

  return encodedPubKey;
};

// only used in keyManager but we have it in cosmosUtils
// export const encryptMasterKeySeed = (
//   password: string,
//   masterKeySeed: Uint8Array,
// ): sjcl.SjclCipherEncrypted => {
//   const strMasterKey = toBase64(masterKeySeed);
//   const saltBits = sjcl.random.randomWords(4);
//   const encryptParams = {
//     v: 1,
//     iter: 1000,
//     ks: 128,
//     mode: 'gcm',
//     adata: '',
//     cipher: 'aes',
//     salt: saltBits,
//     iv: saltBits,
//   };
//   return sjcl.encrypt(password, strMasterKey, encryptParams);
// };

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

export const encodeSignatureMessage = (message: string) => {
  const signBytesBuffer = Buffer.from(message);
  const keccak256HashOfSigningBytes = createKeccakHash('keccak256').update(signBytesBuffer).digest();
  const signHashBuf = keccak256HashOfSigningBytes;
  // keep this implementation as an example of the sha256 signing
  // const signBytesWithKeccak = new Uint8Array(keccak256HashOfSigningBytes)
  // const messageHash = signBytesWithKeccak;
  // const messageHash = CryptoJS.SHA256(message).toString();
  // const messageHash2 = CryptoJS.SHA256(message).toString();
  // const signHashBuf = Buffer.from(messageHash, `hex`);
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
