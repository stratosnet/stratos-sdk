import { fromHex } from '@cosmjs/encoding';
import _get from 'lodash/get';
import { getAccountsData } from '../accounts';
import { stratosDenom } from '../config/hdVault';
import { decimalPrecision, maxGasAmount, standardFeeAmount } from '../config/tokens';
import { uint8ArrayToBuffer } from '../hdVault/utils';
import Sdk from '../Sdk';
import { toWei } from '../services/bigNumber';
import { getCosmos } from '../services/cosmos';
import * as Types from './types';

function* payloadGenerator(dataList: Types.TxPayload[]) {
  while (dataList.length) {
    yield dataList.shift();
  }
}

export const broadcast = async (signedTx: Types.SignedTransaction): Promise<Types.BroadcastResult> => {
  try {
    const result = await getCosmos().broadcast(signedTx);

    // add pproper error handling!! check for code!
    return result;
  } catch (err) {
    console.log('Could not broadcast', err.message);

    throw err;
  }
};

export const sign = (txMessage: Types.TransactionMessage, privateKey: string): Types.SignedTransaction => {
  const pkey = uint8ArrayToBuffer(fromHex(privateKey));

  const signedTx = getCosmos().sign(txMessage, pkey);
  return signedTx;
};

export const getStandardFee = (numberOfMessages = 1): Types.TransactionFee => {
  const fee = {
    amount: [{ amount: String(standardFeeAmount), denom: stratosDenom }],
    gas: String(maxGasAmount + standardFeeAmount * numberOfMessages),
  };
  return fee;
};

export const getStandardAmount = (amounts: number[]): Types.AmountType[] => {
  const result = amounts.map(amount => ({
    amount: toWei(amount, decimalPrecision).toString(),
    denom: stratosDenom,
  }));

  return result;
};

const getBaseTx = async (
  keyPairAddress: string,
  memo = '',
  numberOfMessages = 1,
): Promise<Types.BaseTransaction> => {
  const accountsData = await getAccountsData(keyPairAddress);

  const oldSequence = String(accountsData.result.value.sequence);
  const newSequence = parseInt(oldSequence);

  const { chainId } = Sdk.environment;

  const myTx = {
    chain_id: chainId,
    fee: getStandardFee(numberOfMessages),
    memo,
    account_number: String(accountsData.result.value.account_number),
    sequence: `${newSequence}`,
  };

  return myTx;
};

export const getSendTx = async (
  keyPairAddress: string,
  sendPayload: Types.SendTxPayload[],
  memo = '',
): Promise<Types.TransactionMessage> => {
  const baseTx = await getBaseTx(keyPairAddress, memo, sendPayload.length);

  const payloadToProcess = payloadGenerator(sendPayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.SendTxMessage[] = [];

  while (iteratedData.value) {
    const { amount, toAddress } = iteratedData.value as Types.SendTxPayload;

    const message = {
      type: Types.TxMsgTypes.Send,
      value: {
        amount: getStandardAmount([amount]),
        from_address: keyPairAddress,
        to_address: toAddress,
      },
    };

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  const myTx = {
    msgs: messagesList,
    ...baseTx,
  };

  const myTxMsg = getCosmos().newStdMsg(myTx);

  return myTxMsg;
};

export const getDelegateTx = async (
  delegatorAddress: string,
  delegatePayload: Types.DelegateTxPayload[],
  memo = '',
): Promise<Types.TransactionMessage> => {
  const baseTx = await getBaseTx(delegatorAddress, memo, delegatePayload.length);

  const payloadToProcess = payloadGenerator(delegatePayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.DelegateTxMessage[] = [];

  while (iteratedData.value) {
    const { amount, validatorAddress } = iteratedData.value as Types.DelegateTxPayload;

    const message = {
      type: Types.TxMsgTypes.Delegate,
      value: {
        amount: {
          amount: toWei(amount, decimalPrecision).toString(),
          denom: stratosDenom,
        },
        delegator_address: delegatorAddress,
        validator_address: validatorAddress,
      },
    };

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  const myTx = {
    msgs: messagesList,
    ...baseTx,
  };

  const myTxMsg = getCosmos().newStdMsg(myTx);

  return myTxMsg;
};

export const getUnDelegateTx = async (
  delegatorAddress: string,
  unDelegatePayload: Types.UnDelegateTxPayload[],
  memo = '',
): Promise<Types.TransactionMessage> => {
  const baseTx = await getBaseTx(delegatorAddress, memo, unDelegatePayload.length);

  const payloadToProcess = payloadGenerator(unDelegatePayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.UnDelegateTxMessage[] = [];

  while (iteratedData.value) {
    const { amount, validatorAddress } = iteratedData.value as Types.DelegateTxPayload;

    const message = {
      type: Types.TxMsgTypes.Undelegate,
      value: {
        amount: {
          amount: toWei(amount, decimalPrecision).toString(),
          denom: stratosDenom,
        },
        delegator_address: delegatorAddress,
        validator_address: validatorAddress,
      },
    };

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  const myTx = {
    msgs: messagesList,
    ...baseTx,
  };

  const myTxMsg = getCosmos().newStdMsg(myTx);

  return myTxMsg;
};

export const getWithdrawalRewardTx = async (
  delegatorAddress: string,
  withdrawalPayload: Types.WithdrawalRewardTxPayload[],
  memo = '',
): Promise<Types.TransactionMessage> => {
  const baseTx = await getBaseTx(delegatorAddress, memo, withdrawalPayload.length);

  const payloadToProcess = payloadGenerator(withdrawalPayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.WithdrawalRewardTxMessage[] = [];

  while (iteratedData.value) {
    const { validatorAddress } = iteratedData.value as Types.WithdrawalRewardTxPayload;

    const message = {
      type: Types.TxMsgTypes.WithdrawRewards,
      value: {
        delegator_address: delegatorAddress,
        validator_address: validatorAddress,
      },
    };

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  const myTx = {
    msgs: messagesList,
    ...baseTx,
  };

  const myTxMsg = getCosmos().newStdMsg(myTx);

  return myTxMsg;
};

export const getSdsPrepayTx = async (
  senderAddress: string,
  amount: number,
  memo = '',
): Promise<Types.TransactionMessage> => {
  const baseTx = await getBaseTx(senderAddress, memo);

  const myTx = {
    msgs: [
      {
        type: Types.TxMsgTypes.SdsPrepay,
        value: {
          sender: senderAddress,
          coins: getStandardAmount([amount]),
        },
      },
    ],
    ...baseTx,
  };

  const myTxMsg = getCosmos().newStdMsg(myTx);

  return myTxMsg;
};
