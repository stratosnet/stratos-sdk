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
  // console.log('🚀 ~ file: wallet.ts ~ line 34 ~ path', path);

  const privateKeySeed = derivePrivateKeySeed(masterKeySeed, path);
  // console.log('🚀 ~ file: wallet.ts ~ line 37 ~ privateKeySeed', privateKeySeed);

  // const pathZero = `${keyPath}0`;
  // console.log('🚀 ~ file: wallet.ts ~ line 40 ~ pathZero', pathZero);

  // const privateKeySeedZero = derivePrivateKeySeed(masterKeySeed, pathZero);
  // console.log('🚀 ~ file: wallet.ts ~ line 43 ~ privateKeySeedZero', privateKeySeedZero);

  // const pathOne = `${keyPath}1`;
  // console.log('🚀 ~ file: wallet.ts ~ line 46 ~ pathOne', pathOne);

  // const privateKeySeedOne = derivePrivateKeySeed(masterKeySeed, pathOne);
  // console.log('🚀 ~ file: wallet.ts ~ line 49 ~ privateKeySeedOne', privateKeySeedOne);

  const derivedKeyPair = await deriveKeyPairFromPrivateKeySeed(privateKeySeed);
  // console.log('🚀 ~ file: wallet.ts ~ line 52 ~ derivedKeyPair', derivedKeyPair);
  // const derivedKeyPairZero = await deriveKeyPairFromPrivateKeySeed(privateKeySeedZero);
  // console.log('🚀 ~ file: wallet.ts ~ line 54 ~ derivedKeyPairZero', derivedKeyPairZero);
  // const derivedKeyPairOne = await deriveKeyPairFromPrivateKeySeed(privateKeySeedOne);
  // console.log('🚀 ~ file: wallet.ts ~ line 56 ~ derivedKeyPairOne', derivedKeyPairOne);

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

  const encryptionKey = await keyUtils.getEncryptionKey(password);

  try {
    deserializedWallet = await DirectSecp256k1HdWallet.deserializeWithEncryptionKey(
      serializedWallet,
      encryptionKey,
    );
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
