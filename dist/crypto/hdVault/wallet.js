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
exports.deriveKeyPairFromMnemonic = exports.deriveKeyPair = void 0;
const hdVault_1 = require("../../config/hdVault");
const Sdk_1 = __importDefault(require("../../Sdk"));
const deriveManager_1 = require("./deriveManager");
const keyManager = __importStar(require("./keyManager"));
const keyUtils = __importStar(require("./keyUtils"));
// used in externally to switch between keypairs and during create wallet
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
// helper to quickly derive a keypair from a givenMnemonic
const deriveKeyPairFromMnemonic = async (givenMnemonic, hdPathIndex = 0, password = '') => {
    const encryptedMasterKeySeed = await keyManager.getMasterKeySeedFromPhrase(givenMnemonic, password, hdPathIndex);
    const encryptedMasterKeySeedInString = encryptedMasterKeySeed.toString();
    const derivedKeyPair = await (0, exports.deriveKeyPair)(hdPathIndex, password, encryptedMasterKeySeedInString);
    return derivedKeyPair;
};
exports.deriveKeyPairFromMnemonic = deriveKeyPairFromMnemonic;
//# sourceMappingURL=wallet.js.map