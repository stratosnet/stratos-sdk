"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOzoneMetricValue = exports.getBalanceCardMetricValue = exports.getBalanceCardMetricDinamicValue = void 0;
const hdVault_1 = require("../../config/hdVault");
const tokens_1 = require("../../config/tokens");
const bigNumber_1 = require("../../services/bigNumber");
const getBalanceCardMetricDinamicValue = (denom, amount) => {
    const isStratosDenom = denom === hdVault_1.stratosDenom;
    if (!isStratosDenom) {
        return '0.0000 STOS';
    }
    if (!amount) {
        return '0.0000 STOS';
    }
    const balanceInWei = (0, bigNumber_1.create)(amount);
    let dynamicPrecision = tokens_1.decimalShortPrecision;
    let counter = 0;
    let balance = '0';
    const maxAdditionalDigits = 4;
    let isStillZero = counter < maxAdditionalDigits;
    do {
        balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFixed(dynamicPrecision, bigNumber_1.ROUND_DOWN);
        const parsetBalance = parseFloat(balance);
        isStillZero = parsetBalance === 0 && counter < maxAdditionalDigits;
        dynamicPrecision++;
        counter++;
    } while (isStillZero);
    const balanceToReturn = `${balance} ${hdVault_1.stratosTopDenom.toUpperCase()}`;
    return balanceToReturn;
};
exports.getBalanceCardMetricDinamicValue = getBalanceCardMetricDinamicValue;
const getBalanceCardMetricValue = (denom, amount) => {
    const isStratosDenom = denom === hdVault_1.stratosDenom;
    if (!isStratosDenom) {
        return '0.0000 STOS';
    }
    if (!amount) {
        return '0.0000 STOS';
    }
    const balanceInWei = (0, bigNumber_1.create)(amount);
    const balance = (0, bigNumber_1.fromWei)(balanceInWei, tokens_1.decimalPrecision).toFixed(tokens_1.decimalShortPrecision, bigNumber_1.ROUND_UP);
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
    const balance = (0, bigNumber_1.fromWei)(balanceInWei, 9).toFixed(tokens_1.decimalShortPrecision, bigNumber_1.ROUND_DOWN);
    const balanceToReturn = `${balance} ${printableDenome}`;
    return balanceToReturn;
};
exports.getOzoneMetricValue = getOzoneMetricValue;
//# sourceMappingURL=balanceValues.js.map