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
exports.StratosSigningStargateClient = void 0;
const amino_1 = require("@cosmjs/amino");
const encoding_1 = require("@cosmjs/encoding");
const math_1 = require("@cosmjs/math");
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_1 = require("@cosmjs/stargate");
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
const stratosTypes = __importStar(require("@stratos-network/stratos-cosmosjs-types"));
// import { PubKey as CosmosCryptoEd25519Pubkey } from 'cosmjs-types/cosmos/crypto/ed25519/keys';
const tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const any_1 = require("cosmjs-types/google/protobuf/any");
class StratosSigningStargateClient extends stargate_1.SigningStargateClient {
    static async connectWithSigner(endpoint, signer, options = {}) {
        const tmClient = await tendermint_rpc_1.Tendermint34Client.connect(endpoint);
        return new StratosSigningStargateClient(tmClient, signer, options);
    }
    constructor(tmClient, signer, options) {
        super(tmClient, signer, options);
        // const { registry = createDefaultRegistry(), aminoTypes = new AminoTypes(createDefaultTypes()) } = options;
        // this.registry = registry;
        // this.aminoTypes = aminoTypes;
        this.mySigner = signer;
        // this.broadcastTimeoutMs = options.broadcastTimeoutMs;
        // this.broadcastPollIntervalMs = options.broadcastPollIntervalMs;
        // this.gasPrice = options.gasPrice;
    }
    async sign(signerAddress, messages, fee, memo, explicitSignerData) {
        let signerData;
        if (explicitSignerData) {
            signerData = explicitSignerData;
        }
        else {
            const { accountNumber, sequence } = await this.getSequence(signerAddress);
            const chainId = await this.getChainId();
            signerData = {
                accountNumber: accountNumber,
                sequence: sequence,
                chainId: chainId,
            };
        }
        console.log('YES sign from signing stargate client (next will be sign direct)');
        return this.signDirectStratos(signerAddress, messages, fee, memo, signerData);
    }
    async signDirectStratos(signerAddress, messages, fee, memo, { accountNumber, sequence, chainId }) {
        // assert(isOfflineDirectSigner(this.signer));
        const accountFromSigner = (await this.mySigner.getAccounts()).find(account => account.address === signerAddress);
        if (!accountFromSigner) {
            throw new Error('Failed to retrieve account from signer');
        }
        const ppToCheck = (0, amino_1.encodeSecp256k1Pubkey)(accountFromSigner.pubkey);
        console.log('YES ppToCheck - tendermin', ppToCheck);
        // const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey));
        const pubkey = (0, proto_signing_1.encodePubkey)(ppToCheck);
        console.log('YES pubkey from sign direct of stragate sign - encoded by cosmos ', pubkey);
        const pubkeyMine = {
            // type: 'tendermint/PubKeySecp256k1',
            type: 'stratos/PubKeyEthSecp256k1',
            // type: '/stratos.crypto.v1.ethsecp256k1.PubKey',
            value: (0, encoding_1.toBase64)(accountFromSigner.pubkey),
        };
        console.log('YES pubkeyMine Stratos', pubkeyMine);
        console.log('YES pubkey from sign direct of stragate sign accountFromSigner ', accountFromSigner.pubkey);
        // typeUrl: '/cosmos.crypto.secp256k1.PubKey',
        // pubkey.typeUrl = '/stratos.crypto.v1.ethsecp256k1.PubKey';
        const StratosPubKey = stratosTypes.stratos.crypto.v1.ethsecp256k1.PubKey;
        const pubkey2Value = (0, encoding_1.toBase64)(accountFromSigner.pubkey);
        console.log('YES pubkey2Value', pubkey2Value);
        // const pubkeyProto = CosmosCryptoSecp256k1Pubkey.fromPartial({
        const pubkeyProto = StratosPubKey.fromObject({
            key: (0, encoding_1.fromBase64)(pubkey2Value),
        });
        console.log('YES pubkeyProto', pubkeyProto);
        const encodedPubKey2 = any_1.Any.fromPartial({
            typeUrl: '/stratos.crypto.v1.ethsecp256k1.PubKey',
            value: Uint8Array.from(StratosPubKey.encode(pubkeyProto).finish()),
        });
        console.log('YES pubkey2 from sign direct of stragate sign ', encodedPubKey2);
        const txBodyEncodeObject = {
            typeUrl: '/cosmos.tx.v1beta1.TxBody',
            value: {
                messages: messages,
                memo: memo,
            },
        };
        const txBodyBytes = this.registry.encode(txBodyEncodeObject);
        const gasLimit = math_1.Int53.fromString(fee.gas).toNumber();
        const authInfoBytes = (0, proto_signing_1.makeAuthInfoBytes)(
        // [{ pubkey, sequence }],
        [{ pubkey: encodedPubKey2, sequence }], fee.amount, gasLimit);
        const signDoc = (0, proto_signing_1.makeSignDoc)(txBodyBytes, authInfoBytes, chainId, accountNumber);
        const { signature, signed } = await this.mySigner.signDirect(signerAddress, signDoc);
        return tx_1.TxRaw.fromPartial({
            bodyBytes: signed.bodyBytes,
            authInfoBytes: signed.authInfoBytes,
            signatures: [(0, encoding_1.fromBase64)(signature.signature)],
        });
    }
}
exports.StratosSigningStargateClient = StratosSigningStargateClient;
//# sourceMappingURL=StratosSigningStargateClient.js.map