import { keyPath, maxHdPathKeyindex } from '../config/hdVault';
import { deserializeWithEncryptionKey } from './cosmosUtils';
import { deriveKeyPairFromPrivateKeySeed, derivePrivateKeySeed } from './deriveManager';
import * as keyUtils from './keyUtils';

export { stratosDenom, stratosOzDenom, stratosTopDenom, stratosUozDenom } from '../config/hdVault';

export interface KeyPairInfo {
  keyIndex: number;
  address: string;
  publicKey: string;
  privateKey: string;
}

export interface TransactionMessage {
  message: string;
  password: string;
  encryptedMasterKeySeed: string;
  signingKeyPath: string;
}

export const deriveKeyPair = async (
  keyIndex: number,
  password: string,
  encryptedMasterKeySeed: string,
): Promise<KeyPairInfo | false> => {
  let masterKeySeed;

  if (keyIndex > maxHdPathKeyindex) {
    throw Error(`hd path index can not be more than ${maxHdPathKeyindex}`);
  }

  try {
    masterKeySeed = await keyUtils.getMasterKeySeed(password, encryptedMasterKeySeed);
  } catch (er) {
    return Promise.reject(false);
  }

  const path = `${keyPath}${keyIndex}`;

  const privateKeySeed = derivePrivateKeySeed(masterKeySeed, path);

  const derivedKeyPair = await deriveKeyPairFromPrivateKeySeed(privateKeySeed);

  const { address, encodedPublicKey, privateKey } = derivedKeyPair;

  const res = {
    keyIndex,
    address,
    publicKey: encodedPublicKey,
    privateKey,
  };

  return res;
};

export const deserializeEncryptedWallet = async (serializedWallet: string, password: string) => {
  let deserializedWallet;

  try {
    deserializedWallet = await deserializeWithEncryptionKey(password, serializedWallet);
  } catch (error) {
    const msg = `"${(error as Error).message}", w "${serializedWallet}"`;
    const errorMsg = `could not deserialize / decode wallet ${msg}`;
    console.log(errorMsg);
    throw new Error(errorMsg);
  }

  if (!deserializedWallet) {
    return Promise.reject(false);
  }

  return deserializedWallet;
};

// export const sign = async ({
//   message,
//   password,
//   encryptedMasterKeySeed,
//   signingKeyPath,
// }: TransactionMessage): Promise<string> => {
//   let masterKeySeed;
//   try {
//     masterKeySeed = await keyUtils.getMasterKeySeed(password, encryptedMasterKeySeed);
//   } catch (er) {
//     return Promise.reject(false);
//   }

//   const privateKeySeed = derivePrivateKeySeed(masterKeySeed, signingKeyPath);

//   const { privateKey } = await deriveKeyPairFromPrivateKeySeed(privateKeySeed);

//   try {
//     const signature = await keyUtils.sign(message, privateKey);
//     return signature;
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
//     const verifyResult = await keyUtils.verifySignature(message, signature, publicKey);
//     return verifyResult;
//   } catch (err) {
//     return Promise.resolve(false);
//   }
// };
