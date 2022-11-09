import _get from 'lodash/get';
import { hdVault } from '../config';
import { stratosDenom, stratosOzDenom, stratosTopDenom, stratosUozDenom } from '../config/hdVault';
import { decimalPrecision, decimalShortPrecision, standardFeeAmount } from '../config/tokens';
import {
  BigNumberValue,
  create as createBigNumber,
  fromWei,
  plus as plusBigNumber,
  ROUND_DOWN,
} from '../services/bigNumber';
import {
  getAccountBalance as getBalancesDataFromNetwork,
  getAccountsData as getAccountsDataFromNetwork,
  getAvailableBalance,
  getDelegatedBalance,
  getRewardBalance,
  getTxListBlockchain,
  getUnboundingBalance,
  networkTypes,
  requestBalanceIncrease,
  sendUserRequestGetOzone,
} from '../services/network';
import { transformTx } from '../services/transformers/transactions';
import { FormattedBlockChainTx } from '../services/transformers/transactions/types';
import * as TxTypes from '../transactions/types';
import * as Types from './types';

export interface BalanceCardMetrics {
  available: string;
  delegated: string;
  unbounding: string;
  reward: string;
  ozone: string;
  detailedBalance?: any;
}

export const increaseBalance = async (walletAddress: string, faucetUrl: string, denom?: string) => {
  try {
    const result = await requestBalanceIncrease(walletAddress, faucetUrl, denom);

    const { error: faucetError } = result;

    if (faucetError) {
      return { result: false, errorMessage: `Could not increase balance: Error: "${faucetError.message}"` };
    }

    console.log('🚀 ~ file: accounts.ts ~ line 45 ~ increaseBalance ~ result', result);
  } catch (error) {
    console.log('Error: Faucet returns:', (error as Error).message);
    return {
      result: false,
      errorMessage: `Could not increase balance: Error: "${(error as Error).message}"`,
    };
  }
  return { result: true };
};

export const getBalance = async (
  keyPairAddress: string,
  requestedDenom: string,
  decimals = decimalShortPrecision,
): Promise<string> => {
  const accountBalanceData = await getBalancesDataFromNetwork(keyPairAddress);

  const coins = _get(accountBalanceData, 'response.balances', []) as TxTypes.AmountType[];

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

export const getBalanceCardMetricValue = (denom?: string | undefined, amount?: string | undefined) => {
  const isStratosDenom = denom === stratosDenom;

  if (!isStratosDenom) {
    return '0.0000 STOS';
  }
  if (!amount) {
    return '0.0000 STOS';
  }
  const balanceInWei = createBigNumber(amount);

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimalShortPrecision, ROUND_DOWN);
  const balanceToReturn = `${balance} ${stratosTopDenom.toUpperCase()}`;
  return balanceToReturn;
};

// @todo merge with get balance card value
export const getOzoneMetricValue = (denom?: string | undefined, amount?: string | undefined) => {
  const isStratosDenom = denom === stratosUozDenom;

  const printableDenome = stratosOzDenom.toUpperCase();

  if (!isStratosDenom) {
    return `0.0000 ${printableDenome}`;
  }
  if (!amount) {
    return `0.0000 ${printableDenome}`;
  }

  const balanceInWei = createBigNumber(amount);

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimalShortPrecision, ROUND_DOWN);
  const balanceToReturn = `${balance} ${printableDenome}`;
  return balanceToReturn;
};

