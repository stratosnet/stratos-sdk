import * as keyUtils from './keyUtils';
import { MnemonicPhrase } from './mnemonic';

export interface MasterKeyInfo {
  readonly encryptedMasterKeySeed: sjcl.SjclCipherEncrypted;
  readonly masterKeySeedAddress: string;
  readonly masterKeySeedPublicKey: string;
}

export const createMasterKeySeed = (phrase: MnemonicPhrase, password: string): MasterKeyInfo => {
  const derivedMasterKeySeed = keyUtils.generateMasterKeySeed(phrase);
  const encryptedMasterKeySeed = keyUtils.encryptMasterKeySeed(password, derivedMasterKeySeed);

  const masterKeySeedPublicKey = keyUtils.getMasterKeySeedPublicKey(derivedMasterKeySeed);
  const masterKeySeedAddress = keyUtils.getMasterKeySeedAddress(masterKeySeedPublicKey);

  return {
    encryptedMasterKeySeed,
    masterKeySeedAddress,
    masterKeySeedPublicKey,
  };
};

export const unlockMasterKeySeed = async (
  password: string,
  encryptedMasterKeySeed: string,
): Promise<boolean> => {
  return await keyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeed);
};
