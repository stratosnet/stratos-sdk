import { keyPath, keyPathSuffix } from '../config/hdVault';
import { deriveAddress, deriveKeyPairFromPrivateKeySeed, derivePrivateKeySeed } from './deriveManager';
import { decryptMasterKeySeed } from './keyUtils';
import { bufferToUint8Array } from './utils';

export interface KeyPairInfo {
  keyIndex: number;
  address: string;
  publicKey: string;
}

export const deriveKeyPair = async (
  keyIndex: number,
  password: string,
  encryptedMasterKeySeed: string,
): Promise<KeyPairInfo | false> => {
  let decryptedMasterKeySeed;

  try {
    decryptedMasterKeySeed = await decryptMasterKeySeed(password, encryptedMasterKeySeed);
  } catch (e) {
    return Promise.reject(false);
  }

  if (!decryptedMasterKeySeed) {
    return Promise.reject(false);
  }

  const path = `${keyPath}${keyIndex}${keyPathSuffix}`;

  const masterKeySeed = bufferToUint8Array(decryptedMasterKeySeed);

  const privateKeySeed = derivePrivateKeySeed(masterKeySeed, path);

  const { publicKey } = await deriveKeyPairFromPrivateKeySeed(privateKeySeed);

  const address = deriveAddress(publicKey);

  const res = { keyIndex, address, publicKey };

  return res;
};

// export const verifyAddress = (address: string): void => {};

// export const sign = (payload: string): void => {};

// export const verifySignature = (payload: string): void => {};
