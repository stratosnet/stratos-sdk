import * as NetworkTypes from '../../../network/networkTypes';
export declare const isSendTxBodyMessage: (bodyMessage: NetworkTypes.RestTxBodyMessage) => bodyMessage is NetworkTypes.RestSendTxBodyMessage;
export declare const isDelegateTxBodyMessage: (bodyMessage: NetworkTypes.RestTxBodyMessage) => bodyMessage is NetworkTypes.RestDelegateTxBodyMessage;
export declare const isBeginRedelegateTxBodyMessage: (bodyMessage: NetworkTypes.RestTxBodyMessage) => bodyMessage is NetworkTypes.RestBeginRedelegateTxBodyMessage;
export declare const isUndelegateTxBodyMessage: (bodyMessage: NetworkTypes.RestTxBodyMessage) => bodyMessage is NetworkTypes.RestUndelegateTxBodyMessage;
export declare const isGetRewardsTxBodyMessage: (bodyMessage: NetworkTypes.RestTxBodyMessage) => bodyMessage is NetworkTypes.RestGetRewardsTxBodyMessage;
export declare const isPrepayTxBodyMessage: (bodyMessage: NetworkTypes.RestTxBodyMessage) => bodyMessage is NetworkTypes.RestSdsPrepayTxBodyMessage;
