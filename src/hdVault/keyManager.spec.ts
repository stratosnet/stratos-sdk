import '@testing-library/jest-dom/extend-expect';
import * as KeyManager from './keyManager';
import * as Mnemonic from './mnemonic';
import * as KeyUtils from './keyUtils';
import sjcl from 'sjcl';

describe('keyManager', () => {
  describe('createMasterKeySeed', () => {
    it('creates master key seed', async () => {
      const password = '123';
      const phrase = Mnemonic.generateMnemonicPhrase(24);

      const encryptedMasterKeySeed = {
        bar: 'foo',
      } as unknown as sjcl.SjclCipherEncrypted;

      const pubkey = {
        foo: 'bar',
      } as unknown as KeyUtils.PubKey;

      const masterKeySeedAddress = 'myMasterKeySeedAddress';

      const encodeAminoPub = new Uint8Array([3, 4]);

      const encodedPublicKey = 'encodedPubKeyOfMine';

      const expected = {
        encryptedMasterKeySeed,
        masterKeySeedAddress,
        masterKeySeedPublicKey: encodeAminoPub,
        masterKeySeedEncodedPublicKey: encodedPublicKey,
      };

      const masterKeySeed = new Uint8Array([1, 2]);

      const spyGenerateMasterKeySeed = jest
        .spyOn(KeyUtils, 'generateMasterKeySeed')
        .mockImplementation(() => {
          return Promise.resolve(masterKeySeed);
        });

      const spyEncryptMasterKeySeed = jest.spyOn(KeyUtils, 'encryptMasterKeySeed').mockImplementation(() => {
        return encryptedMasterKeySeed;
      });

      const spyGetMasterKeySeedPublicKey = jest
        .spyOn(KeyUtils, 'getMasterKeySeedPublicKey')
        .mockImplementation(() => {
          return Promise.resolve(pubkey);
        });

      const spyGetAddressFromPubKey = jest.spyOn(KeyUtils, 'getAddressFromPubKey').mockImplementation(() => {
        return masterKeySeedAddress;
      });

      const spyGetAminoPublicKey = jest.spyOn(KeyUtils, 'getAminoPublicKey').mockImplementation(() => {
        return Promise.resolve(encodeAminoPub);
      });

      const spyGetEncodedPublicKey = jest.spyOn(KeyUtils, 'getEncodedPublicKey').mockImplementation(() => {
        return Promise.resolve(encodedPublicKey);
      });

      const result = await KeyManager.createMasterKeySeed(phrase, password);

      expect(result).toStrictEqual(expected);

      expect(spyGenerateMasterKeySeed).toHaveBeenCalledWith(phrase);
      expect(spyEncryptMasterKeySeed).toHaveBeenCalledWith(password, masterKeySeed);
      expect(spyGetMasterKeySeedPublicKey).toHaveBeenCalledWith(masterKeySeed);
      expect(spyGetAddressFromPubKey).toHaveBeenCalledWith(pubkey);
      expect(spyGetAminoPublicKey).toHaveBeenCalledWith(pubkey);
      expect(spyGetEncodedPublicKey).toHaveBeenCalledWith(encodeAminoPub);

      spyGenerateMasterKeySeed.mockRestore();
      spyEncryptMasterKeySeed.mockRestore();
      spyGetMasterKeySeedPublicKey.mockRestore();
      spyGetAddressFromPubKey.mockRestore();
      spyGetAminoPublicKey.mockRestore();
      spyGetEncodedPublicKey.mockRestore();
    });
  });

  describe('unlockMasterKeySeed', () => {
    it('unlocks master key seed', async () => {
      const password = '123';
      const encryptedMasterKeySeed = 'masterMaster';

      const unlockResult = true;

      const spyUnlockMasterKeySeed = jest.spyOn(KeyUtils, 'unlockMasterKeySeed').mockImplementation(() => {
        return Promise.resolve(unlockResult);
      });

      const result = await KeyManager.unlockMasterKeySeed(password, encryptedMasterKeySeed);

      expect(result).toBe(unlockResult);
      expect(spyUnlockMasterKeySeed).toHaveBeenCalledWith(password, encryptedMasterKeySeed);

      spyUnlockMasterKeySeed.mockRestore();
    });
  });
});
