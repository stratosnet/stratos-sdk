"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxHistoryTypesMap = exports.BlockChainTxMsgTypesMap = exports.TxMsgTypesMap = exports.TxHistoryTypes = exports.HistoryTxType = exports.TxMsgTypes = void 0;
var TxMsgTypes;
(function (TxMsgTypes) {
    TxMsgTypes["Account"] = "/cosmos.auth.v1beta1.BaseAccount";
    TxMsgTypes["Send"] = "/cosmos.bank.v1beta1.MsgSend";
    TxMsgTypes["Delegate"] = "/cosmos.staking.v1beta1.MsgDelegate";
    TxMsgTypes["Undelegate"] = "/cosmos.staking.v1beta1.MsgUndelegate";
    TxMsgTypes["WithdrawRewards"] = "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward";
    TxMsgTypes["CreateValidator"] = "/cosmos.staking.v1beta1.MsgCreateValidator";
})(TxMsgTypes = exports.TxMsgTypes || (exports.TxMsgTypes = {}));
(function (TxMsgTypes) {
    TxMsgTypes["SdsAll"] = "";
    TxMsgTypes["SdsPrepay"] = "/stratos.sds.v1.MsgPrepay";
    TxMsgTypes["SdsFileUpload"] = "/stratos.sds.v1.MsgFileUpload";
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
    HistoryTxType[HistoryTxType["SdsPrepay"] = 5] = "SdsPrepay";
    HistoryTxType[HistoryTxType["SdsFileUpload"] = 6] = "SdsFileUpload";
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
})(HistoryTxType = exports.HistoryTxType || (exports.HistoryTxType = {}));
var TxHistoryTypes;
(function (TxHistoryTypes) {
    TxHistoryTypes["SdsAll"] = "";
    TxHistoryTypes["Transfer"] = "cosmos-sdk/MsgSend";
    TxHistoryTypes["Delegate"] = "cosmos-sdk/MsgDelegate";
    TxHistoryTypes["Undelegate"] = "cosmos-sdk/MsgUndelegate";
    TxHistoryTypes["GetReward"] = "cosmos-sdk/MsgWithdrawDelegationReward";
    TxHistoryTypes["SdsPrepay"] = "sds/PrepayTx";
})(TxHistoryTypes = exports.TxHistoryTypes || (exports.TxHistoryTypes = {}));
exports.TxMsgTypesMap = new Map([
    [HistoryTxType.All, TxMsgTypes.SdsAll],
    [HistoryTxType.Account, TxMsgTypes.Account],
    [HistoryTxType.Transfer, TxMsgTypes.Send],
    [HistoryTxType.Delegate, TxMsgTypes.Delegate],
    [HistoryTxType.Undelegate, TxMsgTypes.Undelegate],
    [HistoryTxType.GetReward, TxMsgTypes.WithdrawRewards],
    [HistoryTxType.CreateValidator, TxMsgTypes.CreateValidator],
    [HistoryTxType.SdsPrepay, TxMsgTypes.SdsPrepay],
    [HistoryTxType.SdsFileUpload, TxMsgTypes.SdsFileUpload],
    [HistoryTxType.PotVolumeReport, TxMsgTypes.PotVolumeReport],
    [HistoryTxType.PotFoundationDeposit, TxMsgTypes.PotFoundationDeposit],
    [HistoryTxType.PotWithdraw, TxMsgTypes.PotWithdraw],
    [HistoryTxType.RegisterCreateResourceNode, TxMsgTypes.RegisterCreateResourceNode],
    [HistoryTxType.RegisterRemoveResourceNode, TxMsgTypes.RegisterRemoveResourceNode],
    [HistoryTxType.RegisterCreateIndexingNode, TxMsgTypes.RegisterCreateIndexingNode],
    [HistoryTxType.RegisterRemoveIndexingNode, TxMsgTypes.RegisterRemoveIndexingNode],
    [HistoryTxType.RegisterIndexingNodeRegistrationVote, TxMsgTypes.RegisterIndexingNodeRegistrationVote],
]);
exports.BlockChainTxMsgTypesMap = new Map([
    [HistoryTxType.All, TxMsgTypes.SdsAll],
    [HistoryTxType.Transfer, TxMsgTypes.Send],
    [HistoryTxType.Delegate, TxMsgTypes.Delegate],
    [HistoryTxType.Undelegate, TxMsgTypes.Undelegate],
    [HistoryTxType.GetReward, TxMsgTypes.WithdrawRewards],
    [HistoryTxType.SdsPrepay, TxMsgTypes.SdsPrepay],
]);
exports.TxHistoryTypesMap = new Map([
    [TxHistoryTypes.SdsAll, HistoryTxType.All],
    // [TxMsgTypes.Account, HistoryTxType.Account],
    [TxHistoryTypes.Transfer, HistoryTxType.Transfer],
    [TxHistoryTypes.Delegate, HistoryTxType.Delegate],
    [TxHistoryTypes.Undelegate, HistoryTxType.Undelegate],
    [TxHistoryTypes.GetReward, HistoryTxType.GetReward],
    // [TxMsgTypes.CreateValidator, HistoryTxType.CreateValidator],
    [TxHistoryTypes.SdsPrepay, HistoryTxType.SdsPrepay],
    // [TxMsgTypes.SdsFileUpload, HistoryTxType.SdsFileUpload],
    // [TxMsgTypes.PotVolumeReport, HistoryTxType.PotVolumeReport],
    // [TxMsgTypes.PotWithdraw, HistoryTxType.PotWithdraw],
    // [TxMsgTypes.RegisterCreateResourceNode, HistoryTxType.RegisterCreateResourceNode],
    // [TxMsgTypes.RegisterRemoveResourceNode, HistoryTxType.RegisterRemoveResourceNode],
    // [TxMsgTypes.RegisterCreateIndexingNode, HistoryTxType.RegisterCreateIndexingNode],
    // [TxMsgTypes.RegisterRemoveIndexingNode, HistoryTxType.RegisterRemoveIndexingNode],
    // [TxMsgTypes.RegisterIndexingNodeRegistrationVote, HistoryTxType.RegisterIndexingNodeRegistrationVote],
]);
//# sourceMappingURL=types.js.map