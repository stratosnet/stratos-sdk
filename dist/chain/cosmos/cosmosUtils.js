"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeWithEncryptionKey = exports.deserializeWithEncryptionKey = exports.encryptMasterKeySeed = exports.isGteN = exports.n = exports.isZero = void 0;
const crypto_2 = require("@cosmjs/crypto");
const crypto_3 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const encoding_2 = require("@cosmjs/encoding");
// import { DirectSecp256k1HdWalletOptions } from '@cosmjs/proto-signing';
const utils_1 = require("@cosmjs/utils");
const bn_js_1 = __importDefault(require("bn.js"));
const sjcl_1 = __importDefault(require("sjcl"));
const StratosDirectSecp256k1HdWallet_1 = __importDefault(require("../../crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto_1 = require('@cosmjs/crypto');
function isDerivationJson(thing) {
    if (!(0, utils_1.isNonNullObject)(thing))
        return false;
    if (typeof thing.hdPath !== 'string')
        return false;
    if (typeof thing.prefix !== 'string')
        return false;
    return true;
}
const isZero = (privkey) => {
    return privkey.every(byte => byte === 0);
};
exports.isZero = isZero;
const n = (curve) => {
    switch (curve) {
        case crypto_3.Slip10Curve.Secp256k1:
            return new bn_js_1.default('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
        default:
            throw new Error('curve not supported');
    }
};
exports.n = n;
const isGteN = (curve, privkey) => {
    const keyAsNumber = new bn_js_1.default(privkey);
    return keyAsNumber.gte((0, exports.n)(curve));
};
exports.isGteN = isGteN;
// used in keymanager
const encryptMasterKeySeed = (password, masterKeySeed) => {
    const strMasterKey = (0, encoding_1.toBase64)(masterKeySeed);
    const saltBits = sjcl_1.default.random.randomWords(4);
    const encryptParams = {
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
// export function encrypt(password: string, plaintext: Uint8Array): sjcl.SjclCipherEncrypted {
function encrypt(password, plaintext) {
    const encripted = (0, exports.encryptMasterKeySeed)(password, plaintext);
    return encripted;
}
// export function decrypt(password: string, encryptedMasterKeySeed: string): Uint8Array {
function decrypt(password, encryptedMasterKeySeed) {
    const decrypteCypherText = sjcl_1.default.decrypt(password, encryptedMasterKeySeed);
    const decryptedMasterKeySeed = (0, encoding_1.fromBase64)(decrypteCypherText); // switch (config.algorithm) {
    return decryptedMasterKeySeed;
}
const deserializeWithEncryptionKey = async (password, serialization) => {
    const root = JSON.parse(serialization);
    if (!(0, utils_1.isNonNullObject)(root))
        throw new Error('Root document is not an object.');
    const untypedRoot = root;
    const decryptedBytes = decrypt(password, untypedRoot.data);
    const decryptedDocument = JSON.parse((0, encoding_2.fromUtf8)(decryptedBytes));
    const { mnemonic, accounts } = decryptedDocument;
    (0, utils_1.assert)(typeof mnemonic === 'string');
    if (!Array.isArray(accounts))
        throw new Error("Property 'accounts' is not an array");
    if (!accounts.every(account => isDerivationJson(account))) {
        throw new Error('Account is not in the correct format.');
    }
    const firstPrefix = accounts[0].prefix;
    if (!accounts.every(({ prefix }) => prefix === firstPrefix)) {
        throw new Error('Accounts do not all have the same prefix');
    }
    const hdPaths = accounts.map(({ hdPath }) => (0, crypto_2.stringToPath)(hdPath));
    const options = {
        prefix: firstPrefix,
        hdPaths,
    };
    return StratosDirectSecp256k1HdWallet_1.default.fromMnemonic(mnemonic, options);
};
exports.deserializeWithEncryptionKey = deserializeWithEncryptionKey;
const serializeWithEncryptionKey = (password, wallet) => {
    const walletAccounts = wallet['myAccounts'];
    const dataToEncrypt = {
        mnemonic: wallet.mnemonic,
        accounts: walletAccounts.map(({ hdPath, prefix }) => ({
            hdPath: (0, crypto_2.pathToString)(hdPath),
            prefix: prefix,
        })),
    };
    const dataToEncryptRaw = (0, encoding_2.toUtf8)(JSON.stringify(dataToEncrypt));
    const encryptedData = encrypt(password, dataToEncryptRaw);
    const out = {
        data: encryptedData.toString(),
    };
    return JSON.stringify(out);
};
exports.serializeWithEncryptionKey = serializeWithEncryptionKey;
// export async function createWalletAtPath(
//   hdPathIndex: number,
//   mnemonic: string,
// ): Promise<StratosDirectSecp256k1HdWallet> {
//   const hdPaths = [makeStratosHubPath(hdPathIndex)];
//
//   const options: DirectSecp256k1HdWalletOptions = { ...hdWalletDefaultOptions, hdPaths };
//
//   const wallet = await StratosDirectSecp256k1HdWallet.fromMnemonic(mnemonic, options);
//
//   return wallet;
// }
//# sourceMappingURL=cosmosUtils.js.map