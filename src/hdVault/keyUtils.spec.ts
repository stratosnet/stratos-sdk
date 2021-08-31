import '@testing-library/jest-dom/extend-expect';

import nacl from 'tweetnacl';
import sjcl from 'sjcl';

import { Bech32, fromBase64, toAscii, toBase64 } from '@cosmjs/encoding';
import * as KeyUtils from './keyUtils';

describe('keyUtils', () => {
  describe('decryptMasterKeySeed', () => {
    it('decrypts master key seed', async () => {
      const password = '123';
      const encryptedMasterKeySeed = 'fooBar';
      const decryptedMasterKeySeed = new Uint8Array([1, 2]);
      const decrypteCypherText = toBase64(decryptedMasterKeySeed);

      const spyDecrypt = jest.spyOn(sjcl, 'decrypt').mockImplementation(() => {
        return decrypteCypherText;
      });

      const result = await KeyUtils.decryptMasterKeySeed(password, encryptedMasterKeySeed);
      expect(result).toStrictEqual(decryptedMasterKeySeed);

      spyDecrypt.mockRestore();
    });
    it('rejects with false if sjcl.decrypt fails', async () => {
      const password = '123';
      const encryptedMasterKeySeed = 'fooBar';
      // const decryptedMasterKeySeed = new Uint8Array([1, 2]);
      // const decrypteCypherText = toBase64(decryptedMasterKeySeed);

      const spyDecrypt = jest.spyOn(sjcl, 'decrypt').mockImplementation(() => {
        // return decrypteCypherText;
        throw new Error('boom');
      });

      await expect(KeyUtils.decryptMasterKeySeed(password, encryptedMasterKeySeed)).rejects.toEqual(false);
      // expect(result).toStrictEqual(decryptedMasterKeySeed);

      spyDecrypt.mockRestore();
    });
  });

  describe('unlockMasterKeySeed', () => {
    it('unlocks master key seed', async () => {
      const password = '123';
      const encryptedMasterKeySeed = 'fooBar';

      const decryptedMasterKeySeed = new Uint8Array([1, 2]);

      const spyDecryptMasterKeySeed = jest.spyOn(KeyUtils, 'decryptMasterKeySeed').mockImplementation(() => {
        return Promise.resolve(decryptedMasterKeySeed);
      });

      const result = await KeyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeed);

      expect(result).toEqual(true);

      spyDecryptMasterKeySeed.mockRestore();
    });
    it('resolves with false if unlocking throws an error', async () => {
      const password = '123';
      const encryptedMasterKeySeed = 'fooBar';

      const spyDecryptMasterKeySeed = jest.spyOn(KeyUtils, 'decryptMasterKeySeed').mockImplementation(() => {
        throw new Error('boom');
      });

      await expect(KeyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeed)).resolves.toEqual(false);

      spyDecryptMasterKeySeed.mockRestore();
    });
  });

  describe('getMasterKeySeed', () => {
    it('returns master key seed', async () => {
      const password = '123';
      const encryptedMasterKeySeed = 'fooBar';

      const decryptedMasterKeySeed = new Uint8Array([1, 2]);

      const spyDecryptMasterKeySeed = jest.spyOn(KeyUtils, 'decryptMasterKeySeed').mockImplementation(() => {
        return Promise.resolve(decryptedMasterKeySeed);
      });

      const result = await KeyUtils.getMasterKeySeed(password, encryptedMasterKeySeed);

      expect(result).toEqual(decryptedMasterKeySeed);

      spyDecryptMasterKeySeed.mockRestore();
    });
    it('rejects with false if decription throws an error', async () => {
      const password = '123';
      const encryptedMasterKeySeed = 'fooBar';

      const spyDecryptMasterKeySeed = jest.spyOn(KeyUtils, 'decryptMasterKeySeed').mockImplementation(() => {
        throw new Error('boom');
      });

      await expect(KeyUtils.getMasterKeySeed(password, encryptedMasterKeySeed)).rejects.toEqual(false);

      spyDecryptMasterKeySeed.mockRestore();
    });
    it('rejects with false if decription fails and returns false', async () => {
      const password = '123';
      const encryptedMasterKeySeed = 'fooBar';

      const decryptedMasterKeySeed = false;

      const spyDecryptMasterKeySeed = jest.spyOn(KeyUtils, 'decryptMasterKeySeed').mockImplementation(() => {
        return Promise.resolve(decryptedMasterKeySeed);
      });

      await expect(KeyUtils.getMasterKeySeed(password, encryptedMasterKeySeed)).rejects.toEqual(false);

      spyDecryptMasterKeySeed.mockRestore();
    });
  });

  describe('sign', () => {
    it('signs the message', async () => {
      const message = toBase64(new Uint8Array([1, 2]));
      const privateKey = toBase64(new Uint8Array([4, 34, 1]));
      const signature = new Uint8Array([40, 30, 20]);

      const naclSign = nacl.sign;

      const spyDetached = jest.spyOn(naclSign, 'detached').mockImplementation(() => {
        return signature;
      });

      const result = await KeyUtils.sign(message, privateKey);

      const expected = toBase64(signature);
      expect(result).toBe(expected);

      spyDetached.mockRestore();
    });
    it('rejects with false if signing throws an error', async () => {
      const message = 'aaa';
      const privateKey = toBase64(new Uint8Array([4, 34, 1]));
      const signature = new Uint8Array([40, 30, 20]);

      const naclSign = nacl.sign;

      const spyDetached = jest.spyOn(naclSign, 'detached').mockImplementation(() => {
        return signature;
      });

      await expect(KeyUtils.sign(message, privateKey)).rejects.toEqual(false);

      spyDetached.mockRestore();
    });
  });

  describe('verifySignature', () => {
    it('verifies signature', async () => {
      const message = toBase64(new Uint8Array([1, 2]));
      const signature = toBase64(new Uint8Array([4, 34, 1]));
      const publicKey = toBase64(new Uint8Array([5, 35, 2]));

      const verifyResult = true;

      const naclDetached = nacl.sign.detached;

      const spyVerify = jest.spyOn(naclDetached, 'verify').mockImplementation(() => {
        return verifyResult;
      });

      const result = await KeyUtils.verifySignature(message, signature, publicKey);
      expect(result).toBe(true);

      spyVerify.mockRestore();
    });
    it('rejects with false if signature verification throws an error', async () => {
      const message = toBase64(new Uint8Array([1, 2]));
      const signature = toBase64(new Uint8Array([4, 34, 1]));
      const publicKey = 'foo';

      const verifyResult = false;

      const naclDetached = nacl.sign.detached;

      const spyVerify = jest.spyOn(naclDetached, 'verify').mockImplementation(() => {
        return verifyResult;
      });

      await expect(KeyUtils.verifySignature(message, signature, publicKey)).rejects.toEqual(false);

      spyVerify.mockRestore();
    });
  });
});
