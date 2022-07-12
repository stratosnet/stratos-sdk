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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSdsPrepayTx = exports.getWithdrawalAllRewardTx = exports.getWithdrawalRewardTx = exports.getUnDelegateTx = exports.getDelegateTx = exports.getSendTx = exports.getBaseTx = exports.getStandardAmount = exports.getStandardFee = exports.sign = exports.broadcast = exports.getStratosTransactionRegistryTypes = void 0;
var stargate_1 = require("@cosmjs/stargate");
var tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
var accounts_1 = require("../accounts");
var hdVault_1 = require("../config/hdVault");
var tokens_1 = require("../config/tokens");
var Sdk_1 = __importDefault(require("../Sdk"));
var bigNumber_1 = require("../services/bigNumber");
var cosmos_1 = require("../services/cosmos");
var validators_1 = require("../validators");
var Types = __importStar(require("./types"));
var stratosTypes = __importStar(require("@stratos-network/stratos-cosmosjs-types"));
function payloadGenerator(dataList) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!dataList.length) return [3 /*break*/, 2];
                return [4 /*yield*/, dataList.shift()];
            case 1:
                _a.sent();
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
        }
    });
}
var getStratosTransactionRegistryTypes = function () {
    var msgPrepayProto = stratosTypes.stratos.sds.v1.MsgPrepay;
    var stratosTxRegistryTypes = __spreadArray(__spreadArray([], stargate_1.defaultRegistryTypes, true), [
        [Types.TxMsgTypes.SdsPrepay, msgPrepayProto],
    ], false);
    return stratosTxRegistryTypes;
};
exports.getStratosTransactionRegistryTypes = getStratosTransactionRegistryTypes;
var broadcast = function (signedTx) { return __awaiter(void 0, void 0, void 0, function () {
    var client, txBytes, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, cosmos_1.getCosmos)()];
            case 1:
                client = _a.sent();
                txBytes = tx_1.TxRaw.encode(signedTx).finish();
                console.log('🚀 ~ file: transactions.ts ~ line 28 ~ broadcast ~ txBytes to be broadcasted', JSON.stringify(txBytes));
                return [4 /*yield*/, client.broadcastTx(txBytes)];
            case 2:
                result = _a.sent();
                console.log('🚀 ~ file: transactions.ts ~ line 52 ~ broadcast ~ result', result);
                return [2 /*return*/, result];
            case 3:
                err_1 = _a.sent();
                console.log('Could not broadcast', err_1.message);
                throw err_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.broadcast = broadcast;
var sign = function (address, txMessages, memo, givenFee) {
    if (memo === void 0) { memo = ''; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fee, client, signedTx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fee = givenFee ? givenFee : (0, exports.getStandardFee)();
                    return [4 /*yield*/, (0, cosmos_1.getCosmos)()];
                case 1:
                    client = _a.sent();
                    signedTx = client.sign(address, txMessages, fee, memo);
                    return [2 /*return*/, signedTx];
            }
        });
    });
};
exports.sign = sign;
var getStandardFee = function (numberOfMessages) {
    if (numberOfMessages === void 0) { numberOfMessages = 1; }
    var fee = {
        amount: [{ amount: String(tokens_1.standardFeeAmount), denom: hdVault_1.stratosDenom }],
        gas: String(tokens_1.baseGasAmount + tokens_1.perMsgGasAmount * numberOfMessages),
    };
    return fee;
};
exports.getStandardFee = getStandardFee;
var getStandardAmount = function (amounts) {
    var result = amounts.map(function (amount) { return ({
        amount: (0, bigNumber_1.toWei)(amount, tokens_1.decimalPrecision).toString(),
        denom: hdVault_1.stratosDenom,
    }); });
    return result;
};
exports.getStandardAmount = getStandardAmount;
// @depricated ?
var getBaseTx = function (keyPairAddress, memo, numberOfMessages) {
    if (memo === void 0) { memo = ''; }
    if (numberOfMessages === void 0) { numberOfMessages = 1; }
    return __awaiter(void 0, void 0, void 0, function () {
        var accountsData, oldSequence, newSequence, chainId, myTx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, accounts_1.getAccountsData)(keyPairAddress)];
                case 1:
                    accountsData = _a.sent();
                    oldSequence = String(accountsData.account.sequence);
                    newSequence = parseInt(oldSequence);
                    chainId = Sdk_1.default.environment.chainId;
                    myTx = {
                        chain_id: chainId,
                        fee: (0, exports.getStandardFee)(numberOfMessages),
                        memo: memo,
                        account_number: String(accountsData.account.account_number),
                        sequence: "" + newSequence,
                    };
                    return [2 /*return*/, myTx];
            }
        });
    });
};
exports.getBaseTx = getBaseTx;
var getSendTx = function (keyPairAddress, sendPayload) { return __awaiter(void 0, void 0, void 0, function () {
    var payloadToProcess, iteratedData, messagesList, _a, amount, toAddress, message;
    return __generator(this, function (_b) {
        payloadToProcess = payloadGenerator(sendPayload);
        iteratedData = payloadToProcess.next();
        messagesList = [];
        while (iteratedData.value) {
            _a = iteratedData.value, amount = _a.amount, toAddress = _a.toAddress;
            message = {
                typeUrl: Types.TxMsgTypes.Send,
                value: {
                    amount: (0, exports.getStandardAmount)([amount]),
                    fromAddress: keyPairAddress,
                    toAddress: toAddress,
                },
            };
            messagesList.push(message);
            iteratedData = payloadToProcess.next();
        }
        return [2 /*return*/, messagesList];
    });
}); };
exports.getSendTx = getSendTx;
var getDelegateTx = function (delegatorAddress, delegatePayload) { return __awaiter(void 0, void 0, void 0, function () {
    var payloadToProcess, iteratedData, messagesList, _a, amount, validatorAddress, message;
    return __generator(this, function (_b) {
        payloadToProcess = payloadGenerator(delegatePayload);
        iteratedData = payloadToProcess.next();
        messagesList = [];
        while (iteratedData.value) {
            _a = iteratedData.value, amount = _a.amount, validatorAddress = _a.validatorAddress;
            message = {
                typeUrl: Types.TxMsgTypes.Delegate,
                value: {
                    amount: {
                        amount: (0, bigNumber_1.toWei)(amount, tokens_1.decimalPrecision).toString(),
                        denom: hdVault_1.stratosDenom,
                    },
                    delegatorAddress: delegatorAddress,
                    validatorAddress: validatorAddress,
                },
            };
            messagesList.push(message);
            iteratedData = payloadToProcess.next();
        }
        return [2 /*return*/, messagesList];
    });
}); };
exports.getDelegateTx = getDelegateTx;
var getUnDelegateTx = function (delegatorAddress, unDelegatePayload) { return __awaiter(void 0, void 0, void 0, function () {
    var payloadToProcess, iteratedData, messagesList, _a, amount, validatorAddress, message;
    return __generator(this, function (_b) {
        payloadToProcess = payloadGenerator(unDelegatePayload);
        iteratedData = payloadToProcess.next();
        messagesList = [];
        while (iteratedData.value) {
            _a = iteratedData.value, amount = _a.amount, validatorAddress = _a.validatorAddress;
            message = {
                typeUrl: Types.TxMsgTypes.Undelegate,
                value: {
                    amount: {
                        amount: (0, bigNumber_1.toWei)(amount, tokens_1.decimalPrecision).toString(),
                        denom: hdVault_1.stratosDenom,
                    },
                    delegatorAddress: delegatorAddress,
                    validatorAddress: validatorAddress,
                },
            };
            messagesList.push(message);
            iteratedData = payloadToProcess.next();
        }
        return [2 /*return*/, messagesList];
    });
}); };
exports.getUnDelegateTx = getUnDelegateTx;
var getWithdrawalRewardTx = function (delegatorAddress, withdrawalPayload) { return __awaiter(void 0, void 0, void 0, function () {
    var payloadToProcess, iteratedData, messagesList, validatorAddress, message;
    return __generator(this, function (_a) {
        payloadToProcess = payloadGenerator(withdrawalPayload);
        iteratedData = payloadToProcess.next();
        messagesList = [];
        while (iteratedData.value) {
            validatorAddress = iteratedData.value.validatorAddress;
            message = {
                typeUrl: Types.TxMsgTypes.WithdrawRewards,
                value: {
                    delegatorAddress: delegatorAddress,
                    validatorAddress: validatorAddress,
                },
            };
            messagesList.push(message);
            iteratedData = payloadToProcess.next();
        }
        return [2 /*return*/, messagesList];
    });
}); };
exports.getWithdrawalRewardTx = getWithdrawalRewardTx;
var getWithdrawalAllRewardTx = function (delegatorAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var vListResult, withdrawalPayload, payloadToProcess, iteratedData, messagesList, validatorAddress, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, validators_1.getValidatorsBondedToDelegator)(delegatorAddress)];
            case 1:
                vListResult = _a.sent();
                withdrawalPayload = vListResult.data;
                payloadToProcess = payloadGenerator(withdrawalPayload.map(function (item) { return ({ validatorAddress: item.address }); }));
                iteratedData = payloadToProcess.next();
                messagesList = [];
                while (iteratedData.value) {
                    validatorAddress = iteratedData.value.validatorAddress;
                    message = {
                        typeUrl: Types.TxMsgTypes.WithdrawRewards,
                        value: {
                            delegatorAddress: delegatorAddress,
                            validatorAddress: validatorAddress,
                        },
                    };
                    messagesList.push(message);
                    iteratedData = payloadToProcess.next();
                }
                return [2 /*return*/, messagesList];
        }
    });
}); };
exports.getWithdrawalAllRewardTx = getWithdrawalAllRewardTx;
var getSdsPrepayTx = function (senderAddress, prepayPayload) { return __awaiter(void 0, void 0, void 0, function () {
    var payloadToProcess, iteratedData, messagesList, amount, message;
    return __generator(this, function (_a) {
        payloadToProcess = payloadGenerator(prepayPayload);
        iteratedData = payloadToProcess.next();
        messagesList = [];
        while (iteratedData.value) {
            amount = iteratedData.value.amount;
            message = {
                typeUrl: Types.TxMsgTypes.SdsPrepay,
                value: {
                    sender: senderAddress,
                    coins: (0, exports.getStandardAmount)([amount]),
                },
            };
            messagesList.push(message);
            iteratedData = payloadToProcess.next();
        }
        return [2 /*return*/, messagesList];
    });
}); };
exports.getSdsPrepayTx = getSdsPrepayTx;
//# sourceMappingURL=transactions.js.map