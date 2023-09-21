"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgDelegate = void 0;
const utils_1 = require("../utils");
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxAmounts_1 = require("./formatTxAmounts");
const formatTxMsgDelegate = (txResponseItemTxBodyMessage, txResponseItemLogEntry) => {
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txResponseItemTxBodyMessage, txResponseItemLogEntry);
    if (!(0, utils_1.isDelegateTxBodyMessage)(txResponseItemTxBodyMessage)) {
        return baseTx;
    }
    const { delegator_address, validator_address, amount } = txResponseItemTxBodyMessage;
    const amounts = (0, formatTxAmounts_1.formatTxSingleAmount)(amount);
    return Object.assign(Object.assign({}, baseTx), { sender: delegator_address, to: validator_address, amounts });
};
exports.formatTxMsgDelegate = formatTxMsgDelegate;
//# sourceMappingURL=formatTxMsgDelegate.js.map