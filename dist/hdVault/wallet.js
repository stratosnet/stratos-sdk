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
exports.deserializeEncryptedWallet = exports.deriveKeyPair = exports.stratosUozDenom = exports.stratosTopDenom = exports.stratosOzDenom = exports.stratosDenom = void 0;
const hdVault_1 = require("../config/hdVault");
const Sdk_1 = __importDefault(require("../Sdk"));
const cosmosUtils_1 = require("./cosmosUtils");
const deriveManager_1 = require("./deriveManager");
const keyUtils = __importStar(require("./keyUtils"));
var hdVault_2 = require("../config/hdVault");
Object.defineProperty(exports, "stratosDenom", { enumerable: true, get: function () { return hdVault_2.stratosDenom; } });
Object.defineProperty(exports, "stratosOzDenom", { enumerable: true, get: function () { return hdVault_2.stratosOzDenom; } });
Object.defineProperty(exports, "stratosTopDenom", { enumerable: true, get: function () { return hdVault_2.stratosTopDenom; } });
Object.defineProperty(exports, "stratosUozDenom", { enumerable: true, get: function () { return hdVault_2.stratosUozDenom; } });
const deriveKeyPair = async (keyIndex, password, encryptedMasterKeySeed) => {
    var _a, _b;
    let masterKeySeed;
    if (keyIndex > hdVault_1.maxHdPathKeyindex) {
        throw Error(`hd path index can not be more than ${hdVault_1.maxHdPathKeyindex}`);
    }
    try {
        masterKeySeed = await keyUtils.getMasterKeySeed(password, encryptedMasterKeySeed);
    }
    catch (er) {
        return Promise.reject(false);
    }
    const keyPath = ((_a = Sdk_1.default.environment.keyPathParameters) === null || _a === void 0 ? void 0 : _a.fullKeyPath) ||
        (0, hdVault_1.keyPath)(hdVault_1.slip10RawIndexes, (0, hdVault_1.masterkey)((_b = Sdk_1.default.environment.keyPathParameters) === null || _b === void 0 ? void 0 : _b.masterkey));
    const path = `${keyPath}${keyIndex}`;
    const privateKeySeed = (0, deriveManager_1.derivePrivateKeySeed)(masterKeySeed, path);
    const derivedKeyPair = await (0, deriveManager_1.deriveKeyPairFromPrivateKeySeed)(privateKeySeed);
    const { address, encodedPublicKey, privateKey } = derivedKeyPair;
    const res = {
        keyIndex,
        address,
        publicKey: encodedPublicKey,
        privateKey,
    };
    return res;
};
exports.deriveKeyPair = deriveKeyPair;
const deserializeEncryptedWallet = async (serializedWallet, password) => {
    let deserializedWallet;
    try {
        deserializedWallet = await (0, cosmosUtils_1.deserializeWithEncryptionKey)(password, serializedWallet);
    }
    catch (error) {
        const msg = `"${error.message}", w "${serializedWallet}"`;
        const errorMsg = `could not deserialize / decode wallet ${msg}`;
        console.log(errorMsg);
        throw new Error(errorMsg);
    }
    if (!deserializedWallet) {
        return Promise.reject(false);
    }
    return deserializedWallet;
};
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