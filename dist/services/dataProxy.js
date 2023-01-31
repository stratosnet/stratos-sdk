"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const json_bigint_1 = __importDefault(require("json-bigint"));
(0, axios_retry_1.default)(axios_1.default, {
    retries: 3,
    retryDelay: (retryCount) => {
        return retryCount * 1000;
    },
    retryCondition: error => {
        var _a, _b;
        const testHeader = (_b = (_a = error === null || error === void 0 ? void 0 : error.config) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.testHeader;
        const retry = !testHeader;
        if (retry) {
            console.log('retrying axios call due to error', error.message);
        }
        return retry;
    },
});
axios_1.default.defaults.headers.common.timeout = 10000;
axios_1.default.defaults.transformResponse = [
    data => {
        try {
            const myResponse = (0, json_bigint_1.default)({ useNativeBigInt: true }).parse(data);
            return { response: myResponse };
        }
        catch (_) {
            return { response: JSON.parse(data) };
        }
    },
];
axios_1.default.interceptors.response.use(response => {
    return response;
}, error => {
    const toReturn = {
        data: {
            error: { message: error.message },
        },
    };
    return toReturn;
});
exports.default = axios_1.default;
//# sourceMappingURL=dataProxy.js.map