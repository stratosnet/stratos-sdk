import { Slip10Curve } from '@cosmjs/crypto';

import { keyPath, keyPathSuffix } from '../config/hdVault';
import {
  deriveAddress,
  deriveAddressFromPhrase,
  deriveKeyPairFromPrivateKeySeed,
  derivePrivateKeySeed,
} from './deriveManager';
import { generateMasterKeySeed } from './keyUtils';
import { bufferToHexStr, bufferToUint8Array } from './utils';

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

const masterKeySeedNew = bufferToUint8Array(derivedMasterKeySeed);

const seedEd25519 = 'bc5888d19db1613b1bacae2c9882b8ef27b7d2fa5b57e42b2c2077f6289865c3';
const seedSecp256k1 = '9481736343ff4a00086271b96157ef7b01d903bbe2650f837ab30d328ce26e95';

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
    const privateKeySeed = derivePrivateKeySeed(masterKeySeedNew, `${keyPath}${0}${keyPathSuffix}`);

    const { publicKey, privateKey } = await deriveKeyPairFromPrivateKeySeed(privateKeySeed);

    expect(publicKey.length).toEqual(44);
    expect(privateKey.length).toEqual(88);
  });

  it('rejects with false when wrong privateKeySeed is used', async () => {
    await expect(deriveKeyPairFromPrivateKeySeed(Buffer.from(''))).rejects.toEqual(false);
  });
});

describe('derivePrivateKeySeed', () => {
  it('derives private key seed using default curve', () => {
    const testPrivateKeySeed = derivePrivateKeySeed(masterKeySeedNew, `${keyPath}${0}${keyPathSuffix}`);
    expect(testPrivateKeySeed.length).toEqual(32);

    const str = bufferToHexStr(testPrivateKeySeed);
    expect(str).toEqual(seedSecp256k1);
  });
  it('derives private key seed using Ed25519 curve', () => {
    const testPrivateKeySeed = derivePrivateKeySeed(
      masterKeySeedNew,
      `${keyPath}${0}${keyPathSuffix}`,
      Slip10Curve.Ed25519,
    );
    expect(testPrivateKeySeed.length).toEqual(32);

    const str = bufferToHexStr(testPrivateKeySeed);
    expect(str).toEqual(seedEd25519);
  });
  it('derives private key seed using Secp256k1 curve', () => {
    const testPrivateKeySeed = derivePrivateKeySeed(
      masterKeySeedNew,
      `${keyPath}${0}${keyPathSuffix}`,
      Slip10Curve.Secp256k1,
    );
    expect(testPrivateKeySeed.length).toEqual(32);

    const str = bufferToHexStr(testPrivateKeySeed);
    expect(str).toEqual(seedSecp256k1);
  });
});
