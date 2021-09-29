"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var SdkDefaultEnvironment = {
    restUrl: 'https://rest-test.thestratos.org',
    rpcUrl: 'https://rpc-test.thestratos.org',
    chainId: 'test-chain-1',
    explorerUrl: 'https://explorer-test.thestratos.org',
};
var Sdk = /** @class */ (function () {
    function Sdk() {
    }
    Sdk.init = function (sdkEnv) {
        Sdk.environment = __assign(__assign({}, Sdk.environment), sdkEnv);
    };
    Sdk.reset = function () {
        Sdk.environment = __assign({}, SdkDefaultEnvironment);
    };
    Sdk.environment = __assign({}, SdkDefaultEnvironment);
    return Sdk;
}());
exports.default = Sdk;
//# sourceMappingURL=Sdk.js.map