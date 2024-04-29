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
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const math_1 = require("@cosmjs/math");
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_1 = require("@cosmjs/stargate");
const queryclient_1 = require("@cosmjs/stargate/build/queryclient");
const utils_1 = require("@cosmjs/utils");
const stratosTypes = __importStar(require("@stratos-network/stratos-cosmosjs-types"));
const service_1 = require("cosmjs-types/cosmos/tx/v1beta1/service");
const tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const any_1 = require("cosmjs-types/google/protobuf/any");
const ethers_1 = require("ethers");
const evm_1 = require("../../chain/evm");
const tokens_1 = require("../../config/tokens");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tendermint_rpc_1 = require('@cosmjs/tendermint-rpc');
const StratosPubKey = stratosTypes.stratos.crypto.v1.ethsecp256k1.PubKey;
class StratosSigningStargateClient extends stargate_1.SigningStargateClient {
    static async connectWithSigner(endpoint, signer, options = {}) {
        // Tendermint/CometBFT 0.34/0.37 auto-detection. Starting with 0.37 we seem to get reliable versions again 🎉
        // Using 0.34 as the fallback.
        let tmClient;
        const tm37Client = await tendermint_rpc_1.Tendermint37Client.connect(endpoint);
        const version = (await tm37Client.status()).nodeInfo.version;
        if (version.startsWith('0.37.')) {
            tmClient = tm37Client;
        }
        else {
            tm37Client.disconnect();
            tmClient = await tendermint_rpc_1.Tendermint34Client.connect(endpoint);
        }
        return StratosSigningStargateClient.createWithSigner(tmClient, signer, options);
    }
    /**
     * Creates an instance from a manually created Tendermint client.
     * Use this to use `Tendermint37Client` instead of `Tendermint34Client`.
     */
    static async createWithSigner(tmClient, signer, options = {}) {
        return new StratosSigningStargateClient(tmClient, signer, options);
    }
    constructor(tmClient, signer, options) {
        super(tmClient, signer, options);
        this.mySigner = signer;
    }
    getQueryService() {
        const queryClient = this.getQueryClient();
        if (!queryClient)
            return;
        const rpc = (0, queryclient_1.createProtobufRpcClient)(queryClient);
        return new service_1.ServiceClientImpl(rpc);
    }
    async ecdsaSignatures(raw, keyPair, prefix) {
        let rawTransaction = ethers_1.ethers.utils.RLP.encode(raw);
        if (prefix) {
            const rawBuffer = Buffer.concat([
                Buffer.from(prefix.toString(16).padStart(2, '0'), 'hex'),
                Buffer.from(ethers_1.ethers.utils.arrayify(rawTransaction)),
            ]);
            rawTransaction = ethers_1.ethers.utils.hexlify(rawBuffer);
        }
        const hash = ethers_1.ethers.utils.keccak256(rawTransaction);
        return await crypto_1.Secp256k1.createSignature(ethers_1.ethers.utils.arrayify(hash), (0, encoding_1.fromHex)(keyPair.privateKey));
    }
    async simulateEvm(payload, fee) {
        var _a, _b, _c;
        const messages = evm_1.evmTransactions.getEvmMsgs(payload).map(m => this.registry.encodeAsAny(m));
        const tx = tx_1.Tx.fromPartial({
            authInfo: tx_1.AuthInfo.fromPartial({
                fee: tx_1.Fee.fromPartial({ amount: fee.amount, gasLimit: fee.gas }),
                signerInfos: [],
            }),
            body: tx_1.TxBody.fromPartial({
                messages: Array.from(messages),
                extensionOptions: evm_1.evmTransactions.evmExtensionOptions,
            }),
            signatures: [],
        });
        const request = service_1.SimulateRequest.fromPartial({
            txBytes: tx_1.Tx.encode(tx).finish(),
        });
        const response = await ((_a = this.getQueryService()) === null || _a === void 0 ? void 0 : _a.Simulate(request));
        const gasUsed = ((_c = (_b = response === null || response === void 0 ? void 0 : response.gasInfo) === null || _b === void 0 ? void 0 : _b.gasUsed) === null || _c === void 0 ? void 0 : _c.toString()) || '21000';
        return math_1.Uint53.fromString(gasUsed).toNumber();
    }
    async sign(signerAddress, messages, fee, memo, explicitSignerData, extensionOptions) {
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
        const directlySignedByStratos = this.signDirectStratos(signerAddress, messages, fee, memo, signerData, extensionOptions);
        return directlySignedByStratos;
    }
    async encodeMessagesFromTheTxBody(messages) {
        if (!messages) {
            return null;
        }
        const parsedData = [];
        for (const message of messages) {
            const encodedMessage = this.registry.encode({ typeUrl: message.typeUrl, value: message.value });
            parsedData.push({ typeUrl: message.typeUrl, value: (0, encoding_1.toBase64)(encodedMessage) });
        }
        return parsedData;
    }
    async decodeMessagesFromTheTxBody(messages) {
        if (!messages) {
            return null;
        }
        const parsedData = [];
        for (const message of messages) {
            const decodedMessage = this.registry.decode(message);
            parsedData.push({ typeUrl: message.typeUrl, value: decodedMessage });
        }
        return parsedData;
    }
    async execEvm(payload, keyPair, simulate) {
        const chainId = +(payload.chainId || '0'); // NOTE: Should be retrieved from API but currently only available on web3 api
        const nonce = payload.nonce || (await this.getSequence(keyPair.address)).sequence;
        const gasTipCap = ethers_1.ethers.BigNumber.from(payload.gasTipCap || '0'); // NOTE: Useless but keeped for a london sync
        const gasFeeCap = ethers_1.ethers.BigNumber.from(payload.gasFeeCap || tokens_1.minGasPrice.toString());
        const to = payload.to || '0x';
        const value = ethers_1.ethers.BigNumber.from(payload.value || 0);
        const data = payload.data;
        const accesses = payload.accesses; // NOTE: Not supported on stratos yet, but required for signing
        const gas = simulate ? evm_1.evmTransactions.maxGas : payload.gas || 0;
        // NOTE: Ordered as set
        const transaction = {
            chainId,
            nonce,
            gasTipCap,
            gasFeeCap,
            gas,
            to,
            value,
            data,
            accesses,
        };
        const raw = [];
        evm_1.evmTransactions.evmTransactionFields.forEach(fieldInfo => {
            let v = transaction[fieldInfo.name] || [];
            v = ethers_1.ethers.utils.arrayify(ethers_1.ethers.utils.hexlify(v));
            // Fixed-width field
            if (fieldInfo.length && v.length !== fieldInfo.length && v.length > 0) {
                throw new Error('invalid length for ' + fieldInfo.name);
            }
            // Variable-width (with a maximum)
            if (fieldInfo.maxLength) {
                v = ethers_1.ethers.utils.stripZeros(v);
                if (v.length > fieldInfo.maxLength) {
                    throw new Error('invalid length for ' + fieldInfo.name);
                }
            }
            if (fieldInfo.asStruct && v.length === 0) {
                raw.push([]); // for rlp struct{}{}
                return;
            }
            raw.push(ethers_1.ethers.utils.hexlify(v));
        });
        const signature = await this.ecdsaSignatures(raw, keyPair, evm_1.evmTransactions.TxTypes.Eip1559);
        const signedPayload = evm_1.evmTransactions.DynamicFeeTx.fromPartial({
            chainId: chainId.toString(),
            nonce,
            gasTipCap: gasTipCap.toString(),
            gasFeeCap: gasFeeCap.toString(),
            gas,
            to,
            value: value.toString(),
            data,
            accesses,
            v: Uint8Array.from([signature.recovery]),
            r: signature.r(32),
            s: signature.s(32),
        });
        const fee = {
            amount: [{ amount: gasFeeCap.add(gasTipCap).mul(signedPayload.gas).toString(), denom: 'wei' }],
            gas: `${signedPayload.gas}`,
        };
        if (simulate) {
            return await this.simulateEvm(signedPayload, fee);
        }
        const txBodyEncodeObject = {
            typeUrl: '/cosmos.tx.v1beta1.TxBody',
            value: {
                messages: evm_1.evmTransactions.getEvmMsgs(signedPayload),
                extensionOptions: evm_1.evmTransactions.evmExtensionOptions,
            },
        };
        const bodyBytes = this.registry.encode(txBodyEncodeObject);
        const authInfoBytes = (0, proto_signing_1.makeAuthInfoBytes)([], fee.amount, +fee.gas, fee.granter, fee.payer);
        return tx_1.TxRaw.fromPartial({
            bodyBytes,
            authInfoBytes,
        });
    }
    async signForEvm(payload, keyPair) {
        payload.gas = payload.gas || (await this.execEvm(payload, keyPair, true));
        return (await this.execEvm(payload, keyPair, false));
    }
    async getEthSecpStratosEncodedPubkey(signerAddress) {
        const accountFromSigner = (await this.mySigner.getAccounts()).find(account => account.address === signerAddress);
        if (!accountFromSigner) {
            throw new Error('Failed to retrieve account from signer');
        }
        const base64ofPubkey = (0, encoding_1.toBase64)(accountFromSigner.pubkey);
        const pubkeyProto = StratosPubKey.fromObject({
            key: (0, encoding_1.fromBase64)(base64ofPubkey),
        });
        const pubkeyEncodedStratos = any_1.Any.fromPartial({
            typeUrl: '/stratos.crypto.v1.ethsecp256k1.PubKey',
            value: Uint8Array.from(StratosPubKey.encode(pubkeyProto).finish()),
        });
        return pubkeyEncodedStratos;
    }
    // private async getCosmosEncodedPubkey(signerAddress: string): Promise<Any> {
    //   const accountFromSigner = (await this.mySigner.getAccounts()).find(
    //     account => account.address === signerAddress,
    //   );
    //
    //   if (!accountFromSigner) {
    //     throw new Error('Failed to retrieve account from signer');
    //   }
    //
    //   const secp256k1PubkeyLegacy = encodeSecp256k1Pubkey(accountFromSigner.pubkey);
    //
    //   const pubkeyEncodedLegacy = encodePubkey(secp256k1PubkeyLegacy);
    //
    //   return pubkeyEncodedLegacy;
    // }
    async signDirectStratos(signerAddress, messages, fee, memo, { accountNumber, sequence, chainId }, extensionOptions) {
        (0, utils_1.assert)((0, proto_signing_1.isOfflineDirectSigner)(this.mySigner));
        const pubkeyEncodedStratos = await this.getEthSecpStratosEncodedPubkey(signerAddress);
        const pubkeyEncodedToUse = pubkeyEncodedStratos;
        const txBodyEncodeObject = {
            typeUrl: '/cosmos.tx.v1beta1.TxBody',
            value: {
                messages,
                memo,
                extensionOptions,
            },
        };
        const txBodyBytes = this.registry.encode(txBodyEncodeObject);
        const gasLimit = math_1.Int53.fromString(fee.gas).toNumber();
        const authInfoBytes = (0, proto_signing_1.makeAuthInfoBytes)([{ pubkey: pubkeyEncodedToUse, sequence }], fee.amount, gasLimit, fee.granter, fee.payer);
        const signDoc = (0, proto_signing_1.makeSignDoc)(txBodyBytes, authInfoBytes, chainId, accountNumber);
        const { signature, signed } = await this.mySigner.signDirect(signerAddress, signDoc);
        const assembledTx = tx_1.TxRaw.fromPartial({
            bodyBytes: signed.bodyBytes,
            authInfoBytes: signed.authInfoBytes,
            signatures: [(0, encoding_1.fromBase64)(signature.signature)],
        });
        return assembledTx;
    }
}
exports.StratosSigningStargateClient = StratosSigningStargateClient;
//# sourceMappingURL=StratosSigningStargateClient.js.map