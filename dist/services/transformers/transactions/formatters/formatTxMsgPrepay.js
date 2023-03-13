"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgPrepay = void 0;
const utils_1 = require("../utils");
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxAmounts_1 = require("./formatTxAmounts");
const findPrepayReciever = (txResponseItemLogEntry) => {
    var _a;
    let receiver = '';
    const eventWithReceivedCoins = (_a = txResponseItemLogEntry === null || txResponseItemLogEntry === void 0 ? void 0 : txResponseItemLogEntry.events) === null || _a === void 0 ? void 0 : _a.find(logEvent => {
        const { type: evetnType } = logEvent;
        return evetnType === 'coin_received';
    });
    if (!eventWithReceivedCoins) {
        return receiver;
    }
    const { attributes } = eventWithReceivedCoins;
    if (!Array.isArray(attributes)) {
        return receiver;
    }
    attributes.forEach(element => {
        if (!receiver && element.key === 'receiver') {
            receiver = `${element.value.trim()}`;
        }
    });
    return receiver;
};
const formatTxMsgPrepay = (txResponseItemTxBodyMessage, txResponseItemLogEntry) => {
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txResponseItemTxBodyMessage, txResponseItemLogEntry);
    if (!(0, utils_1.isPrepayTxBodyMessage)(txResponseItemTxBodyMessage)) {
        return baseTx;
    }
    const { sender, coins } = txResponseItemTxBodyMessage;
    const amounts = (0, formatTxAmounts_1.formatTxMultipleAmounts)(coins);
    const toAddress = findPrepayReciever(txResponseItemLogEntry);
    return Object.assign(Object.assign({}, baseTx), { sender, to: toAddress, amounts });
};
exports.formatTxMsgPrepay = formatTxMsgPrepay;
//# sourceMappingURL=formatTxMsgPrepay.js.map