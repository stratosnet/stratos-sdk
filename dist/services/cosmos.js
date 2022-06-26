"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCosmos = exports.StratosCosmos = void 0;
var Sdk_1 = __importDefault(require("../Sdk"));
var StratosCosmos = /** @class */ (function () {
    function StratosCosmos() {
    }
    StratosCosmos.init = function () {
        var _a = Sdk_1.default.environment, envRestUrl = _a.restUrl, envChainId = _a.chainId;
        // StratosCosmos.cosmosInstance = cosmosjs.network(envRestUrl, envChainId);
    };
    return StratosCosmos;
}());
exports.StratosCosmos = StratosCosmos;
var getCosmos = function () {
    if (!StratosCosmos.cosmosInstance) {
        StratosCosmos.init();
    }
    return StratosCosmos.cosmosInstance;
};
exports.getCosmos = getCosmos;
//# sourceMappingURL=cosmos.js.map