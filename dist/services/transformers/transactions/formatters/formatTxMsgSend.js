"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgSend = void 0;
const utils_1 = require("../utils");
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxAmounts_1 = require("./formatTxAmounts");
const formatTxMsgSend = (txResponseItemTxBodyMessage, txResponseItemLogEntry) => {
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txResponseItemTxBodyMessage, txResponseItemLogEntry);
    if (!(0, utils_1.isSendTxBodyMessage)(txResponseItemTxBodyMessage)) {
        return baseTx;
    }
    const { from_address, to_address, amount } = txResponseItemTxBodyMessage;
    const amounts = (0, formatTxAmounts_1.formatTxMultipleAmounts)(amount);
    return Object.assign(Object.assign({}, baseTx), { sender: from_address, to: to_address, amounts });
};
exports.formatTxMsgSend = formatTxMsgSend;
//# sourceMappingURL=formatTxMsgSend.js.map