"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryTxType = exports.TxHistoryTypes = exports.TxMsgTypes = void 0;
var TxMsgTypes;
(function (TxMsgTypes) {
    TxMsgTypes["SdsAll"] = "";
    TxMsgTypes["SdsPrepay"] = "/stratos.sds.v1.MsgPrepay";
    TxMsgTypes["SdsFileUpload"] = "/stratos.sds.v1.MsgFileUpload";
})(TxMsgTypes = exports.TxMsgTypes || (exports.TxMsgTypes = {}));
var TxHistoryTypes;
(function (TxHistoryTypes) {
    TxHistoryTypes["SdsPrepay"] = "sds/PrepayTx";
})(TxHistoryTypes = exports.TxHistoryTypes || (exports.TxHistoryTypes = {}));
var HistoryTxType;
(function (HistoryTxType) {
    HistoryTxType[HistoryTxType["SdsPrepay"] = 5] = "SdsPrepay";
    HistoryTxType[HistoryTxType["SdsFileUpload"] = 6] = "SdsFileUpload";
})(HistoryTxType = exports.HistoryTxType || (exports.HistoryTxType = {}));
//# sourceMappingURL=types.js.map