import * as bech32 from 'bech32';
import { mnemonicToSeedSync } from 'bip39';
import sjcl from 'sjcl';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

import { convertArrayToString, MnemonicPhrase } from './mnemonic';
import { bufferToUint8Array, hexStrToUint8Array, uint8ArrayToBase64str, uint8ArrayToBuffer } from './utils';

// @todo move to the config - to be created
const masterSeedKeyAddrPrefix = 'st';

export const generateMasterKeySeed = (phrase: MnemonicPhrase): Buffer => {
  return mnemonicToSeedSync(convertArrayToString(phrase));
};

export const getMasterKeySeedPublicKey = (masterKeySeed: Buffer): string => {
  return uint8ArrayToBase64str(nacl.sign.keyPair.fromSecretKey(masterKeySeed).publicKey);
};

export const getMasterKeySeedAddress = (masterKeySeedPublicKey: string): string => {
  const base64PublicKey = sjcl.codec.base64.toBits(masterKeySeedPublicKey);
  const hash = new sjcl.hash.sha256();
  hash.update(base64PublicKey);
  const hashResult = hash.finalize();
  const hashedData = sjcl.codec.hex.fromBits(hashResult);
  hash.reset();
  const data = hexStrToUint8Array(hashedData.substring(0, 40));
  const address = bech32.encode(masterSeedKeyAddrPrefix, bech32.toWords(data));

  return address;
};

export const encryptMasterKeySeed = (password: string, masterKeySeed: Buffer): sjcl.SjclCipherEncrypted => {
  const strMasterKey = naclUtil.encodeBase64(bufferToUint8Array(masterKeySeed));
  const saltBits = sjcl.random.randomWords(4);
  const encryptParams = {
    v: 1,
    iter: 1000,
    ks: 128,
    mode: 'ccm',
    adata: '',
    cipher: 'aes',
    salt: saltBits,
    iv: sjcl.random.randomWords(4, 0),
  };
  return sjcl.encrypt(password, strMasterKey, encryptParams);
};

export const decryptMasterKeySeed = async (
  password: string,
  encryptedMasterKeySeed: string,
): Promise<Buffer> => {
  let decryptedMasterKeySeed;

  try {
    const decrypteCypherText = sjcl.decrypt(password, encryptedMasterKeySeed);
    decryptedMasterKeySeed = uint8ArrayToBuffer(naclUtil.decodeBase64(decrypteCypherText));
  } catch (err) {
    return Promise.reject(Buffer.from(''));
  }

  if (decryptedMasterKeySeed) {
    return Promise.resolve(decryptedMasterKeySeed);
  }

  return Promise.reject(false);
};

export const unlockMasterKeySeed = async (
  password: string,
  encryptedMasterKeySeed: string,
): Promise<boolean> => {
  try {
    await decryptMasterKeySeed(password, encryptedMasterKeySeed);
    return Promise.resolve(true);
  } catch (e) {
    return Promise.resolve(false);
  }
};

export const getMasterKeySeedAddressFromPhrase = (phrase: MnemonicPhrase): string => {
  const masterKeySeed = generateMasterKeySeed(phrase);
  return getMasterKeySeedAddress(getMasterKeySeedPublicKey(masterKeySeed));
};
