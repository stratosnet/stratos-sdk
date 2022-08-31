import { KdfConfiguration } from '@cosmjs/proto-signing';

export const masterkey = 'm/';

export const bip44purpose = "44'/";
export const bip39Password = '';

export const stratosCoinType = "606'/0'/0/";
export const stratosAddressPrefix = 'st';
export const stratosPubkeyPrefix = 'stpub';
export const stratosDenom = 'ustos';
export const stratosTopDenom = 'stos';

export const stratosUozDenom = 'uoz';
export const stratosOzDenom = 'oz';

export const keyPath = `${masterkey}${bip44purpose}${stratosCoinType}`;

export const keyPathPattern = `${keyPath}a`;

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
