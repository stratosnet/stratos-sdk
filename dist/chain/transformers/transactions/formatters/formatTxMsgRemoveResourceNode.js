"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgRemoveResourceNode = void 0;
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxMsgRemoveResourceNode = (txResponseItemTxBodyMessage, txResponseItemLogEntry) => {
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txResponseItemTxBodyMessage, txResponseItemLogEntry);
    const toAddress = 'n/a';
    const msgFrom = baseTx.eventSender || baseTx.sender || 'n/a';
    return Object.assign(Object.assign({}, baseTx), { sender: msgFrom, to: toAddress });
};
exports.formatTxMsgRemoveResourceNode = formatTxMsgRemoveResourceNode;
//# sourceMappingURL=formatTxMsgRemoveResourceNode.js.map