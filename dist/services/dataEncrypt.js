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
exports.getDataKey = exports.uint8arrayToBase64Str = void 0;
const stratos = __importStar(require("../index"));
const uint8arrayToBase64Str = (input) => Buffer.from(input).toString('base64');
exports.uint8arrayToBase64Str = uint8arrayToBase64Str;
const getDataKey = async (derivedKeyPair) => {
    const myTextToEncode = derivedKeyPair.address;
    const encodedStAddress = stratos.crypto.hdVault.keyUtils.encodeSignatureMessage(myTextToEncode);
    const encodedStAddressStringBase64 = (0, exports.uint8arrayToBase64Str)(encodedStAddress);
    console.log('encodedStAddressStringBase64', encodedStAddressStringBase64, encodedStAddressStringBase64.length);
    console.log('\n');
    const encodedStAddressStringSignedBase64 = await stratos.crypto.hdVault.keyUtils.signWithPrivateKeyInBase64(encodedStAddressStringBase64, derivedKeyPair.privateKey);
    console.log('encodedStAddressStringSignedBase64 (will be a redis key?)', encodedStAddressStringSignedBase64, encodedStAddressStringSignedBase64.length, '\n');
    const signVerificationResult = await stratos.crypto.hdVault.keyUtils.verifySignatureInBase64(encodedStAddressStringBase64, encodedStAddressStringSignedBase64, derivedKeyPair.publicKey);
    console.log('signVerificationResult base64!', signVerificationResult);
    return encodedStAddressStringSignedBase64;
};
exports.getDataKey = getDataKey;
//# sourceMappingURL=dataEncrypt.js.map