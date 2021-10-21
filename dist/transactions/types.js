"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxHistoryTypesMap = exports.BlockChainTxMsgTypesMap = exports.TxMsgTypesMap = exports.HistoryTxType = exports.TxMsgTypes = void 0;
var TxMsgTypes;
(function (TxMsgTypes) {
    TxMsgTypes["Account"] = "cosmos-sdk/Account";
    TxMsgTypes["Send"] = "cosmos-sdk/MsgSend";
    TxMsgTypes["Delegate"] = "cosmos-sdk/MsgDelegate";
    TxMsgTypes["Undelegate"] = "cosmos-sdk/MsgUndelegate";
    TxMsgTypes["WithdrawRewards"] = "cosmos-sdk/MsgWithdrawDelegationReward";
    TxMsgTypes["CreateValidator"] = "osmos-sdk/MsgCreateValidator";
})(TxMsgTypes = exports.TxMsgTypes || (exports.TxMsgTypes = {}));
(function (TxMsgTypes) {
    TxMsgTypes["SdsAll"] = "";
    TxMsgTypes["SdsPrepay"] = "sds/MsgPrepay";
    TxMsgTypes["SdsFileUpload"] = "sds/MsgFileUpload";
})(TxMsgTypes = exports.TxMsgTypes || (exports.TxMsgTypes = {}));
(function (TxMsgTypes) {
    TxMsgTypes["PotVolumeReport"] = "pot/MsgVolumeReport";
    TxMsgTypes["PotWithdraw"] = "pot/MsgWithdraw";
    TxMsgTypes["PotFoundationDeposit"] = "pot/MsgFoundationDeposit";
})(TxMsgTypes = exports.TxMsgTypes || (exports.TxMsgTypes = {}));
(function (TxMsgTypes) {
    TxMsgTypes["RegisterCreateResourceNode"] = "register/MsgCreateResourceNode";
    TxMsgTypes["RegisterRemoveResourceNode"] = "register/MsgRemoveResourceNode";
    TxMsgTypes["RegisterCreateIndexingNode"] = "register/MsgCreateIndexingNode";
    TxMsgTypes["RegisterRemoveIndexingNode"] = "register/MsgRemoveIndexingNode";
    TxMsgTypes["RegisterIndexingNodeRegistrationVote"] = "register/MsgIndexingNodeRegistrationVote";
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
    [HistoryTxType.Transfer, 'send'],
    [HistoryTxType.Delegate, 'delegate'],
    [HistoryTxType.Undelegate, 'begin_unbonding'],
    [HistoryTxType.GetReward, 'withdraw_delegator_reward'],
    [HistoryTxType.SdsPrepay, 'SdsPrepayTx'],
]);
exports.TxHistoryTypesMap = new Map([
    [TxMsgTypes.SdsAll, HistoryTxType.All],
    [TxMsgTypes.Account, HistoryTxType.Account],
    [TxMsgTypes.Send, HistoryTxType.Transfer],
    [TxMsgTypes.Delegate, HistoryTxType.Delegate],
    [TxMsgTypes.Undelegate, HistoryTxType.Undelegate],
    [TxMsgTypes.WithdrawRewards, HistoryTxType.GetReward],
    [TxMsgTypes.CreateValidator, HistoryTxType.CreateValidator],
    [TxMsgTypes.SdsPrepay, HistoryTxType.SdsPrepay],
    [TxMsgTypes.SdsFileUpload, HistoryTxType.SdsFileUpload],
    [TxMsgTypes.PotVolumeReport, HistoryTxType.PotVolumeReport],
    [TxMsgTypes.PotWithdraw, HistoryTxType.PotWithdraw],
    [TxMsgTypes.RegisterCreateResourceNode, HistoryTxType.RegisterCreateResourceNode],
    [TxMsgTypes.RegisterRemoveResourceNode, HistoryTxType.RegisterRemoveResourceNode],
    [TxMsgTypes.RegisterCreateIndexingNode, HistoryTxType.RegisterCreateIndexingNode],
    [TxMsgTypes.RegisterRemoveIndexingNode, HistoryTxType.RegisterRemoveIndexingNode],
    [TxMsgTypes.RegisterIndexingNodeRegistrationVote, HistoryTxType.RegisterIndexingNodeRegistrationVote],
]);
//# sourceMappingURL=types.js.map