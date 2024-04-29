import * as cosmosUtils from '../../chain/cosmos/cosmosUtils';
import * as cosmosWallet from '../../chain/cosmos/cosmosWallet';
import { maxHdPathKeyindex } from '../../config/hdVault';
import { type LegacyMasterKeyInfo, type MasterKeyInfo } from './hdVaultTypes';
import * as keyUtils from './keyUtils';
import { convertArrayToString, convertStringToArray, MnemonicPhrase } from './mnemonic';

export const createMasterKeySeedFromGivenSeed = async (
  derivedMasterKeySeed: Uint8Array,
  password: string,
): Promise<LegacyMasterKeyInfo> => {
  const encryptedMasterKeySeed = cosmosUtils.encryptMasterKeySeed(password, derivedMasterKeySeed);

  const pubkey = await cosmosWallet.getMasterKeySeedPublicKey(derivedMasterKeySeed);

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
  if (hdPathIndex > maxHdPathKeyindex) {
    throw Error(`hd path index can not be more than ${maxHdPathKeyindex}`);
  }
  const derivedMasterKeySeed = await keyUtils.generateMasterKeySeed(phrase);

  const wallet = await cosmosWallet.createWalletAtPath(hdPathIndex, convertArrayToString(phrase));

  let encryptedWalletInfo;

  try {
    encryptedWalletInfo = await cosmosWallet.serializeWallet(wallet, password);
  } catch (error) {
    throw new Error(`could not serialize wallet (sdk), ${(error as Error).message}`);
  }

  const legacyMasterKeyInfo = await createMasterKeySeedFromGivenSeed(derivedMasterKeySeed, password);

  const masterKeyInfo = { ...legacyMasterKeyInfo, encryptedWalletInfo };

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

// helper which is used in wallet hdVault
export const getMasterKeySeedFromPhrase = async (userMnemonic: string, password: string, hdPathIndex = 0) => {
  const phrase = convertStringToArray(userMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password, hdPathIndex);

  return masterKeySeedInfo.encryptedMasterKeySeed;
};
