"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.signWithPrivateKey = exports.encodeSignatureMessage = exports.makePathBuilder = exports.getMasterKeySeed = exports.unlockMasterKeySeed = exports.decryptMasterKeySeed = exports.getEncodedPublicKey = exports.convertEvmToNativeToAddress = exports.convertNativeToEvmAddress = exports.getAddressFromPubKeyWithKeccak = exports.getAminoPublicKey = exports.generateMasterKeySeed = void 0;
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const keccak_1 = __importDefault(require("keccak"));
const sjcl_1 = __importDefault(require("sjcl"));
const hdVault_1 = require("../../config/hdVault");
const StratosDirectSecp256k1HdWallet_1 = require("../../crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet");
const Sdk_1 = __importDefault(require("../../Sdk"));
const mnemonic_1 = require("./mnemonic");
const generateMasterKeySeed = async (phrase) => {
    var _a;
    const stringMnemonic = (0, mnemonic_1.convertArrayToString)(phrase);
    const mnemonicChecked = new crypto_1.EnglishMnemonic(stringMnemonic);
    const seed = await crypto_1.Bip39.mnemonicToSeed(mnemonicChecked, (0, hdVault_1.bip39Password)((_a = Sdk_1.default.environment.keyPathParameters) === null || _a === void 0 ? void 0 : _a.bip39Password));
    return seed;
};
exports.generateMasterKeySeed = generateMasterKeySeed;
const getTendermintPrefixBytes = () => {
    const pubkeyAminoPrefixSecp256k1 = (0, encoding_1.fromHex)('eb5ae987' + '21');
    const pubkeyAminoPrefixSecp256k1Converted = Array.from(pubkeyAminoPrefixSecp256k1);
    return pubkeyAminoPrefixSecp256k1Converted;
};
const encodeStratosPubkey = (pubkey, appendAminoPreffix = false) => {
    const ecodedPubkey = (0, encoding_1.fromBase64)(pubkey.value);
    const ecodedPubkeyConverted = Array.from(ecodedPubkey);
    const pubkeyAminoPrefixSecp256k1Converted = appendAminoPreffix ? getTendermintPrefixBytes() : [];
    const encodedFullPubKey = new Uint8Array([
        ...pubkeyAminoPrefixSecp256k1Converted,
        ...ecodedPubkeyConverted,
    ]);
    return encodedFullPubKey;
};
const getAminoPublicKey = async (pubkey) => {
    const encodedAminoPub = encodeStratosPubkey(pubkey);
    return encodedAminoPub;
};
exports.getAminoPublicKey = getAminoPublicKey;
const getAddressFromPubKeyWithKeccak = (pubkey) => {
    const prefix = hdVault_1.stratosAddressPrefix;
    const addressChunkOfBytes = (0, StratosDirectSecp256k1HdWallet_1.pubkeyToRawAddressWithKeccak)(pubkey);
    const address = (0, encoding_1.toBech32)(prefix, addressChunkOfBytes);
    return address;
};
exports.getAddressFromPubKeyWithKeccak = getAddressFromPubKeyWithKeccak;
const convertNativeToEvmAddress = (nativeAddress) => {
    const evmAddress = '0x' + (0, encoding_1.toHex)((0, encoding_1.fromBech32)(nativeAddress).data);
    return evmAddress;
};
exports.convertNativeToEvmAddress = convertNativeToEvmAddress;
const convertEvmToNativeToAddress = (evmAddress) => {
    const nativeAddress = (0, encoding_1.toBech32)(hdVault_1.stratosAddressPrefix, (0, encoding_1.fromHex)(evmAddress.replace('0x', '')));
    return nativeAddress;
};
exports.convertEvmToNativeToAddress = convertEvmToNativeToAddress;
const getEncodedPublicKey = async (encodedAminoPub) => {
    const encodedPubKey = (0, encoding_1.toBech32)(hdVault_1.stratosPubkeyPrefix, encodedAminoPub);
    return encodedPubKey;
};
exports.getEncodedPublicKey = getEncodedPublicKey;
// used in unlockMasterKeySeed and getMasterKeySeed - here
const decryptMasterKeySeed = async (password, encryptedMasterKeySeed) => {
    try {
        const decrypteCypherText = sjcl_1.default.decrypt(password, encryptedMasterKeySeed);
        const decryptedMasterKeySeed = (0, encoding_1.fromBase64)(decrypteCypherText);
        return decryptedMasterKeySeed;
    }
    catch (err) {
        return Promise.reject(false);
    }
};
exports.decryptMasterKeySeed = decryptMasterKeySeed;
// used in keyManager to call unlockMasterKeySeed
const unlockMasterKeySeed = async (password, encryptedMasterKeySeed) => {
    try {
        await (0, exports.decryptMasterKeySeed)(password, encryptedMasterKeySeed);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.unlockMasterKeySeed = unlockMasterKeySeed;
// used in wallet.ts to deriveKeyPair
const getMasterKeySeed = async (password, encryptedMasterKeySeed) => {
    let decryptedMasterKeySeed;
    try {
        decryptedMasterKeySeed = await (0, exports.decryptMasterKeySeed)(password, encryptedMasterKeySeed);
    }
    catch (e) {
        return Promise.reject(false);
    }
    if (!decryptedMasterKeySeed) {
        return Promise.reject(false);
    }
    return decryptedMasterKeySeed;
};
exports.getMasterKeySeed = getMasterKeySeed;
function makePathBuilder(pattern) {
    if (pattern.indexOf('a') === -1)
        throw new Error('Missing account index variable `a` in pattern.');
    if (pattern.indexOf('a') !== pattern.lastIndexOf('a')) {
        throw new Error('More than one account index variable `a` in pattern.');
    }
    const builder = function (a) {
        const path = pattern.replace('a', a.toString());
        return (0, crypto_1.stringToPath)(path);
    };
    // test builder
    const _path = builder(0);
    return builder;
}
exports.makePathBuilder = makePathBuilder;
const encodeSignatureMessage = (message) => {
    const signBytesBuffer = Buffer.from(message);
    const keccak256HashOfSigningBytes = (0, keccak_1.default)('keccak256').update(signBytesBuffer).digest();
    const signHashBuf = keccak256HashOfSigningBytes;
    const encodedMessage = Uint8Array.from(signHashBuf);
    return encodedMessage;
};
exports.encodeSignatureMessage = encodeSignatureMessage;
const signWithPrivateKey = async (signMessageString, privateKey) => {
    const defaultPrivkey = (0, encoding_1.fromHex)(privateKey);
    const encodedMessage = (0, exports.encodeSignatureMessage)(signMessageString);
    const signature = await crypto_1.Secp256k1.createSignature(encodedMessage, defaultPrivkey);
    const signatureBytes = signature.toFixedLength().slice(0, -1);
    const sigString = (0, encoding_1.toHex)(signatureBytes);
    return sigString;
};
exports.signWithPrivateKey = signWithPrivateKey;
const verifySignature = async (signatureMessage, signature, publicKey) => {
    try {
        const compressedPubkey = (0, encoding_1.fromBase64)(publicKey);
        const encodedMessage = (0, exports.encodeSignatureMessage)(signatureMessage);
        const signatureData = (0, encoding_1.fromHex)(signature);
        const restoredSignature = crypto_1.Secp256k1Signature.fromFixedLength(signatureData);
        const verifyResult = await crypto_1.Secp256k1.verifySignature(restoredSignature, encodedMessage, compressedPubkey);
        return verifyResult;
    }
    catch (err) {
        return Promise.reject(false);
    }
};
exports.verifySignature = verifySignature;
//# sourceMappingURL=keyUtils.js.map