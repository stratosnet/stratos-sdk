import '@testing-library/jest-dom/extend-expect';

import { toHex } from '@cosmjs/encoding';
import * as DeriveManager from './deriveManager';
import * as KeyUtils from './keyUtils';
import * as Mnemonic from './mnemonic';
import * as CosmosCrypto from '@cosmjs/crypto';

describe('deriveManager', () => {
  describe('deriveAddressFromPhrase', () => {
    it('derives address from given mnemonic phrase', async () => {
      const phrase = Mnemonic.generateMnemonicPhrase(24);

      const masterKeySeed = new Uint8Array([1, 2]);

      const pubkey = {
        foo: 'bar',
      } as unknown as KeyUtils.PubKey;

      const address = 'myAddrr123';

      const spyGenerateMasterKeySeed = jest
        .spyOn(KeyUtils, 'generateMasterKeySeed')
        .mockImplementation(() => {
          return Promise.resolve(masterKeySeed);
        });

      const spyGetMasterKeySeedPublicKey = jest
        .spyOn(KeyUtils, 'getMasterKeySeedPublicKey')
        .mockImplementation(() => {
          return Promise.resolve(pubkey);
        });

      const spyGetAddressFromPubKey = jest.spyOn(KeyUtils, 'getAddressFromPubKey').mockImplementation(() => {
        return address;
      });

      const result = await DeriveManager.deriveAddressFromPhrase(phrase);

      expect(result).toBe(address);

      expect(spyGenerateMasterKeySeed).toBeCalledWith(phrase);
      expect(spyGetMasterKeySeedPublicKey).toBeCalledWith(masterKeySeed);
      expect(spyGetAddressFromPubKey).toBeCalledWith(pubkey);
    });
  });

  describe('deriveKeyPairFromPrivateKeySeed', () => {
    it('derives keypair from private key seed', async () => {
      const privkey = new Uint8Array([1, 2]);
      const encodeAminoPub = new Uint8Array([3, 4]);
      const address = 'myAddrr123';
      const encodedPublicKey = 'encodedPubKeyOfMine';

      const pubkey = {
        foo: 'bar',
      } as unknown as KeyUtils.PubKey;

      const spyGetPublicKeyFromPrivKey = jest
        .spyOn(KeyUtils, 'getPublicKeyFromPrivKey')
        .mockImplementation(() => {
          return Promise.resolve(pubkey);
        });

      const spyGetAminoPublicKey = jest.spyOn(KeyUtils, 'getAminoPublicKey').mockImplementation(() => {
        return Promise.resolve(encodeAminoPub);
      });

      const spyGetEncodedPublicKey = jest.spyOn(KeyUtils, 'getEncodedPublicKey').mockImplementation(() => {
        return Promise.resolve(encodedPublicKey);
      });

      const spyGetAddressFromPubKey = jest.spyOn(KeyUtils, 'getAddressFromPubKey').mockImplementation(() => {
        return address;
      });

      const result = await DeriveManager.deriveKeyPairFromPrivateKeySeed(privkey);

      const expected = {
        address,
        publicKey: encodeAminoPub,
        encodedPublicKey,
        privateKey: toHex(privkey),
      };

      expect(result).toStrictEqual(expected);

      expect(spyGetPublicKeyFromPrivKey).toBeCalledWith(privkey);
      expect(spyGetAminoPublicKey).toBeCalledWith(pubkey);
      expect(spyGetEncodedPublicKey).toBeCalledWith(encodeAminoPub);
      expect(spyGetAddressFromPubKey).toBeCalledWith(pubkey);

      spyGetPublicKeyFromPrivKey.mockRestore();
      spyGetAminoPublicKey.mockRestore();
      spyGetEncodedPublicKey.mockRestore();
      spyGetAddressFromPubKey.mockRestore();
    });
  });

  describe('getSlip10', () => {
    it('returns cosmojsCrypto slip10 (as a helper)', () => {
      const result = DeriveManager.getSlip10();
      expect(result).toBe(CosmosCrypto.Slip10);
    });
  });

  describe('derivePrivateKeySeed', () => {
    it('derives private key seed', () => {
      const masterKey = new Uint8Array([1, 2]);
      const keyPath = 'm/boo/foo';

      const myPrivKey = 'priv12345';

      const convertedPath = {
        foo: 'bar',
      } as unknown as CosmosCrypto.HdPath;

      const spyStringToPath = jest.spyOn(CosmosCrypto, 'stringToPath').mockImplementation(() => {
        return convertedPath;
      });

      const fakeSlip10 = {
        derivePath: jest.fn(() => {
          return fakeDerivedPath;
        }),
      } as unknown as typeof CosmosCrypto.Slip10;

      const spySlip10 = jest.spyOn(DeriveManager, 'getSlip10').mockImplementation(() => {
        return fakeSlip10;
      });

      const fakeDerivedPath = {
        privkey: myPrivKey,
      } as unknown as CosmosCrypto.Slip10Result;

      const spyDerivePath = jest.spyOn(fakeSlip10, 'derivePath').mockImplementation(() => {
        return fakeDerivedPath;
      });

      const result = DeriveManager.derivePrivateKeySeed(masterKey, keyPath);
      expect(result).toBe(myPrivKey);

      expect(spyStringToPath).toHaveBeenCalledWith(keyPath);
      expect(spySlip10).toHaveBeenCalled();
      expect(spyDerivePath).toHaveBeenCalledWith(
        CosmosCrypto.Slip10Curve.Secp256k1,
        masterKey,
        convertedPath,
      );

      spyStringToPath.mockRestore();
      spySlip10.mockRestore();
      spyDerivePath.mockRestore();
    });
    it('derives private key seed using different curve', () => {
      const masterKey = new Uint8Array([1, 2]);
      const keyPath = 'm/boo/foo';

      const myPrivKey = 'priv12345';

      const convertedPath = {
        foo: 'bar',
      } as unknown as CosmosCrypto.HdPath;

      const spyStringToPath = jest.spyOn(CosmosCrypto, 'stringToPath').mockImplementation(() => {
        return convertedPath;
      });

      const fakeSlip10 = {
        derivePath: jest.fn(() => {
          return fakeDerivedPath;
        }),
      } as unknown as typeof CosmosCrypto.Slip10;

      const spySlip10 = jest.spyOn(DeriveManager, 'getSlip10').mockImplementation(() => {
        return fakeSlip10;
      });

      const fakeDerivedPath = {
        privkey: myPrivKey,
      } as unknown as CosmosCrypto.Slip10Result;

      const spyDerivePath = jest.spyOn(fakeSlip10, 'derivePath').mockImplementation(() => {
        return fakeDerivedPath;
      });

      const result = DeriveManager.derivePrivateKeySeed(masterKey, keyPath, CosmosCrypto.Slip10Curve.Ed25519);
      expect(result).toBe(myPrivKey);

      expect(spyStringToPath).toHaveBeenCalledWith(keyPath);
      expect(spySlip10).toHaveBeenCalled();
      expect(spyDerivePath).toHaveBeenCalledWith(CosmosCrypto.Slip10Curve.Ed25519, masterKey, convertedPath);

      spyStringToPath.mockRestore();
      spySlip10.mockRestore();
      spyDerivePath.mockRestore();
    });
  });
});
