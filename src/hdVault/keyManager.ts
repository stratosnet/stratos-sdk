import { log } from '../services/helpers';
import * as cosmosWallet from './cosmosWallet';
import * as keyUtils from './keyUtils';
import { convertArrayToString, convertStringToArray, MnemonicPhrase } from './mnemonic';

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

export const createMasterKeySeedFromGivenSeed = async (
  derivedMasterKeySeed: Uint8Array,
  password: string,
): Promise<LegacyMasterKeyInfo> => {
  const encryptedMasterKeySeed = keyUtils.encryptMasterKeySeed(password, derivedMasterKeySeed);

  const pubkey = await cosmosWallet.getMasterKeySeedPublicKey(derivedMasterKeySeed);

  // old address
  // const masterKeySeedAddress = keyUtils.getAddressFromPubKey(pubkey);

  // new address
  const fullPubkey = await cosmosWallet.getMasterKeySeedPublicKeyWithKeccak(derivedMasterKeySeed);
  const masterKeySeedAddress = keyUtils.getAddressFromPubKeyWithKeccak(fullPubkey);

  const masterKeySeedPublicKey = await keyUtils.getAminoPublicKey(pubkey); // 1 amino dep  - encodeAminoPubkey
  const masterKeySeedEncodedPublicKey = await keyUtils.getEncodedPublicKey(masterKeySeedPublicKey);

  const masterKeyInfo = {
    encryptedMasterKeySeed,
    masterKeySeedAddress,
    masterKeySeedPublicKey,
    masterKeySeedEncodedPublicKey,
  };

  return masterKeyInfo;
};

// exposed outside, used in the DesktopWallet to "create" a wallet
export const createMasterKeySeed = async (
  phrase: MnemonicPhrase,
  password: string,
  hdPathIndex = 0,
): Promise<MasterKeyInfo> => {
  // log('Generating master key seed');
  const derivedMasterKeySeed = await keyUtils.generateMasterKeySeed(phrase);

  // log('Creating wallet');
  const wallet = await keyUtils.createWalletAtPath(hdPathIndex, convertArrayToString(phrase));

  // log('Calling helper to serialize the wallet');

  let encryptedWalletInfo;

  try {
    encryptedWalletInfo = await keyUtils.serializeWallet(wallet, password);
  } catch (error) {
    throw new Error(`could not serialize wallet (sdk), ${(error as Error).message}`);
  }

  // log('Creating master key seed info from the seed');
  const legacyMasterKeyInfo = await createMasterKeySeedFromGivenSeed(derivedMasterKeySeed, password);

  const masterKeyInfo = { ...legacyMasterKeyInfo, encryptedWalletInfo };

  log('Master key info (the wallet) is created and ready');
  return masterKeyInfo;
};

// exposed outside, used in the DesktopWallet to login
export const unlockMasterKeySeed = async (
  password: string,
  encryptedMasterKeySeed: string,
): Promise<boolean> => {
  return await keyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeed);
};

// helper to provide an encripted, serialized wallet from a given mnemonic
export const getSerializedWalletFromPhrase = async (
  userMnemonic: string,
  password: string,
  hdPathIndex = 0,
) => {
  const phrase = convertStringToArray(userMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password, hdPathIndex);
  const serialized = masterKeySeedInfo.encryptedWalletInfo;

  return serialized;
};
