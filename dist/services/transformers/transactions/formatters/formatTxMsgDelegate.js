"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxMsgDelegate = void 0;
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxMsgDelegate = (txItem) => {
    var _a, _b, _c, _d;
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txItem);
    const msg = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.msg[0];
    const msgFrom = ((_c = msg === null || msg === void 0 ? void 0 : msg.value) === null || _c === void 0 ? void 0 : _c.delegator_address) || baseTx.eventSender || '';
    const msgTo = ((_d = msg === null || msg === void 0 ? void 0 : msg.value) === null || _d === void 0 ? void 0 : _d.validator_address) || baseTx.to;
    return Object.assign(Object.assign({}, baseTx), { sender: msgFrom, to: msgTo });
};
exports.formatTxMsgDelegate = formatTxMsgDelegate;
//# sourceMappingURL=formatTxMsgDelegate.js.map