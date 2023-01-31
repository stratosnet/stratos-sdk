"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgSend = void 0;
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxMsgSend = (txItem) => {
    var _a, _b, _c;
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txItem);
    const msg = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.msg[0];
    const msgFrom = ((_c = msg === null || msg === void 0 ? void 0 : msg.value) === null || _c === void 0 ? void 0 : _c.from_address) || baseTx.eventSender || '';
    return Object.assign(Object.assign({}, baseTx), { sender: msgFrom });
};
exports.formatTxMsgSend = formatTxMsgSend;
//# sourceMappingURL=formatTxMsgSend.js.map