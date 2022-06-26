import * as keyUtils from './keyUtils';
import { convertArrayToString, MnemonicPhrase } from './mnemonic';
export interface LegacyMasterKeyInfo {
  readonly encryptedMasterKeySeed: sjcl.SjclCipherEncrypted;
  readonly masterKeySeedAddress: string;
  readonly masterKeySeedPublicKey: Uint8Array;
  readonly masterKeySeedEncodedPublicKey: string;
}
export interface MasterKeyInfo extends LegacyMasterKeyInfo {
  readonly encryptedMasterKeySeed: sjcl.SjclCipherEncrypted;
  readonly masterKeySeedAddress: string;
  readonly masterKeySeedPublicKey: Uint8Array;
  readonly masterKeySeedEncodedPublicKey: string;
  readonly encryptedWalletInfo: string;
}

// exposed outside, used in the DesktopWallet to "create" a wallet
export const createMasterKeySeed = async (
  phrase: MnemonicPhrase,
  password: string,
): Promise<MasterKeyInfo> => {
  const derivedMasterKeySeed = await keyUtils.generateMasterKeySeed(phrase);

  const wallet = await keyUtils.createWalletAtPath(0, convertArrayToString(phrase));
  const encryptedWalletInfo = await wallet.serialize(password);

  const legacyMasterKeyInfo = await createMasterKeySeedFromGivenSeed(derivedMasterKeySeed, password);

  const masterKeyInfo = { ...legacyMasterKeyInfo, encryptedWalletInfo };

  return masterKeyInfo;
};

export const createMasterKeySeedFromGivenSeed = async (
  derivedMasterKeySeed: Uint8Array,
  password: string,
): Promise<LegacyMasterKeyInfo> => {
  const encryptedMasterKeySeed = keyUtils.encryptMasterKeySeed(password, derivedMasterKeySeed);

  console.log('🚀 ~ file: keyManager.ts ~ line 28 ~ derivedMasterKeySeed', derivedMasterKeySeed);

  const pubkey = await keyUtils.getMasterKeySeedPublicKey(derivedMasterKeySeed);
  const masterKeySeedPublicKey = await keyUtils.getAminoPublicKey(pubkey); // 1 amino dep  - encodeAminoPubkey
  const masterKeySeedAddress = keyUtils.getAddressFromPubKey(pubkey); // 2 amino dep  - pubkeyToAddress
  const masterKeySeedEncodedPublicKey = await keyUtils.getEncodedPublicKey(masterKeySeedPublicKey);

  const masterKeyInfo = {
    encryptedMasterKeySeed,
    masterKeySeedAddress,
    masterKeySeedPublicKey,
    masterKeySeedEncodedPublicKey,
  };

  return masterKeyInfo;
};

// exposed outside, used in the DesktopWallet to login
export const unlockMasterKeySeed = async (
  password: string,
  encryptedMasterKeySeed: string,
): Promise<boolean> => {
  return await keyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeed);
};
