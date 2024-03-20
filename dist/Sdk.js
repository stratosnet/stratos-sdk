"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hdVault_1 = require("./config/hdVault");
const SdkDefaultEnvironment = {
    restUrl: 'https://rest-test.thestratos.org',
    rpcUrl: 'https://rpc-test.thestratos.org',
    chainId: 'test-chain-1',
    explorerUrl: 'https://explorer-test.thestratos.org',
    ppNodeUrl: '',
    ppNodePort: '',
    faucetUrl: '',
    isNewProtocol: true,
    keyPathParameters: {
        masterkey: hdVault_1.masterkey,
        bip44purpose: hdVault_1.bip44purpose,
        stratosCoinType: hdVault_1.stratosCoinType,
        bip39Password: hdVault_1.bip39Password,
    },
    keyPath: hdVault_1.keyPath,
};
class Sdk {
    static init(sdkEnv) {
        Sdk.environment = Object.assign(Object.assign({}, Sdk.environment), sdkEnv);
    }
    static reset() {
        Sdk.environment = Object.assign({}, SdkDefaultEnvironment);
    }
}
exports.default = Sdk;
Sdk.environment = Object.assign({}, SdkDefaultEnvironment);
//# sourceMappingURL=Sdk.js.map