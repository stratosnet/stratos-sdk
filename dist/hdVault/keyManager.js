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
exports.getSerializedWalletFromPhrase = exports.unlockMasterKeySeed = exports.createMasterKeySeed = exports.createMasterKeySeedFromGivenSeed = void 0;
const helpers_1 = require("../services/helpers");
const cosmosWallet = __importStar(require("./cosmosWallet"));
const keyUtils = __importStar(require("./keyUtils"));
const mnemonic_1 = require("./mnemonic");
const createMasterKeySeedFromGivenSeed = async (derivedMasterKeySeed, password) => {
    const encryptedMasterKeySeed = keyUtils.encryptMasterKeySeed(password, derivedMasterKeySeed);
    const pubkey = await cosmosWallet.getMasterKeySeedPublicKey(derivedMasterKeySeed);
    // old address
    // const masterKeySeedAddress = keyUtils.getAddressFromPubKey(pubkey);
    // new address
    const fullPubkey = await cosmosWallet.getMasterKeySeedPublicKeyWithKeccak(derivedMasterKeySeed);
    const masterKeySeedAddress = keyUtils.getAddressFromPubKeyWithKeccak(fullPubkey);
    const masterKeySeedPublicKey = await keyUtils.getAminoPublicKey(pubkey); // 1 amino dep  - encodeAminoPubkey
    const masterKeySeedEncodedPublicKey = await keyUtils.getEncodedPublicKey(masterKeySeedPublicKey);
    const masterKeyInfo = {
        encryptedMasterKeySeed,
        masterKeySeedAddress,
        masterKeySeedPublicKey,
        masterKeySeedEncodedPublicKey,
    };
    return masterKeyInfo;
};
exports.createMasterKeySeedFromGivenSeed = createMasterKeySeedFromGivenSeed;
// exposed outside, used in the DesktopWallet to "create" a wallet
const createMasterKeySeed = async (phrase, password, hdPathIndex = 0) => {
    // log('Generating master key seed');
    const derivedMasterKeySeed = await keyUtils.generateMasterKeySeed(phrase);
    // log('Creating wallet');
    const wallet = await keyUtils.createWalletAtPath(hdPathIndex, (0, mnemonic_1.convertArrayToString)(phrase));
    // log('Calling helper to serialize the wallet');
    let encryptedWalletInfo;
    try {
        encryptedWalletInfo = await keyUtils.serializeWallet(wallet, password);
    }
    catch (error) {
        throw new Error(`could not serialize wallet (sdk), ${error.message}`);
    }
    // log('Creating master key seed info from the seed');
    const legacyMasterKeyInfo = await (0, exports.createMasterKeySeedFromGivenSeed)(derivedMasterKeySeed, password);
    const masterKeyInfo = Object.assign(Object.assign({}, legacyMasterKeyInfo), { encryptedWalletInfo });
    (0, helpers_1.log)('Master key info (the wallet) is created and ready');
    return masterKeyInfo;
};
exports.createMasterKeySeed = createMasterKeySeed;
// exposed outside, used in the DesktopWallet to login
const unlockMasterKeySeed = async (password, encryptedMasterKeySeed) => {
    return await keyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeed);
};
exports.unlockMasterKeySeed = unlockMasterKeySeed;
// helper to provide an encripted, serialized wallet from a given mnemonic
const getSerializedWalletFromPhrase = async (userMnemonic, password, hdPathIndex = 0) => {
    const phrase = (0, mnemonic_1.convertStringToArray)(userMnemonic);
    const masterKeySeedInfo = await (0, exports.createMasterKeySeed)(phrase, password, hdPathIndex);
    const serialized = masterKeySeedInfo.encryptedWalletInfo;
    return serialized;
};
exports.getSerializedWalletFromPhrase = getSerializedWalletFromPhrase;
//# sourceMappingURL=keyManager.js.map