"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.signWithPrivateKey = exports.encodeSignatureMessage = exports.generateWallets = exports.createWallets = exports.createWalletAtPath = exports.serializeWallet = exports.makePathBuilder = exports.getMasterKeySeed = exports.unlockMasterKeySeed = exports.decryptMasterKeySeed = exports.encryptMasterKeySeed = exports.getMasterKeySeedPublicKey = exports.getEncodedPublicKey = exports.getAddressFromPubKey = exports.getAminoPublicKey = exports.getEncryptionKey = exports.getPublicKeyFromPrivKey = exports.getMasterKeySeedPriveKey = exports.generateMasterKeySeed = exports.makeStratosHubPath = void 0;
var crypto_1 = require("@cosmjs/crypto");
var encoding_1 = require("@cosmjs/encoding");
var proto_signing_1 = require("@cosmjs/proto-signing");
var bn_js_1 = __importDefault(require("bn.js"));
var crypto_js_1 = __importDefault(require("crypto-js"));
var sjcl_1 = __importDefault(require("sjcl"));
var hdVault_1 = require("../config/hdVault");
var helpers_1 = require("../services/helpers");
var cosmosUtils_1 = require("./cosmosUtils");
var mnemonic_1 = require("./mnemonic");
/**
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
function makeStratosHubPath(a) {
    return [
        crypto_1.Slip10RawIndex.hardened(44),
        crypto_1.Slip10RawIndex.hardened(606),
        crypto_1.Slip10RawIndex.hardened(0),
        crypto_1.Slip10RawIndex.normal(0),
        crypto_1.Slip10RawIndex.normal(a),
    ];
}
exports.makeStratosHubPath = makeStratosHubPath;
// @todo - move it - used in getMasterKeyInfo
var isZero = function (privkey) {
    return privkey.every(function (byte) { return byte === 0; });
};
// @todo - move it =  used in isGteN
var n = function (curve) {
    switch (curve) {
        case crypto_1.Slip10Curve.Secp256k1:
            return new bn_js_1.default('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
        default:
            throw new Error('curve not supported');
    }
};
// @todo - move it - used in getMasterKeyInfo
var isGteN = function (curve, privkey) {
    var keyAsNumber = new bn_js_1.default(privkey);
    return keyAsNumber.gte(n(curve));
};
// @todo - move it - used in getMasterKeySeedPriveKey
var getMasterKeyInfo = function (curve, seed) {
    var i = new crypto_1.Hmac(crypto_1.Sha512, (0, encoding_1.toAscii)(curve)).update(seed).digest();
    var il = i.slice(0, 32);
    var ir = i.slice(32, 64);
    if (curve !== crypto_1.Slip10Curve.Ed25519 && (isZero(il) || isGteN(curve, il))) {
        return getMasterKeyInfo(curve, i);
    }
    return {
        chainCode: ir,
        privkey: il,
    };
};
var generateMasterKeySeed = function (phrase) { return __awaiter(void 0, void 0, void 0, function () {
    var stringMnemonic, mnemonicChecked, seed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stringMnemonic = (0, mnemonic_1.convertArrayToString)(phrase);
                console.log('🚀 ~ file: keyUtils.ts ~ line 107 ~ generateMasterKeySeed ~ stringMnemonic', stringMnemonic);
                mnemonicChecked = new crypto_1.EnglishMnemonic(stringMnemonic);
                console.log('🚀 ~ file: keyUtils.ts ~ line 110 ~ generateMasterKeySeed ~ mnemonicChecked', mnemonicChecked);
                return [4 /*yield*/, crypto_1.Bip39.mnemonicToSeed(mnemonicChecked, hdVault_1.bip39Password)];
            case 1:
                seed = _a.sent();
                console.log('🚀 ~ file: keyUtils.ts ~ line 113 ~ generateMasterKeySeed ~ seed', seed);
                return [2 /*return*/, seed];
        }
    });
}); };
exports.generateMasterKeySeed = generateMasterKeySeed;
// helper, not used?
var getMasterKeySeedPriveKey = function (masterKeySeed) {
    var masterKeyInfo = getMasterKeyInfo(crypto_1.Slip10Curve.Secp256k1, masterKeySeed);
    var privkey = masterKeyInfo.privkey;
    return privkey;
};
exports.getMasterKeySeedPriveKey = getMasterKeySeedPriveKey;
// used in derriveManager - deriveKeyPairFromPrivateKeySeed
var getPublicKeyFromPrivKey = function (privkey) { return __awaiter(void 0, void 0, void 0, function () {
    var pubkey, compressedPub, pubkeyMine;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, crypto_1.Secp256k1.makeKeypair(privkey)];
            case 1:
                pubkey = (_a.sent()).pubkey;
                compressedPub = crypto_1.Secp256k1.compressPubkey(pubkey);
                pubkeyMine = {
                    type: 'tendermint/PubKeySecp256k1',
                    value: (0, encoding_1.toBase64)(compressedPub),
                };
                return [2 /*return*/, pubkeyMine];
        }
    });
}); };
exports.getPublicKeyFromPrivKey = getPublicKeyFromPrivKey;
// used in wallet serialization and desirialization
// meant to replace cosmos.js encryption key generation, which uses executeKdf
// and that is using libsodium, (wasm) which is extremelly slow on mobile devices
var getEncryptionKey = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var base64SaltBits, cryptoJsKey, cryptoJsKeyEncoded, keyBuffer, encryptionKey;
    return __generator(this, function (_a) {
        base64SaltBits = 'my salt';
        try {
            cryptoJsKey = crypto_js_1.default.PBKDF2(password, base64SaltBits, {
                keySize: hdVault_1.encryptionKeyLength / 4,
                iterations: hdVault_1.encryptionIterations,
                hasher: crypto_js_1.default.algo.SHA256,
            });
        }
        catch (error) {
            throw new Error("Could not call PBKDF2. Error - " + error.message);
        }
        cryptoJsKeyEncoded = cryptoJsKey.toString(crypto_js_1.default.enc.Base64);
        keyBuffer = Buffer.from(cryptoJsKeyEncoded, 'base64');
        encryptionKey = new Uint8Array(keyBuffer);
        return [2 /*return*/, encryptionKey];
    });
}); };
exports.getEncryptionKey = getEncryptionKey;
var getTendermintPrefixBytes = function () {
    var pubkeyAminoPrefixSecp256k1 = (0, encoding_1.fromHex)('eb5ae987' + '21');
    var pubkeyAminoPrefixSecp256k1Converted = Array.from(pubkeyAminoPrefixSecp256k1);
    return pubkeyAminoPrefixSecp256k1Converted;
};
var encodeStratosPubkey = function (pubkey, appendAminoPreffix) {
    if (appendAminoPreffix === void 0) { appendAminoPreffix = false; }
    var ecodedPubkey = (0, encoding_1.fromBase64)(pubkey.value);
    var ecodedPubkeyConverted = Array.from(ecodedPubkey);
    var pubkeyAminoPrefixSecp256k1Converted = appendAminoPreffix ? getTendermintPrefixBytes() : [];
    var encodedFullPubKey = new Uint8Array(__spreadArray(__spreadArray([], pubkeyAminoPrefixSecp256k1Converted, true), ecodedPubkeyConverted, true));
    return encodedFullPubKey;
};
var getAminoPublicKey = function (pubkey) { return __awaiter(void 0, void 0, void 0, function () {
    var encodedAminoPub;
    return __generator(this, function (_a) {
        encodedAminoPub = encodeStratosPubkey(pubkey);
        return [2 /*return*/, encodedAminoPub];
    });
}); };
exports.getAminoPublicKey = getAminoPublicKey;
function rawSecp256k1PubkeyToRawAddress(pubkeyData) {
    if (pubkeyData.length !== 33) {
        throw new Error("Invalid Secp256k1 pubkey length (compressed): " + pubkeyData.length);
    }
    return (0, crypto_1.ripemd160)((0, crypto_1.sha256)(pubkeyData));
}
function pubkeyToRawAddress(pubkey) {
    var pubkeyData = (0, encoding_1.fromBase64)(pubkey.value);
    return rawSecp256k1PubkeyToRawAddress(pubkeyData);
}
// amino pubkeyToAddress - dep 2 - solved
var getAddressFromPubKey = function (pubkey) {
    var prefix = hdVault_1.stratosAddressPrefix;
    var address = (0, encoding_1.toBech32)(prefix, pubkeyToRawAddress(pubkey));
    return address;
};
exports.getAddressFromPubKey = getAddressFromPubKey;
var getEncodedPublicKey = function (encodedAminoPub) { return __awaiter(void 0, void 0, void 0, function () {
    var encodedPubKey;
    return __generator(this, function (_a) {
        encodedPubKey = (0, encoding_1.toBech32)(hdVault_1.stratosPubkeyPrefix, encodedAminoPub);
        return [2 /*return*/, encodedPubKey];
    });
}); };
exports.getEncodedPublicKey = getEncodedPublicKey;
var getMasterKeySeedPublicKey = function (masterKeySeed) { return __awaiter(void 0, void 0, void 0, function () {
    var privkey, pubkey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                privkey = (0, exports.getMasterKeySeedPriveKey)(masterKeySeed);
                return [4 /*yield*/, (0, exports.getPublicKeyFromPrivKey)(privkey)];
            case 1:
                pubkey = _a.sent();
                return [2 /*return*/, pubkey];
        }
    });
}); };
exports.getMasterKeySeedPublicKey = getMasterKeySeedPublicKey;
// only used in keyManager
var encryptMasterKeySeed = function (password, masterKeySeed) {
    var strMasterKey = (0, encoding_1.toBase64)(masterKeySeed);
    var saltBits = sjcl_1.default.random.randomWords(4);
    var encryptParams = {
        v: 1,
        iter: 1000,
        ks: 128,
        mode: 'gcm',
        adata: '',
        cipher: 'aes',
        salt: saltBits,
        iv: saltBits,
    };
    return sjcl_1.default.encrypt(password, strMasterKey, encryptParams);
};
exports.encryptMasterKeySeed = encryptMasterKeySeed;
// used in unlockMasterKeySeed and getMasterKeySeed - here
var decryptMasterKeySeed = function (password, encryptedMasterKeySeed) { return __awaiter(void 0, void 0, void 0, function () {
    var decrypteCypherText, decryptedMasterKeySeed;
    return __generator(this, function (_a) {
        try {
            decrypteCypherText = sjcl_1.default.decrypt(password, encryptedMasterKeySeed);
            decryptedMasterKeySeed = (0, encoding_1.fromBase64)(decrypteCypherText);
            return [2 /*return*/, decryptedMasterKeySeed];
        }
        catch (err) {
            return [2 /*return*/, Promise.reject(false)];
        }
        return [2 /*return*/];
    });
}); };
exports.decryptMasterKeySeed = decryptMasterKeySeed;
// used in keyManager to call unlockMasterKeySeed
var unlockMasterKeySeed = function (password, encryptedMasterKeySeed) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, exports.decryptMasterKeySeed)(password, encryptedMasterKeySeed)];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
            case 2:
                e_1 = _a.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.unlockMasterKeySeed = unlockMasterKeySeed;
