"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeWithEncryptionKey = exports.serializeWithEncryptionKey = void 0;
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
// import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
const utils_1 = require("@cosmjs/utils");
const StratosDirectSecp256k1HdWallet_1 = __importDefault(require("../hdVault/StratosDirectSecp256k1HdWallet"));
const cosmosWallet_1 = require("./cosmosWallet");
// const serializationTypeV1 = 'directsecp256k1hdwallet-v1';
const serializeWithEncryptionKey = (password, wallet) => {
    // const walletAccounts = wallet['accounts'] as Secp256k1Derivation[];
    const walletAccounts = wallet['myAccounts'];
    const dataToEncrypt = {
        mnemonic: wallet.mnemonic,
        accounts: walletAccounts.map(({ hdPath, prefix }) => ({
            hdPath: (0, crypto_1.pathToString)(hdPath),
            prefix: prefix,
        })),
    };
    const dataToEncryptRaw = (0, encoding_1.toUtf8)(JSON.stringify(dataToEncrypt));
    // const encryptedData = await encrypt(password, dataToEncryptRaw);
    const encryptedData = (0, cosmosWallet_1.encrypt)(password, dataToEncryptRaw);
    const out = {
        data: encryptedData.toString(),
    };
    return JSON.stringify(out);
};
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
const deserializeWithEncryptionKey = async (password, serialization) => {
    const root = JSON.parse(serialization);
    if (!(0, utils_1.isNonNullObject)(root))
        throw new Error('Root document is not an object.');
    const untypedRoot = root;
    const decryptedBytes = (0, cosmosWallet_1.decrypt)(password, untypedRoot.data);
    const decryptedDocument = JSON.parse((0, encoding_1.fromUtf8)(decryptedBytes));
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
    const hdPaths = accounts.map(({ hdPath }) => (0, crypto_1.stringToPath)(hdPath));
    // we would need to update options here as well if we need to use a custom parser
    return StratosDirectSecp256k1HdWallet_1.default.fromMnemonic(mnemonic, {
        hdPaths: hdPaths,
        prefix: firstPrefix,
    });
};
exports.deserializeWithEncryptionKey = deserializeWithEncryptionKey;
//# sourceMappingURL=cosmosUtils.js.map