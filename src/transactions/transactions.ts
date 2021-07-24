import { fromHex } from '@cosmjs/encoding';
import _get from 'lodash/get';
import { getAccountsData } from '../accounts';
import { stratosDenom } from '../config/hdVault';
import { decimalPrecision, standardFeeAmount } from '../config/tokens';
import { uint8ArrayToBuffer } from '../hdVault/utils';
import Sdk from '../Sdk';
import { toWei } from '../services/bigNumber';
import { getCosmos } from '../services/cosmos';
import * as Types from './types';

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

export const getStandardFee = (): Types.TransactionFee => {
  const fee = { amount: [{ amount: String(standardFeeAmount), denom: stratosDenom }], gas: String(200000) };
  return fee;
};

export const getStandardAmount = (amounts: number[]): Types.AmountType[] => {
  const result = amounts.map(amount => ({
    amount: toWei(amount, decimalPrecision).toString(),
    denom: stratosDenom,
  }));

  return result;
};

const getBaseTx = async (keyPairAddress: string, memo = ''): Promise<Types.BaseTransaction> => {
  const accountsData = await getAccountsData(keyPairAddress);

  console.log('accountsData! base value', accountsData.result.value);

  const oldSequence = String(accountsData.result.value.sequence);
  // const newSequence = parseInt(oldSequence) + 1;
  const newSequence = parseInt(oldSequence);

  const { chainId } = Sdk.environment;

  const myTx = {
    chain_id: chainId,
    fee: getStandardFee(),
    memo,
    account_number: String(accountsData.result.value.account_number),
    sequence: `${newSequence}`,
  };

  return myTx;
};

export const getSendTx = async (
  amount: number,
  keyPairAddress: string,
  toAddress: string,
  memo = '',
): Promise<Types.TransactionMessage> => {
  const baseTx = await getBaseTx(keyPairAddress, memo);

  const myTx = {
    msgs: [
      {
        type: Types.TxMsgTypes.Send,
        value: {
          amount: getStandardAmount([amount]),
          from_address: keyPairAddress,
          to_address: toAddress,
        },
      },
    ],
    ...baseTx,
  };

  const myTxMsg = getCosmos().newStdMsg(myTx);

  return myTxMsg;
};

export const getDelegateTx = async (
  amount: number,
  delegatorAddress: string,
  validatorAddress: string,
  memo = '',
): Promise<Types.TransactionMessage> => {
  const baseTx = await getBaseTx(delegatorAddress, memo);

  const myTx = {
    msgs: [
      {
        type: Types.TxMsgTypes.Delegate,
        value: {
          amount: {
            amount: toWei(amount, decimalPrecision).toString(),
            denom: stratosDenom,
          },
          delegator_address: delegatorAddress,
          validator_address: validatorAddress,
        },
      },
    ],
    ...baseTx,
  };

  const myTxMsg = getCosmos().newStdMsg(myTx);

  return myTxMsg;
};

export const getWithdrawalRewardTx = async (
  delegatorAddress: string,
  validatorAddress: string,
  memo = '',
): Promise<Types.TransactionMessage> => {
  const baseTx = await getBaseTx(delegatorAddress, memo);

  const myTx = {
    msgs: [
      {
        type: Types.TxMsgTypes.WithdrawRewards,
        value: {
          delegator_address: delegatorAddress,
          validator_address: validatorAddress,
        },
      },
    ],
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
