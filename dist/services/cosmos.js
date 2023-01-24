"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCosmos = exports.resetCosmos = exports.StratosCosmos = void 0;
const proto_signing_1 = require("@cosmjs/proto-signing");
const StratosSigningStargateClient_1 = require("../hdVault/StratosSigningStargateClient");
const StratosStargateAccounts_1 = require("../hdVault/StratosStargateAccounts");
const wallet_1 = require("../hdVault/wallet");
const Sdk_1 = __importDefault(require("../Sdk"));
const transactions_1 = require("../transactions/transactions");
const getCosmosClient = async (rpcEndpoint, deserializedWallet) => {
    const clientRegistryTypes = (0, transactions_1.getStratosTransactionRegistryTypes)();
    const clientRegistry = new proto_signing_1.Registry(clientRegistryTypes);
    const options = {
        registry: clientRegistry,
        // in order to be able to decode `ethSecp256k1` pubkey
        accountParser: StratosStargateAccounts_1.accountFromAnyStratos,
    };
    try {
        const client = await StratosSigningStargateClient_1.StratosSigningStargateClient.connectWithSigner(rpcEndpoint, deserializedWallet, options);
        return client;
    }
    catch (error) {
        throw new Error(`Can not connect with a signer (cosmos). ${error.message}`);
    }
};
class StratosCosmos {
    static async init(serialized, password) {
        if (!serialized) {
            throw new Error('encripted wallet must be provided for the client initialization');
        }
        const { rpcUrl: rpcEndpoint } = Sdk_1.default.environment;
        let deserializedWallet;
        try {
            deserializedWallet = await (0, wallet_1.deserializeEncryptedWallet)(serialized, password);
        }
        catch (error) {
            throw new Error(`Can not deserialize encrypted wallet (cosmos). ${error.message}`);
        }
        try {
            const client = await getCosmosClient(rpcEndpoint, deserializedWallet);
            StratosCosmos.cosmosInstance = client;
        }
        catch (error) {
            throw new Error(`Can not get cosmos client (cosmos). ${error.message}`);
        }
    }
    static reset() {
        StratosCosmos.cosmosInstance = null;
    }
}
exports.StratosCosmos = StratosCosmos;
const resetCosmos = () => {
    StratosCosmos.reset();
};
exports.resetCosmos = resetCosmos;
const getCosmos = async (serialized = '', password = '') => {
    if (!StratosCosmos.cosmosInstance) {
        try {
            await StratosCosmos.init(serialized, password);
        }
        catch (error) {
            throw new Error(`Can not initialize cosmos (cosmos). ${error.message}`);
        }
    }
    return StratosCosmos.cosmosInstance;
};
exports.getCosmos = getCosmos;
//# sourceMappingURL=cosmos.js.map