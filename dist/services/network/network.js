"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainId = exports.sendUserUploadData = exports.sendUserRequestGetOzone = exports.sendUserDownloadedFileInfo = exports.sendUserDownloadData = exports.sendUserRequestDownload = exports.sendUserRequestUpload = exports.sendUserRequestList = exports.getRpcPayload = exports.uploadFile = exports.getRpcStatus = exports.requestBalanceIncrease = exports.getRewardBalance = exports.getUnboundingBalance = exports.getDelegatedBalance = exports.getAvailableBalance = exports.getStakingPool = exports.getValidator = exports.getValidatorsBondedToDelegatorList = exports.getValidatorsList = exports.getTxList = exports.getTxListBlockchain = exports.submitTransaction = exports.getSubmitTransactionData = exports.getStakingValidators = exports.getAccountBalance = exports.getAccountsData = exports.sendRpcCall = exports.apiGet = exports.apiPost = exports.apiPostLegacy = void 0;
const axios_1 = __importDefault(require("axios"));
const json_bigint_1 = __importDefault(require("json-bigint"));
const qs_1 = __importDefault(require("qs"));
const config_1 = require("../../config");
const Sdk_1 = __importDefault(require("../../Sdk"));
const helpers_1 = require("../../services/helpers");
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
    if (!ppNodeUrl || !ppNodePort) {
        throw new Error('SDK must be initialized with pp node url and port prior to use the getPpNodeRoute function');
    }
    return `${ppNodeUrl}:${ppNodePort}`;
};
const getExplorerRoute = () => {
    const { explorerUrl } = Sdk_1.default.environment;
    const url = `${explorerUrl}`;
    return url;
};
const apiPostLegacy = async (url, data, config) => {
    let axiosResponse;
    try {
        axiosResponse = await _axios.post(url, data, config);
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
exports.apiPostLegacy = apiPostLegacy;
const apiPost = async (url, data, config) => {
    const myConfig = {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        // timeout: 31000,
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
    const payload = Object.assign(Object.assign({}, defaultPayload), givenPayload);
    (0, helpers_1.log)('from network ~ rpc call url', url);
    // log('from network - calling rpc', payload);
    const dataResult = await (0, exports.apiPost)(url, payload, Object.assign({}, config));
    // log('from network - rpc post result', payload);
    return dataResult;
};
exports.sendRpcCall = sendRpcCall;
const getAccountsData = async (address, config) => {
    const url = `${getRestRoute()}/cosmos/auth/v1beta1/accounts/${address}`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getAccountsData = getAccountsData;
const getAccountBalance = async (address, config) => {
    const url = `${getRestRoute()}/cosmos/bank/v1beta1/balances/${address}`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getAccountBalance = getAccountBalance;
const getStakingValidators = async (address, config) => {
    const url = `${getRestRoute()}/auth/acconts/${address}`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getStakingValidators = getStakingValidators;
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
    // @todo - move it to submitDelegate
    const url = `${getRestRoute()}/staking/delegators/${delegatorAddr}/delegations`;
    const { response: txData, error } = (0, exports.getSubmitTransactionData)(data);
    if (error) {
        return { error };
    }
    const dataResult = await (0, exports.apiPost)(url, txData, config);
    return dataResult;
};
exports.submitTransaction = submitTransaction;
const getTxListBlockchain = async (address, type, givenPage = 1, pageLimit = 5, config) => {
    const url = `${getRestRoute()}/cosmos/tx/v1beta1/txs`;
    const givenEvents = [`message.sender='${address}'`];
    if (type) {
        const msgTypeActionParameter = `message.action='${type}'`;
        givenEvents.push(msgTypeActionParameter);
    }
    const params = {
        events: givenEvents,
        'pagination.limit': pageLimit,
        'pagination.offset': givenPage,
        'pagination.count_total': true,
        order_by: 'ORDER_BY_DESC',
    };
    const dataResult = await (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    return dataResult;
};
exports.getTxListBlockchain = getTxListBlockchain;
/**
 * @param address
 * @deprecated
 * @param type
 * @param page
 * @param config
 * @returns
 */
const getTxList = async (address, type, page = 1, config) => {
    // const url = `${getExplorerRoute()}/api/activeAccont/`; // page 1
    // const url = `${getExplorerRoute()}/api/queryBlock/rand=9.56503971&height=1`;
    // const url = `${getExplorerRoute()}/api/cleanup`;
    const url = `${getExplorerRoute()}/api/getAccountHistory`;
    console.log('url 1', url);
    const params = {
        page,
        account: address,
        limit: 5,
    };
    if (type) {
        params.operation = type;
    }
    const dataResult = await (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params }));
    // https://explorer-test.thestratos.org/api/getAccountHistory?account=st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6&limit=2&operation=cosmos-sdk/MsgSend
    return dataResult;
};
exports.getTxList = getTxList;
// done
const getValidatorsList = async (status, page = 1, config) => {
    const url = `${getRestRoute()}/cosmos/staking/v1beta1/validators`;
    const dataResult = await (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params: { page, status } }));
    return dataResult;
};
exports.getValidatorsList = getValidatorsList;
// done
const getValidatorsBondedToDelegatorList = async (status, delegatorAddress, config) => {
    const url = `${getRestRoute()}/cosmos/staking/v1beta1/delegators/${delegatorAddress}/validators`;
    const dataResult = await (0, exports.apiGet)(url, Object.assign(Object.assign({}, config), { params: { status } }));
    return dataResult;
};
exports.getValidatorsBondedToDelegatorList = getValidatorsBondedToDelegatorList;
// done
const getValidator = async (address, config) => {
    const url = `${getRestRoute()}/cosmos/staking/v1beta1/validators/${address}`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getValidator = getValidator;
// done
const getStakingPool = async (config) => {
    const url = `${getRestRoute()}/cosmos/staking/v1beta1/pool`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getStakingPool = getStakingPool;
const getAvailableBalance = async (address, config) => {
    const url = `${getRestRoute()}/bank/balances/${address}`;
    const dataResult = await (0, exports.apiGet)(url, config);
    console.log('🚀 ~ file: network.ts ~ line 356 ~ getAvailableBalance dataResult', JSON.stringify(dataResult));
    return dataResult;
};
exports.getAvailableBalance = getAvailableBalance;
const getDelegatedBalance = async (delegatorAddr, config) => {
    const url = `${getRestRoute()}/staking/delegators/${delegatorAddr}/delegations`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getDelegatedBalance = getDelegatedBalance;
const getUnboundingBalance = async (delegatorAddr, config) => {
    const url = `${getRestRoute()}/staking/delegators/${delegatorAddr}/unbonding_delegations`;
    const dataResult = await (0, exports.apiGet)(url, config);
    return dataResult;
};
exports.getUnboundingBalance = getUnboundingBalance;
const getRewardBalance = async (delegatorAddr, config) => {
    const url = `${getRestRoute()}/distribution/delegators/${delegatorAddr}/rewards`;
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
    // console.log('uu', url);
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
    // console.log('network, rpc payload to be sent');
    // const { id } = payload;
    // const { filehash } = extraParams as unknown as Types.FileUserRequestUploadParams;
    // const myData = { id, method, params: { filehash: filehash ? filehash : '' } };
    // console.log(myData);
    // console.log(payload);
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
    console.log('🚀 ~ file: network.ts ~ line 476 ~ sendUserRequestGetOzone dataResult', dataResult);
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
const getChainId = async () => {
    var _a, _b;
    const result = await (0, exports.getRpcStatus)();
    const { response } = result;
    const chainId = (_b = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.node_info) === null || _b === void 0 ? void 0 : _b.network;
    return chainId;
};
exports.getChainId = getChainId;
//# sourceMappingURL=network.js.map