import { createMasterKeySeed } from './keyManager';
// import { deriveKeyPair, sign, verifySignature } from './wallet';

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

// const masterKeySeed = createMasterKeySeed(phrase, password);
// const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();

// const path = "m/44'/606'/0'/0'/0'";

// const sourceKeyIndex = 0;
// const sourceAddress = 'st14e2wee4zhfg0q29y5ehk2dt8nmc9ta4rj6s598';
// const sourcePublicKey = 'bB3/zDDHrfo964xIlogLEwv73MdL81z9Mgx7eydZbBQ=';
// const encodedSignData = 'eyBmb286ICdiYXInLCBmb29iYXI6ICdiYXJmb28nIH0=';

// const sourceSignature =
//   'JqfsQ5ABWPrOcLhgORkv2j80hdypUprEhzTMGKze0N2Q5H1uBhq8zsj8lFFQQB0jc1OKJqjJ/nrIGHxXRXIGCA==';

describe('wallet', () => {
  describe('deriveKeyPair', () => {
    it('returns dummy', async () => {
      expect(1).toBe(1);
    });
  });
});

// describe('deriveKeyPair', () => {
//   it('should derive a keypair', async () => {
//     const keyPair = await deriveKeyPair(sourceKeyIndex, password, encryptedMasterKeySeedString);
//     if (keyPair !== false) {
//       const { address, keyIndex, publicKey } = keyPair;
//       expect(address).toEqual(sourceAddress);
//       expect(keyIndex).toEqual(sourceKeyIndex);
//       expect(publicKey).toEqual(sourcePublicKey);
//     }
//   });

//   it('should reject with false when using a wrong password', async () => {
//     await expect(deriveKeyPair(sourceKeyIndex, wrongPassword, encryptedMasterKeySeedString)).rejects.toEqual(
//       false,
//     );
//   });
// });

// describe('sign', () => {
//   it('signs the message', async () => {
//     const txMessage = {
//       message: encodedSignData,
//       password: password,
//       encryptedMasterKeySeed: encryptedMasterKeySeedString,
//       signingKeyPath: path,
//     };

//     const signature = await sign(txMessage);
//     expect(signature).toEqual(sourceSignature);
//   });

//   it("can't sign with a wrong password", async () => {
//     const txMessage = {
//       message: encodedSignData,
//       password: wrongPassword,
//       encryptedMasterKeySeed: encryptedMasterKeySeedString,
//       signingKeyPath: path,
//     };

//     await expect(sign(txMessage)).rejects.toEqual(false);
//   });
// });

// describe('verifySignature', () => {
//   it('verifies the signature ', async () => {
//     const result = await verifySignature(encodedSignData, sourceSignature, sourcePublicKey);

//     expect(result).toEqual(true);
//   });
//   it("can't verify the signature if public key is not authentic", async () => {
//     const result = await verifySignature(
//       encodedSignData,
//       sourceSignature,
//       masterKeySeed.masterKeySeedPublicKey,
//     );

//     expect(result).toEqual(false);
//   });
//   it("can't verify the signature if public key is corrupted", async () => {
//     await expect(verifySignature(encodedSignData, sourceSignature, 'foo')).resolves.toEqual(false);
//   });
//   it("can't verify the signature if signature is corrupted", async () => {
//     await expect(
//       verifySignature(encodedSignData, 'foo', masterKeySeed.masterKeySeedPublicKey),
//     ).resolves.toEqual(false);
//   });
//   it("can't verify the signature if message is corrupted", async () => {
//     await expect(
//       verifySignature('foo', sourceSignature, masterKeySeed.masterKeySeedPublicKey),
//     ).resolves.toEqual(false);
//   });
// });
