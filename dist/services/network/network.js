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
        while (_) try {
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
exports.requestBalanceIncrease = exports.getRewardBalance = exports.getUnboundingBalance = exports.getDelegatedBalance = exports.getAvailableBalance = exports.getStakingPool = exports.getValidator = exports.getValidatorsBondedToDelegatorList = exports.getValidatorsList = exports.getTxList = exports.submitTransaction = exports.getSubmitTransactionData = exports.getStakingValidators = exports.getAccountsData = exports.apiGet = exports.apiPost = void 0;
var axios_1 = __importDefault(require("axios"));
var json_bigint_1 = __importDefault(require("json-bigint"));
var Sdk_1 = __importDefault(require("../../Sdk"));
var getRestRoute = function () {
    var restUrl = Sdk_1.default.environment.restUrl;
    return restUrl;
};
var getExplorerRoute = function () {
    var explorerUrl = Sdk_1.default.environment.explorerUrl;
    var url = "" + explorerUrl;
    return url;
};
var apiPost = function (url, data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var axiosResponse, err_1, myResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.post(url, data, config)];
            case 1:
                axiosResponse = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, { error: { message: err_1.message } }];
            case 3:
                try {
                    myResponse = (0, json_bigint_1.default)({ useNativeBigInt: true }).parse(axiosResponse.data);
                    return [2 /*return*/, { response: myResponse }];
                }
                catch (_) {
                    return [2 /*return*/, { response: axiosResponse.data }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.apiPost = apiPost;
var apiGet = function (url, config) { return __awaiter(void 0, void 0, void 0, function () {
    var axiosResponse, err_2, myResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get(url, config)];
            case 1:
                axiosResponse = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                return [2 /*return*/, { error: { message: err_2.message } }];
            case 3:
                try {
                    myResponse = (0, json_bigint_1.default)({ useNativeBigInt: true }).parse(axiosResponse.data);
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
var getAccountsData = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getRestRoute() + "/auth/acconts/" + address;
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getAccountsData = getAccountsData;
var getStakingValidators = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getRestRoute() + "/auth/acconts/" + address;
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
            error: { message: "Can't submit transaction. Can't parse transaction data. " + err.message },
        };
    }
};
exports.getSubmitTransactionData = getSubmitTransactionData;
var submitTransaction = function (delegatorAddr, data, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, _a, txData, error, dataResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = getRestRoute() + "/staking/delegators/" + delegatorAddr + "/delegations";
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
var getTxList = function (address, type, page, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, params, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = getExplorerRoute() + "/api/getAccountHistory";
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
var getValidatorsList = function (status, page, config) {
    if (page === void 0) { page = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var url, dataResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = getRestRoute() + "/staking/validators";
                    return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: { page: page, status: status } }))];
                case 1:
                    dataResult = _a.sent();
                    return [2 /*return*/, dataResult];
            }
        });
    });
};
exports.getValidatorsList = getValidatorsList;
var getValidatorsBondedToDelegatorList = function (status, delegatorAddress, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getRestRoute() + "/staking/delegators/" + delegatorAddress + "/validators";
                return [4 /*yield*/, (0, exports.apiGet)(url, __assign(__assign({}, config), { params: { status: status } }))];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getValidatorsBondedToDelegatorList = getValidatorsBondedToDelegatorList;
var getValidator = function (address, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getRestRoute() + "/staking/validators/" + address;
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getValidator = getValidator;
var getStakingPool = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = getRestRoute() + "/staking/pool";
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
                url = getRestRoute() + "/bank/balances/" + address;
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
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
                url = getRestRoute() + "/staking/delegators/" + delegatorAddr + "/delegations";
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
                url = getRestRoute() + "/staking/delegators/" + delegatorAddr + "/unbonding_delegations";
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
                url = getRestRoute() + "/distribution/delegators/" + delegatorAddr + "/rewards";
                return [4 /*yield*/, (0, exports.apiGet)(url, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.getRewardBalance = getRewardBalance;
var requestBalanceIncrease = function (walletAddress, faucetUrl, config) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dataResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = faucetUrl + "/" + walletAddress;
                return [4 /*yield*/, (0, exports.apiPost)(url, {}, config)];
            case 1:
                dataResult = _a.sent();
                return [2 /*return*/, dataResult];
        }
    });
}); };
exports.requestBalanceIncrease = requestBalanceIncrease;
//# sourceMappingURL=network.js.map