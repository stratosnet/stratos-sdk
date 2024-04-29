import {
  keyPath as keyPathDefault,
  masterkey as masterkeyDefault,
  maxHdPathKeyindex,
  slip10RawIndexes,
} from '../../config/hdVault';
import Sdk from '../../Sdk';
import { deriveKeyPairFromPrivateKeySeed, derivePrivateKeySeed } from './deriveManager';
import { type KeyPairInfo } from './hdVaultTypes';
import * as keyManager from './keyManager';
import * as keyUtils from './keyUtils';

// used in externally to switch between keypairs and during create wallet
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

  const keyPath =
    Sdk.environment.keyPathParameters?.fullKeyPath ||
    keyPathDefault(slip10RawIndexes, masterkeyDefault(Sdk.environment.keyPathParameters?.masterkey));

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

// helper to quickly derive a keypair from a givenMnemonic
export const deriveKeyPairFromMnemonic = async (givenMnemonic: string, hdPathIndex = 0, password = '') => {
  const encryptedMasterKeySeed = await keyManager.getMasterKeySeedFromPhrase(
    givenMnemonic,
    password,
    hdPathIndex,
  );

  const encryptedMasterKeySeedInString = encryptedMasterKeySeed.toString();

  const derivedKeyPair = await deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedInString);

  return derivedKeyPair;
};
