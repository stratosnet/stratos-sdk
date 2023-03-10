"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountTrasactions = exports.getMaxAvailableBalance = exports.getBalanceCardMetrics = exports.getOzoneMetricValue = exports.getBalanceCardMetricValue = exports.formatBalanceFromWei = exports.getBalance = exports.increaseBalance = void 0;
const get_1 = __importDefault(require("lodash/get"));
const config_1 = require("../config");
const hdVault_1 = require("../config/hdVault");
const tokens_1 = require("../config/tokens");
const bigNumber_1 = require("../services/bigNumber");
const network_1 = require("../services/network");
const transactions_1 = require("../services/transformers/transactions");
const TxTypes = __importStar(require("../transactions/types"));
const increaseBalance = async (walletAddress, faucetUrl, denom) => {
    try {
        const result = await (0, network_1.requestBalanceIncrease)(walletAddress, faucetUrl, denom);
        const { error: faucetError } = result;
        if (faucetError) {
            return { result: false, errorMessage: `Could not increase balance: Error: "${faucetError.message}"` };
        }
        console.log('🚀 ~ file: accounts.ts ~ line 45 ~ increaseBalance ~ result', result);
    }
    catch (error) {
        console.log('Error: Faucet returns:', error.message);
        return {
            result: false,
            errorMessage: `Could not increase balance: Error: "${error.message}"`,
        };
    }
    return { result: true };
};
exports.increaseBalance = increaseBalance;
const getBalance = async (keyPairAddress, requestedDenom, decimals = tokens_1.decimalShortPrecision) => {
    const accountBalanceData = await (0, network_1.getAccountBalance)(keyPairAddress);
    const coins = (0, get_1.default)(accountBalanceData, 'response.balances', []);
    const coin = coins.find(item => item.denom === requestedDenom);
    const currentBalance = (coin === null || coin === void 0 ? void 0 : coin.amount) || '0';
    const balanceInWei = (0, bigNumber_1.create)(currentBalance);
    const balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(decimals, bigNumber_1.ROUND_DOWN);
    return balance;
};
exports.getBalance = getBalance;
const formatBalanceFromWei = (amount, requiredPrecision, appendDenom = false) => {
    const balanceInWei = (0, bigNumber_1.create)(amount);
    const balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(requiredPrecision, bigNumber_1.ROUND_DOWN);
    if (!appendDenom) {
        return balance;
    }
    const fullBalance = `${balance} ${hdVault_1.stratosTopDenom.toUpperCase()}`;
    return fullBalance;
};
exports.formatBalanceFromWei = formatBalanceFromWei;
const getBalanceCardMetricValue = (denom, amount) => {
    const isStratosDenom = denom === hdVault_1.stratosDenom;
    if (!isStratosDenom) {
        return '0.0000 STOS';
    }
    if (!amount) {
        return '0.0000 STOS';
    }
    const balanceInWei = (0, bigNumber_1.create)(amount);
    const balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(tokens_1.decimalShortPrecision, bigNumber_1.ROUND_DOWN);
    const balanceToReturn = `${balance} ${hdVault_1.stratosTopDenom.toUpperCase()}`;
    return balanceToReturn;
};
exports.getBalanceCardMetricValue = getBalanceCardMetricValue;
// @todo merge with get balance card value
const getOzoneMetricValue = (denom, amount) => {
    const isStratosDenom = denom === hdVault_1.stratosUozDenom;
    const printableDenome = hdVault_1.stratosOzDenom.toUpperCase();
    if (!isStratosDenom) {
        return `0.0000 ${printableDenome}`;
    }
    if (!amount) {
        return `0.0000 ${printableDenome}`;
    }
    const balanceInWei = (0, bigNumber_1.create)(amount);
    const balance = (0, bigNumber_1.fromWei)(balanceInWei, 9).toFormat(tokens_1.decimalShortPrecision, bigNumber_1.ROUND_DOWN);
    console.log('balance', balance);
    const balanceToReturn = `${balance} ${printableDenome}`;
    return balanceToReturn;
};
exports.getOzoneMetricValue = getOzoneMetricValue;
const getBalanceCardMetrics = async (keyPairAddress) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const cardMetricsResult = {
        available: `0.0000 ${hdVault_1.stratosTopDenom.toUpperCase()}`,
        delegated: `0.0000 ${hdVault_1.stratosTopDenom.toUpperCase()}`,
        unbounding: `0.0000 ${hdVault_1.stratosTopDenom.toUpperCase()}`,
        reward: `0.0000 ${hdVault_1.stratosTopDenom.toUpperCase()}`,
        ozone: `0.0000 ${hdVault_1.stratosTopDenom.toUpperCase()}`,
        detailedBalance: {},
    };
    const detailedBalance = {
        delegated: {},
        reward: {},
        ozone: '',
    };
    const availableBalanceResult = await (0, network_1.getAvailableBalance)(keyPairAddress);
    const { response: availableBalanceResponse, error: availableBalanceError } = availableBalanceResult;
    if (!availableBalanceError) {
        const amount = (_b = (_a = availableBalanceResponse === null || availableBalanceResponse === void 0 ? void 0 : availableBalanceResponse.result) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.amount;
        const denom = (_d = (_c = availableBalanceResponse === null || availableBalanceResponse === void 0 ? void 0 : availableBalanceResponse.result) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.denom;
        cardMetricsResult.available = (0, exports.getBalanceCardMetricValue)(denom, amount);
    }
    const delegatedBalanceResult = await (0, network_1.getDelegatedBalance)(keyPairAddress);
    const { response: delegatedBalanceResponse, error: delegatedBalanceError } = delegatedBalanceResult;
    if (!delegatedBalanceError) {
        const entries = delegatedBalanceResponse === null || delegatedBalanceResponse === void 0 ? void 0 : delegatedBalanceResponse.result;
        const amountInWei = entries === null || entries === void 0 ? void 0 : entries.reduce((acc, entry) => {
            var _a;
            const balanceInWei = (0, bigNumber_1.create)(entry.balance.amount);
            const validatorAddress = (_a = entry.delegation) === null || _a === void 0 ? void 0 : _a.validator_address;
            const validatorBalance = (0, exports.getBalanceCardMetricValue)(entry.balance.denom, entry.balance.amount);
            detailedBalance.delegated[validatorAddress] = validatorBalance;
            return (0, bigNumber_1.plus)(acc, balanceInWei);
        }, 0);
        const myDelegated = (0, exports.getBalanceCardMetricValue)(config_1.hdVault.stratosDenom, `${amountInWei || ''}`);
        cardMetricsResult.delegated = myDelegated;
    }
    const unboundingBalanceResult = await (0, network_1.getUnboundingBalance)(keyPairAddress);
    const { response: unboundingBalanceResponse, error: unboundingBalanceError } = unboundingBalanceResult;
    if (!unboundingBalanceError) {
        const entries = (_f = (_e = unboundingBalanceResponse === null || unboundingBalanceResponse === void 0 ? void 0 : unboundingBalanceResponse.result) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.entries;
        const amountInWei = entries === null || entries === void 0 ? void 0 : entries.reduce((acc, entry) => {
            const balanceInWei = (0, bigNumber_1.create)(entry.balance);
            return (0, bigNumber_1.plus)(acc, balanceInWei);
        }, 0);
        cardMetricsResult.unbounding = (0, exports.getBalanceCardMetricValue)(config_1.hdVault.stratosDenom, `${amountInWei || ''}`);
    }
    const rewardBalanceResult = await (0, network_1.getRewardBalance)(keyPairAddress);
    const { response: rewardBalanceResponse, error: rewardBalanceError } = rewardBalanceResult;
    if (!rewardBalanceError) {
        const entries = (_g = rewardBalanceResponse === null || rewardBalanceResponse === void 0 ? void 0 : rewardBalanceResponse.result) === null || _g === void 0 ? void 0 : _g.rewards;
        const amount = (_k = (_j = (_h = rewardBalanceResponse === null || rewardBalanceResponse === void 0 ? void 0 : rewardBalanceResponse.result) === null || _h === void 0 ? void 0 : _h.total) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.amount;
        const denom = (_o = (_m = (_l = rewardBalanceResponse === null || rewardBalanceResponse === void 0 ? void 0 : rewardBalanceResponse.result) === null || _l === void 0 ? void 0 : _l.total) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.denom;
        entries === null || entries === void 0 ? void 0 : entries.forEach((entry) => {
            var _a, _b;
            const validatorAddress = entry.validator_address;
            const validatorBalance = ((_b = (_a = entry.reward) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.amount) || '0';
            detailedBalance.reward[validatorAddress] = validatorBalance;
        }, 0);
        cardMetricsResult.reward = (0, exports.getBalanceCardMetricValue)(denom, amount);
    }
    try {
        const ozoneBalanceResult = await (0, network_1.sendUserRequestGetOzone)([{ walletaddr: keyPairAddress }]);
        const { response: ozoneBalanceRespone, error: ozoneBalanceError } = ozoneBalanceResult;
        if (!ozoneBalanceError) {
            const amount = ozoneBalanceRespone === null || ozoneBalanceRespone === void 0 ? void 0 : ozoneBalanceRespone.result.ozone;
            cardMetricsResult.ozone = (0, exports.getOzoneMetricValue)(hdVault_1.stratosUozDenom, amount);
            detailedBalance.ozone = amount;
        }
    }
    catch (error) {
        console.log('could not get ozone balance , error', error);
    }
    cardMetricsResult.detailedBalance = detailedBalance;
    return cardMetricsResult;
};
exports.getBalanceCardMetrics = getBalanceCardMetrics;
const getMaxAvailableBalance = async (keyPairAddress, requestedDenom, decimals = 4) => {
    console.log('from max av balance');
    // const accountsData = await getAccountsData(keyPairAddress);
    const accountBalanceData = await (0, network_1.getAccountBalance)(keyPairAddress);
    // const coins = _get(accountsData, 'result.value.coins', []) as TxTypes.AmountType[];
    const coins = (0, get_1.default)(accountBalanceData, 'response.balances', []);
    const coin = coins.find(item => item.denom === requestedDenom);
    const currentBalance = (coin === null || coin === void 0 ? void 0 : coin.amount) || '0';
    const feeAmount = (0, bigNumber_1.create)((0, tokens_1.standardFeeAmount)());
    const balanceInWei = (0, bigNumber_1.create)(currentBalance);
    // NOTE: Do we need this?
    if (balanceInWei.gt(0)) {
        const balance = (0, bigNumber_1.fromWei)(balanceInWei.minus(feeAmount), tokens_1.decimalPrecision).toFormat(decimals, bigNumber_1.ROUND_DOWN);
        return balance;
    }
    const balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFormat(decimals, bigNumber_1.ROUND_DOWN);
    return balance;
};
exports.getMaxAvailableBalance = getMaxAvailableBalance;
const getAccountTrasactions = async (address, type = TxTypes.HistoryTxType.All, page = 1, pageLimit = 5) => {
    const txType = TxTypes.BlockChainTxMsgTypesMap.get(type) || '';
    const txListResult = await (0, network_1.getTxListBlockchain)(address, txType, page, pageLimit);
    const { response, error } = txListResult;
    if (error) {
        throw new Error(`Could not fetch tx history. Details: "${error.message}"`);
    }
    if (!response) {
        throw new Error('Could not fetch tx history');
    }
    const parsedData = [];
    const { tx_responses: data = [], pagination } = response;
    console.log('getAccountTrasactions response', response);
    const { total } = pagination;
    data.forEach(txResponseItem => {
        try {
            const parsed = (0, transactions_1.transformTx)(txResponseItem);
            parsedData.push(parsed);
        }
        catch (err) {
            console.log(`Parsing error: ${err.message}`);
        }
    });
    const a = parseInt(total) / pageLimit;
    const totalPages = Math.ceil(a);
    const result = { data: parsedData, total, page: page || 1, totalPages };
    console.dir(result, { depth: null, colors: true, maxArrayLength: null });
    return result;
};
exports.getAccountTrasactions = getAccountTrasactions;
//# sourceMappingURL=accounts.js.map