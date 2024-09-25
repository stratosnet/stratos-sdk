"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainAndProtocolDetails = exports.getNodeProtocolVersion = exports.getChainId = exports.sendUserRequestGetFileStatus = exports.sendUserRequestGetShared = exports.sendUserRequestStopShare = exports.sendUserRequestListShare = exports.sendUserRequestShare = exports.sendUserUploadData = exports.sendUserRequestGetOzone = exports.sendUserDownloadedFileInfo = exports.sendUserDownloadData = exports.sendUserRequestDownload = exports.sendUserRequestUpload = exports.sendUserRequestList = exports.getRpcPayload = exports.uploadFile = exports.getRpcStatus = exports.requestBalanceIncrease = exports.getRewardBalance = exports.getUnboundingBalance = exports.getDelegatedBalance = exports.getAvailableBalance = exports.getAvailableBalance_n = exports.getNozPrice = exports.getStakingPool = exports.getValidator = exports.getValidatorsBondedToDelegatorList = exports.getValidatorsList = exports.getTxListBlockchain = exports.submitTransaction = exports.getSubmitTransactionData = exports.sendRpcCall = exports.apiGet = exports.apiPost = void 0;
const axios_1 = __importDefault(require("axios"));
const json_bigint_1 = __importDefault(require("json-bigint"));
const qs_1 = __importDefault(require("qs"));
const config_1 = require("../config");
const Sdk_1 = __importDefault(require("../Sdk"));
const helpers_1 = require("./helpers");
const networkTypes_1 = require("./networkTypes");
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
const getRestRoute = () => {
    const { restUrl } = Sdk_1.default.environment;
    return restUrl;
};
const getRpcRoute = () => {
    const { rpcUrl } = Sdk_1.default.environment;
    return rpcUrl;
};
const getPpNodeRoute = () => {
    const { ppNodeUrl, ppNodePort } = Sdk_1.default.environment;
    if (!ppNodeUrl) {
        throw new Error('SDK must be initialized with pp node url and (optionally) port prior to use the getPpNodeRoute function');
    }
    const ppNodeUrlRes = `${ppNodeUrl}${ppNodePort ? `:${ppNodePort}` : ''}`;
    return ppNodeUrlRes;
};
const apiPost = async (url, data, config) => {
    const myConfig = {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        // timeout: 31000,
    };
    let axiosResponse;
    try {
        axiosResponse = await _axios.post(url, data, Object.assign(Object.assign({}, config), myConfig));
    }
    catch (err) {
        const e = err;
        return { error: { message: e.message } };
    }
    try {
        const myResponse = axiosResponse.data;
        return { response: myResponse };
    }
    catch (err) {
        const e = err;
        return { error: { message: e.message } };
    }
};
exports.apiPost = apiPost;
const apiGet = async (url, config) => {
    let axiosResponse;
    const myParamsSerializer = function (params) {
        return qs_1.default.stringify(params, { arrayFormat: 'repeat' });
    };
    const myConfig = Object.assign(Object.assign({}, config), { paramsSerializer: myParamsSerializer });
    try {
        axiosResponse = await _axios.get(url, myConfig);
    }
    catch (err) {
        return { error: { message: err.message } };
    }
    try {
        const myResponse = axiosResponse.data;
        return { response: myResponse };
    }
    catch (_) {
        return { response: axiosResponse.data };
    }
};
exports.apiGet = apiGet;
const sendRpcCall = async (givenPayload, config) => {
    const defaultPayload = {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_protocolVersion',
        params: [],
    };
    const url = `${getPpNodeRoute()}`;
    console.log('url for the rpc call', url);
    const payload = Object.assign(Object.assign({}, defaultPayload), givenPayload);
    const dataResult = await (0, exports.apiPost)(url, payload, Object.assign({}, config));
    return dataResult;
};
exports.sendRpcCall = sendRpcCall;
const getSubmitTransactionData = (data) => {
    let txData;
    if (!data) {
        return { response: txData };
    }
    try {
        txData = json_bigint_1.default.parse(data);
        return { response: txData };
    }
    catch (err) {
        return {
            error: { message: `Can't submit transaction. Can't parse transaction data. ${err.message}` },
        };
    }
};
exports.getSubmitTransactionData = getSubmitTransactionData;
const submitTransaction = async (delegatorAddr, data, config) => {
    const url = `${getRestRoute()}/staking/delegators/${delegatorAddr}/delegations`;
    console.log('url to broadcast the tx (POST)');
    const { response: txData, error } = (0, exports.getSubmitTransactionData)(data);
    if (error) {
        return { error };
    }
    console.log('tx data to broadcast', txData);
    const dataResult = await (0, exports.apiPost)(url, txData, config);
    console.log('dataResult after the broadcast', dataResult);
    return dataResult;
};
exports.submitTransaction = submitTransaction;
const getTxListBlockchain = async (address, type, givenPage = 1, pageLimit = 5, userType = networkTypes_1.TxHistoryUser.TxHistorySenderUser, config) => {
    const url = `${getRestRoute()}/cosmos/tx/v1beta1/txs`;
    console.log('url', url);
    console.log('given page', givenPage, pageLimit);
    const userQueryType = userType === networkTypes_1.TxHistoryUser.TxHistorySenderUser
        ? `message.sender='${address}'`
        : `transfer.recipient='${address}'`;
    const givenEvents = [userQueryType];
    if (type) {
        const msgTypeActionParameter = `message.action='${type}'`;
        givenEvents.push(msgTypeActionParameter);
    }
    const offset = (givenPage - 1) * pageLimit + 1;
    const params = {
        events: givenEvents,
        'pagination.limit': pageLimit,
        'pagination.offset': offset,
        'pagination.count_total': true,
        order_by: 'ORDER_BY_DESC',
    };
    const dataResult = await (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    // console.log('TxHistory data result ', dataResult);
    return dataResult;
};
exports.getTxListBlockchain = getTxListBlockchain;
const getValidatorsList = async (status, page = 1, config) => {
    const url = `${getRestRoute()}/cosmos/staking/v1beta1/validators`;
    const dataResult = await (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params: { page, status } }));
    return dataResult;
};
exports.getValidatorsList = getValidatorsList;
const getValidatorsBondedToDelegatorList = async (status, delegatorAddress, config) => {
    const url = `${getRestRoute()}/cosmos/staking/v1beta1/delegators/${delegatorAddress}/validators`;
    const dataResult = await (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params: { status } }));
    return dataResult;
};
exports.getValidatorsBondedToDelegatorList = getValidatorsBondedToDelegatorList;
const getValidator = async (address, config) => {
    const url = `${getRestRoute()}/cosmos/staking/v1beta1/validators/${address}`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getValidator = getValidator;
const getStakingPool = async (config) => {
    const url = `${getRestRoute()}/cosmos/staking/v1beta1/pool`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getStakingPool = getStakingPool;
const getNozPrice = async (config) => {
    const url = `${getRestRoute()}/stratos/sds/v1/noz_price`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getNozPrice = getNozPrice;
const getAvailableBalance_n = async (address, config) => {
    const url = `${getRestRoute()}/cosmos/bank/v1beta1/balances/${address}`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getAvailableBalance_n = getAvailableBalance_n;
const getAvailableBalance = async (address, config) => {
    // we can support different variations of methods which depend on isNewProtocol flag
    // see getChainAndProtocolDetails methods for more details
    // const isNewProtocol = !!Sdk.environment.isNewProtocol;
    // console.log('getAvailableBalance  isNewProtocol', isNewProtocol);
    // if (isNewProtocol) {
    // return getAvailableBalance_n(address, config);
    // }
    // return getAvailableBalance_o(address, config);
    return (0, exports.getAvailableBalance_n)(address, config);
};
exports.getAvailableBalance = getAvailableBalance;
const getDelegatedBalance = async (delegatorAddr, config) => {
    const url = `${getRestRoute()}/cosmos/staking/v1beta1/delegations/${delegatorAddr}`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getDelegatedBalance = getDelegatedBalance;
const getUnboundingBalance = async (delegatorAddr, config) => {
    const url = `${getRestRoute()}/cosmos/staking/v1beta1/delegators/${delegatorAddr}/unbonding_delegations`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getUnboundingBalance = getUnboundingBalance;
const getRewardBalance = async (delegatorAddr, config) => {
    const url = `${getRestRoute()}/cosmos/distribution/v1beta1/delegators/${delegatorAddr}/rewards`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getRewardBalance = getRewardBalance;
const requestBalanceIncrease = async (walletAddress, faucetUrl, denom = config_1.hdVault.stratosDenom, // ustos and now wei
config) => {
    const url = `${faucetUrl}`;
    const payload = {
        denom,
        address: walletAddress.trim(),
    };
    const dataResult = await (0, exports.apiPost)(url, payload, config);
    return dataResult;
};
exports.requestBalanceIncrease = requestBalanceIncrease;
const getRpcStatus = async (config) => {
    const url = `${getRpcRoute()}/status`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getRpcStatus = getRpcStatus;
const uploadFile = async (config) => {
    const url = `${getRpcRoute()}/status`;
    console.log('🚀 !~ file: network.ts ~ line 321 ~ getRpcStatus ~ url', url);
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.uploadFile = uploadFile;
const getRpcPayload = (msgId, method, extraParams) => {
    const payload = {
        id: msgId,
        method,
        params: extraParams,
    };
    return payload;
};
exports.getRpcPayload = getRpcPayload;
const sendUserRequestList = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_requestList';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserRequestList = sendUserRequestList;
const sendUserRequestUpload = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_requestUpload';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserRequestUpload = sendUserRequestUpload;
const sendUserRequestDownload = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_requestDownload';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserRequestDownload = sendUserRequestDownload;
const sendUserDownloadData = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_downloadData';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserDownloadData = sendUserDownloadData;
const sendUserDownloadedFileInfo = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_downloadedFileInfo';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserDownloadedFileInfo = sendUserDownloadedFileInfo;
const sendUserRequestGetOzone = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_requestGetOzone';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserRequestGetOzone = sendUserRequestGetOzone;
const sendUserUploadData = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_uploadData';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserUploadData = sendUserUploadData;
const sendUserRequestShare = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_requestShare';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserRequestShare = sendUserRequestShare;
const sendUserRequestListShare = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_requestListShare';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserRequestListShare = sendUserRequestListShare;
const sendUserRequestStopShare = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_requestStopShare';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserRequestStopShare = sendUserRequestStopShare;
const sendUserRequestGetShared = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_requestGetShared';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserRequestGetShared = sendUserRequestGetShared;
const sendUserRequestGetFileStatus = async (extraParams, config) => {
    const msgId = 1;
    const method = 'user_getFileStatus';
    const payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
    const dataResult = await (0, exports.sendRpcCall)(payload, config);
    return dataResult;
};
exports.sendUserRequestGetFileStatus = sendUserRequestGetFileStatus;
const getChainId = async () => {
    var _a, _b;
    const result = await (0, exports.getRpcStatus)();
    const { response } = result;
    const chainId = (_b = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.node_info) === null || _b === void 0 ? void 0 : _b.network;
    return chainId;
};
exports.getChainId = getChainId;
const getNodeProtocolVersion = async () => {
    var _a, _b;
    const result = await (0, exports.getRpcStatus)();
    const { response } = result;
    const version = (_b = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.node_info) === null || _b === void 0 ? void 0 : _b.version;
    return version;
};
exports.getNodeProtocolVersion = getNodeProtocolVersion;
const getChainAndProtocolDetails = async () => {
    let resolvedChainID;
    let resolvedChainVersion;
    let isNewProtocol = false;
    try {
        const resolvedChainIDToTest = await (0, exports.getChainId)();
        if (!resolvedChainIDToTest) {
            throw new Error('Chain id is empty. Exiting');
        }
        resolvedChainID = resolvedChainIDToTest;
        const resolvedChainVersionToTest = await (0, exports.getNodeProtocolVersion)();
        if (!resolvedChainVersionToTest) {
            throw new Error('Protocol version id is empty. Exiting');
        }
        resolvedChainVersion = resolvedChainVersionToTest;
        console.log('🚀 ~ file: network ~ resolvedChainIDToTest', resolvedChainIDToTest);
        const { MIN_NEW_PROTOCOL_VERSION } = config_1.chain;
        isNewProtocol = (0, helpers_1.getNewProtocolFlag)(resolvedChainVersion, MIN_NEW_PROTOCOL_VERSION);
    }
    catch (error) {
        console.log('🚀 ~ file: network ~ resolvedChainID error', error);
        throw new Error('Could not resolve chain id');
    }
    return {
        resolvedChainID,
        resolvedChainVersion,
        isNewProtocol,
    };
};
exports.getChainAndProtocolDetails = getChainAndProtocolDetails;
// export const getFilesDataFromRedis = async (
//   dataKey: string,
//   keyPrefix: string,
//   config?: Types.NetworkAxiosConfig,
// ): Promise<Types.GetDataFromRedisResult> => {
//   // const url = `${getRestRedisRoute()}/api/get_key_value`;
//   const url = `${getRestRedisRoute()}/redis-rest-api/get_key_value${getGatewayToken()}`;
//
//   console.log('given keyPrefix for get', keyPrefix);
//   console.log('getFilesDataFromRedis url', url);
//
//   const payload = {
//     data_key: dataKey,
//   };
//
//   const dataResult = await apiPost(url, payload, config);
//
//   return dataResult;
// };
// export const setFilesDataToRedis = async (
//   dataKey: string,
//   dataValue: string,
//   keyPrefix: string,
//   config?: Types.NetworkAxiosConfig,
// ): Promise<Types.SetDataToRedisResult> => {
//   // const url = `${getRestRedisRoute()}/api/set_key_value`;
//   const url = `${getRestRedisRoute()}/redis-rest-api/set_key_value${getGatewayToken()}`;
//
//   console.log('given keyPrefix for set', keyPrefix);
//
//   const payload = {
//     data_key: dataKey,
//     data_value: dataValue,
//   };
//
//   const dataResult = await apiPost(url, payload, config);
//
//   return dataResult;
// };
//# sourceMappingURL=network.js.map