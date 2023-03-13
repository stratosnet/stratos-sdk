import * as NetworkTypes from '../../../network/types';
import * as Types from '../types';
import { isGetRewardsTxBodyMessage } from '../utils';
import { formatBaseTx } from './formatBaseTx';
import { formatTxSingleAmount } from './formatTxAmounts';
import { emptyAmounts } from './formatTxAmounts';

const findReceivedAmounts = (
  txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog,
): NetworkTypes.Amount[] => {
  let receivedCoinsAmount = '';
  let receivedDenom = '';

  if (!txResponseItemLogEntry) {
    return emptyAmounts;
  }

  const eventWithReceivedCoins = txResponseItemLogEntry?.events?.find(logEvent => {
    const { type: evetnType } = logEvent;
    return evetnType === 'coin_received';
  });

  if (!eventWithReceivedCoins) {
    return emptyAmounts;
  }

  const { attributes } = eventWithReceivedCoins;

  if (!Array.isArray(attributes)) {
    return emptyAmounts;
  }

  attributes.forEach(element => {
    if (!receivedCoinsAmount && element.key === 'amount') {
      const tmpReceivedCoinsAmount = `${element.value}`;
      receivedCoinsAmount = `${parseInt(tmpReceivedCoinsAmount)}`;
      receivedDenom = tmpReceivedCoinsAmount.replace(`${receivedCoinsAmount}`, '');
    }
  });

  return [
    {
      amount: receivedCoinsAmount,
      denom: receivedDenom,
    },
  ];
};

export const formatTxMsgWithdrawDelegationReward = (
  txResponseItemTxBodyMessage: NetworkTypes.RestTxBodyMessage,
  txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog,
): Types.FormattedBlockChainTxMessage => {
  const baseTx = formatBaseTx(txResponseItemTxBodyMessage, txResponseItemLogEntry);

  if (!isGetRewardsTxBodyMessage(txResponseItemTxBodyMessage)) {
    return baseTx;
  }

  const { delegator_address, validator_address } = txResponseItemTxBodyMessage;

  const amounts = findReceivedAmounts(txResponseItemLogEntry);

  return {
    ...baseTx,
    sender: validator_address,
    to: delegator_address,
    amounts,
  };
};
