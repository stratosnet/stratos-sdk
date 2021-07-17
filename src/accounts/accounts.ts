import _get from 'lodash/get';
import { decimalPrecision, standardFeeAmount } from '../config/tokens';
import { create as createBigNumber, fromWei, ROUND_DOWN } from '../services/bigNumber';
import { getCosmos } from '../services/cosmos';
import { getTxList } from '../services/network';
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

  const coins = _get(accountsData, 'result.value.coins', []) as Types.AmountType[];

  const coin = coins.find(item => item.denom === requestedDenom);

  const currentBalance = coin?.amount || '0';

  const balanceInWei = createBigNumber(currentBalance);
  console.log('🚀 ~ file: accounts.ts ~ line 49 ~ balanceInWei', balanceInWei);

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimals, ROUND_DOWN);

  return balance;
};

export const getMaxAvailableBalance = async (
  keyPairAddress: string,
  requestedDenom: string,
  decimals = 4,
): Promise<string> => {
  const accountsData = await getAccountsData(keyPairAddress);

  const coins = _get(accountsData, 'result.value.coins', []) as Types.AmountType[];

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
