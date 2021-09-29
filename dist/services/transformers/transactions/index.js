"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.getTransformer = exports.TxHistoryTypesMap = void 0;
var TxTypes = __importStar(require("../../../transactions/types"));
var Formatters = __importStar(require("./formatters"));
exports.TxHistoryTypesMap = new Map([
    [TxTypes.TxMsgTypes.SdsAll, Formatters.formatTxdDefault],
    [TxTypes.TxMsgTypes.Account, Formatters.formatTxdDefault],
    [TxTypes.TxMsgTypes.Send, Formatters.formatTxMsgSend],
    [TxTypes.TxMsgTypes.Delegate, Formatters.formatTxMsgDelegate],
    [TxTypes.TxMsgTypes.Undelegate, Formatters.formatTxdDefault],
    [TxTypes.TxMsgTypes.WithdrawRewards, Formatters.formatTxdDefault],
    [TxTypes.TxMsgTypes.CreateValidator, Formatters.formatTxMsgCreateValidator],
    [TxTypes.TxMsgTypes.SdsPrepay, Formatters.formatTxMsgPrepay],
    [TxTypes.TxMsgTypes.SdsFileUpload, Formatters.formatTxMsgFileUpload],
    [TxTypes.TxMsgTypes.PotVolumeReport, Formatters.formatTxMsgVolumeReport],
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
var getTransformer = function (txType) {
    return exports.TxHistoryTypesMap.get(txType) || Formatters.formatTxdDefault;
};
exports.getTransformer = getTransformer;
//# sourceMappingURL=index.js.map