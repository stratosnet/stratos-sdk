import * as TxTypes from '../../../chain/transactions/types';
import * as NetworkTypes from '../../../network/networkTypes';
import * as TxTypesPrepay from '../../../sds/transactions/types';

export const isSendTxBodyMessage = (
  bodyMessage: NetworkTypes.RestTxBodyMessage,
): bodyMessage is NetworkTypes.RestSendTxBodyMessage => {
  return bodyMessage['@type'] === TxTypes.TxMsgTypes.Send;
};

export const isDelegateTxBodyMessage = (
  bodyMessage: NetworkTypes.RestTxBodyMessage,
): bodyMessage is NetworkTypes.RestDelegateTxBodyMessage => {
  return bodyMessage['@type'] === TxTypes.TxMsgTypes.Delegate;
};

export const isBeginRedelegateTxBodyMessage = (
  bodyMessage: NetworkTypes.RestTxBodyMessage,
): bodyMessage is NetworkTypes.RestBeginRedelegateTxBodyMessage => {
  return bodyMessage['@type'] === TxTypes.TxMsgTypes.BeginRedelegate;
};

export const isUndelegateTxBodyMessage = (
  bodyMessage: NetworkTypes.RestTxBodyMessage,
): bodyMessage is NetworkTypes.RestUndelegateTxBodyMessage => {
  return bodyMessage['@type'] === TxTypes.TxMsgTypes.Undelegate;
};

export const isGetRewardsTxBodyMessage = (
  bodyMessage: NetworkTypes.RestTxBodyMessage,
): bodyMessage is NetworkTypes.RestGetRewardsTxBodyMessage => {
  return bodyMessage['@type'] === TxTypes.TxMsgTypes.WithdrawRewards;
};

export const isPrepayTxBodyMessage = (
  bodyMessage: NetworkTypes.RestTxBodyMessage,
): bodyMessage is NetworkTypes.RestSdsPrepayTxBodyMessage => {
  return bodyMessage['@type'] === TxTypesPrepay.TxMsgTypes.SdsPrepay;
};
