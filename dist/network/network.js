"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFilesDataToRedis = exports.getFilesDataFromRedis = void 0;
const stratos_sdk_js_1 = require("@stratos-network/stratos-sdk.js");
const axios_1 = __importDefault(require("axios"));
const json_bigint_1 = __importDefault(require("json-bigint"));
const Sdk_1 = __importDefault(require("../Sdk"));
const _axios = axios_1.default.create({});
_axios.defaults.transformResponse = [
    data => {
        try {
            return (0, json_bigint_1.default)({ useNativeBigInt: true }).parse(data);
        }
        catch (_) {
            return data;
        }
    },
];
const getRestRedisRoute = () => {
    const { restRedisUrl } = Sdk_1.default.environment;
    return restRedisUrl || 'http://localhost:8080';
};
const getGatewayToken = () => {
    const { gatewayToken } = Sdk_1.default.environment;
    if (!gatewayToken)
        return '';
    return `?token=${gatewayToken.trim()}`;
};
const getFilesDataFromRedis = async (dataKey, keyPrefix, config) => {
    // const url = `${getRestRedisRoute()}/api/get_key_value`;
    const url = `${getRestRedisRoute()}/redis-rest-api/get_key_value${getGatewayToken()}`;
    console.log('given keyPrefix for get', keyPrefix);
    console.log('getFilesDataFromRedis url', url);
    const payload = {
        data_key: dataKey,
    };
    const dataResult = await stratos_sdk_js_1.network.networkApi.apiPost(url, payload, config);
    return dataResult;
};
exports.getFilesDataFromRedis = getFilesDataFromRedis;
const setFilesDataToRedis = async (dataKey, dataValue, keyPrefix, config) => {
    // const url = `${getRestRedisRoute()}/api/set_key_value`;
    const url = `${getRestRedisRoute()}/redis-rest-api/set_key_value${getGatewayToken()}`;
    console.log('given keyPrefix for set', keyPrefix);
    const payload = {
        data_key: dataKey,
        data_value: dataValue,
    };
    const dataResult = await stratos_sdk_js_1.network.networkApi.apiPost(url, payload, config);
    return dataResult;
};
exports.setFilesDataToRedis = setFilesDataToRedis;
//# sourceMappingURL=network.js.map