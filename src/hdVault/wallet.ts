import { keyPath, keyPathSuffix } from '../config/hdVault';
import {
  deriveAddress,
  deriveKeyPairFromPrivateKeySeed,
  deriveMasterKey,
  derivePrivateKeySeed,
} from './deriveManager';
import { decryptMasterKeySeed } from './keyUtils';
import { bufferToHexStr } from './utils';

export interface KeyPairInfo {
  keyIndex: number;
  address: string;
  publicKey: string;
}

export const deriveKeyPair = async (
  keyIndex: number,
  password: string,
  encryptedMasterKeySeed: string,
): Promise<KeyPairInfo> => {
  const decryptedMasterKeySeed = await decryptMasterKeySeed(password, encryptedMasterKeySeed);

  const masterKey = deriveMasterKey(bufferToHexStr(decryptedMasterKeySeed));

  const privateKeySeed = derivePrivateKeySeed(masterKey, `${keyPath}${keyIndex}${keyPathSuffix}`);

  const { publicKey } = await deriveKeyPairFromPrivateKeySeed(privateKeySeed);

  const address = deriveAddress(publicKey);

  return { keyIndex, address, publicKey };
};

// export const verifyAddress = (address: string): void => {};

// export const sign = (payload: string): void => {};

// export const verifySignature = (payload: string): void => {};
