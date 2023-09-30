"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgWithdrawDelegationReward = void 0;
const balanceValues_1 = require("../../balanceValues");
const utils_1 = require("../utils");
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxAmounts_1 = require("./formatTxAmounts");
const findReceivedAmounts = (txResponseItemLogEntry) => {
    var _a;
    let receivedCoinsAmount = '';
    let receivedDenom = '';
    let receivedCoinsAmountFormatted = '';
    if (!txResponseItemLogEntry) {
        return formatTxAmounts_1.emptyAmounts;
    }
    const eventWithReceivedCoins = (_a = txResponseItemLogEntry === null || txResponseItemLogEntry === void 0 ? void 0 : txResponseItemLogEntry.events) === null || _a === void 0 ? void 0 : _a.find(logEvent => {
        const { type: evetnType } = logEvent;
        return evetnType === 'coin_received';
    });
    if (!eventWithReceivedCoins) {
        return formatTxAmounts_1.emptyAmounts;
    }
    const { attributes } = eventWithReceivedCoins;
    if (!Array.isArray(attributes)) {
        return formatTxAmounts_1.emptyAmounts;
    }
    attributes.forEach(element => {
        if (!receivedCoinsAmount && element.key === 'amount') {
            const tmpReceivedCoinsAmount = `${element.value}`;
            receivedCoinsAmount = `${parseInt(tmpReceivedCoinsAmount)}`;
            receivedDenom = tmpReceivedCoinsAmount.replace(`${receivedCoinsAmount}`, '');
            receivedCoinsAmountFormatted = (0, balanceValues_1.getBalanceCardMetricDinamicValue)(receivedDenom, receivedCoinsAmount);
        }
    });
    return [
        {
            amount: receivedCoinsAmountFormatted,
            denom: receivedDenom,
        },
    ];
};
const formatTxMsgWithdrawDelegationReward = (txResponseItemTxBodyMessage, txResponseItemLogEntry) => {
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txResponseItemTxBodyMessage, txResponseItemLogEntry);
    if (!(0, utils_1.isGetRewardsTxBodyMessage)(txResponseItemTxBodyMessage)) {
        return baseTx;
    }
    const { delegator_address, validator_address } = txResponseItemTxBodyMessage;
    const amounts = findReceivedAmounts(txResponseItemLogEntry);
    return Object.assign(Object.assign({}, baseTx), { sender: validator_address, to: delegator_address, amounts });
};
exports.formatTxMsgWithdrawDelegationReward = formatTxMsgWithdrawDelegationReward;
//# sourceMappingURL=formatTxMsgWithdrawDelegationReward.js.map