"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMasterKeySeedPublicKeyWithKeccak = exports.getMasterKeySeedPublicKey = exports.getPublicKeyFromPrivKey = exports.getMasterKeySeedPriveKey = exports.decrypt = exports.encrypt = exports.encryptMasterKeySeed = exports.cosmjsSalt = void 0;
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const bn_js_1 = __importDefault(require("bn.js"));
const sjcl_1 = __importDefault(require("sjcl"));
exports.cosmjsSalt = (0, encoding_1.toAscii)('The CosmJS salt.');
// @todo merge with keyUtils
const encryptMasterKeySeed = (password, plaintext) => {
    const strMasterKey = (0, encoding_1.toBase64)(plaintext);
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
function encrypt(password, plaintext) {
    const encripted = (0, exports.encryptMasterKeySeed)(password, plaintext);
    return encripted;
}
exports.encrypt = encrypt;
function decrypt(password, encryptedMasterKeySeed) {
    const decrypteCypherText = sjcl_1.default.decrypt(password, encryptedMasterKeySeed);
    const decryptedMasterKeySeed = (0, encoding_1.fromBase64)(decrypteCypherText); // switch (config.algorithm) {
    return decryptedMasterKeySeed;
}
exports.decrypt = decrypt;
// @todo - move it - used in getMasterKeyInfo
const isZero = (privkey) => {
    return privkey.every(byte => byte === 0);
};
// @todo - move it =  used in isGteN
const n = (curve) => {
    switch (curve) {
        case crypto_1.Slip10Curve.Secp256k1:
            return new bn_js_1.default('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141', 16);
        default:
            throw new Error('curve not supported');
    }
};
// @todo - move it - used in getMasterKeyInfo
const isGteN = (curve, privkey) => {
    const keyAsNumber = new bn_js_1.default(privkey);
    return keyAsNumber.gte(n(curve));
};
const getMasterKeyInfo = (curve, seed) => {
    const i = new crypto_1.Hmac(crypto_1.Sha512, (0, encoding_1.toAscii)(curve)).update(seed).digest();
    const il = i.slice(0, 32);
    const ir = i.slice(32, 64);
    if (curve !== crypto_1.Slip10Curve.Ed25519 && (isZero(il) || isGteN(curve, il))) {
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
        // type: 'tendermint/PubKeySecp256k1',
        type: 'stratos/PubKeyEthSecp256k1',
        value: (0, encoding_1.toBase64)(compressedPub),
    };
    // console.log('get full pub pubkeyMine', pubkeyMine);
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