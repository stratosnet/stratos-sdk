"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
var sjcl_1 = __importDefault(require("sjcl"));
// import nacl from 'tweetnacl';
var CosmosAmino = __importStar(require("@cosmjs/amino"));
var CosmosCrypto = __importStar(require("@cosmjs/crypto"));
var encoding_1 = require("@cosmjs/encoding");
var KeyUtils = __importStar(require("./keyUtils"));
describe('keyUtils', function () {
    describe('getPublicKeyFromPrivKey', function () {
        it('return a public key from private key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var privkey, pubkey, compressedPub, keyPair, mySecp256k1, spyMakeKeypair, spyCompressPubkey, pubkeyMine, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privkey = new Uint8Array([1, 2, 3, 4, 5]);
                        pubkey = new Uint8Array([5, 6, 7, 8]);
                        compressedPub = new Uint8Array([9, 10, 11]);
                        keyPair = {
                            pubkey: pubkey,
                        };
                        mySecp256k1 = CosmosCrypto.Secp256k1;
                        spyMakeKeypair = jest.spyOn(mySecp256k1, 'makeKeypair').mockImplementation(function () {
                            return Promise.resolve(keyPair);
                        });
                        spyCompressPubkey = jest.spyOn(mySecp256k1, 'compressPubkey').mockImplementation(function () {
                            return compressedPub;
                        });
                        pubkeyMine = {
                            type: 'tendermint/PubKeySecp256k1',
                            value: (0, encoding_1.toBase64)(compressedPub),
                        };
                        return [4 /*yield*/, KeyUtils.getPublicKeyFromPrivKey(privkey)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(pubkeyMine);
                        spyMakeKeypair.mockRestore();
                        spyCompressPubkey.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAminoPublicKey', function () {
        it('returns amino pubkey', function () { return __awaiter(void 0, void 0, void 0, function () {
            var pubkey, encodedAminoPub, spyEncodeAminoPubkey, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pubkey = {
                            foo: 'bar',
                            type: 'stratos',
                            value: 'foobar',
                        };
                        encodedAminoPub = new Uint8Array([1, 2, 3, 4, 5]);
                        spyEncodeAminoPubkey = jest.spyOn(CosmosAmino, 'encodeAminoPubkey').mockImplementation(function () {
                            return encodedAminoPub;
                        });
                        return [4 /*yield*/, KeyUtils.getAminoPublicKey(pubkey)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(encodedAminoPub);
                        expect(spyEncodeAminoPubkey).toHaveBeenCalledWith(pubkey);
                        spyEncodeAminoPubkey.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAddressFromPubKey', function () {
        it('returns address from pubkey', function () {
            var pubkey = {
                foo: 'bar',
                type: 'stratos',
                value: 'foobar',
            };
            var spyPubkeyToAddress = jest.spyOn(CosmosAmino, 'pubkeyToAddress').mockImplementation(function () {
                return '123';
            });
            var result = KeyUtils.getAddressFromPubKey(pubkey);
            expect(result).toBe('123');
            expect(spyPubkeyToAddress).toHaveBeenCalledWith(pubkey, 'st');
            spyPubkeyToAddress.mockRestore();
        });
    });
    describe('getEncodedPublicKey', function () {
        it('returns encoded public key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var encodedAminoPub, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encodedAminoPub = new Uint8Array([1, 2, 3, 4, 5]);
                        return [4 /*yield*/, KeyUtils.getEncodedPublicKey(encodedAminoPub)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe('stpub1qypqxpq9sjvpxu');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getMasterKeySeedPublicKey', function () {
        it('returns master key see public key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var masterKeySeed, pubkey, privkey, spyGetMasterKeySeedPriveKey, spyGetPublicKeyFromPrivKey, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        masterKeySeed = new Uint8Array([1, 2]);
                        pubkey = {
                            foo: 'bar',
                        };
                        privkey = new Uint8Array([1, 2]);
                        spyGetMasterKeySeedPriveKey = jest
                            .spyOn(KeyUtils, 'getMasterKeySeedPriveKey')
                            .mockImplementation(function () {
                            return privkey;
                        });
                        spyGetPublicKeyFromPrivKey = jest
                            .spyOn(KeyUtils, 'getPublicKeyFromPrivKey')
                            .mockImplementation(function () {
                            return Promise.resolve(pubkey);
                        });
                        return [4 /*yield*/, KeyUtils.getMasterKeySeedPublicKey(masterKeySeed)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(pubkey);
                        spyGetMasterKeySeedPriveKey.mockRestore();
                        spyGetPublicKeyFromPrivKey.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('encryptMasterKeySeed', function () {
        it('encrypts master key seed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var password, masterKeySeed, encryptedMasterKeySeed, saltBits, sjclRandom, spyRandomWords, spyEncrypt, encryptParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = '123';
                        masterKeySeed = new Uint8Array([1, 2]);
                        encryptedMasterKeySeed = {
                            foo: 'bar',
                        };
                        saltBits = sjcl_1.default.random.randomWords(4);
                        sjclRandom = sjcl_1.default.random;
                        spyRandomWords = jest.spyOn(sjclRandom, 'randomWords').mockImplementation(function () {
                            return saltBits;
                        });
                        spyEncrypt = jest.spyOn(sjcl_1.default, 'encrypt').mockImplementation(function () {
                            return encryptedMasterKeySeed;
                        });
                        return [4 /*yield*/, KeyUtils.encryptMasterKeySeed(password, masterKeySeed)];
                    case 1:
                        _a.sent();
                        encryptParams = {
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
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('decryptMasterKeySeed', function () {
        it('decrypts master key seed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var password, encryptedMasterKeySeed, decryptedMasterKeySeed, decrypteCypherText, spyDecrypt, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = '123';
                        encryptedMasterKeySeed = 'fooBar';
                        decryptedMasterKeySeed = new Uint8Array([1, 2]);
                        decrypteCypherText = (0, encoding_1.toBase64)(decryptedMasterKeySeed);
                        spyDecrypt = jest.spyOn(sjcl_1.default, 'decrypt').mockImplementation(function () {
                            return decrypteCypherText;
                        });
                        return [4 /*yield*/, KeyUtils.decryptMasterKeySeed(password, encryptedMasterKeySeed)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(decryptedMasterKeySeed);
                        spyDecrypt.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects with false if sjcl.decrypt fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var password, encryptedMasterKeySeed, spyDecrypt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = '123';
                        encryptedMasterKeySeed = 'fooBar';
                        spyDecrypt = jest.spyOn(sjcl_1.default, 'decrypt').mockImplementation(function () {
                            throw new Error('boom');
                        });
                        return [4 /*yield*/, expect(KeyUtils.decryptMasterKeySeed(password, encryptedMasterKeySeed)).rejects.toEqual(false)];
                    case 1:
                        _a.sent();
                        spyDecrypt.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects with false if fromBase64 fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            var password, encryptedMasterKeySeed, decrypteCypherText, spyDecrypt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = '123';
                        encryptedMasterKeySeed = 'fooBar';
                        decrypteCypherText = 'foobar';
                        spyDecrypt = jest.spyOn(sjcl_1.default, 'decrypt').mockImplementation(function () {
                            return decrypteCypherText;
                        });
                        return [4 /*yield*/, expect(KeyUtils.decryptMasterKeySeed(password, encryptedMasterKeySeed)).rejects.toEqual(false)];
                    case 1:
                        _a.sent();
                        spyDecrypt.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('unlockMasterKeySeed', function () {
        it('unlocks master key seed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var password, encryptedMasterKeySeed, decryptedMasterKeySeed, spyDecryptMasterKeySeed, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = '123';
                        encryptedMasterKeySeed = 'fooBar';
                        decryptedMasterKeySeed = new Uint8Array([1, 2]);
                        spyDecryptMasterKeySeed = jest.spyOn(KeyUtils, 'decryptMasterKeySeed').mockImplementation(function () {
                            return Promise.resolve(decryptedMasterKeySeed);
                        });
                        return [4 /*yield*/, KeyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeed)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(true);
                        spyDecryptMasterKeySeed.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('resolves with false if unlocking throws an error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var password, encryptedMasterKeySeed, spyDecryptMasterKeySeed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = '123';
                        encryptedMasterKeySeed = 'fooBar';
                        spyDecryptMasterKeySeed = jest.spyOn(KeyUtils, 'decryptMasterKeySeed').mockImplementation(function () {
                            throw new Error('boom');
                        });
                        return [4 /*yield*/, expect(KeyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeed)).resolves.toEqual(false)];
                    case 1:
                        _a.sent();
                        spyDecryptMasterKeySeed.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getMasterKeySeed', function () {
        it('returns master key seed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var password, encryptedMasterKeySeed, decryptedMasterKeySeed, spyDecryptMasterKeySeed, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = '123';
                        encryptedMasterKeySeed = 'fooBar';
                        decryptedMasterKeySeed = new Uint8Array([1, 2]);
                        spyDecryptMasterKeySeed = jest.spyOn(KeyUtils, 'decryptMasterKeySeed').mockImplementation(function () {
                            return Promise.resolve(decryptedMasterKeySeed);
                        });
                        return [4 /*yield*/, KeyUtils.getMasterKeySeed(password, encryptedMasterKeySeed)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(decryptedMasterKeySeed);
                        spyDecryptMasterKeySeed.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects with false if decription throws an error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var password, encryptedMasterKeySeed, spyDecryptMasterKeySeed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = '123';
                        encryptedMasterKeySeed = 'fooBar';
                        spyDecryptMasterKeySeed = jest.spyOn(KeyUtils, 'decryptMasterKeySeed').mockImplementation(function () {
                            throw new Error('boom');
                        });
                        return [4 /*yield*/, expect(KeyUtils.getMasterKeySeed(password, encryptedMasterKeySeed)).rejects.toEqual(false)];
                    case 1:
                        _a.sent();
                        spyDecryptMasterKeySeed.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('rejects with false if decription fails and returns false', function () { return __awaiter(void 0, void 0, void 0, function () {
            var password, encryptedMasterKeySeed, decryptedMasterKeySeed, spyDecryptMasterKeySeed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = '123';
                        encryptedMasterKeySeed = 'fooBar';
                        decryptedMasterKeySeed = false;
                        spyDecryptMasterKeySeed = jest.spyOn(KeyUtils, 'decryptMasterKeySeed').mockImplementation(function () {
                            return Promise.resolve(decryptedMasterKeySeed);
                        });
                        return [4 /*yield*/, expect(KeyUtils.getMasterKeySeed(password, encryptedMasterKeySeed)).rejects.toEqual(false)];
                    case 1:
                        _a.sent();
                        spyDecryptMasterKeySeed.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
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