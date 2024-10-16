import { type AmountType, type TransactionValue } from '../../common/types/transactionTypes';
export declare enum TxMsgTypes {
    SdsAll = "",
    SdsPrepay = "/stratos.sds.v1.MsgPrepay",
    SdsFileUpload = "/stratos.sds.v1.MsgFileUpload"
}
export interface SdsPrepayTxMessage {
    typeUrl: TxMsgTypes;
    value: {
        sender: string;
        amount: AmountType[];
    };
}
export interface SdsPrepayTxPayload {
    amount: number;
}
export interface SdsPrepayValue extends TransactionValue {
    sender: string;
    coins: AmountType[];
}
export declare enum TxHistoryTypes {
    SdsPrepay = "sds/PrepayTx"
}
export declare enum HistoryTxType {
    SdsPrepay = 5,
    SdsFileUpload = 6
}
