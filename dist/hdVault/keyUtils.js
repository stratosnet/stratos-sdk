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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.sign = exports.getMasterKeySeed = exports.unlockMasterKeySeed = exports.decryptMasterKeySeed = exports.encryptMasterKeySeed = exports.getMasterKeySeedPublicKey = exports.getEncodedPublicKey = exports.getAddressFromPubKey = exports.getAminoPublicKey = exports.getPublicKeyFromPrivKey = exports.getMasterKeySeedPriveKey = exports.generateMasterKeySeed = void 0;
var amino_1 = require("@cosmjs/amino");
var crypto_1 = require("@cosmjs/crypto");
var encoding_1 = require("@cosmjs/encoding");
var bn_js_1 = __importDefault(require("bn.js"));
var sjcl_1 = __importDefault(require("sjcl"));
var tweetnacl_1 = __importDefault(require("tweetnacl"));
var hdVault_1 = require("../config/hdVault");
var mnemonic_1 = require("./mnemonic");
// @todo - move it
var isZero = function (privkey) {
    return privkey.every(function (byte) { return byte === 0; });
};
// @todo - move it
var n = function (curve) {
    switch (curve) {
        case crypto_1.Slip10Curve.Secp256k1:
            return new bn_js_1.default('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
        default:
            throw new Error('curve not supported');
    }
};
// @todo - move it
var isGteN = function (curve, privkey) {
    var keyAsNumber = new bn_js_1.default(privkey);
    return keyAsNumber.gte(n(curve));
};
// @todo - move it
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
/**
 * @todo add unit test
 */
var generateMasterKeySeed = function (phrase) { return __awaiter(void 0, void 0, void 0, function () {
    var stringMnemonic, mnemonicChecked, seed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stringMnemonic = (0, mnemonic_1.convertArrayToString)(phrase);
                mnemonicChecked = new crypto_1.EnglishMnemonic(stringMnemonic);
                return [4 /*yield*/, crypto_1.Bip39.mnemonicToSeed(mnemonicChecked, hdVault_1.bip39Password)];
            case 1:
                seed = _a.sent();
                return [2 /*return*/, seed];
        }
    });
}); };
exports.generateMasterKeySeed = generateMasterKeySeed;
/**
 * @todo add unit test
 */
var getMasterKeySeedPriveKey = function (masterKeySeed) {
    var masterKeyInfo = getMasterKeyInfo(crypto_1.Slip10Curve.Secp256k1, masterKeySeed);
    var privkey = masterKeyInfo.privkey;
    return privkey;
};
exports.getMasterKeySeedPriveKey = getMasterKeySeedPriveKey;
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
var getAminoPublicKey = function (pubkey) { return __awaiter(void 0, void 0, void 0, function () {
    var encodedAminoPub;
    return __generator(this, function (_a) {
        encodedAminoPub = (0, amino_1.encodeAminoPubkey)(pubkey);
        return [2 /*return*/, encodedAminoPub];
    });
}); };
exports.getAminoPublicKey = getAminoPublicKey;
var getAddressFromPubKey = function (pubkey) {
    var address = (0, amino_1.pubkeyToAddress)(pubkey, hdVault_1.stratosAddressPrefix);
    return address;
};
exports.getAddressFromPubKey = getAddressFromPubKey;
var getEncodedPublicKey = function (encodedAminoPub) { return __awaiter(void 0, void 0, void 0, function () {
    var encodedPubKey;
    return __generator(this, function (_a) {
        encodedPubKey = encoding_1.Bech32.encode(hdVault_1.stratosPubkeyPrefix, encodedAminoPub);
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
var sign = function (message, privateKey) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedMessage, decodedPrivateKey, signature, ecodedSignature;
    return __generator(this, function (_a) {
        try {
            decodedMessage = (0, encoding_1.fromBase64)(message);
            decodedPrivateKey = (0, encoding_1.fromBase64)(privateKey);
            signature = tweetnacl_1.default.sign.detached(Uint8Array.from(decodedMessage), decodedPrivateKey);
            ecodedSignature = (0, encoding_1.toBase64)(signature);
            return [2 /*return*/, ecodedSignature];
        }
        catch (error) {
            return [2 /*return*/, Promise.reject(false)];
        }
        return [2 /*return*/];
    });
}); };
exports.sign = sign;
var verifySignature = function (message, signature, publicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var convertedMessage, formattedMessage, convertedSignature, convertedPubKey, verifyResult;
    return __generator(this, function (_a) {
        try {
            convertedMessage = (0, encoding_1.fromBase64)(message);
            formattedMessage = Uint8Array.from(convertedMessage);
            convertedSignature = (0, encoding_1.fromBase64)(signature);
            convertedPubKey = (0, encoding_1.fromBase64)(publicKey);
            verifyResult = tweetnacl_1.default.sign.detached.verify(formattedMessage, convertedSignature, convertedPubKey);
            return [2 /*return*/, verifyResult];
        }
        catch (err) {
            return [2 /*return*/, Promise.reject(false)];
        }
        return [2 /*return*/];
    });
}); };
exports.verifySignature = verifySignature;
//# sourceMappingURL=keyUtils.js.map