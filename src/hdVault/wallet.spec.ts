import { createMasterKeySeed } from './keyManager';
import { deriveKeyPair } from './wallet';

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

describe('deriveKeyPair', () => {
  const sourceKeyIndex = 0;
  const sourceAddress = 'st14e2wee4zhfg0q29y5ehk2dt8nmc9ta4rj6s598';
  const sourcePublicKey = 'bB3/zDDHrfo964xIlogLEwv73MdL81z9Mgx7eydZbBQ=';

  it('should derive a keypair', async () => {
    const keyPair = await deriveKeyPair(sourceKeyIndex, password, encryptedMasterKeySeedString);
    if (keyPair !== false) {
      const { address, keyIndex, publicKey } = keyPair;
      expect(address).toEqual(sourceAddress);
      expect(keyIndex).toEqual(sourceKeyIndex);
      expect(publicKey).toEqual(sourcePublicKey);
    }
  });

  it('should reject with false when using a wrong password', async () => {
    await expect(deriveKeyPair(sourceKeyIndex, wrongPassword, encryptedMasterKeySeedString)).rejects.toEqual(
      false,
    );
  });
});
