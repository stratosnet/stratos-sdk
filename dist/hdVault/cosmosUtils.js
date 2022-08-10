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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeWithEncryptionKey = exports.serializeWithEncryptionKey = void 0;
var crypto_1 = require("@cosmjs/crypto");
var encoding_1 = require("@cosmjs/encoding");
var proto_signing_1 = require("@cosmjs/proto-signing");
var utils_1 = require("@cosmjs/utils");
var cosmosWallet_1 = require("./cosmosWallet");
// const serializationTypeV1 = 'directsecp256k1hdwallet-v1';
/**
 * This interface describes a JSON object holding the encrypted wallet and the meta data.
 * All fields in here must be JSON types.
 */
// export interface DirectSecp256k1HdWalletSerialization {
//   /** A format+version identifier for this serialization format */
//   readonly type: string;
//   /** Information about the key derivation function (i.e. password to encryption key) */
//   readonly kdf: KdfConfiguration;
//   /** Information about the symmetric encryption */
//   readonly encryption: EncryptionConfiguration;
//   /** An instance of Secp256k1HdWalletData, which is stringified, encrypted and base64 encoded. */
//   readonly data: string;
// }
var serializeWithEncryptionKey = function (password, wallet) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAccounts, dataToEncrypt, dataToEncryptRaw, encryptedData, out;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                walletAccounts = wallet['accounts'];
                dataToEncrypt = {
                    mnemonic: wallet.mnemonic,
                    accounts: walletAccounts.map(function (_a) {
                        var hdPath = _a.hdPath, prefix = _a.prefix;
                        return ({
                            hdPath: (0, crypto_1.pathToString)(hdPath),
                            prefix: prefix,
                        });
                    }),
                };
                dataToEncryptRaw = (0, encoding_1.toUtf8)(JSON.stringify(dataToEncrypt));
                return [4 /*yield*/, (0, cosmosWallet_1.encrypt)(password, dataToEncryptRaw)];
            case 1:
                encryptedData = _a.sent();
                out = {
                    data: encryptedData.toString(),
                };
                return [2 /*return*/, JSON.stringify(out)];
        }
    });
}); };
exports.serializeWithEncryptionKey = serializeWithEncryptionKey;
function isDerivationJson(thing) {
    if (!(0, utils_1.isNonNullObject)(thing))
        return false;
    if (typeof thing.hdPath !== 'string')
        return false;
    if (typeof thing.prefix !== 'string')
        return false;
    return true;
}
var deserializeWithEncryptionKey = function (password, serialization) { return __awaiter(void 0, void 0, void 0, function () {
    var root, untypedRoot, decryptedBytes, decryptedDocument, mnemonic, accounts, firstPrefix, hdPaths;
    return __generator(this, function (_a) {
        root = JSON.parse(serialization);
        if (!(0, utils_1.isNonNullObject)(root))
            throw new Error('Root document is not an object.');
        untypedRoot = root;
        decryptedBytes = (0, cosmosWallet_1.decrypt)(password, untypedRoot.data);
        decryptedDocument = JSON.parse((0, encoding_1.fromUtf8)(decryptedBytes));
        mnemonic = decryptedDocument.mnemonic, accounts = decryptedDocument.accounts;
        (0, utils_1.assert)(typeof mnemonic === 'string');
        if (!Array.isArray(accounts))
            throw new Error("Property 'accounts' is not an array");
        if (!accounts.every(function (account) { return isDerivationJson(account); })) {
            throw new Error('Account is not in the correct format.');
        }
        firstPrefix = accounts[0].prefix;
        if (!accounts.every(function (_a) {
            var prefix = _a.prefix;
            return prefix === firstPrefix;
        })) {
            throw new Error('Accounts do not all have the same prefix');
        }
        hdPaths = accounts.map(function (_a) {
            var hdPath = _a.hdPath;
            return (0, crypto_1.stringToPath)(hdPath);
        });
        return [2 /*return*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
                hdPaths: hdPaths,
                prefix: firstPrefix,
            })];
    });
}); };
exports.deserializeWithEncryptionKey = deserializeWithEncryptionKey;
//# sourceMappingURL=cosmosUtils.js.map