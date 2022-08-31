"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.getAccountTrasactions = exports.getMaxAvailableBalance = exports.getBalanceCardMetrics = exports.getOzoneMetricValue = exports.getBalanceCardMetricValue = exports.formatBalanceFromWei = exports.getBalance = exports.increaseBalance = void 0;
var get_1 = __importDefault(require("lodash/get"));
var hdVault_1 = require("../config/hdVault");
var tokens_1 = require("../config/tokens");
var bigNumber_1 = require("../services/bigNumber");
var network_1 = require("../services/network");
var transactions_1 = require("../services/transformers/transactions");
var TxTypes = __importStar(require("../transactions/types"));
// @depricated?
// export const getAccountsData = async (keyPairAddress: string): Promise<Types.CosmosAccountData> => {
//   try {
//     const accountsData = await getAccountsDataFromNetwork(keyPairAddress);
//     console.log('🚀 ~ file: accounts.ts ~ line 38 ~ getAccountsData ~ accountsData', accountsData);
//     const { response, error } = accountsData;
//     if (error) {
//       throw new Error(`1 Could not get account data. Details: ${error.message}`);
//     }
//     if (!response) {
//       throw new Error('Could not get account data. Response is empty');
//     }
//     return response;
//   } catch (err) {
//     console.log('2 Could not get accounts', (err as Error).message);
//     throw err;
//   }
// };
var increaseBalance = function (walletAddress, faucetUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var result, faucetError, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, network_1.requestBalanceIncrease)(walletAddress, faucetUrl)];
            case 1:
                result = _a.sent();
                faucetError = result.error;
                if (faucetError) {
                    return [2 /*return*/, { result: false, errorMessage: "Could not increase balance: Error: \"" + faucetError.message + "\"" }];
                }
                console.log('🚀 ~ file: accounts.ts ~ line 45 ~ increaseBalance ~ result', result);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log('Error: Faucet returns:', error_1.message);
                return [2 /*return*/, {
                        result: false,
                        errorMessage: "Could not increase balance: Error: \"" + error_1.message + "\"",
                    }];
            case 3: return [2 /*return*/, { result: true }];
        }
    });
}); };
exports.increaseBalance = increaseBalance;
var getBalance = function (keyPairAddress, requestedDenom, decimals) {
    if (decimals === void 0) { decimals = tokens_1.decimalShortPrecision; }
    return __awaiter(void 0, void 0, void 0, function () {
        var accountBalanceData, coins, coin, currentBalance, balanceInWei, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, network_1.getAccountBalance)(keyPairAddress)];
                case 1:
                    accountBalanceData = _a.sent();
                    coins = (0, get_1.default)(accountBalanceData, 'response.balances', []);
                    coin = coins.find(function (item) { return item.denom === requestedDenom; });
                    currentBalance = (coin === null || coin === void 0 ? void 0 : coin.amount) || '0';
                    balanceInWei = (0, bigNumber_1.create)(currentBalance);
                    balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(decimals, bigNumber_1.ROUND_DOWN);
                    return [2 /*return*/, balance];
            }
        });
    });
};
exports.getBalance = getBalance;
var formatBalanceFromWei = function (amount, requiredPrecision, appendDenom) {
    if (appendDenom === void 0) { appendDenom = false; }
    var balanceInWei = (0, bigNumber_1.create)(amount);
    var balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(requiredPrecision, bigNumber_1.ROUND_DOWN);
    if (!appendDenom) {
        return balance;
    }
    var fullBalance = balance + " " + hdVault_1.stratosTopDenom.toUpperCase();
    return fullBalance;
};
exports.formatBalanceFromWei = formatBalanceFromWei;
var getBalanceCardMetricValue = function (denom, amount) {
    var isStratosDenom = denom === hdVault_1.stratosDenom;
    if (!isStratosDenom) {
        return '0.0000 STOS';
    }
    if (!amount) {
        return '0.0000 STOS';
    }
    var balanceInWei = (0, bigNumber_1.create)(amount);
    var balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(tokens_1.decimalShortPrecision, bigNumber_1.ROUND_DOWN);
    var balanceToReturn = balance + " " + hdVault_1.stratosTopDenom.toUpperCase();
    return balanceToReturn;
};
exports.getBalanceCardMetricValue = getBalanceCardMetricValue;
// @todo merge with get balance card value
var getOzoneMetricValue = function (denom, amount) {
    var isStratosDenom = denom === hdVault_1.stratosUozDenom;
    var printableDenome = hdVault_1.stratosOzDenom.toUpperCase();
    if (!isStratosDenom) {
        return "0.0000 " + printableDenome;
    }
    if (!amount) {
        return "0.0000 " + printableDenome;
    }
    var balanceInWei = (0, bigNumber_1.create)(amount);
    var balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(tokens_1.decimalShortPrecision, bigNumber_1.ROUND_DOWN);
    var balanceToReturn = balance + " " + printableDenome;
    return balanceToReturn;
};
exports.getOzoneMetricValue = getOzoneMetricValue;
var getBalanceCardMetrics = function (keyPairAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var cardMetricsResult, detailedBalance, availableBalanceResult, availableBalanceResponse, availableBalanceError, amount, denom, delegatedBalanceResult, delegatedBalanceResponse, delegatedBalanceError, entries, amountInWei, myDelegated, unboundingBalanceResult, unboundingBalanceResponse, unboundingBalanceError, entries, amountInWei, rewardBalanceResult, rewardBalanceResponse, rewardBalanceError, entries, amount, denom, ozoneBalanceResult, ozoneBalanceRespone, ozoneBalanceError, amount, error_2;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                cardMetricsResult = {
                    available: "0.0000 " + hdVault_1.stratosTopDenom.toUpperCase(),
                    delegated: "0.0000 " + hdVault_1.stratosTopDenom.toUpperCase(),
                    unbounding: "0.0000 " + hdVault_1.stratosTopDenom.toUpperCase(),
                    reward: "0.0000 " + hdVault_1.stratosTopDenom.toUpperCase(),
                    ozone: "0.0000 " + hdVault_1.stratosTopDenom.toUpperCase(),
                    detailedBalance: {},
                };
                detailedBalance = {
                    delegated: {},
                    reward: {},
                    ozone: '',
                };
                return [4 /*yield*/, (0, network_1.getAvailableBalance)(keyPairAddress)];
            case 1:
                availableBalanceResult = _p.sent();
                availableBalanceResponse = availableBalanceResult.response, availableBalanceError = availableBalanceResult.error;
                if (!availableBalanceError) {
                    amount = (_b = (_a = availableBalanceResponse === null || availableBalanceResponse === void 0 ? void 0 : availableBalanceResponse.result) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.amount;
                    denom = (_d = (_c = availableBalanceResponse === null || availableBalanceResponse === void 0 ? void 0 : availableBalanceResponse.result) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.denom;
                    cardMetricsResult.available = (0, exports.getBalanceCardMetricValue)(denom, amount);
                }
                return [4 /*yield*/, (0, network_1.getDelegatedBalance)(keyPairAddress)];
            case 2:
                delegatedBalanceResult = _p.sent();
                delegatedBalanceResponse = delegatedBalanceResult.response, delegatedBalanceError = delegatedBalanceResult.error;
                if (!delegatedBalanceError) {
                    entries = delegatedBalanceResponse === null || delegatedBalanceResponse === void 0 ? void 0 : delegatedBalanceResponse.result;
                    amountInWei = entries === null || entries === void 0 ? void 0 : entries.reduce(function (acc, entry) {
                        var balanceInWei = (0, bigNumber_1.create)(entry.balance.amount);
                        var validatorAddress = entry.validator_address;
                        var validatorBalance = (0, exports.getBalanceCardMetricValue)(entry.balance.denom, entry.balance.amount);
                        detailedBalance.delegated[validatorAddress] = validatorBalance;
                        return (0, bigNumber_1.plus)(acc, balanceInWei);
                    }, 0);
                    myDelegated = (0, exports.getBalanceCardMetricValue)('ustos', "" + (amountInWei || ''));
                    cardMetricsResult.delegated = myDelegated;
                }
                return [4 /*yield*/, (0, network_1.getUnboundingBalance)(keyPairAddress)];
            case 3:
                unboundingBalanceResult = _p.sent();
                unboundingBalanceResponse = unboundingBalanceResult.response, unboundingBalanceError = unboundingBalanceResult.error;
                if (!unboundingBalanceError) {
                    entries = (_f = (_e = unboundingBalanceResponse === null || unboundingBalanceResponse === void 0 ? void 0 : unboundingBalanceResponse.result) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.entries;
                    amountInWei = entries === null || entries === void 0 ? void 0 : entries.reduce(function (acc, entry) {
                        var balanceInWei = (0, bigNumber_1.create)(entry.balance);
                        return (0, bigNumber_1.plus)(acc, balanceInWei);
                    }, 0);
                    cardMetricsResult.unbounding = (0, exports.getBalanceCardMetricValue)('ustos', "" + (amountInWei || ''));
                }
                return [4 /*yield*/, (0, network_1.getRewardBalance)(keyPairAddress)];
            case 4:
                rewardBalanceResult = _p.sent();
                rewardBalanceResponse = rewardBalanceResult.response, rewardBalanceError = rewardBalanceResult.error;
                if (!rewardBalanceError) {
                    entries = (_g = rewardBalanceResponse === null || rewardBalanceResponse === void 0 ? void 0 : rewardBalanceResponse.result) === null || _g === void 0 ? void 0 : _g.rewards;
                    amount = (_k = (_j = (_h = rewardBalanceResponse === null || rewardBalanceResponse === void 0 ? void 0 : rewardBalanceResponse.result) === null || _h === void 0 ? void 0 : _h.total) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.amount;
                    denom = (_o = (_m = (_l = rewardBalanceResponse === null || rewardBalanceResponse === void 0 ? void 0 : rewardBalanceResponse.result) === null || _l === void 0 ? void 0 : _l.total) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.denom;
                    entries === null || entries === void 0 ? void 0 : entries.forEach(function (entry) {
                        var _a, _b;
                        var validatorAddress = entry.validator_address;
                        var validatorBalance = ((_b = (_a = entry.reward) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.amount) || '0';
                        detailedBalance.reward[validatorAddress] = validatorBalance;
                    }, 0);
                    cardMetricsResult.reward = (0, exports.getBalanceCardMetricValue)(denom, amount);
                }
                _p.label = 5;
            case 5:
                _p.trys.push([5, 7, , 8]);
                return [4 /*yield*/, (0, network_1.sendUserRequestGetOzone)([{ walletaddr: keyPairAddress }])];
            case 6:
                ozoneBalanceResult = _p.sent();
                ozoneBalanceRespone = ozoneBalanceResult.response, ozoneBalanceError = ozoneBalanceResult.error;
                if (!ozoneBalanceError) {
                    amount = ozoneBalanceRespone === null || ozoneBalanceRespone === void 0 ? void 0 : ozoneBalanceRespone.result.ozone;
                    cardMetricsResult.ozone = (0, exports.getOzoneMetricValue)(hdVault_1.stratosUozDenom, amount);
                    detailedBalance.ozone = amount;
                }
                return [3 /*break*/, 8];
            case 7:
                error_2 = _p.sent();
                console.log('could not get ozone balance , error', error_2);
                return [3 /*break*/, 8];
            case 8:
                cardMetricsResult.detailedBalance = detailedBalance;
                return [2 /*return*/, cardMetricsResult];
        }
    });
}); };
exports.getBalanceCardMetrics = getBalanceCardMetrics;
var getMaxAvailableBalance = function (keyPairAddress, requestedDenom, decimals) {
    if (decimals === void 0) { decimals = 4; }
    return __awaiter(void 0, void 0, void 0, function () {
        var accountBalanceData, coins, coin, currentBalance, feeAmount, balanceInWei, balance_1, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('from max av balance');
                    return [4 /*yield*/, (0, network_1.getAccountBalance)(keyPairAddress)];
                case 1:
                    accountBalanceData = _a.sent();
                    coins = (0, get_1.default)(accountBalanceData, 'response.balances', []);
                    coin = coins.find(function (item) { return item.denom === requestedDenom; });
                    currentBalance = (coin === null || coin === void 0 ? void 0 : coin.amount) || '0';
                    feeAmount = (0, bigNumber_1.create)(tokens_1.standardFeeAmount);
                    balanceInWei = (0, bigNumber_1.create)(currentBalance);
                    if (balanceInWei.gt(0)) {
                        balance_1 = (0, bigNumber_1.fromWei)(balanceInWei.minus(feeAmount), tokens_1.decimalPrecision).toFormat(decimals, bigNumber_1.ROUND_DOWN);
                        return [2 /*return*/, balance_1];
                    }
                    balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(decimals, bigNumber_1.ROUND_DOWN);
                    return [2 /*return*/, balance];
            }
        });
    });
};
exports.getMaxAvailableBalance = getMaxAvailableBalance;
var getAccountTrasactions = function (address, type, page) {
    if (type === void 0) { type = TxTypes.HistoryTxType.All; }
    return __awaiter(void 0, void 0, void 0, function () {
        var txType, txListResult, response, error, parsedData, _a, data, total, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    txType = TxTypes.BlockChainTxMsgTypesMap.get(type) || '';
                    return [4 /*yield*/, (0, network_1.getTxListBlockchain)(address, txType, page)];
                case 1:
                    txListResult = _b.sent();
                    response = txListResult.response, error = txListResult.error;
                    if (error) {
                        throw new Error("Could not fetch tx history. Details: \"" + error.message + "\"");
                    }
                    if (!response) {
                        throw new Error('Could not fetch tx history');
                    }
                    parsedData = [];
                    _a = response.txs, data = _a === void 0 ? [] : _a, total = response.total_count;
                    console.log('🚀 ~ file: accounts.ts ~ line 223 ~ response', response);
                    data.forEach(function (txItem) {
                        try {
                            var parsed = (0, transactions_1.transformTx)(txItem);
                            parsedData.push(parsed);
                        }
                        catch (err) {
                            console.log("Parsing error: " + err.message);
                        }
                    });
                    result = { data: parsedData, total: total, page: page || 1 };
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.getAccountTrasactions = getAccountTrasactions;
//# sourceMappingURL=accounts.js.map