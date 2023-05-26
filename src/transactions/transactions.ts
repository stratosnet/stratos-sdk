import { DeliverTxResponse } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import _get from 'lodash/get';
import { stratosDenom } from '../config/hdVault';
import {
  baseGasAmount,
  decimalPrecision,
  perMsgGasAmount,
  standardFeeAmount,
  minGasPrice,
  gasAdjustment,
} from '../config/tokens';
import { toWei } from '../services/bigNumber';
import { getCosmos } from '../services/cosmos';
import { log, dirLog } from '../services/helpers';
import { getValidatorsBondedToDelegator } from '../validators';
import * as Types from './types';

const maxMessagesPerTx = 500;

function* payloadGenerator(dataList: Types.TxPayload[]) {
  while (dataList.length) {
    yield dataList.shift();
  }
}

declare global {
  interface Window {
    encoder: any;
  }
  /* eslint-disable-next-line @typescript-eslint/no-namespace */
  namespace NodeJS {
    interface Global {
      encoder: any;
    }
  }
}

export const broadcast = async (signedTx: TxRaw): Promise<DeliverTxResponse> => {
  try {
    const client = await getCosmos();

    dirLog('signedTx to be broadcasted', signedTx);
    const txBytes = TxRaw.encode(signedTx).finish();

    const result = await client.broadcastTx(txBytes);
    dirLog('🚀 ~ file: transactions.ts ~ line 52 ~ broadcast ~ result', result);

    return result;
  } catch (err) {
    dirLog('Could not broadcast', (err as Error).message);

    throw err;
  }
};

export const getStandardDefaultFee = (): Types.TransactionFee => {
  const gas = baseGasAmount + perMsgGasAmount; // i.e. 500_000 + 100_000 * 1 = 600_000_000_000gas

  // for min gas price in the chain of 0.01gwei/10_000_000wei and 600_000gas, the fee would be 6_000gwei / 6_000_000_000_000wei
  // for min gas price in tropos-5 of 1gwei/1_000_000_000wei and 600_000gas, the fee would be 600_000gwei / 600_000_000_000_000wei, or 0.006stos
  const dynamicFeeAmount = standardFeeAmount(gas);

  const feeAmount = [{ amount: String(dynamicFeeAmount), denom: stratosDenom }];

  const fee = {
    amount: feeAmount,
    gas: `${gas}`,
  };
  dirLog('standard default fee', fee);

  return fee;
};

export const getStandardFee = async (
  signerAddress?: string,
  txMessages?: Types.TxMessage[],
): Promise<Types.TransactionFee> => {
  if (!txMessages || !signerAddress) {
    return getStandardDefaultFee();
  }

  dirLog('from getStandardFee txMessages', txMessages);

  if (txMessages.length > maxMessagesPerTx) {
    throw new Error(
      `Exceed max messages for fee calculation (got: ${txMessages.length}, limit: ${maxMessagesPerTx})`,
    );
  }

  try {
    const client = await getCosmos();
    const gas = await client.simulate(signerAddress, txMessages, '');
    const estimatedGas = Math.round(gas * gasAdjustment);

    const amount = minGasPrice.mul(estimatedGas).toString();

    const feeAmount = [{ amount, denom: stratosDenom }];
    const fees = {
      amount: feeAmount,
      gas: `${estimatedGas}`,
    };
    return fees;
  } catch (error) {
    log('Full error from simutlate', error);
    throw new Error(
      `Could not simutlate the fee calculation. Error details: ${
        (error as Error).message || JSON.stringify(error)
      }`,
    );
  }
};

export const sign = async (
  address: string,
  txMessages: Types.TxMessage[],
  memo = '',
  givenFee?: Types.TransactionFee,
): Promise<TxRaw> => {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const fee = givenFee ? givenFee : await getStandardFee(address, txMessages);
  // const fee = givenFee ? givenFee : getStandardDefaultFee();

  const client = await getCosmos();

  const signedTx = await client.sign(address, txMessages, fee, memo);

  return signedTx;
};

export const getStandardAmount = (amounts: number[]): Types.AmountType[] => {
  const result = amounts.map(amount => ({
    amount: toWei(amount, decimalPrecision).toString(),
    denom: stratosDenom,
  }));

  return result;
};

// @depricated ?
// export const getBaseTx = async (
//   keyPairAddress: string,
//   memo = '',
//   numberOfMessages = 1,
// ): Promise<Types.BaseTransaction> => {
//   console.log('get base tx 1');
//   const accountsData = await getAccountsData(keyPairAddress);

