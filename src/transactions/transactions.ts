import { stratosDenom } from '../config/hdVault';
import { chainId } from '../config/network';
import { networkTypes, submitTransaction } from '../services/network';
import { getCosmos } from './cosmos';
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

export const sign = (txMessage: Types.TransactionMessage, pkey: Buffer): Types.SignedTransaction => {
  const signedTx = getCosmos().sign(txMessage, pkey);
  return signedTx;
};

export const getAccountsData = async (keyPairAddress: string): Promise<Types.AccountsData> => {
  try {
    const accountsData = await getCosmos().getAccounts(keyPairAddress);
    return accountsData;
  } catch (err) {
    console.log('Could not get accounts', err.message);
    throw err;
  }
};

export const getStandardFee = (): Types.TransactionFee => {
  const fee = { amount: [{ amount: String(5000), denom: stratosDenom }], gas: String(200000) };
  return fee;
};

export const getStandardAmount = (amounts: number[]): Types.AmountType[] => {
  const result = amounts.map(amount => ({
    amount: String(amount),
    denom: stratosDenom,
  }));

  return result;
};

const getBaseTx = async (keyPairAddress: string, memo = ''): Promise<Types.BaseTransaction> => {
  const accountsData = await getAccountsData(keyPairAddress);

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
        type: Types.CosmosMsgTypes.Send,
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
        type: Types.CosmosMsgTypes.Delegate,
        value: {
          amount: {
            amount: String(amount),
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

export const delegate = async (
  delegateAmount: number,
  keyPairAddress: string,
  delegatorAddress: string,
  validatorAddress: string,
): Promise<networkTypes.SubmitTransactionDataResult> => {
  const accountsData = await getAccountsData(keyPairAddress);

  console.log('accountsData!', accountsData);

  const example = {
    base_req: {
      from: delegatorAddress,
      memo: '',
      chain_id: chainId,
      account_number: String(accountsData.result.value.account_number),
      sequence: String(accountsData.result.value.sequence),
      gas: '200000',
      gas_adjustment: '1.2',
      fees: [
        {
          denom: stratosDenom,
          amount: '50',
        },
      ],
      simulate: false,
    },
    delegator_address: delegatorAddress,
    validator_address: validatorAddress,
    delegation: {
      denom: stratosDenom,
      amount: delegateAmount, // string?
    },
  };

  const res = await submitTransaction(delegatorAddress, JSON.stringify(example));

  console.log('res!', res);

  return res;
};
