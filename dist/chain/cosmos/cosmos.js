"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.getCosmos = exports.resetCosmos = exports.StratosCosmos = void 0;
const proto_signing_2 = require("@cosmjs/proto-signing");
const StratosRegistry_1 = require("../../crypto/stratos-proto-signing/StratosRegistry");
const StratosSigningStargateClient_1 = require("../../crypto/stratos-proto-signing/StratosSigningStargateClient");
const StratosStargateAccounts_1 = require("../../crypto/stratos-proto-signing/StratosStargateAccounts");
const Sdk_1 = __importDefault(require("../../Sdk"));
const cosmosWallet_1 = require("./cosmosWallet");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const proto_signing_1 = require('@cosmjs/proto-signing');
const getCosmosClient = async (rpcEndpoint, deserializedWallet) => {
    const clientRegistryTypes = (0, StratosRegistry_1.getStratosTransactionRegistryTypes)();
    const clientRegistry = new proto_signing_2.Registry(clientRegistryTypes);
    const options = {
        registry: clientRegistry,
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
            deserializedWallet = await (0, cosmosWallet_1.deserializeEncryptedWallet)(serialized, password);
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
    static async create(userMnemonic, hdPathIndex) {
        if (!userMnemonic) {
            throw new Error('userMnemonic wallet must be provided for the client initialization');
        }
        const deserializedWallet = await (0, cosmosWallet_1.createWalletAtPath)(hdPathIndex, userMnemonic);
        const { rpcUrl: rpcEndpoint } = Sdk_1.default.environment;
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
const create = async (userMnemonic = '', hdPathIndex = 0) => {
    StratosCosmos.reset();
    try {
        await StratosCosmos.create(userMnemonic, hdPathIndex);
    }
    catch (error) {
        throw new Error(`Can not initialize cosmos (cosmos). ${error.message}`);
    }
    return StratosCosmos.cosmosInstance;
};
exports.create = create;
//# sourceMappingURL=cosmos.js.map