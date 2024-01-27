import _get from 'lodash/get';
import { hdVault } from '../config';
import { stratosTopDenom, stratosUozDenom } from '../config/hdVault';
import { decimalPrecision, decimalShortPrecision, standardFeeAmount } from '../config/tokens';
import * as ApiUtils from '../services/apiUtils';
import {
  BigNumberValue,
  create as createBigNumber,
  fromWei,
  plus as plusBigNumber,
  ROUND_DOWN,
} from '../services/bigNumber';
import {
  getAccountBalance as getBalancesDataFromNetwork, // getAccountsData as getAccountsDataFromNetwork,
  getAvailableBalance,
  getDelegatedBalance,
  getRewardBalance,
  getTxListBlockchain,
  getUnboundingBalance,
  networkTypes,
  requestBalanceIncrease,
  sendUserRequestGetOzone,
} from '../services/network';
import { type TxHistoryUserType, TxHistoryUser } from '../services/network/types';
import {
  getBalanceCardMetricDinamicValue,
  getBalanceCardMetricValue,
  getOzoneMetricValue,
} from '../services/transformers/balanceValues';
import { transformTx } from '../services/transformers/transactions';
import { FormattedBlockChainTx, ParsedTxData } from '../services/transformers/transactions/types';
import * as TxTypes from '../transactions/types';

export interface OtherBalanceCardMetrics {
  ozone?: string;
  detailedBalance?: any;
}

