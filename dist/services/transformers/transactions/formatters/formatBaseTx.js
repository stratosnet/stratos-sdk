"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBaseTx = void 0;
var TxTypes = __importStar(require("../../../../transactions/types"));
var formatTxAmounts_1 = require("./formatTxAmounts");
var formatBaseTx = function (txItem) {
    var _a, _b, _c, _d, _e;
    var msg = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.msg[0];
    if (!msg) {
        throw Error('There is no single message in the transaction!');
    }
    var block = txItem.height;
    var hash = txItem.txhash;
    var time = txItem.timestamp;
    var dateTimeString = new Date(time).toLocaleString();
    var attributes = (_d = (_c = txItem === null || txItem === void 0 ? void 0 : txItem.logs[0]) === null || _c === void 0 ? void 0 : _c.events[0]) === null || _d === void 0 ? void 0 : _d.attributes;
    var eventSender = '';
    if (Array.isArray(attributes)) {
        attributes.forEach(function (element) {
            if (!eventSender && element.key === 'sender') {
                eventSender = element.value;
            }
        });
    }
    var txType = msg.type;
    var resolvedType = TxTypes.TxHistoryTypesMap.get(txType) || TxTypes.HistoryTxType.All;
    var txAmount = (0, formatTxAmounts_1.formatTxAmounts)(txItem);
    var txFee = (0, formatTxAmounts_1.formatTxFee)(txItem);
    var msgTo = ((_e = msg === null || msg === void 0 ? void 0 : msg.value) === null || _e === void 0 ? void 0 : _e.to_address) || '';
    return {
        eventSender: eventSender,
        sender: '',
        to: msgTo,
        type: resolvedType,
        txType: txType,
        block: "".concat(block),
        amount: txAmount,
        time: dateTimeString,
        hash: hash,
        txFee: txFee,
        originalTransactionData: txItem,
    };
};
exports.formatBaseTx = formatBaseTx;
//# sourceMappingURL=formatBaseTx.js.map