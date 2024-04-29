import { KdfConfiguration } from '@cosmjs/proto-signing';

export const bip39Password = (givenP?: string) => (givenP ? `${givenP}` : '');

export const slip10RawIndexes = [44, 606, 0, 0];

// export const masterkey = 'm/';
export const masterkey = (givenM?: string) => (givenM ? `${givenM}/` : 'm/');

// bip44purpose = "44'/";
export const bip44purpose = (slipList = slip10RawIndexes) => `${slipList[0]}'/`;

// stratosCoinType = "606'/0'/0/";
export const stratosCoinType = (slipList = slip10RawIndexes) =>
  `${slipList[1]}'/${slipList[2]}'/${slipList[3]}/`;

// fullKeyPath: "'m/44'/606'/0'/0/",
export const keyPath = (slipList = slip10RawIndexes, givenM?: string) =>
  `${masterkey(givenM)}${bip44purpose(slipList)}${stratosCoinType(slipList)}`;

export const stratosAddressPrefix = 'st';
export const stratosPubkeyPrefix = 'stpub';

export const stratosDenom = 'wei';

export const stratosTopDenom = 'stos';

export const stratosUozDenom = 'uoz';
export const stratosOzDenom = 'oz';

export const kdfConfiguration: KdfConfiguration = {
  algorithm: 'argon2id',
  params: {
    outputLength: 32,
    opsLimit: 24,
    memLimitKib: 12 * 1024,
  },
};

export const encryptionKeyLength = 32;
export const encryptionIterations = 10000;

export const maxHdPathKeyindex = 65535;
