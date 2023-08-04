import { fromBase64, toBase64, toHex } from '@cosmjs/encoding';
import { DecodedTxRaw, decodeTxRaw } from '@cosmjs/proto-signing';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { AuthInfo, Tx, TxBody, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import _get from 'lodash/get';
import { stratosDenom } from '../config/hdVault';
import {
  baseGasAmount,
  decimalPrecision,
  gasAdjustment,
  minGasPrice,
  perMsgGasAmount,
  standardFeeAmount,
} from '../config/tokens';
import { toWei } from '../services/bigNumber';
import { getCosmos } from '../services/cosmos';
import { dirLog, log } from '../services/helpers';
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

export const assembleTxRawFromHumanRead = (decoded: DecodedTxRaw): TxRaw => {
  const txBytesAssembled = TxRaw.fromPartial({
    bodyBytes: TxBody.encode(decoded.body).finish(),
    authInfoBytes: AuthInfo.encode(decoded.authInfo).finish(),
    signatures: [fromBase64(decoded.signatures.map(ss => toBase64(ss)).pop()!)],
  });

  return txBytesAssembled;
};

export const assembleTxRawFromTx = (tx: Tx) => {
  const txR = TxRaw.fromPartial({
    bodyBytes: TxBody.encode(tx.body!).finish(),
    authInfoBytes: AuthInfo.encode(tx.authInfo!).finish(),
    signatures: tx.signatures.map(ss => ss),
  });
  // console.log('assembleTxRawFromTx txRaw', txR);

  return txR;
};

export const assembleTxFromString = (txString: string) => {
  const parsedObject = JSON.parse(txString);
  // console.log('parsedObject', parsedObject);

  const tx = Tx.fromJSON(parsedObject);

  return tx;
};

export const assembleTxRawFromString = (txRawString: string) => {
  const tx = assembleTxFromString(txRawString);

  const txR = assembleTxRawFromTx(tx);

  return txR;
};

export const encodeTxHrToTx = async (jsonizedTx: JsonizedTx) => {
  const client = await getCosmos();
  // const txBodyObject = txD.body!;

  const encodedMessages = await client.encodeMessagesFromTheTxBody(jsonizedTx.body.messages);

  dirLog('from encodeTxHrToTx encodedMessages', encodedMessages);

  if (encodedMessages) {
    jsonizedTx.body.messages = encodedMessages;
  }
  // const myTx = { body: txBodyObject, authInfo: txD.authInfo, signatures: txD.signatures };

  // myTx.body['messages'] = encodedMessages;
  // dirLog('from encodeTxHrToTx myTx', myTx);

  const encoded = Tx.fromJSON(jsonizedTx);
  dirLog('from encodeTxHrToTx encoded', encoded);

  return encoded;
};

interface EncodedMessage {
  typeUrl: string;
  value: Uint8Array;
}

interface DecodedMessage {
  typeUrl: string;
  value: any;
}
interface JsonizedMessage {
  typeUrl: string;
  value: string;
}

export interface JsonizedTx {
  body: {
    messages: JsonizedMessage[];
  };
  authInfo: any;
  signatures: string[];
}

export const decodeTxRawToTx = (signedTx: TxRaw) => {
  const txBodyObject = TxBody.decode(signedTx.bodyBytes);

  const authInfo = AuthInfo.decode(signedTx.authInfoBytes);

  const decoded = Tx.fromPartial({
    authInfo,
    body: txBodyObject,
    signatures: signedTx.signatures.map(ss => ss),
  });

  dirLog('from decodeTxRawToTx decoded', decoded);

  return decoded;
};

export const decodeTxRawToTxHr = async (signedTx: TxRaw) => {
  const client = await getCosmos();

  const decoded = decodeTxRawToTx(signedTx);

  const jsonizedTx: JsonizedTx = Tx.toJSON(decoded) as JsonizedTx;

  dirLog('from decodeTxRawToHr jsonizedTx ', jsonizedTx);

  // const txBodyObject = decoded.body!;

  // hex string with the value
  // const encodedTxBodyObject = TxBody.toJSON(txBodyObject) as TxBody;

  const decodedMessages = await client.decodeMessagesFromTheTxBody(decoded.body?.messages);

  if (decodedMessages) {
    jsonizedTx.body.messages = decodedMessages;
  }

  // const txD = Tx.toJSON(decoded) as Tx;
  // if (decodedMessages) {
  //   txD.body!['messages'] = decodedMessages;
  // }

  dirLog('from decodeTxRawToHr jsonizedTx modified ', jsonizedTx);
  return jsonizedTx;
};

export const decodeEncodedTxToHumanRead = (txBytes: Uint8Array): DecodedTxRaw => {
  const decoded = decodeTxRaw(txBytes);
  return decoded;
};

export const encodeTxRawToEncodedTx = (signedTx: TxRaw): Uint8Array => {
  const txBytes = TxRaw.encode(signedTx).finish();
  return txBytes;
};

export const broadcast = async (signedTx: TxRaw): Promise<DeliverTxResponse> => {
  try {
    const client = await getCosmos();

    // log('signedTx to be broadcasted', signedTx);
    // const txBytes = TxRaw.encode(signedTx).finish();
    const txBytes = encodeTxRawToEncodedTx(signedTx);
    // log('encoded tx txBytes', txBytes);

    const result = await client.broadcastTx(txBytes);

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

  // dirLog('from getStandardFee txMessages', txMessages);

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

  // const txBytes = encodeTxRawToEncodedTx(signedTx);

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
