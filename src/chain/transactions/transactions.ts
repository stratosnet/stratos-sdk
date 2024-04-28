import { DeliverTxResponse } from '@cosmjs/stargate';
import { AuthInfo, Tx, TxBody, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import _get from 'lodash/get';
import * as transactionsCommon from '../../common/transactions';
import { stratosDenom } from '../../config/hdVault';
import {
  baseGasAmount,
  decimalPrecision,
  gasAdjustment,
  minGasPrice,
  perMsgGasAmount,
  standardFeeAmount,
} from '../../config/tokens';
import { toWei } from '../../services/bigNumber';
import { dirLog, log } from '../../services/helpers';
import { cosmosService } from '../cosmos';
import { validatorsApi } from '../validators';
import * as Types from './types';

const maxMessagesPerTx = 500;

interface JsonizedMessage {
  typeUrl: string;
  value: string;
}

interface JsonizedTx {
  body: {
    messages: JsonizedMessage[];
  };
  authInfo: any;
  signatures: string[];
}

// function* payloadGenerator(dataList: Types.TxPayload[]) {
//   while (dataList.length) {
//     yield dataList.shift();
//   }
// }

// declare global {
//   interface Window {
//     encoder: any;
//   }
//   /* eslint-disable-next-line @typescript-eslint/no-namespace */
//   namespace NodeJS {
//     interface Global {
//       encoder: any;
//     }
//   }
// }

export const assembleTxRawFromTx = (tx: Tx) => {
  const txR = TxRaw.fromPartial({
    bodyBytes: TxBody.encode(tx.body!).finish(),
    authInfoBytes: AuthInfo.encode(tx.authInfo!).finish(),
    signatures: tx.signatures.map(ss => ss),
  });

  return txR;
};

export const encodeTxHrToTx = async (jsonizedTx: JsonizedTx) => {
  const client = await cosmosService.getCosmos();

  const encodedMessages = await client.encodeMessagesFromTheTxBody(jsonizedTx.body.messages);

  if (encodedMessages) {
    jsonizedTx.body.messages = encodedMessages;
  }

  const encoded = Tx.fromJSON(jsonizedTx);

  return encoded;
};

export const decodeTxRawToTx = (signedTx: TxRaw) => {
  const txBodyObject = TxBody.decode(signedTx.bodyBytes);

  const authInfo = AuthInfo.decode(signedTx.authInfoBytes);

  const decoded = Tx.fromPartial({
    authInfo,
    body: txBodyObject,
    signatures: signedTx.signatures.map(ss => ss),
  });

  return decoded;
};

export const decodeTxRawToTxHr = async (signedTx: TxRaw) => {
  const client = await cosmosService.getCosmos();

  const decoded = decodeTxRawToTx(signedTx);

  const jsonizedTx: JsonizedTx = Tx.toJSON(decoded) as JsonizedTx;

  const decodedMessages = await client.decodeMessagesFromTheTxBody(decoded.body?.messages);

  if (decodedMessages) {
    jsonizedTx.body.messages = decodedMessages;
  }

  return jsonizedTx;
};

export const encodeTxRawToEncodedTx = (signedTx: TxRaw): Uint8Array => {
  const txBytes = TxRaw.encode(signedTx).finish();
  return txBytes;
};

export const broadcast = async (signedTx: TxRaw): Promise<DeliverTxResponse> => {
  try {
    const client = await cosmosService.getCosmos();

    const txBytes = encodeTxRawToEncodedTx(signedTx);

    const result = await client.broadcastTx(txBytes);
    dirLog('🚀 ~ file: transactions.ts ~  broadcast ~ result', result);
    return result;
  } catch (err) {
    dirLog('transactions.broadcastTx Could not broadcast', (err as Error).message);

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

  // dirLog('from getStandardFee txMessages', txMessages);

  if (txMessages.length > maxMessagesPerTx) {
    throw new Error(
      `Exceed max messages for fee calculation (got: ${txMessages.length}, limit: ${maxMessagesPerTx})`,
    );
  }

  try {
    const client = await cosmosService.getCosmos();
    const gas = await client.simulate(signerAddress, txMessages, '');
    const estimatedGas = Math.round(gas * gasAdjustment);

    const amount = minGasPrice.mul(estimatedGas).toString();

    const feeAmount = [
      {
        amount,
        denom: stratosDenom,
      },
    ];

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

  const client = await cosmosService.getCosmos();

  const signedTx = await client.sign(address, txMessages, fee, memo);

  // const txBytes = encodeTxRawToEncodedTx(signedTx);

  return signedTx;
};

export const getSendTx = async (
  keyPairAddress: string,
  sendPayload: Types.SendTxPayload[],
): Promise<Types.SendTxMessage[]> => {
  const payloadToProcess = transactionsCommon.payloadGenerator(sendPayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.SendTxMessage[] = [];

  while (iteratedData.value) {
    const { amount, toAddress } = iteratedData.value as Types.SendTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.Send,
      value: {
        amount: transactionsCommon.getStandardAmount([amount]),
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
  const payloadToProcess = transactionsCommon.payloadGenerator(delegatePayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.DelegateTxMessage[] = [];

  while (iteratedData.value) {
    const { amount, validatorAddress } = iteratedData.value as Types.DelegateTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.Delegate,
      value: {
        amount: {
          amount: toWei(amount, decimalPrecision).toFixed(),
          denom: stratosDenom,
        },
        delegatorAddress: delegatorAddress,
        validatorAddress: validatorAddress,
      },
    };

    console.log('message to Delegate', message);

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  return messagesList;
};

export const getBeginRedelegateTx = async (
  delegatorAddress: string,
  delegatePayload: Types.BeginRedelegateTxPayload[],
): Promise<Types.BeginRedelegateTxMessage[]> => {
  const payloadToProcess = transactionsCommon.payloadGenerator(delegatePayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.BeginRedelegateTxMessage[] = [];

  while (iteratedData.value) {
    const { amount, validatorSrcAddress, validatorDstAddress } =
      iteratedData.value as Types.BeginRedelegateTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.BeginRedelegate,
      value: {
        amount: {
          amount: toWei(amount, decimalPrecision).toFixed(),
          denom: stratosDenom,
        },
        delegatorAddress: delegatorAddress,
        validatorSrcAddress: validatorSrcAddress,
        validatorDstAddress: validatorDstAddress,
      },
    };

    console.log('message to ReDelegate', message);

    messagesList.push(message);

    iteratedData = payloadToProcess.next();
  }

  return messagesList;
};

export const getUnDelegateTx = async (
  delegatorAddress: string,
  unDelegatePayload: Types.UnDelegateTxPayload[],
): Promise<Types.UnDelegateTxMessage[]> => {
  const payloadToProcess = transactionsCommon.payloadGenerator(unDelegatePayload);

  let iteratedData = payloadToProcess.next();

  const messagesList: Types.UnDelegateTxMessage[] = [];

  while (iteratedData.value) {
    const { amount, validatorAddress } = iteratedData.value as Types.DelegateTxPayload;

    const message = {
      typeUrl: Types.TxMsgTypes.Undelegate,
      value: {
        amount: {
          amount: toWei(amount, decimalPrecision).toFixed(),
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
  const payloadToProcess = transactionsCommon.payloadGenerator(withdrawalPayload);

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
  const vListResult = await validatorsApi.getValidatorsBondedToDelegator(delegatorAddress);

  const { data: withdrawalPayload } = vListResult;

  const payloadToProcess = transactionsCommon.payloadGenerator(
    withdrawalPayload.map((item: { address: string }) => ({
      validatorAddress: item.address,
    })),
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
