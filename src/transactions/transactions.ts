import { fromHex } from '@cosmjs/encoding';
import _get from 'lodash/get';
import { stratosDenom } from '../config/hdVault';
import { chainId } from '../config/network';
import { decimalPrecision } from '../config/tokens';
import { uint8ArrayToBuffer } from '../hdVault/utils';
import { getTxList } from '../services/network';
import { create as createBigNumber, fromWei, toWei } from '../services/bigNumber';
import { getCosmos } from './cosmos';
import * as Types from './types';

interface ParsedTxItem {
  sender: string;
  to: string;
  type: Types.HistoryTxType;
  block: string;
  amount: string;
  time: string;
  hash: string;
}

interface ParsedTxData {
  data: ParsedTxItem[];
  total: number;
  page: number;
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

// move to account module
export const getAccountsData = async (keyPairAddress: string): Promise<Types.AccountsData> => {
  try {
    const accountsData = await getCosmos().getAccounts(keyPairAddress);
    console.log('accountsData!', accountsData);
    return accountsData;
  } catch (err) {
    console.log('Could not get accounts', err.message);
    throw err;
  }
};

// @todo move it to account module.
export const getBalance = async (keyPairAddress: string, requestedDenom: string): Promise<string> => {
  const accountsData = await getAccountsData(keyPairAddress);

  const coins = _get(accountsData, 'result.value.coins', []) as Types.AmountType[];

  const coin = coins.find(item => item.denom === requestedDenom);

  const currentBalance = coin?.amount || '0';

  const balanceInWei = createBigNumber(currentBalance);

  console.log('balanceInWei', balanceInWei);

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimalPrecision);

  return balance;
};

export const getAccountTrasactions = async (
  address: string,
  type = Types.HistoryTxType.Transfer,
  page?: number,
): Promise<ParsedTxData> => {
  const txType = Types.TxMsgTypesMap.get(type) || Types.TxMsgTypes.Send;
  const txListResult = await getTxList(address, txType, page);

  const { response } = txListResult;

  if (!response) {
    throw new Error('Could not fetch tx history');
  }

  const { data, total } = response;

  const parsedData: ParsedTxItem[] = data.map(txItem => {
    const block = _get(txItem, 'block_height', '') as string;
    const hash = _get(txItem, 'tx_hash', '');
    const time = _get(txItem, 'time', '');

    const sender = _get(txItem, 'transaction_data.txData.sender', '') as string;
    const to = _get(txItem, 'transaction_data.txData.data.to', '') as string;
    const amountValue = _get(txItem, 'transaction_data.txData.data.amount[0].amount', '') as string;
    const amountDenom = _get(txItem, 'transaction_data.txData.data.amount[0].denom', '') as string;

    const amount = `${amountValue} ${amountDenom}`.toUpperCase().trim();

    return {
      to,
      sender,
      type,
      block,
      amount,
      time,
      hash,
    };
  });

  const result = { data: parsedData, total, page: page || 1 };

  return result;
};

export const getStandardFee = (): Types.TransactionFee => {
  const fee = { amount: [{ amount: String(5000), denom: stratosDenom }], gas: String(200000) };
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

  console.log('accountsData! base', accountsData);
  console.log('accountsData! base value', accountsData.result.value);

  const myTx = {
    chain_id: chainId,
    fee: getStandardFee(),
    memo,
    account_number: String(accountsData.result.value.account_number),
    sequence: String(accountsData.result.value.sequence),
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
