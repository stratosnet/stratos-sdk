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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import nacl from 'tweetnacl';
const CosmosAmino = __importStar(require("@cosmjs/amino"));
const CosmosCrypto = __importStar(require("@cosmjs/crypto"));
const encoding_1 = require("@cosmjs/encoding");
require("@testing-library/jest-dom/extend-expect");
const sjcl_1 = __importDefault(require("sjcl"));
const KeyUtils = __importStar(require("./keyUtils"));
describe('keyUtils', () => {
    describe('getPublicKeyFromPrivKey', () => {
        it('return a public key from private key', async () => {
            const privkey = new Uint8Array([1, 2, 3, 4, 5]);
            const pubkey = new Uint8Array([5, 6, 7, 8]);
            const compressedPub = new Uint8Array([9, 10, 11]);
            const keyPair = {
                pubkey,
            };
            const mySecp256k1 = CosmosCrypto.Secp256k1;
            const spyMakeKeypair = jest.spyOn(mySecp256k1, 'makeKeypair').mockImplementation(() => {
                return Promise.resolve(keyPair);
            });
            const spyCompressPubkey = jest.spyOn(mySecp256k1, 'compressPubkey').mockImplementation(() => {
                return compressedPub;
            });
            const pubkeyMine = {
                type: 'tendermint/PubKeySecp256k1',
                value: (0, encoding_1.toBase64)(compressedPub),
            };
            const result = await KeyUtils.getPublicKeyFromPrivKey(privkey);
            expect(result).toStrictEqual(pubkeyMine);
            spyMakeKeypair.mockRestore();
            spyCompressPubkey.mockRestore();
        });
    });
    describe('getAminoPublicKey', () => {
        it('returns amino pubkey', async () => {
            const pubkey = {
                foo: 'bar',
                type: 'stratos',
                value: 'foobar',
            };
            const encodedAminoPub = new Uint8Array([1, 2, 3, 4, 5]);
            const spyEncodeAminoPubkey = jest.spyOn(CosmosAmino, 'encodeAminoPubkey').mockImplementation(() => {
                return encodedAminoPub;
            });
            const result = await KeyUtils.getAminoPublicKey(pubkey);
            expect(result).toBe(encodedAminoPub);
            expect(spyEncodeAminoPubkey).toHaveBeenCalledWith(pubkey);
            spyEncodeAminoPubkey.mockRestore();
        });
    });
    // describe('getAddressFromPubKey', () => {
    //   it('returns address from pubkey', () => {
    //     const pubkey = {
    //       foo: 'bar',
    //       type: 'stratos',
    //       value: 'foobar',
    //     } as unknown as KeyUtils.PubKey;
    //
    //     const spyPubkeyToAddress = jest.spyOn(CosmosAmino, 'pubkeyToAddress').mockImplementation(() => {
    //       return '123';
    //     });
    //
    //     const result = KeyUtils.getAddressFromPubKey(pubkey);
    //
    //     expect(result).toBe('123');
    //
    //     expect(spyPubkeyToAddress).toHaveBeenCalledWith(pubkey, 'st');
    //     spyPubkeyToAddress.mockRestore();
    //   });
    // });
    describe('getEncodedPublicKey', () => {
        it('returns encoded public key', async () => {
            const encodedAminoPub = new Uint8Array([1, 2, 3, 4, 5]);
            const result = await KeyUtils.getEncodedPublicKey(encodedAminoPub);
            expect(result).toBe('stpub1qypqxpq9sjvpxu');
        });
    });
    describe('getMasterKeySeedPublicKey', () => {
        it('returns master key see public key', async () => {
            const masterKeySeed = new Uint8Array([1, 2]);
            const pubkey = {
                foo: 'bar',
            };
            const privkey = new Uint8Array([1, 2]);
            const spyGetMasterKeySeedPriveKey = jest
                .spyOn(KeyUtils, 'getMasterKeySeedPriveKey')
                .mockImplementation(() => {
                return privkey;
            });
            const spyGetPublicKeyFromPrivKey = jest
                .spyOn(KeyUtils, 'getPublicKeyFromPrivKey')
                .mockImplementation(() => {
                return Promise.resolve(pubkey);
            });
            const result = await KeyUtils.getMasterKeySeedPublicKey(masterKeySeed);
            expect(result).toBe(pubkey);
            spyGetMasterKeySeedPriveKey.mockRestore();
            spyGetPublicKeyFromPrivKey.mockRestore();
        });
    });
    describe('encryptMasterKeySeed', () => {
        it('encrypts master key seed', async () => {
            const password = '123';
            const masterKeySeed = new Uint8Array([1, 2]);
            const encryptedMasterKeySeed = {
                foo: 'bar',
            };
            const saltBits = sjcl_1.default.random.randomWords(4);
            const sjclRandom = sjcl_1.default.random;
            const spyRandomWords = jest.spyOn(sjclRandom, 'randomWords').mockImplementation(() => {
                return saltBits;
            });
            const spyEncrypt = jest.spyOn(sjcl_1.default, 'encrypt').mockImplementation(() => {
                return encryptedMasterKeySeed;
            });
            await KeyUtils.encryptMasterKeySeed(password, masterKeySeed);
            const encryptParams = {
                v: 1,
                iter: 1000,
                ks: 128,
                mode: 'gcm',
                adata: '',
                cipher: 'aes',
                salt: saltBits,
                iv: saltBits,
            };
            expect(spyEncrypt).toHaveBeenCalledWith(password, (0, encoding_1.toBase64)(masterKeySeed), encryptParams);
            spyEncrypt.mockRestore();
            spyRandomWords.mockRestore();
        });
    });
    describe('decryptMasterKeySeed', () => {
        it('decrypts master key seed', async () => {
            const password = '123';
            const encryptedMasterKeySeed = 'fooBar';
            const decryptedMasterKeySeed = new Uint8Array([1, 2]);
            const decrypteCypherText = (0, encoding_1.toBase64)(decryptedMasterKeySeed);
            const spyDecrypt = jest.spyOn(sjcl_1.default, 'decrypt').mockImplementation(() => {
                return decrypteCypherText;
            });
            const result = await KeyUtils.decryptMasterKeySeed(password, encryptedMasterKeySeed);
            expect(result).toStrictEqual(decryptedMasterKeySeed);
            spyDecrypt.mockRestore();
        });
        it('rejects with false if sjcl.decrypt fails', async () => {
            const password = '123';
            const encryptedMasterKeySeed = 'fooBar';
            const spyDecrypt = jest.spyOn(sjcl_1.default, 'decrypt').mockImplementation(() => {
                throw new Error('boom');
            });
            await expect(KeyUtils.decryptMasterKeySeed(password, encryptedMasterKeySeed)).rejects.toEqual(false);
            spyDecrypt.mockRestore();
        });
        it('rejects with false if fromBase64 fails', async () => {
            const password = '123';
            const encryptedMasterKeySeed = 'fooBar';
            const decrypteCypherText = 'foobar';
            const spyDecrypt = jest.spyOn(sjcl_1.default, 'decrypt').mockImplementation(() => {
                return decrypteCypherText;
            });
            await expect(KeyUtils.decryptMasterKeySeed(password, encryptedMasterKeySeed)).rejects.toEqual(false);
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
    // describe('sign', () => {
    //   it('signs the message', async () => {
    //     const message = toBase64(new Uint8Array([1, 2]));
    //     const privateKey = toBase64(new Uint8Array([4, 34, 1]));
    //     const signature = new Uint8Array([40, 30, 20]);
    //     const naclSign = nacl.sign;
    //     const spyDetached = jest.spyOn(naclSign, 'detached').mockImplementation(() => {
    //       return signature;
    //     });
    //     const result = await KeyUtils.sign(message, privateKey);
    //     const expected = toBase64(signature);
    //     expect(result).toBe(expected);
    //     spyDetached.mockRestore();
    //   });
    //   it('rejects with false if signing throws an error', async () => {
    //     const message = 'aaa';
    //     const privateKey = toBase64(new Uint8Array([4, 34, 1]));
    //     const signature = new Uint8Array([40, 30, 20]);
    //     const naclSign = nacl.sign;
    //     const spyDetached = jest.spyOn(naclSign, 'detached').mockImplementation(() => {
    //       return signature;
    //     });
    //     await expect(KeyUtils.sign(message, privateKey)).rejects.toEqual(false);
    //     spyDetached.mockRestore();
    //   });
    // });
    // describe('verifySignature', () => {
    //   it('verifies signature', async () => {
    //     const message = toBase64(new Uint8Array([1, 2]));
    //     const signature = toBase64(new Uint8Array([4, 34, 1]));
    //     const publicKey = toBase64(new Uint8Array([5, 35, 2]));
    //     const verifyResult = true;
    //     const naclDetached = nacl.sign.detached;
    //     const spyVerify = jest.spyOn(naclDetached, 'verify').mockImplementation(() => {
    //       return verifyResult;
    //     });
    //     const result = await KeyUtils.verifySignature(message, signature, publicKey);
    //     expect(result).toBe(true);
    //     spyVerify.mockRestore();
    //   });
    //   it('rejects with false if signature verification throws an error', async () => {
    //     const message = toBase64(new Uint8Array([1, 2]));
    //     const signature = toBase64(new Uint8Array([4, 34, 1]));
    //     const publicKey = 'foo';
    //     const verifyResult = false;
    //     const naclDetached = nacl.sign.detached;
    //     const spyVerify = jest.spyOn(naclDetached, 'verify').mockImplementation(() => {
    //       return verifyResult;
    //     });
    //     await expect(KeyUtils.verifySignature(message, signature, publicKey)).rejects.toEqual(false);
    //     spyVerify.mockRestore();
    //   });
    // });
});
//# sourceMappingURL=keyUtils.spec.js.map