import { createMasterKeySeed } from './keyManager';
import {
  decryptMasterKeySeed,
  encryptMasterKeySeed,
  generateMasterKeySeed,
  getMasterKeySeed,
  getMasterKeySeedPublicKey,
  sign,
  unlockMasterKeySeed,
  verifySignature,
} from './keyUtils';
import { bufferToHexStr, hexStrToBuffer, uint8arrayToHexStr } from './utils';

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

// const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
const masterKeySeedHex =
  'd7564333264ec1b72683b0f24e342fb35c67dd1812c173375101ed1b095e16b57c45cb2eecd216736950ceae58881894b5e7ec9a6a8c9da626b9b2928191d320';
const masterKeySeedPublicKey = 'fEXLLuzSFnNpUM6uWIgYlLXn7JpqjJ2mJrmykoGR0yA=';

const sourcePublicKey = 'bB3/zDDHrfo964xIlogLEwv73MdL81z9Mgx7eydZbBQ=';
const encodedSignData = 'eyBmb286ICdiYXInLCBmb29iYXI6ICdiYXJmb28nIH0=';
const sourceSignature =
  'JqfsQ5ABWPrOcLhgORkv2j80hdypUprEhzTMGKze0N2Q5H1uBhq8zsj8lFFQQB0jc1OKJqjJ/nrIGHxXRXIGCA==';

const sourcePrivateKey =
  'lIFzY0P/SgAIYnG5YVfvewHZA7viZQ+DerMNMozibpVsHf/MMMet+j3rjEiWiAsTC/vcx0vzXP0yDHt7J1lsFA==';

// describe('decryptMasterKeySeed', () => {
//   it('decrypts master key seed', async () => {
//     const decryptedMasterKeySeed = await decryptMasterKeySeed(password, encryptedMasterKeySeedString);
//     if (decryptedMasterKeySeed !== false) {
//       expect(bufferToHexStr(decryptedMasterKeySeed)).toEqual(masterKeySeedHex);
//     }
//   });
//   it('should fail while wrongPassword is used', async () => {
//     await expect(decryptMasterKeySeed(wrongPassword, encryptedMasterKeySeedString)).rejects.toEqual(false);
//   });
// });

// describe('unlockMasterKeySeed', () => {
//   it('should unlock master key seed', async () => {
//     const unlockResult = await unlockMasterKeySeed(password, encryptedMasterKeySeedString);
//     expect(unlockResult).toEqual(true);
//   });
//   it('should fail unlocking with a pwrong password', async () => {
//     const unlockResult = await unlockMasterKeySeed(wrongPassword, encryptedMasterKeySeedString);
//     expect(unlockResult).toEqual(false);
//   });
// });

// describe('encryptMasterKeySeed', () => {
//   it('should encrypt master key seed', async () => {
//     const encryptedMasterKeySeed = encryptMasterKeySeed(password, hexStrToBuffer(masterKeySeedHex));
//     const decryptedMasterKeySeed = await decryptMasterKeySeed(password, encryptedMasterKeySeed.toString());
//     expect(decryptedMasterKeySeed).toEqual(hexStrToBuffer(masterKeySeedHex));
//   });
// });

// describe('getMasterKeySeedPublicKey', () => {
//   it('should return a public key from the master key seed', () => {
//     const testMasterKeySeed = hexStrToBuffer(masterKeySeedHex);
//     const publicKey = getMasterKeySeedPublicKey(testMasterKeySeed);
//     expect(publicKey).toEqual(masterKeySeedPublicKey);
//   });
// });

// describe('generateMasterKeySeed', () => {
//   it('should generate master key seed from a mnemonic phrase', () => {
//     const testMasterKeySeed = generateMasterKeySeed(phrase);
//     expect(testMasterKeySeed).toEqual(hexStrToBuffer(masterKeySeedHex));
//   });
// });

// describe('getMasterKeySeed', () => {
//   it('return master key seed', async () => {
//     const masterKeySeedToTest = await getMasterKeySeed(password, encryptedMasterKeySeedString);
//     expect(uint8arrayToHexStr(masterKeySeedToTest)).toEqual(masterKeySeedHex);
//   });
//   it('rejects with false if a password is wrong', async () => {
//     await expect(getMasterKeySeed(wrongPassword, encryptedMasterKeySeedString)).rejects.toEqual(false);
//   });
// });

// describe('sign', () => {
//   it('signs the message', async () => {
//     const signature = await sign(encodedSignData, sourcePrivateKey);
//     expect(signature).toEqual(sourceSignature);
//   });

//   it("can't sign with a wrong private key", async () => {
//     await expect(sign(encodedSignData, '')).rejects.toEqual(false);
//   });
// });

// describe('verifySignature', () => {
//   it('verifies the signature ', async () => {
//     const result = await verifySignature(encodedSignData, sourceSignature, sourcePublicKey);

//     expect(result).toEqual(true);
//   });
//   it("can't verify the signature if public key is not authentic  ", async () => {
//     const result = await verifySignature(
//       encodedSignData,
//       sourceSignature,
//       masterKeySeed.masterKeySeedPublicKey,
//     );

//     expect(result).toEqual(false);
//   });
//   it("can't verify the signature if public key is corrupted", async () => {
//     await expect(verifySignature(encodedSignData, sourceSignature, 'foo')).rejects.toEqual(false);
//   });
//   it("can't verify the signature if signature is corrupted", async () => {
//     await expect(
//       verifySignature(encodedSignData, 'foo', masterKeySeed.masterKeySeedPublicKey),
//     ).rejects.toEqual(false);
//   });
//   it("can't verify the signature if message is corrupted", async () => {
//     await expect(
//       verifySignature('foo', sourceSignature, masterKeySeed.masterKeySeedPublicKey),
//     ).rejects.toEqual(false);
//   });
// });
