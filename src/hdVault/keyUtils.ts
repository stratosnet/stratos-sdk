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

  const masterKeySeed = bufferToUint8Array(decryptedMasterKeySeed);

  return masterKeySeed;
};

export const sign = async (message: string, privateKey: string): Promise<string> => {
  try {
    const decodedMessage = naclUtil.decodeBase64(message);
    const decodedPrivateKey = naclUtil.decodeBase64(privateKey);

    const signature = nacl.sign.detached(Uint8Array.from(decodedMessage), decodedPrivateKey);
    const ecodedSignature = naclUtil.encodeBase64(signature);

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
      Uint8Array.from(naclUtil.decodeBase64(message)),
      naclUtil.decodeBase64(signature),
      naclUtil.decodeBase64(publicKey),
    );
    return verifyResult;
  } catch (err) {
    return Promise.reject(false);
  }
};
