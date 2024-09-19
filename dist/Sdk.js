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
    restRedisUrl: 'http://localhost:8080',
    gatewayToken: '',
    isNewProtocol: true,
    keyPathParameters: {
        masterkey: (0, hdVault_1.masterkey)(),
        bip44purpose: (0, hdVault_1.bip44purpose)(),
        stratosCoinType: (0, hdVault_1.stratosCoinType)(),
        bip39Password: (0, hdVault_1.bip39Password)(),
        fullKeyPath: (0, hdVault_1.keyPath)(),
        slip10RawIndexes: hdVault_1.slip10RawIndexes,
    },
};
class Sdk {
    static init(sdkEnv) {
        const { keyPathParameters } = sdkEnv;
        if (!keyPathParameters) {
            Sdk.environment = Object.assign(Object.assign({}, Sdk.environment), sdkEnv);
            return;
        }
        const { slip10RawIndexes, masterkey, bip39Password } = keyPathParameters;
        if (!slip10RawIndexes) {
            const errMsg1 = 'if keyPathParameters is given to the SDK init and it must contain "slip10RawIndexes" field ';
            throw Error(`${errMsg1}`);
        }
        const updatedSdkEnv = Object.assign(Object.assign({}, sdkEnv), { keyPathParameters: {
                masterkey: (0, hdVault_1.masterkey)(masterkey),
                bip39Password: (0, hdVault_1.bip39Password)(bip39Password),
                bip44purpose: (0, hdVault_1.bip44purpose)(slip10RawIndexes),
                stratosCoinType: (0, hdVault_1.stratosCoinType)(slip10RawIndexes),
                fullKeyPath: (0, hdVault_1.keyPath)(slip10RawIndexes),
                slip10RawIndexes,
            } });
        Sdk.environment = Object.assign(Object.assign({}, Sdk.environment), updatedSdkEnv);
    }
    static reset() {
        Sdk.environment = Object.assign({}, SdkDefaultEnvironment);
    }
}
exports.default = Sdk;
Sdk.environment = Object.assign({}, SdkDefaultEnvironment);
//# sourceMappingURL=Sdk.js.map