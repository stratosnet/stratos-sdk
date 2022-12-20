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
require("@testing-library/jest-dom/extend-expect");
const KeyManager = __importStar(require("./keyManager"));
const KeyUtils = __importStar(require("./keyUtils"));
const Mnemonic = __importStar(require("./mnemonic"));
describe('keyManager', () => {
    describe('createMasterKeySeed', () => {
        it('creates master key seed', async () => {
            const password = '123';
            const phrase = Mnemonic.generateMnemonicPhrase(24);
            const encryptedMasterKeySeed = {
                bar: 'foo',
            };
            const pubkey = {
                foo: 'bar',
            };
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
            const spyGetAddressFromPubKey = jest
                .spyOn(KeyUtils, 'getAddressFromPubKeyWithKeccak')
                .mockImplementation(() => {
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
//# sourceMappingURL=keyManager.spec.js.map