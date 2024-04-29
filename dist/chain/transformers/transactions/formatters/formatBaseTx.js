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
const TxTypes = __importStar(require("../../../transactions/types"));
const formatTxAmounts_1 = require("./formatTxAmounts");
const findSenderFromLogEvents = (txResponseItemLogEntry) => {
    let eventSender = '';
    if (!txResponseItemLogEntry) {
        return eventSender;
    }
    txResponseItemLogEntry.events.forEach(({ attributes }) => {
        if (Array.isArray(attributes)) {
            attributes.forEach(element => {
                if (!eventSender && element.key === 'sender') {
                    eventSender = element.value;
                }
            });
        }
    });
    return eventSender;
};
const formatBaseTx = (txResponseItemTxBodyMessage, txResponseItemLogEntry) => {
    const eventSender = findSenderFromLogEvents(txResponseItemLogEntry);
    const sender = '';
    const msgTo = '';
    const txType = txResponseItemTxBodyMessage['@type'];
    const resolvedType = TxTypes.TxHistoryTypesMap.get(txType) || TxTypes.HistoryTxType.All;
    const res = {
        eventSender,
        sender,
        to: msgTo,
        type: resolvedType,
        txType,
        amounts: formatTxAmounts_1.emptyAmounts,
    };
    return res;
};
exports.formatBaseTx = formatBaseTx;
//# sourceMappingURL=formatBaseTx.js.map