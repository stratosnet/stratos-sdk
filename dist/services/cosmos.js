"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCosmos = void 0;
var cosmosjs_1 = __importDefault(require("@cosmostation/cosmosjs"));
var Sdk_1 = __importDefault(require("../Sdk"));
var StratosCosmos = /** @class */ (function () {
    function StratosCosmos() {
    }
    StratosCosmos.init = function () {
        var _a = Sdk_1.default.environment, envRestUrl = _a.restUrl, envChainId = _a.chainId;
        console.log('🚀 ~ file: cosmos.ts ~ line 22 ~ StratosCosmos ~ init ~ Sdk.environment', Sdk_1.default.environment);
        StratosCosmos.cosmosInstance = cosmosjs_1.default.network(envRestUrl, envChainId);
    };
    return StratosCosmos;
}());
var getCosmos = function () {
    if (!StratosCosmos.cosmosInstance) {
        StratosCosmos.init();
    }
    return StratosCosmos.cosmosInstance;
};
exports.getCosmos = getCosmos;
//# sourceMappingURL=cosmos.js.map