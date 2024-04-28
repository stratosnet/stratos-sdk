"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxHistoryTypesMap = exports.BlockChainTxMsgTypesMap = exports.TxMsgTypesMap = exports.HistoryTxType = exports.TxMsgTypes = void 0;
const transactions_1 = require("../../sds/transactions");
var TxMsgTypes;
(function (TxMsgTypes) {
    TxMsgTypes["All"] = "";
    TxMsgTypes["Account"] = "/cosmos.auth.v1beta1.BaseAccount";
    TxMsgTypes["Send"] = "/cosmos.bank.v1beta1.MsgSend";
    TxMsgTypes["Delegate"] = "/cosmos.staking.v1beta1.MsgDelegate";
    TxMsgTypes["Undelegate"] = "/cosmos.staking.v1beta1.MsgUndelegate";
    TxMsgTypes["WithdrawRewards"] = "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
    TxMsgTypes["CreateValidator"] = "/cosmos.staking.v1beta1.MsgCreateValidator";
    TxMsgTypes["BeginRedelegate"] = "/cosmos.staking.v1beta1.MsgBeginRedelegate";
})(TxMsgTypes = exports.TxMsgTypes || (exports.TxMsgTypes = {}));
(function (TxMsgTypes) {
    TxMsgTypes["PotVolumeReport"] = "/stratos.pot.v1.MsgVolumeReport";
    TxMsgTypes["PotWithdraw"] = "/stratos.pot.v1.MsgWithdraw";
    TxMsgTypes["PotFoundationDeposit"] = "/stratos.pot.v1.MsgFoundationDeposit";
})(TxMsgTypes = exports.TxMsgTypes || (exports.TxMsgTypes = {}));
(function (TxMsgTypes) {
    TxMsgTypes["RegisterCreateResourceNode"] = "/stratos.register.v1.MsgCreateResourceNode";
    TxMsgTypes["RegisterRemoveResourceNode"] = "/stratos.register.v1.MsgRemoveResourceNode";
    TxMsgTypes["RegisterCreateIndexingNode"] = "/stratos.register.v1.MsgCreateMetaNode";
    TxMsgTypes["RegisterRemoveIndexingNode"] = "/stratos.register.v1.MsgRemoveMetaNode";
    TxMsgTypes["RegisterIndexingNodeRegistrationVote"] = "/stratos.register.v1.MsgIndexingNodeRegistrationVote";
})(TxMsgTypes = exports.TxMsgTypes || (exports.TxMsgTypes = {}));
var HistoryTxType;
(function (HistoryTxType) {
    HistoryTxType[HistoryTxType["All"] = 0] = "All";
    HistoryTxType[HistoryTxType["Transfer"] = 1] = "Transfer";
    HistoryTxType[HistoryTxType["Delegate"] = 2] = "Delegate";
    HistoryTxType[HistoryTxType["Undelegate"] = 3] = "Undelegate";
    HistoryTxType[HistoryTxType["GetReward"] = 4] = "GetReward";
    HistoryTxType[HistoryTxType["PotVolumeReport"] = 7] = "PotVolumeReport";
    HistoryTxType[HistoryTxType["PotWithdraw"] = 8] = "PotWithdraw";
    HistoryTxType[HistoryTxType["CreateValidator"] = 9] = "CreateValidator";
    HistoryTxType[HistoryTxType["Account"] = 10] = "Account";
    HistoryTxType[HistoryTxType["RegisterCreateResourceNode"] = 11] = "RegisterCreateResourceNode";
    HistoryTxType[HistoryTxType["RegisterRemoveResourceNode"] = 12] = "RegisterRemoveResourceNode";
    HistoryTxType[HistoryTxType["RegisterCreateIndexingNode"] = 13] = "RegisterCreateIndexingNode";
    HistoryTxType[HistoryTxType["RegisterRemoveIndexingNode"] = 14] = "RegisterRemoveIndexingNode";
    HistoryTxType[HistoryTxType["RegisterIndexingNodeRegistrationVote"] = 15] = "RegisterIndexingNodeRegistrationVote";
    HistoryTxType[HistoryTxType["PotFoundationDeposit"] = 16] = "PotFoundationDeposit";
    HistoryTxType[HistoryTxType["BeginRedelegate"] = 17] = "BeginRedelegate";
})(HistoryTxType = exports.HistoryTxType || (exports.HistoryTxType = {}));
// we dont need it?
// export enum TxHistoryTypes {
// SdsAll = '',
// Transfer = 'cosmos-sdk/MsgSend',
// Delegate = 'cosmos-sdk/MsgDelegate',
// Undelegate = 'cosmos-sdk/MsgUndelegate',
// GetReward = 'cosmos-sdk/MsgWithdrawDelegationReward',
// SdsPrepay = 'sds/PrepayTx',
// BeginRedelegate = 'cosmos-sdk/MsgBeginRedelegate',
// }
exports.TxMsgTypesMap = new Map([
    [HistoryTxType.All, TxMsgTypes.All],
    [HistoryTxType.Account, TxMsgTypes.Account],
    [HistoryTxType.Transfer, TxMsgTypes.Send],
    [HistoryTxType.Delegate, TxMsgTypes.Delegate],
    [HistoryTxType.BeginRedelegate, TxMsgTypes.BeginRedelegate],
    [HistoryTxType.Undelegate, TxMsgTypes.Undelegate],
    [HistoryTxType.GetReward, TxMsgTypes.WithdrawRewards],
    [HistoryTxType.CreateValidator, TxMsgTypes.CreateValidator],
    [HistoryTxType.PotVolumeReport, TxMsgTypes.PotVolumeReport],
    [HistoryTxType.PotFoundationDeposit, TxMsgTypes.PotFoundationDeposit],
    [HistoryTxType.PotWithdraw, TxMsgTypes.PotWithdraw],
    [HistoryTxType.RegisterCreateResourceNode, TxMsgTypes.RegisterCreateResourceNode],
    [HistoryTxType.RegisterRemoveResourceNode, TxMsgTypes.RegisterRemoveResourceNode],
    [HistoryTxType.RegisterCreateIndexingNode, TxMsgTypes.RegisterCreateIndexingNode],
    [HistoryTxType.RegisterRemoveIndexingNode, TxMsgTypes.RegisterRemoveIndexingNode],
    [HistoryTxType.RegisterIndexingNodeRegistrationVote, TxMsgTypes.RegisterIndexingNodeRegistrationVote],
    [transactions_1.sdsTxTypes.HistoryTxType.SdsPrepay, transactions_1.sdsTxTypes.TxMsgTypes.SdsPrepay],
    [transactions_1.sdsTxTypes.HistoryTxType.SdsFileUpload, transactions_1.sdsTxTypes.TxMsgTypes.SdsFileUpload],
]);
exports.BlockChainTxMsgTypesMap = new Map([
    [HistoryTxType.All, TxMsgTypes.All],
    [HistoryTxType.Transfer, TxMsgTypes.Send],
    [HistoryTxType.Delegate, TxMsgTypes.Delegate],
    [HistoryTxType.BeginRedelegate, TxMsgTypes.BeginRedelegate],
    [HistoryTxType.Undelegate, TxMsgTypes.Undelegate],
    [HistoryTxType.GetReward, TxMsgTypes.WithdrawRewards],
    [transactions_1.sdsTxTypes.HistoryTxType.SdsPrepay, transactions_1.sdsTxTypes.TxMsgTypes.SdsPrepay],
]);
exports.TxHistoryTypesMap = new Map([
    [TxMsgTypes.All, HistoryTxType.All],
    [TxMsgTypes.Send, HistoryTxType.Transfer],
    [TxMsgTypes.Delegate, HistoryTxType.Delegate],
    [TxMsgTypes.BeginRedelegate, HistoryTxType.BeginRedelegate],
    [TxMsgTypes.Undelegate, HistoryTxType.Undelegate],
    [TxMsgTypes.WithdrawRewards, HistoryTxType.GetReward],
    [transactions_1.sdsTxTypes.TxMsgTypes.SdsPrepay, transactions_1.sdsTxTypes.HistoryTxType.SdsPrepay],
]);
//# sourceMappingURL=types.js.map