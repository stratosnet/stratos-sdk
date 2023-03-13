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
exports.transformTx = exports.getTransformer = exports.TxHistoryTypesMap = void 0;
const TxTypes = __importStar(require("../../../transactions/types"));
const Formatters = __importStar(require("./formatters"));
const formatTxAmounts_1 = require("./formatters/formatTxAmounts");
exports.TxHistoryTypesMap = new Map([
    [TxTypes.TxMsgTypes.SdsAll, Formatters.formatTxdDefault],
    [TxTypes.TxMsgTypes.Account, Formatters.formatTxdDefault],
    [TxTypes.TxMsgTypes.Send, Formatters.formatTxMsgSend],
    [TxTypes.TxMsgTypes.Delegate, Formatters.formatTxMsgDelegate],
    [TxTypes.TxMsgTypes.Undelegate, Formatters.formatTxMsgUndelegate],
    [TxTypes.TxMsgTypes.WithdrawRewards, Formatters.formatTxMsgWithdrawDelegationReward],
    [TxTypes.TxMsgTypes.CreateValidator, Formatters.formatTxMsgCreateValidator],
    [TxTypes.TxMsgTypes.SdsPrepay, Formatters.formatTxMsgPrepay],
    [TxTypes.TxMsgTypes.SdsFileUpload, Formatters.formatTxMsgFileUpload],
    [TxTypes.TxMsgTypes.PotVolumeReport, Formatters.formatTxMsgVolumeReport],
    [TxTypes.TxMsgTypes.PotFoundationDeposit, Formatters.formatTxMsgFoundationDeposit],
    [TxTypes.TxMsgTypes.PotWithdraw, Formatters.formatTxMsgWithdraw],
    [TxTypes.TxMsgTypes.RegisterCreateResourceNode, Formatters.formatTxMsgCreateResourceNode],
    [TxTypes.TxMsgTypes.RegisterRemoveResourceNode, Formatters.formatTxMsgRemoveResourceNode],
    [TxTypes.TxMsgTypes.RegisterCreateIndexingNode, Formatters.formatTxMsgCreateIndexingNode],
    [TxTypes.TxMsgTypes.RegisterRemoveIndexingNode, Formatters.formatTxMsgRemoveIndexingNode],
    [
        TxTypes.TxMsgTypes.RegisterIndexingNodeRegistrationVote,
        Formatters.formatTxMsgIndexingNodeRegistrationVote,
    ],
]);
const getTransformer = (txType) => {
    return exports.TxHistoryTypesMap.get(txType) || Formatters.formatTxdDefault;
};
exports.getTransformer = getTransformer;
const transformTx = (txResponseItem) => {
    const { code, tx, logs, height: block, txhash: hash, timestamp: time } = txResponseItem;
    const { body, auth_info: { fee }, } = tx;
    const { memo } = body;
    const dateTimeString = new Date(time).toLocaleString();
    const transformedTransactionMessages = body.messages.map((bodyMessage, messageIndex) => {
        const transactionType = bodyMessage['@type'];
        const transactionTransformer = (0, exports.getTransformer)(transactionType);
        const messageLogEntry = logs.find(logEntry => {
            return `${logEntry.msg_index}` === `${messageIndex}`;
        });
        const transformedTransactionMessage = transactionTransformer(bodyMessage, messageLogEntry);
        return transformedTransactionMessage;
    });
    const txFee = (0, formatTxAmounts_1.formatTxFee)(fee);
    return {
        statusCode: code,
        block,
        time: dateTimeString,
        hash,
        txFee,
        memo,
        originalTransactionData: tx,
        txMessages: transformedTransactionMessages,
    };
};
exports.transformTx = transformTx;
//# sourceMappingURL=index.js.map