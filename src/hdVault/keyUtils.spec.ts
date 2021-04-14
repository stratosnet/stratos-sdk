import { createMasterKeySeed } from './keyManager';
import {
  decryptMasterKeySeed,
  encryptMasterKeySeed,
  generateMasterKeySeed,
  getMasterKeySeedAddress,
  getMasterKeySeedAddressFromPhrase,
  getMasterKeySeedPublicKey,
  unlockMasterKeySeed,
} from './keyUtils';
import { bufferToHexStr, hexStrToBuffer } from './utils';

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

const password = '123456';
const wrongPassword = '123456ABC';

const masterKeySeed = createMasterKeySeed(phrase, password);

const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
const masterKeySeedHex =
  'd7564333264ec1b72683b0f24e342fb35c67dd1812c173375101ed1b095e16b57c45cb2eecd216736950ceae58881894b5e7ec9a6a8c9da626b9b2928191d320';
const masterKeySeedPublicKey = 'fEXLLuzSFnNpUM6uWIgYlLXn7JpqjJ2mJrmykoGR0yA=';
const masterKeySeedAddress = 'st1yx3kkx9jnqeck59j744nc5qgtv4lt4dc45jcwz';

describe('decryptMasterKeySeed', () => {
  it('decrypts master key seed', async () => {
    const decryptedMasterKeySeed = await decryptMasterKeySeed(password, encryptedMasterKeySeedString);
    expect(bufferToHexStr(decryptedMasterKeySeed)).toEqual(masterKeySeedHex);
  });
  it('should fail while wrongPassword is used', async () => {
    await expect(decryptMasterKeySeed(wrongPassword, encryptedMasterKeySeedString)).rejects.toEqual(
      Buffer.from(''),
    );
  });
});

describe('unlockMasterKeySeed', () => {
  it('should unlock master key seed', async () => {
    const unlockResult = await unlockMasterKeySeed(password, encryptedMasterKeySeedString);
    expect(unlockResult).toEqual(true);
  });
  it('should fail unlocking with a pwrong password', async () => {
    const unlockResult = await unlockMasterKeySeed(wrongPassword, encryptedMasterKeySeedString);
    expect(unlockResult).toEqual(false);
  });
});

describe('encryptMasterKeySeed', () => {
  it('should encrypt master key seed', async () => {
    const encryptedMasterKeySeed = encryptMasterKeySeed(password, hexStrToBuffer(masterKeySeedHex));
    const decryptedMasterKeySeed = await decryptMasterKeySeed(password, encryptedMasterKeySeed.toString());
    expect(decryptedMasterKeySeed).toEqual(hexStrToBuffer(masterKeySeedHex));
  });
});

describe('getMasterKeySeedAddress', () => {
  it('should return an address from the public key', () => {
    const address = getMasterKeySeedAddress(masterKeySeedPublicKey);
    expect(address).toEqual(masterKeySeedAddress);
  });
});

describe('getMasterKeySeedPublicKey', () => {
  it('should return a public key from the master key seed', () => {
    const testMasterKeySeed = hexStrToBuffer(masterKeySeedHex);
    const publicKey = getMasterKeySeedPublicKey(testMasterKeySeed);
    expect(publicKey).toEqual(masterKeySeedPublicKey);
  });
});

describe('generateMasterKeySeed', () => {
  it('should generate master key seed from a mnemonic phrase', () => {
    const testMasterKeySeed = generateMasterKeySeed(phrase);
    expect(testMasterKeySeed).toEqual(hexStrToBuffer(masterKeySeedHex));
  });
});

describe('getMasterKeySeedAddressFromPhrase', () => {
  it('generates master seed keey address from a given phrase', () => {
    const retrivedAddress = getMasterKeySeedAddressFromPhrase(phrase);
    expect(retrivedAddress).toEqual(masterKeySeedAddress);
  });
});
