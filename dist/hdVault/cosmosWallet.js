"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.encryptMasterKeySeed = exports.cosmjsSalt = void 0;
var encoding_1 = require("@cosmjs/encoding");
var sjcl_1 = __importDefault(require("sjcl"));
exports.cosmjsSalt = (0, encoding_1.toAscii)('The CosmJS salt.');
// export interface KdfConfiguration {
//   /**
//    * An algorithm identifier, such as "argon2id" or "scrypt".
//    */
//   readonly algorithm: string;
//   /** A map of algorithm-specific parameters */
//   readonly params: Record<string, unknown>;
// }
// @todo merge with keyUtils
var encryptMasterKeySeed = function (password, plaintext) {
    var strMasterKey = (0, encoding_1.toBase64)(plaintext);
    var saltBits = sjcl_1.default.random.randomWords(4);
    var encryptParams = {
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
    var encripted = (0, exports.encryptMasterKeySeed)(password, plaintext);
    return encripted;
}
exports.encrypt = encrypt;
function decrypt(password, encryptedMasterKeySeed) {
    var decrypteCypherText = sjcl_1.default.decrypt(password, encryptedMasterKeySeed);
    var decryptedMasterKeySeed = (0, encoding_1.fromBase64)(decrypteCypherText); // switch (config.algorithm) {
    return decryptedMasterKeySeed;
}
exports.decrypt = decrypt;
//# sourceMappingURL=cosmosWallet.js.map