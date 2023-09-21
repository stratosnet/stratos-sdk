"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgCreateValidator = void 0;
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxMsgCreateValidator = (txResponseItemTxBodyMessage, txResponseItemLogEntry) => {
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txResponseItemTxBodyMessage, txResponseItemLogEntry);
    const toAddress = 'n/a';
    const msgFrom = baseTx.eventSender || baseTx.sender || 'n/a';
    return Object.assign(Object.assign({}, baseTx), { sender: msgFrom, to: toAddress });
    // const msgFrom = msg?.value?.delegator_address || baseTx.eventSender || '';
    // const msgTo = msg?.value?.validator_address || baseTx.to;
    //
    // return {
    //   ...baseTx,
    //   sender: msgFrom,
    //   to: msgTo,
    // };
};
exports.formatTxMsgCreateValidator = formatTxMsgCreateValidator;
//# sourceMappingURL=formatTxMsgCreateValidator.js.map