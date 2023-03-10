import * as TxTypes from '../../../transactions/types';
import * as NetworkTypes from '../../network/types';

export const isSendTxBodyMessage = (
  bodyMessage: NetworkTypes.RestTxBodyMessage,
): bodyMessage is NetworkTypes.RestSendTxBodyMessage => {
  // return 'from_address' in bodyMessage;
  return bodyMessage['@type'] === TxTypes.TxMsgTypes.Send;
};

export const isDelegateTxBodyMessage = (
  bodyMessage: NetworkTypes.RestTxBodyMessage,
): bodyMessage is NetworkTypes.RestDelegateTxBodyMessage => {
  return bodyMessage['@type'] === TxTypes.TxMsgTypes.Delegate;
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
