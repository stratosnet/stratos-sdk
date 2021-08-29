import _get from 'lodash/get';
import { stratosDenom, stratosTopDenom } from '../config/hdVault';
import { decimalPrecision, decimalShortPrecision, standardFeeAmount } from '../config/tokens';
import {
  BigNumberValue,
  create as createBigNumber,
  fromWei,
  plus as plusBigNumber,
  ROUND_DOWN,
} from '../services/bigNumber';
import { getCosmos } from '../services/cosmos';
import {
  getAvailableBalance,
  getDelegatedBalance,
  getRewardBalance,
  getTxList,
  getUnboundingBalance,
  networkTypes,
} from '../services/network';
import * as TxTypes from '../transactions/types';
import * as Types from './types';

export interface BalanceCardMetrics {
  available: string;
  delegated: string;
  unbounding: string;
  reward: string;
}

export const getAccountsData = async (keyPairAddress: string): Promise<Types.AccountsData> => {
  try {
    const accountsData = await getCosmos().getAccounts(keyPairAddress);
    // console.log('accountsData!', accountsData);
    return accountsData;
  } catch (err) {
    console.log('Could not get accounts', (err as Error).message);
    throw err;
  }
};

export const getBalance = async (
  keyPairAddress: string,
  requestedDenom: string,
  decimals = decimalShortPrecision,
): Promise<string> => {
  const accountsData = await getAccountsData(keyPairAddress);

  const coins = _get(accountsData, 'result.value.coins', []) as TxTypes.AmountType[];

  const coin = coins.find(item => item.denom === requestedDenom);

  const currentBalance = coin?.amount || '0';

  const balanceInWei = createBigNumber(currentBalance);

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimals, ROUND_DOWN);

  return balance;
};

export const formatBalanceFromWei = (amount: string, requiredPrecision: number, appendDenom = false) => {
  const balanceInWei = createBigNumber(amount);

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(requiredPrecision, ROUND_DOWN);

  if (!appendDenom) {
    return balance;
  }
  const fullBalance = `${balance} ${stratosTopDenom.toUpperCase()}`;

  return fullBalance;
};

export const getBalanceCardMetrics = async (keyPairAddress: string): Promise<BalanceCardMetrics> => {
  const cardMetricsResult = {
    available: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    delegated: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    unbounding: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    reward: `0.0000 ${stratosTopDenom.toUpperCase()}`,
  };

  const availableBalanceResult = await getAvailableBalance(keyPairAddress);

  const { response: availableBalanceResponse, error: availableBalanceError } = availableBalanceResult;

  if (!availableBalanceError) {
    const amount = availableBalanceResponse?.result?.[0]?.amount;
    const denom = availableBalanceResponse?.result?.[0]?.denom;

    if (denom === stratosDenom && amount) {
      const balanceInWei = createBigNumber(amount);

      const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimalShortPrecision, ROUND_DOWN);
      cardMetricsResult.available = `${balance} ${stratosTopDenom.toUpperCase()}`;
    }
  }

  const delegatedBalanceResult = await getDelegatedBalance(keyPairAddress);

  const { response: delegatedBalanceResponse, error: delegatedBalanceError } = delegatedBalanceResult;

  if (!delegatedBalanceError) {
    const amount = delegatedBalanceResponse?.result?.[0]?.balance?.amount;
    const denom = delegatedBalanceResponse?.result?.[0]?.balance?.denom;

    if (denom === stratosDenom && amount) {
      const balanceInWei = createBigNumber(amount);

      const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimalShortPrecision, ROUND_DOWN);
      cardMetricsResult.delegated = `${balance} ${stratosTopDenom.toUpperCase()}`;
    }
  }

  const unboundingBalanceResult = await getUnboundingBalance(keyPairAddress);

  const { response: unboundingBalanceResponse, error: unboundingBalanceError } = unboundingBalanceResult;

  if (!unboundingBalanceError) {
    const entries = unboundingBalanceResponse?.result?.[0]?.entries;

    const amountInWei = entries?.reduce((acc: BigNumberValue, entry: networkTypes.UnboundingEntry) => {
      const balanceInWei = createBigNumber(entry.balance);

      return plusBigNumber(acc, balanceInWei);
    }, 0);

    if (amountInWei) {
      const balance = fromWei(amountInWei, decimalPrecision).toFormat(decimalShortPrecision, ROUND_DOWN);
      cardMetricsResult.unbounding = `${balance} ${stratosTopDenom.toUpperCase()}`;
    }
  }

  const rewardBalanceResult = await getRewardBalance(keyPairAddress);

  const { response: rewardBalanceResponse, error: rewardBalanceError } = rewardBalanceResult;

  if (!rewardBalanceError) {
    const amount = rewardBalanceResponse?.result?.total?.[0]?.amount;
    const denom = rewardBalanceResponse?.result?.total?.[0]?.denom;

    if (denom === stratosDenom && amount) {
      const balanceInWei = createBigNumber(amount);

      const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimalShortPrecision, ROUND_DOWN);
      cardMetricsResult.reward = `${balance} ${stratosTopDenom.toUpperCase()}`;
    }
  }

  return cardMetricsResult;
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

    const hash = _get(txItem, 'tx_info.tx_hash', '');

    const time = _get(txItem, 'tx_info.time', '');

    const sender = _get(txItem, 'tx_info.transaction_data.txData.sender', '') as string;

    const to = _get(txItem, 'tx_info.transaction_data.txData.data.to', '') as string;

    const originalTransactionData = _get(txItem, 'tx_info.transaction_data', {});

    const validatorAddress = _get(
      txItem,
      'tx_info.transaction_data.txData.data.validator_address',
      '',
    ) as string;

    const txType = _get(txItem, 'tx_info.transaction_data.txType', '') as string;

    const amountValue = _get(txItem, 'tx_info.transaction_data.txData.data.amount[0].amount', '') as string;

    const delegationAmountValue = _get(
      txItem,
      'tx_info.transaction_data.txData.data.amount.amount',
      '',
    ) as string;

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
      originalTransactionData,
    };
  });

  const result = { data: parsedData, total, page: page || 1 };

  return result;
};
