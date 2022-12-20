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
const transformTx = (txItem) => {
    var _a, _b, _c;
    const transactionType = (_c = (_b = (_a = txItem.tx) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.msg[0]) === null || _c === void 0 ? void 0 : _c.type;
    const transactionTransformer = (0, exports.getTransformer)(transactionType);
    let transformedTransaction;
    try {
        transformedTransaction = transactionTransformer(txItem);
    }
    catch (err) {
        console.log(`Could not parse txItem with hash "${txItem.txhash}"`, err.message);
        throw new Error(`Could not parse txItem with hash "${txItem.txhash}"`);
    }
    return transformedTransaction;
};
exports.transformTx = transformTx;
//# sourceMappingURL=index.js.map