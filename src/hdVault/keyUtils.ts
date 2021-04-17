import { mnemonicToSeedSync } from 'bip39';
import sjcl from 'sjcl';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

import { convertArrayToString, MnemonicPhrase } from './mnemonic';
import { bufferToUint8Array, uint8ArrayToBase64str, uint8ArrayToBuffer } from './utils';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export const generateMasterKeySeed = (phrase: MnemonicPhrase): Buffer => {
  return mnemonicToSeedSync(convertArrayToString(phrase));
};

export const getMasterKeySeedPublicKey = (masterKeySeed: Buffer): string => {
  const publicKey = uint8ArrayToBase64str(nacl.sign.keyPair.fromSecretKey(masterKeySeed).publicKey);

  return publicKey;
};

export const encryptMasterKeySeed = (password: string, masterKeySeed: Buffer): sjcl.SjclCipherEncrypted => {
  const strMasterKey = naclUtil.encodeBase64(bufferToUint8Array(masterKeySeed));
  const saltBits = sjcl.random.randomWords(4);
  const encryptParams = {
    v: 1,
    iter: 1000,
    ks: 128,
    mode: 'gcm',
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
): Promise<Buffer | false> => {
  let decryptedMasterKeySeed;

  try {
    const decrypteCypherText = sjcl.decrypt(password, encryptedMasterKeySeed);
    decryptedMasterKeySeed = uint8ArrayToBuffer(naclUtil.decodeBase64(decrypteCypherText));
  } catch (err) {
    return Promise.reject(false);
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
