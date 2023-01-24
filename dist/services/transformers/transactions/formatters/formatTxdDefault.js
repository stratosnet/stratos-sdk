"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxdDefault = void 0;
const formatBaseTx_1 = require("./formatBaseTx");
const formatTxdDefault = (txItem) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const baseTx = (0, formatBaseTx_1.formatBaseTx)(txItem);
    const msg = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.msg[0];
    const from = (_c = msg.value) === null || _c === void 0 ? void 0 : _c.from;
    const fromAddress = (_d = msg.value) === null || _d === void 0 ? void 0 : _d.from_address;
    const senderAddress = (_e = msg.value) === null || _e === void 0 ? void 0 : _e.sender;
    const reporterAddress = (_f = msg.value) === null || _f === void 0 ? void 0 : _f.reporter;
    const delegatorAddress = (_g = msg.value) === null || _g === void 0 ? void 0 : _g.delegator_address;
    const addressAddress = (_h = msg.value) === null || _h === void 0 ? void 0 : _h.address;
    const toAddress = (_j = msg.value) === null || _j === void 0 ? void 0 : _j.to_address;
    const validatorAddress = (_k = msg.value) === null || _k === void 0 ? void 0 : _k.validator_address;
    const msgFrom = from ||
        fromAddress ||
        senderAddress ||
        reporterAddress ||
        delegatorAddress ||
        addressAddress ||
        baseTx.eventSender ||
        baseTx.sender;
    const msgTo = toAddress || validatorAddress || baseTx.to;
    return Object.assign(Object.assign({}, baseTx), { sender: msgFrom, to: msgTo });
};
exports.formatTxdDefault = formatTxdDefault;
//# sourceMappingURL=formatTxdDefault.js.map