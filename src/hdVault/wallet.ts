import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { keyPath } from '../config/hdVault';
import { deriveKeyPairFromPrivateKeySeed, derivePrivateKeySeed } from './deriveManager';
import * as keyUtils from './keyUtils';

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

  try {
    masterKeySeed = await keyUtils.getMasterKeySeed(password, encryptedMasterKeySeed);
  } catch (er) {
    return Promise.reject(false);
  }

  const path = `${keyPath}${keyIndex}`;

  const privateKeySeed = derivePrivateKeySeed(masterKeySeed, path);

  const { address, encodedPublicKey, privateKey } = await deriveKeyPairFromPrivateKeySeed(privateKeySeed);

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
    deserializedWallet = await DirectSecp256k1HdWallet.deserialize(serializedWallet, password);
  } catch (error) {
    console.log('could not deserialize / decode wallet');
    console.log(error);
    return Promise.reject(false);
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
