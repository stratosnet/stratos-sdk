"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SdkDefaultEnvironment = {
    restUrl: 'https://rest-test.thestratos.org',
    rpcUrl: 'https://rpc-test.thestratos.org',
    chainId: 'test-chain-1',
    explorerUrl: 'https://explorer-test.thestratos.org',
    // ppNodeUrl: 'http://52.14.150.146',
    // ppNodePort: '8153',
    ppNodeUrl: '',
    ppNodePort: '',
    faucetUrl: '',
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