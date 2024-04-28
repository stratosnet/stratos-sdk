import { type AmountType, type TransactionValue } from '../../common/types/transactionTypes';

export enum TxMsgTypes {
  SdsAll = '', // All 0
  SdsPrepay = '/stratos.sds.v1.MsgPrepay', // SdsPrepay 5
  SdsFileUpload = '/stratos.sds.v1.MsgFileUpload', // SdsFileUpload 6
}

export interface SdsPrepayTxMessage {
  typeUrl: TxMsgTypes;
  value: {
    sender: string;
    // NOTE: this is still coins on tropos and it is amount on devnet
    // coins: AmountType[];
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

export enum TxHistoryTypes {
  // SdsAll = '',
  SdsPrepay = 'sds/PrepayTx',
}

export enum HistoryTxType {
  // All = 0,
  SdsPrepay = 5,
  SdsFileUpload = 6,
}
