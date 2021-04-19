import { keyPath, keyPathSuffix } from '../config/hdVault';
import {
  deriveAddress,
  deriveAddressFromPhrase,
  deriveKeyPairFromPrivateKeySeed,
  deriveMasterKey,
  derivePrivateKeySeed,
} from './deriveManager';
import { generateMasterKeySeed } from './keyUtils';
import { bufferToHexStr } from './utils';

const phrase = [
  { index: 1, word: 'rate' },
  { index: 2, word: 'seminar' },
  { index: 3, word: 'essence' },
  { index: 4, word: 'abandon' },
  { index: 5, word: 'sure' },
  { index: 6, word: 'grab' },
  { index: 7, word: 'submit' },
  { index: 8, word: 'scare' },
  { index: 9, word: 'rather' },
  { index: 10, word: 'front' },
  { index: 11, word: 'dune' },
  { index: 12, word: 'planet' },
  { index: 13, word: 'bag' },
  { index: 14, word: 'cheap' },
  { index: 15, word: 'first' },
  { index: 16, word: 'rude' },
  { index: 17, word: 'enjoy' },
  { index: 18, word: 'harvest' },
  { index: 19, word: 'motor' },
  { index: 20, word: 'demise' },
  { index: 21, word: 'tennis' },
  { index: 22, word: 'erase' },
  { index: 23, word: 'poet' },
  { index: 24, word: 'pole' },
];

const masterKeySeedPublicKey = 'fEXLLuzSFnNpUM6uWIgYlLXn7JpqjJ2mJrmykoGR0yA=';
const masterKeySeedAddress = 'st1yx3kkx9jnqeck59j744nc5qgtv4lt4dc45jcwz';
const derivedMasterKeySeed = generateMasterKeySeed(phrase);

const masterKeySeed = bufferToHexStr(derivedMasterKeySeed);
const masterKey = deriveMasterKey(masterKeySeed);

describe('deriveAddress', () => {
  it('should return an address from the public key', () => {
    const address = deriveAddress(masterKeySeedPublicKey);
    expect(address).toEqual(masterKeySeedAddress);
  });
});

describe('deriveAddressFromPhrase', () => {
  it('derives address from a given phrase', () => {
    const retrivedAddress = deriveAddressFromPhrase(phrase);
    expect(retrivedAddress).toEqual(masterKeySeedAddress);
  });
});

describe('deriveKeyPairFromPrivateKeySeed', () => {
  it('derives keypair from private key seed', async () => {
    const privateKeySeed = derivePrivateKeySeed(masterKey, `${keyPath}${0}${keyPathSuffix}`);

    const { publicKey, privateKey } = await deriveKeyPairFromPrivateKeySeed(privateKeySeed);

    expect(publicKey.length).toEqual(44);
    expect(privateKey.length).toEqual(88);
  });

  it('rejects with false when wrong privateKeySeed is used', async () => {
    await expect(deriveKeyPairFromPrivateKeySeed(Buffer.from(''))).rejects.toEqual(false);
  });
});

describe('deriveMasterKey', () => {
  it('derives master key', () => {
    const testMasterKey = deriveMasterKey(masterKeySeed);
    expect(testMasterKey.length).toEqual(32);
  });
});

describe('derivePrivateKeySeed', () => {
  it('derives private key seed', () => {
    const testPrivateKeySeed = derivePrivateKeySeed(masterKey, `${keyPath}${0}${keyPathSuffix}`);

    expect(testPrivateKeySeed.length).toEqual(32);
  });
});
