"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgBeginRedelegate = void 0;
const utils_1 = require("../utils");
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxAmounts_1 = require("./formatTxAmounts");
const formatTxMsgBeginRedelegate = (txResponseItemTxBodyMessage, txResponseItemLogEntry) => {
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txResponseItemTxBodyMessage, txResponseItemLogEntry);
    if (!(0, utils_1.isBeginRedelegateTxBodyMessage)(txResponseItemTxBodyMessage)) {
        return baseTx;
    }
    const { delegator_address, validator_src_address, validator_dst_address, amount } = txResponseItemTxBodyMessage;
    const amounts = (0, formatTxAmounts_1.formatTxSingleAmount)(amount);
    return Object.assign(Object.assign({}, baseTx), { sender: delegator_address, to: validator_dst_address, from: validator_src_address, amounts });
};
exports.formatTxMsgBeginRedelegate = formatTxMsgBeginRedelegate;
//# sourceMappingURL=formatTxMsgBeginRedelegate.js.map