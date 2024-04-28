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
exports.getMasterKeySeedPublicKeyWithKeccak = exports.getMasterKeySeedPublicKey = exports.getPublicKeyFromPrivKey = exports.getMasterKeySeedPriveKey = exports.createWalletAtPath = exports.serializeWallet = exports.deserializeEncryptedWallet = void 0;
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const StratosDirectSecp256k1HdWallet_1 = __importStar(require("../../crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet"));
const cosmosUtils_1 = require("./cosmosUtils");
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
const serializeWallet = async (wallet, password) => {
    // log('Beginning serializing..');
    let encryptedWalletInfoFour;
    try {
        // encryptedWalletInfoFour = await serializeWithEncryptionKey(password, wallet);
        encryptedWalletInfoFour = (0, cosmosUtils_1.serializeWithEncryptionKey)(password, wallet);
        // log('Serialization with prepared cryptoJs data Uint8 is done. ');
    }
    catch (error) {
        throw new Error(`Could not serialize a wallet with the encryption key. Error4 - ${error.message}`);
    }
    return encryptedWalletInfoFour;
};
exports.serializeWallet = serializeWallet;
async function createWalletAtPath(hdPathIndex, mnemonic) {
    const hdPaths = [(0, StratosDirectSecp256k1HdWallet_1.makeStratosHubPath)(hdPathIndex)];
    const options = Object.assign(Object.assign({}, StratosDirectSecp256k1HdWallet_1.defaultOptions), { hdPaths });
    const wallet = await StratosDirectSecp256k1HdWallet_1.default.fromMnemonic(mnemonic, options);
    return wallet;
}
exports.createWalletAtPath = createWalletAtPath;
const getMasterKeyInfo = (curve, seed) => {
    const i = new crypto_1.Hmac(crypto_1.Sha512, (0, encoding_1.toAscii)(curve)).update(seed).digest();
    const il = i.slice(0, 32);
    const ir = i.slice(32, 64);
    if (curve !== crypto_1.Slip10Curve.Ed25519 && ((0, cosmosUtils_1.isZero)(il) || (0, cosmosUtils_1.isGteN)(curve, il))) {
        return getMasterKeyInfo(curve, i);
    }
    return {
        chainCode: ir,
        privkey: il,
    };
};
const getMasterKeySeedPriveKey = (masterKeySeed) => {
    const masterKeyInfo = getMasterKeyInfo(crypto_1.Slip10Curve.Secp256k1, masterKeySeed);
    const { privkey } = masterKeyInfo;
    return privkey;
};
exports.getMasterKeySeedPriveKey = getMasterKeySeedPriveKey;
const getPublicKeyFromPrivKey = async (privkey) => {
    const { pubkey } = await crypto_1.Secp256k1.makeKeypair(privkey);
    const compressedPub = crypto_1.Secp256k1.compressPubkey(pubkey);
    const pubkeyMine = {
        type: 'stratos/PubKeyEthSecp256k1',
        value: (0, encoding_1.toBase64)(compressedPub),
    };
    return pubkeyMine;
};
exports.getPublicKeyFromPrivKey = getPublicKeyFromPrivKey;
const getMasterKeySeedPublicKey = async (masterKeySeed) => {
    const privkey = (0, exports.getMasterKeySeedPriveKey)(masterKeySeed);
    const pubkey = await (0, exports.getPublicKeyFromPrivKey)(privkey);
    return pubkey;
};
exports.getMasterKeySeedPublicKey = getMasterKeySeedPublicKey;
const getMasterKeySeedPublicKeyWithKeccak = async (masterKeySeed) => {
    const privkey = (0, exports.getMasterKeySeedPriveKey)(masterKeySeed);
    const { pubkey } = await crypto_1.Secp256k1.makeKeypair(privkey);
    return pubkey;
};
exports.getMasterKeySeedPublicKeyWithKeccak = getMasterKeySeedPublicKeyWithKeccak;
//# sourceMappingURL=cosmosWallet.js.map