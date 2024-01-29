"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SdkDefaultEnvironment = {
    restUrl: 'https://rest-test.thestratos.org',
    rpcUrl: 'https://rpc-test.thestratos.org',
    chainId: 'test-chain-1',
    explorerUrl: 'https://explorer-test.thestratos.org',
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
    static getNewProtocolFlag(currentVersion, minRequiredNewVersion) {
        console.log('current protocol version ', currentVersion);
        const [pVer, pSubVer, pPatch] = currentVersion.split('.');
        const [minVer, minSubVer, minPatch] = minRequiredNewVersion.split('.');
        const isVerOld = +pVer < +minVer;
        const isSubVerOld = +pSubVer < +minSubVer;
        const isPatchOld = +pPatch < +minPatch;
        const isOldProtocol = isVerOld && isSubVerOld && isPatchOld;
        return !isOldProtocol;
    }
}
exports.default = Sdk;
Sdk.environment = Object.assign({}, SdkDefaultEnvironment);
//# sourceMappingURL=Sdk.js.map