export interface BalanceCardMetrics {
  available: string;
  delegated: string;
  unbounding: string;
  reward: string;
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

export const getOtherBalanceCardMetrics = async (
  keyPairAddress: string,
): Promise<OtherBalanceCardMetrics> => {
  const cardMetricsResult = {
    ozone: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    detailedBalance: {},
  };

  const detailedBalance: { [key: string]: any } = {
    ozone: '',
    sequence: '',
  };

  try {
    const ozoneBalanceResult = await sendUserRequestGetOzone([{ walletaddr: keyPairAddress }]);

    const { response: ozoneBalanceRespone, error: ozoneBalanceError } = ozoneBalanceResult;

    if (!ozoneBalanceError) {
      const amount = ozoneBalanceRespone?.result.ozone;
      const sequence = ozoneBalanceRespone?.result.sequencynumber;

      cardMetricsResult.ozone = getOzoneMetricValue(stratosUozDenom, amount);

      detailedBalance.ozone = amount;
      detailedBalance.sequence = sequence;
    }
  } catch (error) {
    console.log('could not get ozone balance , error', error);
  }

  cardMetricsResult.detailedBalance = detailedBalance;

  return cardMetricsResult;
};

export const getBalanceCardMetrics = async (keyPairAddress: string): Promise<BalanceCardMetrics> => {
  const cardMetricsResult = {
    available: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    delegated: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    unbounding: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    reward: `0.0000 ${stratosTopDenom.toUpperCase()}`,
    detailedBalance: {},
  };

  const detailedBalance: { [key: string]: any } = {
    delegated: {},
    reward: {},
    unbounding: {},
  };

  const availableBalanceResult = await getAvailableBalance(keyPairAddress);

  const { response: availableBalanceResponse, error: availableBalanceError } = availableBalanceResult;

  if (!availableBalanceError && availableBalanceResponse) {
    if (ApiUtils.isNewBalanceVersion(availableBalanceResponse)) {
      const amount = availableBalanceResponse.balances?.[0]?.amount;
      const denom = availableBalanceResponse.balances?.[0]?.denom;
      cardMetricsResult.available = getBalanceCardMetricValue(denom, amount);
    }

    if (ApiUtils.isOldBalanceVersion(availableBalanceResponse)) {
      const amount = availableBalanceResponse.result?.[0]?.amount;
      const denom = availableBalanceResponse.result?.[0]?.denom;
      cardMetricsResult.available = getBalanceCardMetricValue(denom, amount);
    }
  }

  const delegatedBalanceResult = await getDelegatedBalance(keyPairAddress);

  const { response: delegatedBalanceResponse, error: delegatedBalanceError } = delegatedBalanceResult;

  if (!delegatedBalanceError) {
    const entries = delegatedBalanceResponse?.result;

    const amountInWei = entries?.reduce((acc: BigNumberValue, entry: networkTypes.DelegatedBalanceResult) => {
      const balanceInWei = createBigNumber(entry.balance.amount);
      const validatorAddress = entry.delegation?.validator_address;
      const validatorBalance = getBalanceCardMetricValue(entry.balance.denom, entry.balance.amount);

      // in stos
      detailedBalance.delegated[validatorAddress] = validatorBalance;
      return plusBigNumber(acc, balanceInWei);
    }, 0);

    const myDelegated = getBalanceCardMetricValue(hdVault.stratosDenom, `${amountInWei || ''}`);

    // in stos
    cardMetricsResult.delegated = myDelegated;
  }

  const unboundingBalanceResult = await getUnboundingBalance(keyPairAddress);

  const { response: unboundingBalanceResponse, error: unboundingBalanceError } = unboundingBalanceResult;

  if (!unboundingBalanceError) {
    const entries = unboundingBalanceResponse?.result;

    const amountInWeiA = entries?.reduce(
      (acc: BigNumberValue, entry: networkTypes.UnboundingBalanceResult) => {
        const balanceEntries = entry?.entries;

        const validatorAddress = entry.validator_address;

        const amountInWeiB = balanceEntries.reduce(
          (accInternal: BigNumberValue, entryInternal: networkTypes.UnboundingEntry) => {
            const balanceInWeiI = createBigNumber(entryInternal.balance);
            return plusBigNumber(accInternal, balanceInWeiI);
          },
          0,
        );

        const validatorBalance = getBalanceCardMetricValue(hdVault.stratosDenom, `${amountInWeiB}`);
        detailedBalance.unbounding[validatorAddress] = validatorBalance;
        return plusBigNumber(acc, amountInWeiB);
      },
      0,
    );
    const unboundingBalance = getBalanceCardMetricValue(hdVault.stratosDenom, `${amountInWeiA}`);
    cardMetricsResult.unbounding = unboundingBalance;
  }

  const rewardBalanceResult = await getRewardBalance(keyPairAddress);
  const { response: rewardBalanceResponse, error: rewardBalanceError } = rewardBalanceResult;

  if (!rewardBalanceError) {
    const entries = rewardBalanceResponse?.result?.rewards;

    const amount = rewardBalanceResponse?.result?.total?.[0]?.amount;
    const denom = rewardBalanceResponse?.result?.total?.[0]?.denom;

    entries?.forEach((entry: networkTypes.Rewards) => {
      const validatorAddress = entry.validator_address;
      // in wei
      const validatorBalance = entry.reward?.[0]?.amount || '0';

      // in wei
      detailedBalance.reward[validatorAddress] = validatorBalance;
    }, 0);

    // in stos
    cardMetricsResult.reward = getBalanceCardMetricDinamicValue(denom, amount);
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

  const feeAmount = createBigNumber(standardFeeAmount());
  const balanceInWei = createBigNumber(currentBalance);

  // NOTE: Do we need this?
  if (balanceInWei.gt(0)) {
    const balance = fromWei(balanceInWei.minus(feeAmount), decimalPrecision).toFormat(decimals, ROUND_DOWN);
    return balance;
  }

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimals, ROUND_DOWN);

  return balance;
};

export const getAccountSenderTrasactions = async (
  address: string,
  type = TxTypes.HistoryTxType.All,
  page = 1,
  pageLimit = 5,
): Promise<ParsedTxData> => {
  const txType = TxTypes.BlockChainTxMsgTypesMap.get(type) || '';

  const txListResult = await getTxListBlockchain(address, txType, page, pageLimit, 1);

  const { response, error } = txListResult;

  if (error) {
    throw new Error(`Could not fetch tx history. Details: "${error.message}"`);
  }

  if (!response) {
    throw new Error('Could not fetch tx history');
  }

  const parsedData: FormattedBlockChainTx[] = [];

  const { tx_responses: data = [], pagination } = response;
  const { total } = pagination;

  data.forEach(txResponseItem => {
    try {
      const parsed = transformTx(txResponseItem);
      parsedData.push(parsed);
    } catch (err) {
      console.log(`Parsing error: ${(err as Error).message}`);
    }
  });

  const totalUnformatted = parseInt(total) / pageLimit;
  const totalPages = Math.ceil(totalUnformatted);

  const result = { data: parsedData, total, page: page || 1, totalPages };

  // console.dir(result, { depth: null, colors: true, maxArrayLength: null });

  return result;
};

export const getAccountReceiverTrasactions = async (
  address: string,
  type = TxTypes.HistoryTxType.All,
  page = 1,
  pageLimit = 5,
): Promise<ParsedTxData> => {
  const txType = TxTypes.BlockChainTxMsgTypesMap.get(type) || '';

  const txListResult = await getTxListBlockchain(address, txType, page, pageLimit, 2);

  const { response, error } = txListResult;

  if (error) {
    throw new Error(`Could not fetch tx history. Details: "${error.message}"`);
  }

  if (!response) {
    throw new Error('Could not fetch tx history');
  }

  const parsedData: FormattedBlockChainTx[] = [];

  const { tx_responses: data = [], pagination } = response;
  const { total } = pagination;

  data.forEach(txResponseItem => {
    try {
      const parsed = transformTx(txResponseItem);
      parsedData.push(parsed);
    } catch (err) {
      console.log(`Parsing error: ${(err as Error).message}`);
    }
  });

  const totalUnformatted = parseInt(total) / pageLimit;
  const totalPages = Math.ceil(totalUnformatted);

  const result = { data: parsedData, total, page: page || 1, totalPages };

  return result;
};

export const getAccountTrasactions = async (
  address: string,
  type = TxTypes.HistoryTxType.All,
  page = 1,
  pageLimit = 5,
  userType: TxHistoryUserType = TxHistoryUser.TxHistorySenderUser,
): Promise<ParsedTxData> => {
  const txType = TxTypes.BlockChainTxMsgTypesMap.get(type) || '';

  const txListResult = await getTxListBlockchain(address, txType, page, pageLimit, userType);

  const { response, error } = txListResult;

  if (error) {
    throw new Error(`Could not fetch tx history. Details: "${error.message}"`);
  }

  if (!response) {
    throw new Error('Could not fetch tx history');
  }

  const parsedData: FormattedBlockChainTx[] = [];

  const { tx_responses: data = [], pagination } = response;
  const { total } = pagination;

  data.forEach(txResponseItem => {
    try {
      const parsed = transformTx(txResponseItem);
      parsedData.push(parsed);
    } catch (err) {
      console.log(`Parsing error: ${(err as Error).message}`);
    }
  });

  const totalUnformatted = parseInt(total) / pageLimit;
  const totalPages = Math.ceil(totalUnformatted);

  const result = { data: parsedData, total, page: page || 1, totalPages };

  return result;
};
