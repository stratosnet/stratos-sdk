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
exports.verifySignature = exports.signWithPrivateKey = exports.encodeSignatureMessage = exports.createWalletAtPath = exports.serializeWallet = exports.makePathBuilder = exports.getMasterKeySeed = exports.unlockMasterKeySeed = exports.decryptMasterKeySeed = exports.encryptMasterKeySeed = exports.getEncodedPublicKey = exports.getAddressFromPubKeyWithKeccak = exports.getAddressFromPubKey = exports.getAminoPublicKey = exports.getEncryptionKey = exports.generateMasterKeySeed = exports.makeStratosHubPath = void 0;
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const crypto_js_1 = __importDefault(require("crypto-js"));
const sjcl_1 = __importDefault(require("sjcl"));
const hdVault_1 = require("../config/hdVault");
const StratosDirectSecp256k1HdWallet_1 = __importStar(require("../hdVault/StratosDirectSecp256k1HdWallet"));
const helpers_1 = require("../services/helpers");
const cosmosUtils_1 = require("./cosmosUtils");
const mnemonic_1 = require("./mnemonic");
// export interface KeyPair {
//   publicKey: string;
//   privateKey: string;
// }
// @todo - move it
// interface Slip10Result {
//   readonly chainCode: Uint8Array;
//   readonly privkey: Uint8Array;
// }
// export interface PubKey {
//   type: string;
//   value: string;
// }
/**
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
function makeStratosHubPath(a) {
    return [
        crypto_1.Slip10RawIndex.hardened(44),
        crypto_1.Slip10RawIndex.hardened(606),
        crypto_1.Slip10RawIndex.hardened(0),
        crypto_1.Slip10RawIndex.normal(0),
        crypto_1.Slip10RawIndex.normal(a),
    ];
}
exports.makeStratosHubPath = makeStratosHubPath;
// @todo - move it - used in getMasterKeyInfo
// const isZero = (privkey: Uint8Array): boolean => {
//   return privkey.every(byte => byte === 0);
// };
// @todo - move it =  used in isGteN
// const n = (curve: Slip10Curve): BN => {
//   switch (curve) {
//     case Slip10Curve.Secp256k1:
//       return new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
//     default:
//       throw new Error('curve not supported');
//   }
// };
// @todo - move it - used in getMasterKeyInfo
// const isGteN = (curve: Slip10Curve, privkey: Uint8Array): boolean => {
//   const keyAsNumber = new BN(privkey);
//   return keyAsNumber.gte(n(curve));
// };
// @todo - move it - used in getMasterKeySeedPriveKey
// const getMasterKeyInfo = (curve: Slip10Curve, seed: Uint8Array): Slip10Result => {
//   const i = new Hmac(Sha512, toAscii(curve)).update(seed).digest();
//   const il = i.slice(0, 32);
//   const ir = i.slice(32, 64);
//
//   if (curve !== Slip10Curve.Ed25519 && (isZero(il) || isGteN(curve, il))) {
//     return getMasterKeyInfo(curve, i);
//   }
//
//   return {
//     chainCode: ir,
//     privkey: il,
//   };
// };
//
const generateMasterKeySeed = async (phrase) => {
    const stringMnemonic = (0, mnemonic_1.convertArrayToString)(phrase);
    // console.log('🚀 ~ file: keyUtils.ts ~ line 107 ~ generateMasterKeySeed ~ stringMnemonic', stringMnemonic);
    const mnemonicChecked = new crypto_1.EnglishMnemonic(stringMnemonic);
    // console.log('🚀 ~ file: keyUtils.ts ~ line 110 ~ generateMasterKeySeed ~ mnemonicChecked', mnemonicChecked);
    const seed = await crypto_1.Bip39.mnemonicToSeed(mnemonicChecked, hdVault_1.bip39Password);
    // console.log('🚀 ~ file: keyUtils.ts ~ line 113 ~ generateMasterKeySeed ~ seed', seed);
    return seed;
};
exports.generateMasterKeySeed = generateMasterKeySeed;
// export const getMasterKeySeedPriveKey = (masterKeySeed: Uint8Array): Uint8Array => {
//   const masterKeyInfo = getMasterKeyInfo(Slip10Curve.Secp256k1, masterKeySeed);
//
//   const { privkey } = masterKeyInfo;
//
//   return privkey;
// };
// used in derriveManager - deriveKeyPairFromPrivateKeySeed
// export const getPublicKeyFromPrivKey = async (privkey: Uint8Array): Promise<PubKey> => {
//   const { pubkey } = await Secp256k1.makeKeypair(privkey);
//
//   const compressedPub = Secp256k1.compressPubkey(pubkey);
//
//   const pubkeyMine = {
//     type: 'tendermint/PubKeySecp256k1',
//     // type: '/stratos.crypto.v1.ethsecp256k1.PubKey',
//     value: toBase64(compressedPub),
//   };
//   console.log('pubkeyMine', pubkeyMine);
//
//   return pubkeyMine;
// };
//
// used in wallet serialization and desirialization
// meant to replace cosmos.js encryption key generation, which uses executeKdf
// and that is using libsodium, (wasm) which is extremelly slow on mobile devices
const getEncryptionKey = async (password) => {
    const base64SaltBits = 'my salt';
    let cryptoJsKey;
    try {
        cryptoJsKey = crypto_js_1.default.PBKDF2(password, base64SaltBits, {
            keySize: hdVault_1.encryptionKeyLength / 4,
            iterations: hdVault_1.encryptionIterations,
            hasher: crypto_js_1.default.algo.SHA256,
        });
    }
    catch (error) {
        throw new Error(`Could not call PBKDF2. Error - ${error.message}`);
    }
    const cryptoJsKeyEncoded = cryptoJsKey.toString(crypto_js_1.default.enc.Base64);
    const keyBuffer = Buffer.from(cryptoJsKeyEncoded, 'base64');
    const encryptionKey = new Uint8Array(keyBuffer);
    return encryptionKey;
};
exports.getEncryptionKey = getEncryptionKey;
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
function rawSecp256k1PubkeyToRawAddress(pubkeyData) {
    if (pubkeyData.length !== 33) {
        throw new Error(`Invalid Secp256k1 pubkey length (compressed): ${pubkeyData.length}`);
    }
    const sha256KeyData = (0, crypto_1.sha256)(pubkeyData);
    const rawSecp256k1RawAddress = (0, crypto_1.ripemd160)(sha256KeyData);
    return rawSecp256k1RawAddress;
}
function pubkeyToRawAddress(pubkey) {
    const pubkeyData = (0, encoding_1.fromBase64)(pubkey.value);
    return rawSecp256k1PubkeyToRawAddress(pubkeyData);
}
// export function pubkeyToRawAddressWithKeccak(pubkey: Uint8Array): Uint8Array {
//   // const compressedPub = Secp256k1.compressPubkey(pubkey);
//
//   const pubkeyBuffer = Buffer.from(pubkey.slice(-64));
//   // const pubkeyBuffer = Buffer.from(compressedPub);
//
//   const keccak256HashOfPubkeyBuffer = createKeccakHash('keccak256').update(pubkeyBuffer).digest();
//   const fullRawAddress = new Uint8Array(keccak256HashOfPubkeyBuffer);
//   // console.log('fullRawAddress', fullRawAddress);
//
//   const addressChunkOfBytes = fullRawAddress.slice(-20);
//   // console.log('addressChunkOfBytes', addressChunkOfBytes);
//
//   const hexAddress = toHex(addressChunkOfBytes);
//   // console.log('hex address', hexAddress);
//
//   const prefix = stratosAddressPrefix;
//   const address = toBech32(prefix, addressChunkOfBytes);
//
//   // console.log('bench32 address', address);
//
//   return addressChunkOfBytes;
// }
// @depricated
const getAddressFromPubKey = (pubkey) => {
    const prefix = hdVault_1.stratosAddressPrefix;
    const addressChunkOfBytes = pubkeyToRawAddress(pubkey);
    const address = (0, encoding_1.toBech32)(prefix, pubkeyToRawAddress(pubkey));
    const hexAddress = (0, encoding_1.toHex)(addressChunkOfBytes);
    console.log('old hex address', hexAddress);
    console.log('old bench32 address', address);
    return address;
};
exports.getAddressFromPubKey = getAddressFromPubKey;
const getAddressFromPubKeyWithKeccak = (pubkey) => {
    const prefix = hdVault_1.stratosAddressPrefix;
    const addressChunkOfBytes = (0, StratosDirectSecp256k1HdWallet_1.pubkeyToRawAddressWithKeccak)(pubkey);
    const hexAddress = (0, encoding_1.toHex)(addressChunkOfBytes);
    console.log('kk hex address', hexAddress);
    const address = (0, encoding_1.toBech32)(prefix, addressChunkOfBytes);
    console.log('kk bench32 address', address);
    return address;
};
exports.getAddressFromPubKeyWithKeccak = getAddressFromPubKeyWithKeccak;
const getEncodedPublicKey = async (encodedAminoPub) => {
    const encodedPubKey = (0, encoding_1.toBech32)(hdVault_1.stratosPubkeyPrefix, encodedAminoPub);
    return encodedPubKey;
};
exports.getEncodedPublicKey = getEncodedPublicKey;
// export const getMasterKeySeedPublicKey = async (masterKeySeed: Uint8Array): Promise<PubKey> => {
//   const privkey = getMasterKeySeedPriveKey(masterKeySeed);
//
//   const pubkey = await getPublicKeyFromPrivKey(privkey);
//
//   return pubkey;
// };
// export const getMasterKeySeedPublicKeyWithKeccak = async (masterKeySeed: Uint8Array): Promise<Uint8Array> => {
//   const privkey = getMasterKeySeedPriveKey(masterKeySeed);
//
//   const { pubkey } = await Secp256k1.makeKeypair(privkey);
//
//   return pubkey;
// };
// only used in keyManager
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
// @todo clena up this function and extract different encryption methods into helper functions
const serializeWallet = async (wallet, password) => {
    (0, helpers_1.log)('Beginning serializing..');
    let encryptedWalletInfoFour;
    try {
        // encryptedWalletInfoFour = await serializeWithEncryptionKey(password, wallet);
        encryptedWalletInfoFour = (0, cosmosUtils_1.serializeWithEncryptionKey)(password, wallet);
        (0, helpers_1.log)('Serialization with prepared cryptoJs data Uint8 is done. ');
    }
    catch (error) {
        throw new Error(`Could not serialize a wallet with the encryption key. Error4 - ${error.message}`);
    }
    return encryptedWalletInfoFour;
};
exports.serializeWallet = serializeWallet;
async function createWalletAtPath(hdPathIndex, mnemonic) {
    const addressPrefix = hdVault_1.stratosAddressPrefix;
    // works - way 1
    const hdPaths = [makeStratosHubPath(hdPathIndex)];
    const options = {
        bip39Password: '',
        prefix: addressPrefix,
        hdPaths,
    };
    const wallet = await StratosDirectSecp256k1HdWallet_1.default.fromMnemonic(mnemonic, options);
    // console.log('direct wallet', JSON.stringify(wallet));
    // works - way 2
    // const pathBuilder = makePathBuilder(keyPathPattern);
    // const path = pathBuilder(hdPathIndex);
    // const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    //   hdPaths: [path],
    //   prefix: addressPrefix,
    // });
    return wallet;
}
exports.createWalletAtPath = createWalletAtPath;
// export async function createWallets(
//   mnemonic: string,
//   pathBuilder: PathBuilder,
//   addressPrefix: string,
//   numberOfDistributors: number,
// ): Promise<ReadonlyArray<readonly [string, OfflineSigner]>> {
//   const wallets = new Array<readonly [string, OfflineSigner]>();
//
//   // first account is the token holder
//   const numberOfIdentities = 1 + numberOfDistributors;
//
//   for (let i = 0; i < numberOfIdentities; i++) {
//     const path = pathBuilder(i);
//     const wallet = await StratosDirectSecp256k1HdWallet.fromMnemonic(
//       mnemonic,
//       options: {
//         hdPaths: [path],
//         prefix: addressPrefix,
//       },
//     );
//
//     const [account] = await wallet.getAccounts();
//     const { address } = account;
//
//     wallets.push([address, wallet]);
//   }
//
//   return wallets;
// }
// export async function generateWallets(
//   quantity: number,
//   mnemonic: string,
// ): Promise<ReadonlyArray<readonly [string, OfflineSigner]>> {
//   const pathBuilder = makePathBuilder(keyPathPattern);
//
//   const wallets = await createWallets(mnemonic, pathBuilder, stratosAddressPrefix, quantity);
//
//   return wallets;
// }
const encodeSignatureMessage = (message) => {
    const messageHash = crypto_js_1.default.SHA256(message).toString();
    const signHashBuf = Buffer.from(messageHash, `hex`);
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