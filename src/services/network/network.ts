import axios from 'axios';
import JSONbig from 'json-bigint';
import { network as newtorkConfig } from '../../config';
import * as Types from './types';

const getRestRoute = (): string => {
  const { lcdUrl, restPort } = newtorkConfig;

  const url = `${lcdUrl}:${restPort}`;

  return url;
};

const getExplorerRoute = (): string => {
  const { explorerUrl, explorerPort } = newtorkConfig;

  const url = `${explorerUrl}:${explorerPort}`;

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
    return { error: { message: err.message } };
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
    return { error: { message: err.message } };
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
    return { error: { message: `Can't submit transaction. Can't parse transaction data. ${err.message}` } };
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

  console.log('url!', url);
  console.log('txData', JSON.stringify(txData, null, 4));
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
  const url = `${getExplorerRoute()}/api/getRecentTx`;

  const dataResult = await apiGet(url, { ...config, params: { page, operation: type, address } });

  return dataResult;
};
