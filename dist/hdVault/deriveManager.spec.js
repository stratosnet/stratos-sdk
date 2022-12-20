"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CosmosCrypto = __importStar(require("@cosmjs/crypto"));
const encoding_1 = require("@cosmjs/encoding");
require("@testing-library/jest-dom/extend-expect");
const DeriveManager = __importStar(require("./deriveManager"));
const KeyUtils = __importStar(require("./keyUtils"));
const Mnemonic = __importStar(require("./mnemonic"));
describe('deriveManager', () => {
    describe('deriveAddressFromPhrase', () => {
        it('derives address from given mnemonic phrase', async () => {
            const phrase = Mnemonic.generateMnemonicPhrase(24);
            const masterKeySeed = new Uint8Array([1, 2]);
            const pubkey = {
                foo: 'bar',
            };
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
            const spyGetAddressFromPubKey = jest
                .spyOn(KeyUtils, 'getAddressFromPubKeyWithKeccak')
                .mockImplementation(() => {
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
            };
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
            const spyGetAddressFromPubKey = jest
                .spyOn(KeyUtils, 'getAddressFromPubKeyWithKeccak')
                .mockImplementation(() => {
                return address;
            });
            const result = await DeriveManager.deriveKeyPairFromPrivateKeySeed(privkey);
            const expected = {
                address,
                publicKey: encodeAminoPub,
                encodedPublicKey,
                privateKey: (0, encoding_1.toHex)(privkey),
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
            };
            const spyStringToPath = jest.spyOn(CosmosCrypto, 'stringToPath').mockImplementation(() => {
                return convertedPath;
            });
            const fakeSlip10 = {
                derivePath: jest.fn(() => {
                    return fakeDerivedPath;
                }),
            };
            const spySlip10 = jest.spyOn(DeriveManager, 'getSlip10').mockImplementation(() => {
                return fakeSlip10;
            });
            const fakeDerivedPath = {
                privkey: myPrivKey,
            };
            const spyDerivePath = jest.spyOn(fakeSlip10, 'derivePath').mockImplementation(() => {
                return fakeDerivedPath;
            });
            const result = DeriveManager.derivePrivateKeySeed(masterKey, keyPath);
            expect(result).toBe(myPrivKey);
            expect(spyStringToPath).toHaveBeenCalledWith(keyPath);
            expect(spySlip10).toHaveBeenCalled();
            expect(spyDerivePath).toHaveBeenCalledWith(CosmosCrypto.Slip10Curve.Secp256k1, masterKey, convertedPath);
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
            };
            const spyStringToPath = jest.spyOn(CosmosCrypto, 'stringToPath').mockImplementation(() => {
                return convertedPath;
            });
            const fakeSlip10 = {
                derivePath: jest.fn(() => {
                    return fakeDerivedPath;
                }),
            };
            const spySlip10 = jest.spyOn(DeriveManager, 'getSlip10').mockImplementation(() => {
                return fakeSlip10;
            });
            const fakeDerivedPath = {
                privkey: myPrivKey,
            };
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
//# sourceMappingURL=deriveManager.spec.js.map