export const getBalanceCardMetrics = async (keyPairAddress: string): Promise<BalanceCardMetrics> => {
  const cardMetricsResult = {
    available: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    delegated: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    unbounding: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    reward: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    ozone: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    detailedBalance: {},
  };

  const detailedBalance: { [key: string]: any } = {
    delegated: {},
    reward: {},
    ozone: '',
  };

  const availableBalanceResult = await getAvailableBalance(keyPairAddress);

  const { response: availableBalanceResponse, error: availableBalanceError } = availableBalanceResult;

  if (!availableBalanceError) {
    const amount = availableBalanceResponse?.result?.[0]?.amount;
    const denom = availableBalanceResponse?.result?.[0]?.denom;

    cardMetricsResult.available = getBalanceCardMetricValue(denom, amount);
  }

  const delegatedBalanceResult = await getDelegatedBalance(keyPairAddress);

  const { response: delegatedBalanceResponse, error: delegatedBalanceError } = delegatedBalanceResult;

  if (!delegatedBalanceError) {
    const entries = delegatedBalanceResponse?.result;

    const amountInWei = entries?.reduce((acc: BigNumberValue, entry: networkTypes.DelegatedBalanceResult) => {
      const balanceInWei = createBigNumber(entry.balance.amount);
      const validatorAddress = entry.validator_address;
      const validatorBalance = getBalanceCardMetricValue(entry.balance.denom, entry.balance.amount);

      detailedBalance.delegated[validatorAddress] = validatorBalance;
      return plusBigNumber(acc, balanceInWei);
    }, 0);

    const myDelegated = getBalanceCardMetricValue(hdVault.stratosDenom, `${amountInWei || ''}`);

    cardMetricsResult.delegated = myDelegated;
  }

  const unboundingBalanceResult = await getUnboundingBalance(keyPairAddress);

  const { response: unboundingBalanceResponse, error: unboundingBalanceError } = unboundingBalanceResult;

  if (!unboundingBalanceError) {
    const entries = unboundingBalanceResponse?.result?.[0]?.entries;

    const amountInWei = entries?.reduce((acc: BigNumberValue, entry: networkTypes.UnboundingEntry) => {
      const balanceInWei = createBigNumber(entry.balance);

      return plusBigNumber(acc, balanceInWei);
    }, 0);

    cardMetricsResult.unbounding = getBalanceCardMetricValue(hdVault.stratosDenom, `${amountInWei || ''}`);
  }

  const rewardBalanceResult = await getRewardBalance(keyPairAddress);

  const { response: rewardBalanceResponse, error: rewardBalanceError } = rewardBalanceResult;

  if (!rewardBalanceError) {
    const entries = rewardBalanceResponse?.result?.rewards;

    const amount = rewardBalanceResponse?.result?.total?.[0]?.amount;
    const denom = rewardBalanceResponse?.result?.total?.[0]?.denom;

    entries?.forEach((entry: networkTypes.Rewards) => {
      const validatorAddress = entry.validator_address;
      const validatorBalance = entry.reward?.[0]?.amount || '0';

      detailedBalance.reward[validatorAddress] = validatorBalance;
    }, 0);

    cardMetricsResult.reward = getBalanceCardMetricValue(denom, amount);
  }

  // temporary disabling that
  try {
    const ozoneBalanceResult = await sendUserRequestGetOzone([{ walletaddr: keyPairAddress }]);

    const { response: ozoneBalanceRespone, error: ozoneBalanceError } = ozoneBalanceResult;

    if (!ozoneBalanceError) {
      const amount = ozoneBalanceRespone?.result.ozone;

      cardMetricsResult.ozone = getOzoneMetricValue(stratosUozDenom, amount);

      detailedBalance.ozone = amount;
    }
  } catch (error) {
    console.log('could not get ozone balance , error', error);
  }

  cardMetricsResult.detailedBalance = detailedBalance;

  return cardMetricsResult;
};

export const getMaxAvailableBalance = async (
  keyPairAddress: string,
  requestedDenom: string,
  decimals = 4,
): Promise<string> => {
  console.log('from max av balance');
  // const accountsData = await getAccountsData(keyPairAddress);

  const accountBalanceData = await getBalancesDataFromNetwork(keyPairAddress);
  // const coins = _get(accountsData, 'result.value.coins', []) as TxTypes.AmountType[];
  const coins = _get(accountBalanceData, 'response.balances', []) as TxTypes.AmountType[];

  const coin = coins.find(item => item.denom === requestedDenom);

  const currentBalance = coin?.amount || '0';

  const feeAmount = createBigNumber(standardFeeAmount);
  const balanceInWei = createBigNumber(currentBalance);

  if (balanceInWei.gt(0)) {
    const balance = fromWei(balanceInWei.minus(feeAmount), decimalPrecision).toFormat(decimals, ROUND_DOWN);
    return balance;
  }

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimals, ROUND_DOWN);

  return balance;
};

export const getAccountTrasactions = async (
  address: string,
  type = TxTypes.HistoryTxType.All,
  page?: number,
): Promise<TxTypes.ParsedTxData> => {
  // const txType = TxTypes.TxMsgTypesMap.get(type) || TxTypes.TxMsgTypes.SdsAll; //  cosmos-sdk/MsgSend

  const txType = TxTypes.BlockChainTxMsgTypesMap.get(type) || '';

  // const txListResult = await getTxList(address, txType, page);
  const txListResult = await getTxListBlockchain(address, txType, page);
  // console.log('🚀 ~ file: accounts.ts ~ line 252 ~ txListResult', JSON.stringify(txListResult, null, 2));

  const { response, error } = txListResult;

  if (error) {
    throw new Error(`Could not fetch tx history. Details: "${error.message}"`);
  }

  if (!response) {
    throw new Error('Could not fetch tx history');
  }

  const parsedData: FormattedBlockChainTx[] = [];

  const { txs: data = [], total_count: total } = response;
  console.log('🚀 ~ file: accounts.ts ~ line 223 ~ response', response);

  data.forEach(txItem => {
    try {
      const parsed = transformTx(txItem);
      parsedData.push(parsed);
    } catch (err) {
      console.log(`Parsing error: ${(err as Error).message}`);
    }
  });

  const result = { data: parsedData, total, page: page || 1 };

  return result;
};
