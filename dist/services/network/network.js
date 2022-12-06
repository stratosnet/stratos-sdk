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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainId = exports.sendUserUploadData = exports.sendUserRequestGetOzone = exports.sendUserRequestUpload = exports.sendUserRequestList = exports.getRpcPayload = exports.uploadFile = exports.getRpcStatus = exports.requestBalanceIncrease = exports.getRewardBalance = exports.getUnboundingBalance = exports.getDelegatedBalance = exports.getAvailableBalance = exports.getStakingPool = exports.getValidator = exports.getValidatorsBondedToDelegatorList = exports.getValidatorsList = exports.getTxList = exports.getTxListBlockchain = exports.submitTransaction = exports.getSubmitTransactionData = exports.getStakingValidators = exports.getAccountBalance = exports.getAccountsData = exports.sendRpcCall = exports.apiGet = exports.apiPost = exports.apiPostLegacy = void 0;
var axios_1 = __importDefault(require("axios"));
var json_bigint_1 = __importDefault(require("json-bigint"));
var config_1 = require("../../config");
var Sdk_1 = __importDefault(require("../../Sdk"));
var helpers_1 = require("../../services/helpers");
var _axios = axios_1.default.create({});
_axios.defaults.transformResponse = [
    function (data) {
        try {
            return (0, json_bigint_1.default)({ useNativeBigInt: true }).parse(data);
        }
        catch (_) {
            return data;
        }
    },
];
var getRestRoute = function () {
    var restUrl = Sdk_1.default.environment.restUrl;
    return restUrl;
};
var getRpcRoute = function () {
    var rpcUrl = Sdk_1.default.environment.rpcUrl;
    return rpcUrl;
};
var getPpNodeRoute = function () {
    var _a = Sdk_1.default.environment, ppNodeUrl = _a.ppNodeUrl, ppNodePort = _a.ppNodePort;
    return "".concat(ppNodeUrl, ":").concat(ppNodePort);
};
var getExplorerRoute = function () {
    var explorerUrl = Sdk_1.default.environment.explorerUrl;
    var url = "".concat(explorerUrl);
    return url;
};
var apiPostLegacy = function (url, data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var axiosResponse, err_1, myResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, _axios.post(url, data, config)];
            case 1:
                axiosResponse = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, { error: { message: err_1.message } }];
            case 3:
                try {
                    myResponse = axiosResponse.data;
                    return [2 /*return*/, { response: myResponse }];
                }
                catch (_) {
                    return [2 /*return*/, { response: axiosResponse.data }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.apiPostLegacy = apiPostLegacy;
var apiPost = function (url, data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var myConfig, axiosResponse, err_2, e, myResponse, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                myConfig = {
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 13000,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, _axios.post(url, data, __assign(__assign({}, config), myConfig))];
            case 2:
                axiosResponse = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                e = err_2;
                return [2 /*return*/, { error: { message: e.message } }];
            case 4:
                try {
                    myResponse = axiosResponse.data;
                    return [2 /*return*/, { response: myResponse }];
                }
                catch (err) {
                    e = err;
                    return [2 /*return*/, { error: { message: e.message } }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.apiPost = apiPost;
var apiGet = function (url, config) { return __awaiter(void 0, void 0, void 0, function () {
    var axiosResponse, err_3, myResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, _axios.get(url, config)];
            case 1:
                axiosResponse = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, { error: { message: err_3.message } }];
            case 3:
                try {
                    myResponse = axiosResponse.data;
                    return [2 /*return*/, { response: myResponse }];
                }
                catch (_) {
                    return [2 /*return*/, { response: axiosResponse.data }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.apiGet = apiGet;
var sendRpcCall = function (givenPayload, config) { return __awaiter(void 0, void 0, void 0, function () {
    var defaultPayload, url, payload, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                defaultPayload = {
                    id: 1,
                    jsonrpc: '2.0',
                    method: 'eth_protocolVersion',
                    params: [],
                };
                url = "".concat(getPpNodeRoute());
                (0, helpers_1.log)('from network ~ rpc call url', url);
                payload = __assign(__assign({}, defaultPayload), givenPayload);
                (0, helpers_1.log)('from network - calling rpc', payload);
                return [4 /*yield*/, (0, exports.apiPost)(url, payload, __assign({}, config))];
            case 1:
                dataResult = _a.sent();
                (0, helpers_1.log)('from network - rpc post result', payload);
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.sendRpcCall = sendRpcCall;
var getAccountsData = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRestRoute(), "/cosmos/auth/v1beta1/accounts/").concat(address);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAccountsData = getAccountsData;
var getAccountBalance = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRestRoute(), "/cosmos/bank/v1beta1/balances/").concat(address);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAccountBalance = getAccountBalance;
var getStakingValidators = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRestRoute(), "/auth/acconts/").concat(address);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getStakingValidators = getStakingValidators;
var getSubmitTransactionData = function (data) {
    var txData;
    if (!data) {
        return { response: txData };
    }
    try {
        txData = json_bigint_1.default.parse(data);
        return { response: txData };
    }
    catch (err) {
        return {
            error: { message: "Can't submit transaction. Can't parse transaction data. ".concat(err.message) },
        };
    }
};
exports.getSubmitTransactionData = getSubmitTransactionData;
var submitTransaction = function (delegatorAddr, data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, _a, txData, error, dataResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "".concat(getRestRoute(), "/staking/delegators/").concat(delegatorAddr, "/delegations");
                _a = (0, exports.getSubmitTransactionData)(data), txData = _a.response, error = _a.error;
                if (error) {
                    return [2 /*return*/, { error: error }];
                }
                return [4 /*yield*/, (0, exports.apiPost)(url, txData, config)];
            case 1:
                dataResult = _b.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.submitTransaction = submitTransaction;
var getTxListBlockchain = function (address, type, page, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, params, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(getRestRoute(), "/txs");
                    params = {
                        page: page,
                        limit: 3,
                        'message.sender': address,
                    };
                    if (type) {
                        params['message.action'] = type;
                    }
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
                case 1:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
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
var getTxList = function (address, type, page, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, params, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(getExplorerRoute(), "/api/getAccountHistory");
                    params = {
                        page: page,
                        account: address,
                        limit: 5,
                    };
                    // console.log('🚀 ~ file: network.ts ~ line 129 ~ params', params);
                    if (type) {
                        params.operation = type;
                    }
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: params }))];
                case 1:
                    dataResult = _a.sent();
                    // https://explorer-test.thestratos.org/api/getAccountHistory?account=st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6&limit=2&operation=cosmos-sdk/MsgSend
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getTxList = getTxList;
// done
var getValidatorsList = function (status, page, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(getRestRoute(), "/cosmos/staking/v1beta1/validators");
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: { page: page, status: status } }))];
                case 1:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getValidatorsList = getValidatorsList;
// done
var getValidatorsBondedToDelegatorList = function (status, delegatorAddress, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRestRoute(), "/cosmos/staking/v1beta1/delegators/").concat(delegatorAddress, "/validators");
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: { status: status } }))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getValidatorsBondedToDelegatorList = getValidatorsBondedToDelegatorList;
// done
var getValidator = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRestRoute(), "/cosmos/staking/v1beta1/validators/").concat(address);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getValidator = getValidator;
// done
var getStakingPool = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRestRoute(), "/cosmos/staking/v1beta1/pool");
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getStakingPool = getStakingPool;
var getAvailableBalance = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRestRoute(), "/bank/balances/").concat(address);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                console.log('🚀 ~ file: network.ts ~ line 356 ~ dataResult', JSON.stringify(dataResult));
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAvailableBalance = getAvailableBalance;
var getDelegatedBalance = function (delegatorAddr, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRestRoute(), "/staking/delegators/").concat(delegatorAddr, "/delegations");
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getDelegatedBalance = getDelegatedBalance;
var getUnboundingBalance = function (delegatorAddr, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRestRoute(), "/staking/delegators/").concat(delegatorAddr, "/unbonding_delegations");
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getUnboundingBalance = getUnboundingBalance;
var getRewardBalance = function (delegatorAddr, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRestRoute(), "/distribution/delegators/").concat(delegatorAddr, "/rewards");
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getRewardBalance = getRewardBalance;
var requestBalanceIncrease = function (walletAddress, faucetUrl, denom, // ustos and now wei
config) {
    if (denom === void 0) { denom = config_1.hdVault.stratosDenom; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, payload, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "".concat(faucetUrl);
                    payload = {
                        denom: denom,
                        address: walletAddress.trim(),
                    };
                    return [4 /*yield*/, (0, exports.apiPost)(url, payload, config)];
                case 1:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.requestBalanceIncrease = requestBalanceIncrease;
var getRpcStatus = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRpcRoute(), "/status");
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getRpcStatus = getRpcStatus;
var uploadFile = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(getRpcRoute(), "/status");
                console.log('🚀 !~ file: network.ts ~ line 321 ~ getRpcStatus ~ url', url);
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.uploadFile = uploadFile;
var getRpcPayload = function (msgId, method, extraParams) {
    var payload = {
        id: msgId,
        method: method,
        params: extraParams,
    };
    return payload;
};
exports.getRpcPayload = getRpcPayload;
var sendUserRequestList = function (extraParams, config) { return __awaiter(void 0, void 0, void 0, function () {
    var msgId, method, payload, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msgId = 1;
                method = 'user_requestList';
                payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
                return [4 /*yield*/, (0, exports.sendRpcCall)(payload, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.sendUserRequestList = sendUserRequestList;
var sendUserRequestUpload = function (extraParams, config) { return __awaiter(void 0, void 0, void 0, function () {
    var msgId, method, payload, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msgId = 1;
                method = 'user_requestUpload';
                payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
                return [4 /*yield*/, (0, exports.sendRpcCall)(payload, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.sendUserRequestUpload = sendUserRequestUpload;
var sendUserRequestGetOzone = function (extraParams, config) { return __awaiter(void 0, void 0, void 0, function () {
    var msgId, method, payload, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msgId = 1;
                method = 'user_requestGetOzone';
                payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
                return [4 /*yield*/, (0, exports.sendRpcCall)(payload, config)];
            case 1:
                dataResult = _a.sent();
                console.log('🚀 ~ file: network.ts ~ line 476 ~ dataResult', dataResult);
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.sendUserRequestGetOzone = sendUserRequestGetOzone;
var sendUserUploadData = function (extraParams, config) { return __awaiter(void 0, void 0, void 0, function () {
    var msgId, method, payload, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msgId = 1;
                method = 'user_uploadData';
                payload = (0, exports.getRpcPayload)(msgId, method, extraParams);
                return [4 /*yield*/, (0, exports.sendRpcCall)(payload, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.sendUserUploadData = sendUserUploadData;
var getChainId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, response, chainId;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, exports.getRpcStatus)()];
            case 1:
                result = _c.sent();
                response = result.response;
                chainId = (_b = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.node_info) === null || _b === void 0 ? void 0 : _b.network;
                return [2 /*return*/, chainId];
        }
    });
}); };
exports.getChainId = getChainId;
//# sourceMappingURL=network.js.map