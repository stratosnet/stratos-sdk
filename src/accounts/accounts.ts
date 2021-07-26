import _get from 'lodash/get';
import { decimalPrecision, standardFeeAmount } from '../config/tokens';
import { create as createBigNumber, fromWei, ROUND_DOWN } from '../services/bigNumber';
import { getCosmos } from '../services/cosmos';
import { getTxList } from '../services/network';
import * as TxTypes from '../transactions/types';
import * as Types from './types';

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

export const getBalance = async (
  keyPairAddress: string,
  requestedDenom: string,
  decimals = 4,
): Promise<string> => {
  const accountsData = await getAccountsData(keyPairAddress);

  const coins = _get(accountsData, 'result.value.coins', []) as TxTypes.AmountType[];

  const coin = coins.find(item => item.denom === requestedDenom);

  const currentBalance = coin?.amount || '0';

  const balanceInWei = createBigNumber(currentBalance);

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimals, ROUND_DOWN);

  return balance;
};

export const getMaxAvailableBalance = async (
  keyPairAddress: string,
  requestedDenom: string,
  decimals = 4,
): Promise<string> => {
  const accountsData = await getAccountsData(keyPairAddress);

  const coins = _get(accountsData, 'result.value.coins', []) as TxTypes.AmountType[];

  const coin = coins.find(item => item.denom === requestedDenom);

  const currentBalance = coin?.amount || '0';

  const feeAmount = createBigNumber(standardFeeAmount);
  const balanceInWei = createBigNumber(currentBalance).minus(feeAmount);
  console.log('🚀 ~ file: accounts.ts ~ line 72 ~ balanceInWei minus fee', balanceInWei);

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimals, ROUND_DOWN);

  return balance;
};

export const getAccountTrasactions = async (
  address: string,
  type = TxTypes.HistoryTxType.All,
  page?: number,
): Promise<TxTypes.ParsedTxData> => {
  // console.log('Types.HistoryTxType.Transfer', TxTypes.HistoryTxType.Transfer); // 0
  // console.log('Types.TxMsgTypes.Send', TxTypes.TxMsgTypes.Send); // cosmos-sdk/MsgSend
  const txType = TxTypes.TxMsgTypesMap.get(type) || TxTypes.TxMsgTypes.SdsAll; //  cosmos-sdk/MsgSend
  const txListResult = await getTxList(address, txType, page);

  const { response } = txListResult;

  if (!response) {
    throw new Error('Could not fetch tx history');
  }

  const { data, total } = response;

  const parsedData: TxTypes.ParsedTxItem[] = data.map(txItem => {
    const block = _get(txItem, 'block_height', '') as string;

    // const hash = _get(txItem, 'tx_hash', '');
    const hash = _get(txItem, 'tx_info.tx_hash', '');

    // const time = _get(txItem, 'time', '');
    const time = _get(txItem, 'tx_info.time', '');

    // const sender = _get(txItem, 'transaction_data.txData.sender', '') as string;
    const sender = _get(txItem, 'tx_info.transaction_data.txData.sender', '') as string;

    // const to = _get(txItem, 'transaction_data.txData.data.to', '') as string;
    const to = _get(txItem, 'tx_info.transaction_data.txData.data.to', '') as string;

    const validatorAddress = _get(
      txItem,
      'tx_info.transaction_data.txData.data.validator_address',
      '',
    ) as string;

    const txType = _get(txItem, 'tx_info.transaction_data.txType', '') as string;

    const amountValue = _get(txItem, 'tx_info.transaction_data.txData.data.amount[0].amount', '') as string;
    // const amountDenom = _get(txItem, 'tx_info.transaction_data.txData.data.amount[0].denom', '') as string;

    const delegationAmountValue = _get(
      txItem,
      'tx_info.transaction_data.txData.data.amount.amount',
      '',
    ) as string;
    // const delegationAmountDenom = _get(
    //   txItem,
    //   'tx_info.transaction_data.txData.data.amount.denom',
    //   '',
    // ) as string;

    const currentAmount = amountValue || delegationAmountValue || '0';

    const balanceInWei = createBigNumber(currentAmount);

    const txAmount = fromWei(balanceInWei, decimalPrecision).toFormat(4, ROUND_DOWN);

    const dd = new Date(time);

    return {
      to: to || validatorAddress,
      sender,
      type: TxTypes.TxHistoryTypesMap.get(txType) || TxTypes.HistoryTxType.All,
      txType,
      block: `${block}`,
      amount: `${txAmount} STOS`,
      time: dd.toLocaleString(),
      hash,
    };
  });

  const result = { data: parsedData, total, page: page || 1 };

  return result;
};
