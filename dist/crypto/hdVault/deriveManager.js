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
exports.derivePrivateKeySeed = exports.deriveKeyPairFromPrivateKeySeed = exports.deriveAddressFromPhrase = void 0;
const CosmosCrypto = __importStar(require("@cosmjs/crypto"));
const encoding_1 = require("@cosmjs/encoding");
const cosmosWallet_1 = require("../../chain/cosmos/cosmosWallet");
const keyUtils_1 = require("./keyUtils");
const deriveAddressFromPhrase = async (phrase) => {
    const masterKeySeed = await (0, keyUtils_1.generateMasterKeySeed)(phrase);
    // new, eth address
    const pubkey = await (0, cosmosWallet_1.getMasterKeySeedPublicKeyWithKeccak)(masterKeySeed);
    const address = (0, keyUtils_1.getAddressFromPubKeyWithKeccak)(pubkey);
    // old address
    // const pubkeyOld = await getMasterKeySeedPublicKey(masterKeySeed);
    // const addressOld = getAddressFromPubKey(pubkeyOld);
    return address;
};
exports.deriveAddressFromPhrase = deriveAddressFromPhrase;
const deriveKeyPairFromPrivateKeySeed = async (privkey) => {
    const pubkeyMine = await (0, cosmosWallet_1.getPublicKeyFromPrivKey)(privkey);
    const encodeAminoPub = await (0, keyUtils_1.getAminoPublicKey)(pubkeyMine); // 1 amino dep - amino encodeAminoPubkey
    // new, eth address
    const { pubkey } = await CosmosCrypto.Secp256k1.makeKeypair(privkey);
    const address = (0, keyUtils_1.getAddressFromPubKeyWithKeccak)(pubkey);
    // old address
    // const addressOld = getAddressFromPubKey(pubkeyMine);
    // console.log('old add 2', addressOld);
    const encodedPublicKey = await (0, keyUtils_1.getEncodedPublicKey)(encodeAminoPub);
    return {
        address,
        publicKey: encodeAminoPub,
        encodedPublicKey,
        privateKey: (0, encoding_1.toHex)(privkey),
    };
};
exports.deriveKeyPairFromPrivateKeySeed = deriveKeyPairFromPrivateKeySeed;
const getSlip10 = () => {
    return CosmosCrypto.Slip10;
};
const derivePrivateKeySeed = (masterKey, keyPath, curve = CosmosCrypto.Slip10Curve.Secp256k1) => {
    const convertedPath = CosmosCrypto.stringToPath(keyPath);
    const { privkey } = getSlip10().derivePath(curve, masterKey, convertedPath);
    return privkey;
};
exports.derivePrivateKeySeed = derivePrivateKeySeed;
//# sourceMappingURL=deriveManager.js.map