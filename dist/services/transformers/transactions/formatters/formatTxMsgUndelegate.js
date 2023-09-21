"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgUndelegate = void 0;
const utils_1 = require("../utils");
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxAmounts_1 = require("./formatTxAmounts");
const formatTxMsgUndelegate = (txResponseItemTxBodyMessage, txResponseItemLogEntry) => {
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txResponseItemTxBodyMessage, txResponseItemLogEntry);
    if (!(0, utils_1.isUndelegateTxBodyMessage)(txResponseItemTxBodyMessage)) {
        return baseTx;
    }
    const { delegator_address, validator_address, amount } = txResponseItemTxBodyMessage;
    const amounts = (0, formatTxAmounts_1.formatTxSingleAmount)(amount);
    return Object.assign(Object.assign({}, baseTx), { sender: validator_address, to: delegator_address, amounts });
};
exports.formatTxMsgUndelegate = formatTxMsgUndelegate;
//# sourceMappingURL=formatTxMsgUndelegate.js.map