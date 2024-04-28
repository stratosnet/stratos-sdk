import { type LegacyMasterKeyInfo, type MasterKeyInfo } from './hdVaultTypes';
import { MnemonicPhrase } from './mnemonic';
export declare const createMasterKeySeedFromGivenSeed: (derivedMasterKeySeed: Uint8Array, password: string) => Promise<LegacyMasterKeyInfo>;
export declare const createMasterKeySeed: (phrase: MnemonicPhrase, password: string, hdPathIndex?: number) => Promise<MasterKeyInfo>;
export declare const unlockMasterKeySeed: (password: string, encryptedMasterKeySeed: string) => Promise<boolean>;
export declare const getSerializedWalletFromPhrase: (userMnemonic: string, password: string, hdPathIndex?: number) => Promise<string>;
