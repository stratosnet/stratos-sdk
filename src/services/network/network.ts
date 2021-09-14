import axios from 'axios';
import JSONbig from 'json-bigint';
import Sdk from '../../Sdk';
import * as Types from './types';

const getRestRoute = (): string => {
  const { restUrl } = Sdk.environment;

  return restUrl;
};

const getExplorerRoute = (): string => {
  const { explorerUrl } = Sdk.environment;

  const url = `${explorerUrl}`;

  return url;
};

export const apiPost = async (
  url: string,
  data?: Types.ParsedTransactionData,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.NetworkAxiosDataResult> => {
  let axiosResponse;

  try {
    axiosResponse = await axios.post(url, data, config);
  } catch (err) {
    return { error: { message: (err as Error).message } };
  }

  try {
    const myResponse = JSONbig({ useNativeBigInt: true }).parse(axiosResponse.data);
    return { response: myResponse };
  } catch (_) {
    return { response: axiosResponse.data };
  }
};

export const apiGet = async (
  url: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.NetworkAxiosDataResult> => {
  let axiosResponse;

  try {
    axiosResponse = await axios.get(url, config);
  } catch (err) {
    return { error: { message: (err as Error).message } };
  }

  try {
    const myResponse = JSONbig({ useNativeBigInt: true }).parse(axiosResponse.data);
    return { response: myResponse };
  } catch (_) {
    return { response: axiosResponse.data };
  }
};

export const getAccountsData = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AccountsDataResult> => {
  const url = `${getRestRoute()}/auth/acconts/${address}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getStakingValidators = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AccountsDataResult> => {
  const url = `${getRestRoute()}/auth/acconts/${address}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getSubmitTransactionData = <T extends Types.TransactionData>(data?: T): Types.DataResult => {
  let txData;

  if (!data) {
    return { response: txData };
  }

  try {
    txData = JSONbig.parse(data);
    return { response: txData };
  } catch (err) {
    return {
      error: { message: `Can't submit transaction. Can't parse transaction data. ${(err as Error).message}` },
    };
  }
};

export const submitTransaction = async <T extends Types.TransactionData>(
  delegatorAddr: string,
  data?: T,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.SubmitTransactionDataResult> => {
  // @todo - move it to submitDelegate
  const url = `${getRestRoute()}/staking/delegators/${delegatorAddr}/delegations`;

  const { response: txData, error } = getSubmitTransactionData(data);

  if (error) {
    return { error };
  }

  const dataResult = await apiPost(url, txData, config);

  return dataResult;
};

export const getTxList = async (
  address: string,
  type: string,
  page = 1,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.ExplorerTxListDataResult> => {
  // const url = `${getExplorerRoute()}/api/activeAccont/`; // page 1
  // const url = `${getExplorerRoute()}/api/queryBlock/rand=9.56503971&height=1`;
  // const url = `${getExplorerRoute()}/api/cleanup`;
  const url = `${getExplorerRoute()}/api/getAccountHistory`;

  const params: { page: number; account: string; limit: number; operation?: string } = {
    page,
    account: address,
    limit: 5,
  };
  // console.log('🚀 ~ file: network.ts ~ line 129 ~ params', params);

  if (type) {
    params.operation = type;
  }

  const dataResult = await apiGet(url, {
    ...config,
    params,
  });

  // https://explorer-test.thestratos.org/api/getAccountHistory?account=st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6&limit=2&operation=cosmos-sdk/MsgSend
  return dataResult;
};

export const getValidatorsList = async (
  status: string,
  page = 1,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.ValidatorListDataResult> => {
  const url = `${getRestRoute()}/staking/validators`;

  const dataResult = await apiGet(url, { ...config, params: { page, status } });

  return dataResult;
};

export const getValidatorsBondedToDelegatorList = async (
  status: string,
  delegatorAddress: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.ValidatorListDataResult> => {
  const url = `${getRestRoute()}/staking/delegators/${delegatorAddress}/validators`;

  const dataResult = await apiGet(url, { ...config, params: { status } });

  return dataResult;
};

export const getValidator = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.ValidatorDataResult> => {
  const url = `${getRestRoute()}/staking/validators/${address}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getStakingPool = async (
  config?: Types.NetworkAxiosConfig,
): Promise<Types.StakingPoolDataResult> => {
  const url = `${getRestRoute()}/staking/pool`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getAvailableBalance = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AvailableBalanceDataResult> => {
  const url = `${getRestRoute()}/bank/balances/${address}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getDelegatedBalance = async (
  delegatorAddr: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.DelegatedBalanceDataResult> => {
  const url = `${getRestRoute()}/staking/delegators/${delegatorAddr}/delegations`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getUnboundingBalance = async (
  delegatorAddr: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.UnboundingBalanceDataResult> => {
  const url = `${getRestRoute()}/staking/delegators/${delegatorAddr}/unbonding_delegations`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getRewardBalance = async (
  delegatorAddr: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.RewardBalanceDataResult> => {
  const url = `${getRestRoute()}/distribution/delegators/${delegatorAddr}/rewards`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const requestBalanceIncrease = async (
  walletAddress: string,
  faucetUrl: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.SubmitTransactionDataResult> => {
  const url = `${faucetUrl}/${walletAddress}`;
  const dataResult = await apiPost(url, {}, config);

  return dataResult;
};
