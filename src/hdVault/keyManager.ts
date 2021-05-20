import { deriveAddress } from './deriveManager';
import * as keyUtils from './keyUtils';
import { MnemonicPhrase } from './mnemonic';
import * as utils from './utils';

export interface MasterKeyInfo {
  readonly encryptedMasterKeySeed: sjcl.SjclCipherEncrypted;
  readonly masterKeySeedAddress: string;
  readonly masterKeySeedPublicKey: Uint8Array;
  readonly masterKeySeedEncodedPublicKey: string;
}

export const createMasterKeySeed = async (
  phrase: MnemonicPhrase,
  password: string,
): Promise<MasterKeyInfo> => {
  const derivedMasterKeySeed = await keyUtils.generateMasterKeySeed(phrase);
  console.log('key manager - derivedMasterKeySeed in hex!', utils.uint8arrayToHexStr(derivedMasterKeySeed));

  const encryptedMasterKeySeed = keyUtils.encryptMasterKeySeed(password, derivedMasterKeySeed);

  const pubkey = await keyUtils.getMasterKeySeedPublicKey(derivedMasterKeySeed);
  const masterKeySeedAddress = deriveAddress(pubkey);
  const masterKeySeedPublicKey = await keyUtils.getAminoPublicKey(pubkey);
  const masterKeySeedEncodedPublicKey = await keyUtils.getEncodedPublicKey(masterKeySeedPublicKey);

  return {
    encryptedMasterKeySeed,
    masterKeySeedAddress, // string uses pubkey
    masterKeySeedPublicKey, // aminopub
    masterKeySeedEncodedPublicKey, // string uses aminopub
  };
};

export const unlockMasterKeySeed = async (
  password: string,
  encryptedMasterKeySeed: string,
): Promise<boolean> => {
  return await keyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeed);
};
