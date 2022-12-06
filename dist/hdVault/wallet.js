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
exports.deserializeEncryptedWallet = exports.deriveKeyPair = exports.stratosUozDenom = exports.stratosTopDenom = exports.stratosOzDenom = exports.stratosDenom = void 0;
var hdVault_1 = require("../config/hdVault");
var cosmosUtils_1 = require("./cosmosUtils");
var deriveManager_1 = require("./deriveManager");
var keyUtils = __importStar(require("./keyUtils"));
var hdVault_2 = require("../config/hdVault");
Object.defineProperty(exports, "stratosDenom", { enumerable: true, get: function () { return hdVault_2.stratosDenom; } });
Object.defineProperty(exports, "stratosOzDenom", { enumerable: true, get: function () { return hdVault_2.stratosOzDenom; } });
Object.defineProperty(exports, "stratosTopDenom", { enumerable: true, get: function () { return hdVault_2.stratosTopDenom; } });
Object.defineProperty(exports, "stratosUozDenom", { enumerable: true, get: function () { return hdVault_2.stratosUozDenom; } });
var deriveKeyPair = function (keyIndex, password, encryptedMasterKeySeed) { return __awaiter(void 0, void 0, void 0, function () {
    var masterKeySeed, er_1, path, privateKeySeed, derivedKeyPair, address, encodedPublicKey, privateKey, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, keyUtils.getMasterKeySeed(password, encryptedMasterKeySeed)];
            case 1:
                masterKeySeed = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                er_1 = _a.sent();
                return [2 /*return*/, Promise.reject(false)];
            case 3:
                path = "".concat(hdVault_1.keyPath).concat(keyIndex);
                privateKeySeed = (0, deriveManager_1.derivePrivateKeySeed)(masterKeySeed, path);
                return [4 /*yield*/, (0, deriveManager_1.deriveKeyPairFromPrivateKeySeed)(privateKeySeed)];
            case 4:
                derivedKeyPair = _a.sent();
                address = derivedKeyPair.address, encodedPublicKey = derivedKeyPair.encodedPublicKey, privateKey = derivedKeyPair.privateKey;
                res = {
                    keyIndex: keyIndex,
                    address: address,
                    publicKey: encodedPublicKey,
                    privateKey: privateKey,
                };
                return [2 /*return*/, res];
        }
    });
}); };
exports.deriveKeyPair = deriveKeyPair;
var deserializeEncryptedWallet = function (serializedWallet, password) { return __awaiter(void 0, void 0, void 0, function () {
    var deserializedWallet, error_1, msg, errorMsg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, cosmosUtils_1.deserializeWithEncryptionKey)(password, serializedWallet)];
            case 1:
                // deserializedWallet = await DirectSecp256k1HdWallet.deserializeWithEncryptionKey(
                deserializedWallet = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                msg = "\"".concat(error_1.message, "\", w \"").concat(serializedWallet, "\"");
                errorMsg = "could not deserialize / decode wallet ".concat(msg);
                console.log(errorMsg);
                throw new Error(errorMsg);
            case 3:
                if (!deserializedWallet) {
                    return [2 /*return*/, Promise.reject(false)];
                }
                return [2 /*return*/, deserializedWallet];
        }
    });
}); };
exports.deserializeEncryptedWallet = deserializeEncryptedWallet;
// export const sign = async ({
//   message,
//   password,
//   encryptedMasterKeySeed,
//   signingKeyPath,
// }: TransactionMessage): Promise<string> => {
//   let masterKeySeed;
//   try {
//     masterKeySeed = await keyUtils.getMasterKeySeed(password, encryptedMasterKeySeed);
//   } catch (er) {
//     return Promise.reject(false);
//   }
//   const privateKeySeed = derivePrivateKeySeed(masterKeySeed, signingKeyPath);
//   const { privateKey } = await deriveKeyPairFromPrivateKeySeed(privateKeySeed);
//   try {
//     const signature = await keyUtils.sign(message, privateKey);
//     return signature;
//   } catch (error) {
//     return Promise.reject(false);
//   }
// };
// export const verifySignature = async (
//   message: string,
//   signature: string,
//   publicKey: string,
// ): Promise<boolean> => {
//   try {
//     const verifyResult = await keyUtils.verifySignature(message, signature, publicKey);
//     return verifyResult;
//   } catch (err) {
//     return Promise.resolve(false);
//   }
// };
//# sourceMappingURL=wallet.js.map