// used in wallet.ts to deriveKeyPair
var getMasterKeySeed = function (password, encryptedMasterKeySeed) { return __awaiter(void 0, void 0, void 0, function () {
    var decryptedMasterKeySeed, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, exports.decryptMasterKeySeed)(password, encryptedMasterKeySeed)];
            case 1:
                decryptedMasterKeySeed = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                return [2 /*return*/, Promise.reject(false)];
            case 3:
                if (!decryptedMasterKeySeed) {
                    return [2 /*return*/, Promise.reject(false)];
                }
                return [2 /*return*/, decryptedMasterKeySeed];
        }
    });
}); };
exports.getMasterKeySeed = getMasterKeySeed;
function makePathBuilder(pattern) {
    if (pattern.indexOf('a') === -1)
        throw new Error('Missing account index variable `a` in pattern.');
    if (pattern.indexOf('a') !== pattern.lastIndexOf('a')) {
        throw new Error('More than one account index variable `a` in pattern.');
    }
    var builder = function (a) {
        var path = pattern.replace('a', a.toString());
        return (0, crypto_1.stringToPath)(path);
    };
    // test builder
    var _path = builder(0);
    return builder;
}
exports.makePathBuilder = makePathBuilder;
// @todo clena up this function and extract different encryption methods into helper functions
var serializeWallet = function (wallet, password) { return __awaiter(void 0, void 0, void 0, function () {
    var encryptedWalletInfoFour, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, helpers_1.log)('Beginning serializing..');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, cosmosUtils_1.serializeWithEncryptionKey)(password, wallet)];
            case 2:
                encryptedWalletInfoFour = _a.sent();
                (0, helpers_1.log)('Serialization with prepared cryptoJs data Uint8 is done. ');
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                throw new Error("Could not serialize a wallet with the encryption key. Error4 - " + error_1.message);
            case 4: 
            // return encryptedWalletInfo;
            return [2 /*return*/, encryptedWalletInfoFour];
        }
    });
}); };
exports.serializeWallet = serializeWallet;
function createWalletAtPath(hdPathIndex, mnemonic) {
    return __awaiter(this, void 0, void 0, function () {
        var addressPrefix, hdPaths, options, wallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addressPrefix = hdVault_1.stratosAddressPrefix;
                    hdPaths = [makeStratosHubPath(hdPathIndex)];
                    options = {
                        bip39Password: '',
                        prefix: addressPrefix,
                        hdPaths: hdPaths,
                    };
                    return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, options)];
                case 1:
                    wallet = _a.sent();
                    // works - way 2
                    // const pathBuilder = makePathBuilder(keyPathPattern);
                    // const path = pathBuilder(hdPathIndex);
                    // const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
                    //   hdPaths: [path],
                    //   prefix: addressPrefix,
                    // });
                    return [2 /*return*/, wallet];
            }
        });
    });
}
exports.createWalletAtPath = createWalletAtPath;
function createWallets(mnemonic, pathBuilder, addressPrefix, numberOfDistributors) {
    return __awaiter(this, void 0, void 0, function () {
        var wallets, numberOfIdentities, i, path, wallet, account, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wallets = new Array();
                    numberOfIdentities = 1 + numberOfDistributors;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < numberOfIdentities)) return [3 /*break*/, 5];
                    path = pathBuilder(i);
                    return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
                            hdPaths: [path],
                            prefix: addressPrefix,
                        })];
                case 2:
                    wallet = _a.sent();
                    return [4 /*yield*/, wallet.getAccounts()];
                case 3:
                    account = (_a.sent())[0];
                    address = account.address;
                    wallets.push([address, wallet]);
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, wallets];
            }
        });
    });
}
exports.createWallets = createWallets;
function generateWallets(quantity, mnemonic) {
    return __awaiter(this, void 0, void 0, function () {
        var pathBuilder, wallets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pathBuilder = makePathBuilder(hdVault_1.keyPathPattern);
                    return [4 /*yield*/, createWallets(mnemonic, pathBuilder, hdVault_1.stratosAddressPrefix, quantity)];
                case 1:
                    wallets = _a.sent();
                    return [2 /*return*/, wallets];
            }
        });
    });
}
exports.generateWallets = generateWallets;
var encodeSignatureMessage = function (message) {
    var messageHash = crypto_js_1.default.SHA256(message).toString();
    var signHashBuf = Buffer.from(messageHash, "hex");
    var encodedMessage = Uint8Array.from(signHashBuf);
    return encodedMessage;
};
exports.encodeSignatureMessage = encodeSignatureMessage;
var signWithPrivateKey = function (signMessageString, privateKey) { return __awaiter(void 0, void 0, void 0, function () {
    var defaultPrivkey, encodedMessage, signature, signatureBytes, sigString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                defaultPrivkey = (0, encoding_1.fromHex)(privateKey);
                encodedMessage = (0, exports.encodeSignatureMessage)(signMessageString);
                return [4 /*yield*/, crypto_1.Secp256k1.createSignature(encodedMessage, defaultPrivkey)];
            case 1:
                signature = _a.sent();
                signatureBytes = signature.toFixedLength().slice(0, -1);
                sigString = (0, encoding_1.toHex)(signatureBytes);
                return [2 /*return*/, sigString];
        }
    });
}); };
exports.signWithPrivateKey = signWithPrivateKey;
var verifySignature = function (signatureMessage, signature, publicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var compressedPubkey, encodedMessage, signatureData, restoredSignature, verifyResult, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                compressedPubkey = (0, encoding_1.fromBase64)(publicKey);
                encodedMessage = (0, exports.encodeSignatureMessage)(signatureMessage);
                signatureData = (0, encoding_1.fromHex)(signature);
                restoredSignature = crypto_1.Secp256k1Signature.fromFixedLength(signatureData);
                return [4 /*yield*/, crypto_1.Secp256k1.verifySignature(restoredSignature, encodedMessage, compressedPubkey)];
            case 1:
                verifyResult = _a.sent();
                return [2 /*return*/, verifyResult];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, Promise.reject(false)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.verifySignature = verifySignature;
//# sourceMappingURL=keyUtils.js.map