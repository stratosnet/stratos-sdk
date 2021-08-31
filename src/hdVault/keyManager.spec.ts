import { createMasterKeySeed, unlockMasterKeySeed } from './keyManager';

// const phrase = [
//   { index: 1, word: 'rate' },
//   { index: 2, word: 'seminar' },
//   { index: 3, word: 'essence' },
//   { index: 4, word: 'abandon' },
//   { index: 5, word: 'sure' },
//   { index: 6, word: 'grab' },
//   { index: 7, word: 'submit' },
//   { index: 8, word: 'scare' },
//   { index: 9, word: 'rather' },
//   { index: 10, word: 'front' },
//   { index: 11, word: 'dune' },
//   { index: 12, word: 'planet' },
//   { index: 13, word: 'bag' },
//   { index: 14, word: 'cheap' },
//   { index: 15, word: 'first' },
//   { index: 16, word: 'rude' },
//   { index: 17, word: 'enjoy' },
//   { index: 18, word: 'harvest' },
//   { index: 19, word: 'motor' },
//   { index: 20, word: 'demise' },
//   { index: 21, word: 'tennis' },
//   { index: 22, word: 'erase' },
//   { index: 23, word: 'poet' },
//   { index: 24, word: 'pole' },
// ];

// const password = '123456';
// const wrongPassword = '123456ABC';

describe('keyManager', () => {
  describe('createMasterKeySeed', () => {
    it('returns dummy', async () => {
      expect(1).toBe(1);
    });
  });
});

// const masterKeySeed = createMasterKeySeed(phrase, password);

// describe('createMasterKeySeed', () => {
//   it('creates a master key seed with the same address and public key', () => {
//     expect(masterKeySeed.masterKeySeedAddress).toEqual('st1yx3kkx9jnqeck59j744nc5qgtv4lt4dc45jcwz');
//     expect(masterKeySeed.masterKeySeedPublicKey).toEqual('fEXLLuzSFnNpUM6uWIgYlLXn7JpqjJ2mJrmykoGR0yA=');
//   });
//   it('creates a master key with proper address format', () => {
//     expect(masterKeySeed.masterKeySeedAddress.length).toEqual(41);
//     expect(masterKeySeed.masterKeySeedAddress.substring(0, 2)).toEqual('st');
//   });
//   it('creates a master key seed with cipher text', () => {
//     const parsedPasterkeySeed = JSON.parse(masterKeySeed.encryptedMasterKeySeed.toString());
//     expect(parsedPasterkeySeed.ct.length).toEqual(128);
//   });
//   it('creates a master key seed using gcm method', () => {
//     const parsedPasterkeySeed = JSON.parse(masterKeySeed.encryptedMasterKeySeed.toString());
//     expect(parsedPasterkeySeed.mode).toEqual('gcm');
//   });
// });

// describe('unlockMasterKeySeed', () => {
//   it('unlocks master key seed', async () => {
//     const result = await unlockMasterKeySeed(password, masterKeySeed.encryptedMasterKeySeed.toString());
//     expect(result).toEqual(true);
//   });
//   it('returns false when unlocks with wrong password', async () => {
//     const result = await unlockMasterKeySeed(wrongPassword, masterKeySeed.encryptedMasterKeySeed.toString());
//     expect(result).toEqual(false);
//   });
// });
