"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgIndexingNodeRegistrationVote = void 0;
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxMsgIndexingNodeRegistrationVote = (txResponseItemTxBodyMessage, txResponseItemLogEntry) => {
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txResponseItemTxBodyMessage, txResponseItemLogEntry);
    const toAddress = 'n/a';
    const msgFrom = baseTx.eventSender || baseTx.sender || 'n/a';
    return Object.assign(Object.assign({}, baseTx), { sender: msgFrom, to: toAddress });
};
exports.formatTxMsgIndexingNodeRegistrationVote = formatTxMsgIndexingNodeRegistrationVote;
//# sourceMappingURL=formatTxMsgIndexingNodeRegistrationVote.js.map