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
exports.accountFromAnyStratos = exports.decodePubkey = exports.anyToStratosSinglePubkey = exports.encodeEthSecp256k1Pubkey = void 0;
const amino_1 = require("@cosmjs/amino");
const encoding_1 = require("@cosmjs/encoding");
const math_1 = require("@cosmjs/math");
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_1 = require("@cosmjs/stargate");
const utils_1 = require("@cosmjs/utils");
const stratosTypes = __importStar(require("@stratos-network/stratos-cosmosjs-types"));
const auth_1 = require("cosmjs-types/cosmos/auth/v1beta1/auth");
// import { PubKey as CosmosCryptoEd25519Pubkey } from 'cosmjs-types/cosmos/crypto/ed25519/keys';
const keys_1 = require("cosmjs-types/cosmos/crypto/secp256k1/keys");
const StratosPubKey = stratosTypes.stratos.crypto.v1.ethsecp256k1.PubKey;
function uint64FromProto(input) {
    return math_1.Uint64.fromString(input.toString());
}
// https://github.com/cosmos/cosmjs/blob/33271bc51cdc865cadb647a1b7ab55d873637f39/packages/amino/src/encoding.ts#L20
function encodeEthSecp256k1Pubkey(pubkey) {
    if (pubkey.length !== 33 || (pubkey[0] !== 0x02 && pubkey[0] !== 0x03)) {
        throw new Error('Public key must be compressed secp256k1, i.e. 33 bytes starting with 0x02 or 0x03');
    }
    return {
        type: 'stratos/PubKeyEthSecp256k1',
        // type: pubkeyType.secp256k1,
        value: (0, encoding_1.toBase64)(pubkey),
    };
}
exports.encodeEthSecp256k1Pubkey = encodeEthSecp256k1Pubkey;
// https://github.com/cosmos/cosmjs/blob/main/packages/proto-signing/src/pubkey.ts
function anyToStratosSinglePubkey(pubkey) {
    switch (pubkey.typeUrl) {
        case '/stratos.crypto.v1.ethsecp256k1.PubKey': {
            const { key } = StratosPubKey.decode(pubkey.value);
            return encodeEthSecp256k1Pubkey(key);
        }
        case '/cosmos.crypto.secp256k1.PubKey': {
            const { key } = keys_1.PubKey.decode(pubkey.value);
            return (0, amino_1.encodeSecp256k1Pubkey)(key);
        }
        // we need to update amino since encodeEd25519Pubkey is not exported in version we use here
        // case '/cosmos.crypto.ed25519.PubKey': {
        //   const { key } = CosmosCryptoEd25519Pubkey.decode(pubkey.value);
        //   return encodeEd25519Pubkey(key);
        // }
        default:
            throw new Error(`Pubkey type_url ${pubkey.typeUrl} not recognized as single public key type`);
    }
}
exports.anyToStratosSinglePubkey = anyToStratosSinglePubkey;
// https://github.com/cosmos/cosmjs/blob/main/packages/proto-signing/src/pubkey.ts
function decodePubkey(pubkey) {
    switch (pubkey.typeUrl) {
        case '/stratos.crypto.v1.ethsecp256k1.PubKey': {
            return anyToStratosSinglePubkey(pubkey);
        }
        default:
            return (0, proto_signing_1.decodePubkey)(pubkey);
    }
}
exports.decodePubkey = decodePubkey;
// https://github.com/cosmos/cosmjs/blob/33271bc51cdc865cadb647a1b7ab55d873637f39/packages/stargate/src/accounts.ts
function accountFromBaseAccount(input) {
    const { address, pubKey, accountNumber, sequence } = input;
    const pubkey = pubKey ? decodePubkey(pubKey) : null;
    return {
        address: address,
        pubkey: pubkey,
        accountNumber: uint64FromProto(accountNumber).toNumber(),
        sequence: uint64FromProto(sequence).toNumber(),
    };
}
/**
 * Basic implementation of AccountParser. This is supposed to support the most relevant
 * common Cosmos SDK account types. If you need support for exotic account types,
 * you'll need to write your own account decoder.
 */
function accountFromAnyStratos(input) {
    const { typeUrl, value } = input;
    // console.log('StratosStargateAccounts - accountFromAnyStratos was called ,input ', input);
    switch (typeUrl) {
        // stratos
        case '/cosmos.auth.v1beta1.BaseAccount': {
            const baseAccount = accountFromBaseAccount(auth_1.BaseAccount.decode(value));
            // console.log('StratosStargateAccounts - got baseAccount', baseAccount);
            (0, utils_1.assert)(baseAccount);
            return baseAccount;
        }
        default: {
            const account = (0, stargate_1.accountFromAny)(input);
            if (!account) {
                // console.log(`Stratos Account was not parsed`, account);
                throw new Error(`Unsupported type: '${typeUrl}'`);
            }
            return account;
        }
    }
}
exports.accountFromAnyStratos = accountFromAnyStratos;
//# sourceMappingURL=StratosStargateAccounts.js.map