//   const oldSequence = String(accountsData.account.sequence);
//   const newSequence = parseInt(oldSequence);

//   const { chainId } = Sdk.environment;

//   const myTx = {
//     chain_id: chainId,
//     fee: getStandardFee(numberOfMessages),
//     memo,
//     account_number: String(accountsData.account.account_number),
//     sequence: `${newSequence}`,
//   };

//   return myTx;
// };

export const getSendTx = async (
  keyPairAddress: string,
  sendPayload: Types.SendTxPayload[],
): Promise<Types.SendTxMessage[]> => {
  const payloadToProcess = payloadGenerator(sendPayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.SendTxMessage[] = [];

  while (iteratedData.value) {
    const { amount, toAddress } = iteratedData.value as Types.SendTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.Send,
      value: {
        amount: getStandardAmount([amount]),
        fromAddress: keyPairAddress,
        toAddress: toAddress,
      },
    };

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  return messagesList;
};

export const getDelegateTx = async (
  delegatorAddress: string,
  delegatePayload: Types.DelegateTxPayload[],
): Promise<Types.DelegateTxMessage[]> => {
  const payloadToProcess = payloadGenerator(delegatePayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.DelegateTxMessage[] = [];

  while (iteratedData.value) {
    const { amount, validatorAddress } = iteratedData.value as Types.DelegateTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.Delegate,
      value: {
        amount: {
          amount: toWei(amount, decimalPrecision).toString(),
          denom: stratosDenom,
        },
        delegatorAddress: delegatorAddress,
        validatorAddress: validatorAddress,
      },
    };

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  return messagesList;
};

export const getUnDelegateTx = async (
  delegatorAddress: string,
  unDelegatePayload: Types.UnDelegateTxPayload[],
): Promise<Types.UnDelegateTxMessage[]> => {
  const payloadToProcess = payloadGenerator(unDelegatePayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.UnDelegateTxMessage[] = [];

  while (iteratedData.value) {
    const { amount, validatorAddress } = iteratedData.value as Types.DelegateTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.Undelegate,
      value: {
        amount: {
          amount: toWei(amount, decimalPrecision).toString(),
          denom: stratosDenom,
        },
        delegatorAddress: delegatorAddress,
        validatorAddress: validatorAddress,
      },
    };

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  return messagesList;
};

export const getWithdrawalRewardTx = async (
  delegatorAddress: string,
  withdrawalPayload: Types.WithdrawalRewardTxPayload[],
): Promise<Types.WithdrawalRewardTxMessage[]> => {
  const payloadToProcess = payloadGenerator(withdrawalPayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.WithdrawalRewardTxMessage[] = [];

  while (iteratedData.value) {
    const { validatorAddress } = iteratedData.value as Types.WithdrawalRewardTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.WithdrawRewards,
      value: {
        delegatorAddress: delegatorAddress,
        validatorAddress: validatorAddress,
      },
    };

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  return messagesList;
};

export const getWithdrawalAllRewardTx = async (
  delegatorAddress: string,
): Promise<Types.WithdrawalRewardTxMessage[]> => {
  const vListResult = await getValidatorsBondedToDelegator(delegatorAddress);

  const { data: withdrawalPayload } = vListResult;

  const payloadToProcess = payloadGenerator(
    withdrawalPayload.map((item: { address: string }) => ({ validatorAddress: item.address })),
  );

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.WithdrawalRewardTxMessage[] = [];

  while (iteratedData.value) {
    const { validatorAddress } = iteratedData.value as Types.WithdrawalRewardTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.WithdrawRewards,
      value: {
        delegatorAddress: delegatorAddress,
        validatorAddress: validatorAddress,
      },
    };

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  return messagesList;
};

export const getSdsPrepayTx = async (
  senderAddress: string,
  prepayPayload: Types.SdsPrepayTxPayload[],
): Promise<Types.SdsPrepayTxMessage[]> => {
  const payloadToProcess = payloadGenerator(prepayPayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.SdsPrepayTxMessage[] = [];

  while (iteratedData.value) {
    const { amount } = iteratedData.value as Types.SdsPrepayTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.SdsPrepay,
      value: {
        sender: senderAddress,
        beneficiary: senderAddress,
        // NOTE: this is still coins on tropos and it is amount on devnet
        // coins: getStandardAmount([amount]),
        amount: getStandardAmount([amount]),
      },
    };

    dirLog('sds prepay message to be signed', message);

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  return messagesList;
};
