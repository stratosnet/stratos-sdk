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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var CosmosCrypto = __importStar(require("@cosmjs/crypto"));
var encoding_1 = require("@cosmjs/encoding");
require("@testing-library/jest-dom/extend-expect");
var DeriveManager = __importStar(require("./deriveManager"));
var KeyUtils = __importStar(require("./keyUtils"));
var Mnemonic = __importStar(require("./mnemonic"));
describe('deriveManager', function () {
    describe('deriveAddressFromPhrase', function () {
        it('derives address from given mnemonic phrase', function () { return __awaiter(void 0, void 0, void 0, function () {
            var phrase, masterKeySeed, pubkey, address, spyGenerateMasterKeySeed, spyGetMasterKeySeedPublicKey, spyGetAddressFromPubKey, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        phrase = Mnemonic.generateMnemonicPhrase(24);
                        masterKeySeed = new Uint8Array([1, 2]);
                        pubkey = {
                            foo: 'bar',
                        };
                        address = 'myAddrr123';
                        spyGenerateMasterKeySeed = jest
                            .spyOn(KeyUtils, 'generateMasterKeySeed')
                            .mockImplementation(function () {
                            return Promise.resolve(masterKeySeed);
                        });
                        spyGetMasterKeySeedPublicKey = jest
                            .spyOn(KeyUtils, 'getMasterKeySeedPublicKey')
                            .mockImplementation(function () {
                            return Promise.resolve(pubkey);
                        });
                        spyGetAddressFromPubKey = jest.spyOn(KeyUtils, 'getAddressFromPubKey').mockImplementation(function () {
                            return address;
                        });
                        return [4 /*yield*/, DeriveManager.deriveAddressFromPhrase(phrase)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(address);
                        expect(spyGenerateMasterKeySeed).toBeCalledWith(phrase);
                        expect(spyGetMasterKeySeedPublicKey).toBeCalledWith(masterKeySeed);
                        expect(spyGetAddressFromPubKey).toBeCalledWith(pubkey);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('deriveKeyPairFromPrivateKeySeed', function () {
        it('derives keypair from private key seed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var privkey, encodeAminoPub, address, encodedPublicKey, pubkey, spyGetPublicKeyFromPrivKey, spyGetAminoPublicKey, spyGetEncodedPublicKey, spyGetAddressFromPubKey, result, expected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privkey = new Uint8Array([1, 2]);
                        encodeAminoPub = new Uint8Array([3, 4]);
                        address = 'myAddrr123';
                        encodedPublicKey = 'encodedPubKeyOfMine';
                        pubkey = {
                            foo: 'bar',
                        };
                        spyGetPublicKeyFromPrivKey = jest
                            .spyOn(KeyUtils, 'getPublicKeyFromPrivKey')
                            .mockImplementation(function () {
                            return Promise.resolve(pubkey);
                        });
                        spyGetAminoPublicKey = jest.spyOn(KeyUtils, 'getAminoPublicKey').mockImplementation(function () {
                            return Promise.resolve(encodeAminoPub);
                        });
                        spyGetEncodedPublicKey = jest.spyOn(KeyUtils, 'getEncodedPublicKey').mockImplementation(function () {
                            return Promise.resolve(encodedPublicKey);
                        });
                        spyGetAddressFromPubKey = jest.spyOn(KeyUtils, 'getAddressFromPubKey').mockImplementation(function () {
                            return address;
                        });
                        return [4 /*yield*/, DeriveManager.deriveKeyPairFromPrivateKeySeed(privkey)];
                    case 1:
                        result = _a.sent();
                        expected = {
                            address: address,
                            publicKey: encodeAminoPub,
                            encodedPublicKey: encodedPublicKey,
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
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getSlip10', function () {
        it('returns cosmojsCrypto slip10 (as a helper)', function () {
            var result = DeriveManager.getSlip10();
            expect(result).toBe(CosmosCrypto.Slip10);
        });
    });
    describe('derivePrivateKeySeed', function () {
        it('derives private key seed', function () {
            var masterKey = new Uint8Array([1, 2]);
            var keyPath = 'm/boo/foo';
            var myPrivKey = 'priv12345';
            var convertedPath = {
                foo: 'bar',
            };
            var spyStringToPath = jest.spyOn(CosmosCrypto, 'stringToPath').mockImplementation(function () {
                return convertedPath;
            });
            var fakeSlip10 = {
                derivePath: jest.fn(function () {
                    return fakeDerivedPath;
                }),
            };
            var spySlip10 = jest.spyOn(DeriveManager, 'getSlip10').mockImplementation(function () {
                return fakeSlip10;
            });
            var fakeDerivedPath = {
                privkey: myPrivKey,
            };
            var spyDerivePath = jest.spyOn(fakeSlip10, 'derivePath').mockImplementation(function () {
                return fakeDerivedPath;
            });
            var result = DeriveManager.derivePrivateKeySeed(masterKey, keyPath);
            expect(result).toBe(myPrivKey);
            expect(spyStringToPath).toHaveBeenCalledWith(keyPath);
            expect(spySlip10).toHaveBeenCalled();
            expect(spyDerivePath).toHaveBeenCalledWith(CosmosCrypto.Slip10Curve.Secp256k1, masterKey, convertedPath);
            spyStringToPath.mockRestore();
            spySlip10.mockRestore();
            spyDerivePath.mockRestore();
        });
        it('derives private key seed using different curve', function () {
            var masterKey = new Uint8Array([1, 2]);
            var keyPath = 'm/boo/foo';
            var myPrivKey = 'priv12345';
            var convertedPath = {
                foo: 'bar',
            };
            var spyStringToPath = jest.spyOn(CosmosCrypto, 'stringToPath').mockImplementation(function () {
                return convertedPath;
            });
            var fakeSlip10 = {
                derivePath: jest.fn(function () {
                    return fakeDerivedPath;
                }),
            };
            var spySlip10 = jest.spyOn(DeriveManager, 'getSlip10').mockImplementation(function () {
                return fakeSlip10;
            });
            var fakeDerivedPath = {
                privkey: myPrivKey,
            };
            var spyDerivePath = jest.spyOn(fakeSlip10, 'derivePath').mockImplementation(function () {
                return fakeDerivedPath;
            });
            var result = DeriveManager.derivePrivateKeySeed(masterKey, keyPath, CosmosCrypto.Slip10Curve.Ed25519);
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