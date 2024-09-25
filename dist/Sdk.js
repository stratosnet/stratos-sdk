"use strict";
// import {
//   masterkey as masterkeyDefault,
//   bip44purpose as bip44purposeDefault,
//   bip39Password as bip39PasswordDefault,
//   stratosCoinType as stratosCoinTypeDefault,
//   keyPath as keyPathDefault,
//   slip10RawIndexes,
// } from './config/hdVault';
Object.defineProperty(exports, "__esModule", { value: true });
const SdkDefaultEnvironment = {
    // restUrl: 'https://rest-test.thestratos.org',
    // rpcUrl: 'https://rpc-test.thestratos.org',
    // chainId: 'test-chain-1',
    // explorerUrl: 'https://explorer-test.thestratos.org',
    ppNodeUrl: '',
    ppNodePort: '',
    // faucetUrl: '',
    restRedisUrl: 'http://localhost:8080',
    gatewayToken: '',
    // isNewProtocol: true,
    // keyPathParameters: {
    //   masterkey: masterkeyDefault(),
    //   bip44purpose: bip44purposeDefault(),
    //   stratosCoinType: stratosCoinTypeDefault(),
    //   bip39Password: bip39PasswordDefault(),
    //   fullKeyPath: keyPathDefault(),
    //   slip10RawIndexes,
    // },
};
class Sdk {
    static init(sdkEnv) {
        // const { keyPathParameters } = sdkEnv;
        // if (!keyPathParameters) {
        Sdk.environment = Object.assign(Object.assign({}, Sdk.environment), sdkEnv);
        // return;
        // }
        // const { slip10RawIndexes, masterkey, bip39Password } = keyPathParameters;
        // if (!slip10RawIndexes) {
        //   const errMsg1 =
        //     'if keyPathParameters is given to the SDK init and it must contain "slip10RawIndexes" field ';
        //
        //   throw Error(`${errMsg1}`);
        // }
        // const updatedSdkEnv = {
        // ...sdkEnv,
        // keyPathParameters: {
        //   masterkey: masterkeyDefault(masterkey),
        //   bip39Password: bip39PasswordDefault(bip39Password),
        //   bip44purpose: bip44purposeDefault(slip10RawIndexes),
        //   stratosCoinType: stratosCoinTypeDefault(slip10RawIndexes),
        //   fullKeyPath: keyPathDefault(slip10RawIndexes),
        //   slip10RawIndexes,
        // },
        // };
        // Sdk.environment = { ...Sdk.environment, ...updatedSdkEnv };
    }
    static reset() {
        Sdk.environment = Object.assign({}, SdkDefaultEnvironment);
    }
}
exports.default = Sdk;
Sdk.environment = Object.assign({}, SdkDefaultEnvironment);
//# sourceMappingURL=Sdk.js.map