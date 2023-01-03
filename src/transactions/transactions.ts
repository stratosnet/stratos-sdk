import { GeneratedType } from '@cosmjs/proto-signing';
import { defaultRegistryTypes } from '@cosmjs/stargate';
import { DeliverTxResponse } from '@cosmjs/stargate';
import * as stratosTypes from '@stratos-network/stratos-cosmosjs-types';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import _get from 'lodash/get';
// import { getAccountsData } from '../accounts';
import { stratosDenom } from '../config/hdVault';
import { baseGasAmount, decimalPrecision, perMsgGasAmount, standardFeeAmount } from '../config/tokens';
// import Sdk from '../Sdk';
import { toWei } from '../services/bigNumber';
import { getCosmos } from '../services/cosmos';
import { getValidatorsBondedToDelegator } from '../validators';
import * as Types from './types';

function* payloadGenerator(dataList: Types.TxPayload[]) {
  while (dataList.length) {
    yield dataList.shift();
  }
}

export const getStratosTransactionRegistryTypes = () => {
  const msgPrepayProto = stratosTypes.stratos.sds.v1.MsgPrepay;
  // console.log('defaultRegistryTypes', defaultRegistryTypes);
  const stratosTxRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
    ...defaultRegistryTypes,
    [Types.TxMsgTypes.SdsPrepay, msgPrepayProto],

    // [Types.TxMsgTypes.PotWithdraw, Coin],
    // [Types.TxMsgTypes.PotFoundationDeposit, Coin],

    // [Types.TxMsgTypes.RegisterCreateResourceNode, Coin],
    // [Types.TxMsgTypes.RegisterRemoveResourceNode, Coin],
    // [Types.TxMsgTypes.RegisterCreateIndexingNode, Coin],
    // [Types.TxMsgTypes.RegisterRemoveIndexingNode, Coin],
  ];

  return stratosTxRegistryTypes;
};

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

    const txBytes = TxRaw.encode(signedTx).finish();

    console.log(
      '🚀 ~ file: transactions.ts ~ line 28 ~ broadcast ~ txBytes to be broadcasted',
      JSON.stringify(txBytes),
    );

    const result = await client.broadcastTx(txBytes);
    console.log('🚀 ~ file: transactions.ts ~ line 52 ~ broadcast ~ result', result);

    return result;
  } catch (err) {
    console.log('Could not broadcast', (err as Error).message);

    throw err;
  }
};

export const sign = async (
  address: string,
  txMessages: Types.TxMessage[],
  memo = '',
  givenFee?: Types.TransactionFee,
): Promise<TxRaw> => {
  const fee = givenFee ? givenFee : getStandardFee();

  console.log('Stratos transaction - fee ', fee);
  console.log('Stratos transaction - address', address);
  console.log('Stratos transaction - txMessages', JSON.stringify(txMessages));
  console.log('Stratos transaction - memo', JSON.stringify(memo));
  const client = await getCosmos();
  console.log('Stratos transaction - calling transaction sign (calling stragate client sign method)');
  const signedTx = await client.sign(address, txMessages, fee, memo);
  console.log('Stratos transaction - signed tx', signedTx);

  return signedTx;
};

export const getStandardFee = (numberOfMessages = 1): Types.TransactionFee => {
  const fee = {
    amount: [{ amount: String(standardFeeAmount), denom: stratosDenom }], // 200_000
    gas: String(baseGasAmount + perMsgGasAmount * numberOfMessages), // 500_000 + 100_000 * 1 = 6000000000000
  };
  console.log('fee', fee);
  return fee;
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
        coins: getStandardAmount([amount]),
      },
    };

    console.log('message to be signed', JSON.stringify(message));

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  return messagesList;
};
