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
exports.isPrepayTxBodyMessage = exports.isGetRewardsTxBodyMessage = exports.isUndelegateTxBodyMessage = exports.isBeginRedelegateTxBodyMessage = exports.isDelegateTxBodyMessage = exports.isSendTxBodyMessage = void 0;
const TxTypes = __importStar(require("../../../transactions/types"));
const isSendTxBodyMessage = (bodyMessage) => {
    // return 'from_address' in bodyMessage;
    return bodyMessage['@type'] === TxTypes.TxMsgTypes.Send;
};
exports.isSendTxBodyMessage = isSendTxBodyMessage;
const isDelegateTxBodyMessage = (bodyMessage) => {
    return bodyMessage['@type'] === TxTypes.TxMsgTypes.Delegate;
};
exports.isDelegateTxBodyMessage = isDelegateTxBodyMessage;
const isBeginRedelegateTxBodyMessage = (bodyMessage) => {
    return bodyMessage['@type'] === TxTypes.TxMsgTypes.BeginRedelegate;
};
exports.isBeginRedelegateTxBodyMessage = isBeginRedelegateTxBodyMessage;
const isUndelegateTxBodyMessage = (bodyMessage) => {
    return bodyMessage['@type'] === TxTypes.TxMsgTypes.Undelegate;
};
exports.isUndelegateTxBodyMessage = isUndelegateTxBodyMessage;
const isGetRewardsTxBodyMessage = (bodyMessage) => {
    return bodyMessage['@type'] === TxTypes.TxMsgTypes.WithdrawRewards;
};
exports.isGetRewardsTxBodyMessage = isGetRewardsTxBodyMessage;
const isPrepayTxBodyMessage = (bodyMessage) => {
    return bodyMessage['@type'] === TxTypes.TxMsgTypes.SdsPrepay;
};
exports.isPrepayTxBodyMessage = isPrepayTxBodyMessage;
//# sourceMappingURL=utils.js.map