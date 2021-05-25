import { stratosDenom } from '../config/hdVault';
import { chainId } from '../config/network';
import { KeyPairInfo } from '../hdVault/wallet';
import { networkTypes, submitTransaction } from '../services/network';
import { getCosmos } from './cosmos';
import * as Types from './types';

export const broadcastTx = async (signedTx: Types.SignedTransaction): Promise<Types.BroadcastResult> => {
  try {
    const result = await getCosmos().broadcast(signedTx);

    // add pproper error handling!! check for code!
    return result;
  } catch (err) {
    console.log('Could not broadcast', err.message);

    throw err;
  }
};

export const getAccountsData = async (keyPair: KeyPairInfo): Promise<Types.AccountsData> => {
  try {
    const accountsData = await getCosmos().getAccounts(keyPair.address);
    return accountsData;
  } catch (err) {
    console.log('Could not get accounts', err.message);
    throw err;
  }
};

export const getStandardFee = () => {
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

export const createSendTx = async (
  amount: number,
  keyPair: KeyPairInfo,
  toAddress: string,
  memo = '',
): Promise<Types.Transaction> => {
  const accountsData = await getAccountsData(keyPair);

  const myTx = {
    msgs: [
      {
        type: Types.CosmosMsgTypes.Send,
        value: {
          amount: getStandardAmount([amount]),
          from_address: keyPair.address,
          to_address: toAddress,
        },
      },
    ],
    chain_id: chainId,
    fee: getStandardFee(),
    memo,
    account_number: String(accountsData.result.value.account_number),
    sequence: String(accountsData.result.value.sequence),
  };

  return myTx;
};

export const createDelegateTx = async (
  amount: number,
  keyPair: KeyPairInfo,
  delegatorAddress: string,
  validatorAddress: string,
  memo = '',
): Promise<Types.Transaction> => {
  const accountsData = await getAccountsData(keyPair);

  const myTx = {
    msgs: [
      {
        type: Types.CosmosMsgTypes.Delegate,
        value: {
          amount: getStandardAmount([amount]),
          delegator_address: delegatorAddress,
          validator_address: validatorAddress,
        },
      },
    ],
    chain_id: chainId,
    fee: getStandardFee(),
    memo,
    account_number: String(accountsData.result.value.account_number),
    sequence: String(accountsData.result.value.sequence),
  };

  return myTx;
};

// export const delegate = async (
//   delegateAmount: number,
//   keyPair: KeyPairInfo,
//   delegatorAddress: string,
//   validatorAddress: string,
// ): Promise<networkTypes.SubmitTransactionDataResult> => {
//   const accountsData = await getAccountsData(keyPair);

//   console.log('accountsData!', accountsData);

//   const example = {
//     base_req: {
//       from: delegatorAddress,
//       memo: '',
//       chain_id: chainId,
//       account_number: String(accountsData.result.value.account_number),
//       sequence: String(accountsData.result.value.sequence),
//       gas: '200000',
//       gas_adjustment: '1.2',
//       fees: [
//         {
//           denom: stratosDenom,
//           amount: '50',
//         },
//       ],
//       simulate: false,
//     },
//     delegator_address: delegatorAddress,
//     validator_address: validatorAddress,
//     delegation: {
//       denom: stratosDenom,
//       amount: delegateAmount, // string?
//     },
//   };

//   const res = await submitTransaction(delegatorAddress, JSON.stringify(example));

//   console.log('res!', res);

//   return res;
// };
