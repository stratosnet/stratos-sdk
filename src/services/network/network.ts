// import { fromBase64, fromHex, toAscii, toBase64, toBech32, toHex } from '@cosmjs/encoding';
// import { fromBase64, fromHex, toBase64, toBech32, toHex, fromBech32 } from '@cosmjs/encoding';
import axios from 'axios';
import JSONbig from 'json-bigint';
import qs from 'qs';
import { hdVault, options } from '../../config';
import Sdk from '../../Sdk';
import { log, dirLog, getNewProtocolFlag } from '../../services/helpers';
import * as Types from './types';
import { TxHistoryUser } from './types';

const _axios = axios.create({});

_axios.defaults.transformResponse = [
  data => {
    try {
      return JSONbig({ useNativeBigInt: true }).parse(data);
    } catch (_) {
      return data;
    }
  },
];

const getRestRoute = (): string => {
  const { restUrl } = Sdk.environment;

  return restUrl;
};

const getRpcRoute = (): string => {
  const { rpcUrl } = Sdk.environment;

  return rpcUrl;
};

const getPpNodeRoute = (): string => {
  const { ppNodeUrl, ppNodePort } = Sdk.environment;

  if (!ppNodeUrl || !ppNodePort) {
    throw new Error(
      'SDK must be initialized with pp node url and port prior to use the getPpNodeRoute function',
    );
  }

  return `${ppNodeUrl}:${ppNodePort}`;
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
  const myConfig = {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    // timeout: 31000,
    // timeout: 31000,
  };

  let axiosResponse;

  try {
    axiosResponse = await _axios.post(url, data, { ...config, ...myConfig });
  } catch (err) {
    const e: Error = err as Error;
    return { error: { message: e.message } };
  }
  try {
    const myResponse = axiosResponse.data;
    return { response: myResponse };
  } catch (err) {
    const e: Error = err as Error;

    return { error: { message: e.message } };
  }
};

export const apiGet = async (
  url: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.NetworkAxiosDataResult> => {
  let axiosResponse;

  const myParamsSerializer = function (params: unknown[]) {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  };

  const myConfig = { ...config, paramsSerializer: myParamsSerializer };

  try {
    axiosResponse = await _axios.get(url, myConfig);
  } catch (err) {
    return { error: { message: (err as Error).message } };
  }

  try {
    const myResponse = axiosResponse.data;
    return { response: myResponse };
  } catch (_) {
    return { response: axiosResponse.data };
  }
};

export const sendRpcCall = async <N>(
  givenPayload: N,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.NetworkAxiosDataResult> => {
  const defaultPayload = {
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_protocolVersion',
    params: [],
  };
  const url = `${getPpNodeRoute()}`;

  const payload = { ...defaultPayload, ...givenPayload };

  log('from network ~ rpc call url', url);
  const dataResult = await apiPost(url, payload, { ...config });

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
  console.log('url to broadcast the tx (POST)');

  const { response: txData, error } = getSubmitTransactionData(data);

  if (error) {
    return { error };
  }

  console.log('tx data to broadcast', txData);

  const dataResult = await apiPost(url, txData, config);
  console.log('dataResult after the broadcast', dataResult);

  return dataResult;
};

// done
export const getTxListBlockchain = async (
  address: string,
  type: string,
  givenPage = 1,
  pageLimit = 5,
  userType: Types.TxHistoryUserType = TxHistoryUser.TxHistorySenderUser,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.RestTxHistoryDataResult> => {
  const url = `${getRestRoute()}/cosmos/tx/v1beta1/txs`;
  console.log('url', url);
  console.log('given page', givenPage, pageLimit);

  const userQueryType =
    userType === TxHistoryUser.TxHistorySenderUser
      ? `message.sender='${address}'`
      : `transfer.recipient='${address}'`;

  const givenEvents = [userQueryType];

  if (type) {
    const msgTypeActionParameter = `message.action='${type}'`;
    givenEvents.push(msgTypeActionParameter);
  }

  const offset = (givenPage - 1) * pageLimit + 1;

  const params = {
    events: givenEvents,
    'pagination.limit': pageLimit,
    'pagination.offset': offset,
    'pagination.count_total': true,
    order_by: 'ORDER_BY_DESC',
  };

  const dataResult = await apiGet(url, {
    ...config,
    params,
  });
  console.log('TxHistory data result ', dataResult);

  return dataResult;
};

// done
export const getValidatorsList = async (
  status: string,
  page = 1,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.ValidatorListDataResult> => {
  const url = `${getRestRoute()}/cosmos/staking/v1beta1/validators`;

  const dataResult = await apiGet(url, { ...config, params: { page, status } });

  return dataResult;
};

// done
export const getValidatorsBondedToDelegatorList = async (
  status: string,
  delegatorAddress: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.ValidatorListDataResult> => {
  const url = `${getRestRoute()}/cosmos/staking/v1beta1/delegators/${delegatorAddress}/validators`;

  const dataResult = await apiGet(url, { ...config, params: { status } });

  return dataResult;
};

// done
export const getValidator = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.ValidatorDataResult> => {
  const url = `${getRestRoute()}/cosmos/staking/v1beta1/validators/${address}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

// done
export const getStakingPool = async (
  config?: Types.NetworkAxiosConfig,
): Promise<Types.StakingPoolDataResult> => {
  const url = `${getRestRoute()}/cosmos/staking/v1beta1/pool`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

// done
export const getAvailableBalance_n = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AvailableBalanceDataResultN> => {
  const url = `${getRestRoute()}/cosmos/bank/v1beta1/balances/${address}`;
  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getAvailableBalance = async (
  address: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.AvailableBalanceDataResult> => {
  // we can support different variations of methods which depend on isNewProtocol flag
  // see getChainAndProtocolDetails methods for more details
  // const isNewProtocol = !!Sdk.environment.isNewProtocol;
  // console.log('getAvailableBalance  isNewProtocol', isNewProtocol);

  // if (isNewProtocol) {
  // return getAvailableBalance_n(address, config);
  // }

  // return getAvailableBalance_o(address, config);

  return getAvailableBalance_n(address, config);
};

// done
export const getDelegatedBalance = async (
  delegatorAddr: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.DelegatedBalanceDataResult> => {
  // const url = `${getRestRoute()}/staking/delegators/${delegatorAddr}/delegations`;
  const url = `${getRestRoute()}/cosmos/staking/v1beta1/delegations/${delegatorAddr}`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

// done
export const getUnboundingBalance = async (
  delegatorAddr: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.UnboundingBalanceDataResult> => {
  // const url = `${getRestRoute()}/staking/delegators/${delegatorAddr}/unbonding_delegations`;
  const url = `${getRestRoute()}/cosmos/staking/v1beta1/delegators/${delegatorAddr}/unbonding_delegations`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

// done
export const getRewardBalance = async (
  delegatorAddr: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.RewardBalanceDataResult> => {
  const url = `${getRestRoute()}/cosmos/distribution/v1beta1/delegators/${delegatorAddr}/rewards`;

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const requestBalanceIncrease = async (
  walletAddress: string,
  faucetUrl: string,
  denom = hdVault.stratosDenom, // ustos and now wei
  config?: Types.NetworkAxiosConfig,
): Promise<Types.SubmitTransactionDataResult> => {
  const url = `${faucetUrl}`;

  const payload = {
    denom,
    address: walletAddress.trim(),
  };
  const dataResult = await apiPost(url, payload, config);

  return dataResult;
};

export const getRpcStatus = async (config?: Types.NetworkAxiosConfig): Promise<Types.RpcStatusDataResult> => {
  const url = `${getRpcRoute()}/status`;
  log('rpc status url ', url);

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const uploadFile = async (config?: Types.NetworkAxiosConfig): Promise<Types.RpcStatusDataResult> => {
  const url = `${getRpcRoute()}/status`;

  console.log('🚀 !~ file: network.ts ~ line 321 ~ getRpcStatus ~ url', url);

  const dataResult = await apiGet(url, config);

  return dataResult;
};

export const getRpcPayload = <T>(msgId: number, method: string, extraParams?: T) => {
  const payload = {
    id: msgId,
    method,
    params: extraParams,
  };

  return payload;
};

export const sendUserRequestList = async (
  extraParams: Types.FileUserRequestListParams[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserRequestListResponse>> => {
  const msgId = 1;
  const method = 'user_requestList';

  const payload = getRpcPayload<Types.FileUserRequestListParams[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserRequestUpload = async (
  extraParams: Types.FileUserRequestUploadParams[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserRequestUploadResponse>> => {
  const msgId = 1;
  const method = 'user_requestUpload';

  const payload = getRpcPayload<Types.FileUserRequestUploadParams[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserRequestDownload = async (
  extraParams: Types.FileUserRequestDownloadParams[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserRequestDownloadResponse>> => {
  const msgId = 1;
  const method = 'user_requestDownload';

  const payload = getRpcPayload<Types.FileUserRequestDownloadParams[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserDownloadData = async (
  extraParams: Types.FileUserDownloadDataParams[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserDownloadDataResponse>> => {
  const msgId = 1;
  const method = 'user_downloadData';

  const payload = getRpcPayload<Types.FileUserDownloadDataParams[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserDownloadedFileInfo = async (
  extraParams: Types.FileUserDownloadedFileInfoParams[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserDownloadedFileInfoResponse>> => {
  const msgId = 1;
  const method = 'user_downloadedFileInfo';

  const payload = getRpcPayload<Types.FileUserDownloadedFileInfoParams[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserRequestGetOzone = async (
  extraParams: Types.FileUserRequestGetOzoneParams[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserRequestGetOzoneResponse>> => {
  const msgId = 1;
  const method = 'user_requestGetOzone';

  const payload = getRpcPayload<typeof extraParams>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserUploadData = async (
  extraParams: Types.FileUserUploadDataParams[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserUploadDataResponse>> => {
  const msgId = 1;
  const method = 'user_uploadData';

  const payload = getRpcPayload<Types.FileUserUploadDataParams[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserRequestShare = async <T = Types.FileUserRequestShareParams>(
  extraParams: T[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserRequestShareResponse>> => {
  const msgId = 1;
  const method = 'user_requestShare';

  const payload = getRpcPayload<T[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserRequestListShare = async <T = Types.FileUserRequestListShareParams>(
  extraParams: T[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserRequestListShareResponse>> => {
  const msgId = 1;
  const method = 'user_requestListShare';

  const payload = getRpcPayload<T[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserRequestStopShare = async <T = Types.FileUserRequestStopShareParams>(
  extraParams: T[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserRequestStopShareResponse>> => {
  const msgId = 1;
  const method = 'user_requestStopShare';

  const payload = getRpcPayload<T[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserRequestGetShared = async <T = Types.FileUserRequestGetSharedParams>(
  extraParams: T[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserRequestGetSharedResponse>> => {
  const msgId = 1;
  const method = 'user_requestGetShared';

  const payload = getRpcPayload<T[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserRequestDownloadShared = async <T = Types.FileUserRequestDownloadSharedParams>(
  extraParams: T[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserRequestDownloadSharedResponse>> => {
  const msgId = 1;
  const method = 'user_requestDownloadShared';

  const payload = getRpcPayload<T[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const sendUserRequestGetFileStatus = async <T = Types.FileUserRequestGetFileStatusParams>(
  extraParams: T[],
  config?: Types.NetworkAxiosConfig,
): Promise<Types.FileUserRequestResult<Types.FileUserRequestGetFileStatusResponse>> => {
  const msgId = 1;
  const method = 'user_getFileStatus';

  const payload = getRpcPayload<T[]>(msgId, method, extraParams);

  const dataResult = await sendRpcCall<typeof payload>(payload, config);

  return dataResult;
};

export const getChainId = async () => {
  const result = await getRpcStatus();

  const { response } = result;
  const chainId = response?.result?.node_info?.network;

  return chainId;
};

export const getNodeProtocolVersion = async () => {
  const result = await getRpcStatus();

  const { response } = result;
  const version = response?.result?.node_info?.version;

  return version;
};

export const getChainAndProtocolDetails = async () => {
  let resolvedChainID: string;
  let resolvedChainVersion: string;
  let isNewProtocol = false;
  try {
    const resolvedChainIDToTest = await getChainId();

    if (!resolvedChainIDToTest) {
      throw new Error('Chain id is empty. Exiting');
    }

    resolvedChainID = resolvedChainIDToTest;

    const resolvedChainVersionToTest = await getNodeProtocolVersion();

    if (!resolvedChainVersionToTest) {
      throw new Error('Protocol version id is empty. Exiting');
    }

    resolvedChainVersion = resolvedChainVersionToTest;

    console.log('🚀 ~ file: network ~ resolvedChainIDToTest', resolvedChainIDToTest);

    const { MIN_NEW_PROTOCOL_VERSION } = options;

    isNewProtocol = getNewProtocolFlag(resolvedChainVersion, MIN_NEW_PROTOCOL_VERSION);
  } catch (error) {
    console.log('🚀 ~ file: network ~ resolvedChainID error', error);
    throw new Error('Could not resolve chain id');
  }

  return {
    resolvedChainID,
    resolvedChainVersion,
    isNewProtocol,
  };
};

/**
 * @deprecated
 */
// export const apiPostLegacy = async (
//   url: string,
//   data?: Types.ParsedTransactionData,
//   config?: Types.NetworkAxiosConfig,
// ): Promise<Types.NetworkAxiosDataResult> => {
//   let axiosResponse;
//
//   try {
//     axiosResponse = await _axios.post(url, data, config);
//   } catch (err) {
//     return { error: { message: (err as Error).message } };
//   }
//
//   try {
//     const myResponse = axiosResponse.data;
//     return { response: myResponse };
//   } catch (_) {
//     return { response: axiosResponse.data };
//   }
// };

/**
 * @deprecated
 */
// export const getAccountsData = async (
//   address: string,
//   config?: Types.NetworkAxiosConfig,
// ): Promise<Types.CosmosAccountsDataResult> => {
//   const url = `${getRestRoute()}/cosmos/auth/v1beta1/accounts/${address}`;
//
//   const dataResult = await apiGet(url, config);
//
//   return dataResult;
// };

/**
 * @deprecated
 */
// export const getStakingValidators = async (
//   address: string,
//   config?: Types.NetworkAxiosConfig,
// ): Promise<Types.AccountsDataResult> => {
//   const url = `${getRestRoute()}/auth/acconts/${address}`;
//
//   const dataResult = await apiGet(url, config);
//
//   return dataResult;
// };

/**
 * @deprecated
 * but still in use
 */
// export const getAvailableBalance_o = async (
//   address: string,
//   config?: Types.NetworkAxiosConfig,
// ): Promise<Types.AvailableBalanceDataResultO> => {
//   const url = `${getRestRoute()}/bank/balances/${address}`;
//   console.log('url', url);
//
//   const dataResult = await apiGet(url, config);
//   console.log(
//     '🚀 ~ file: network.ts ~ line 356 ~ getAvailableBalance dataResult',
//     JSON.stringify(dataResult),
//   );
//
//   return dataResult;
// };

// export const getAccountBalance = async (
//   address: string,
//   config?: Types.NetworkAxiosConfig,
// ): Promise<Types.CosmosAccountBalanceDataResult> => {
//   const url = `${getRestRoute()}/cosmos/bank/v1beta1/balances/${address}`;
//
//   const dataResult = await apiGet(url, config);
//
//   return dataResult;
// };

/**
 * @deprecated
 */
// export const getTxList = async (
//   address: string,
//   type: string,
//   page = 1,
//   config?: Types.NetworkAxiosConfig,
// ): Promise<Types.ExplorerTxListDataResult> => {
//   const url = `${getExplorerRoute()}/api/getAccountHistory`;
//   console.log('url 1', url);
//
//   const params: { page: number; account: string; limit: number; operation?: string } = {
//     page,
//     account: address,
//     limit: 5,
//   };
//
//   if (type) {
//     params.operation = type;
//   }
//
//   const dataResult = await apiGet(url, {
//     ...config,
//     params,
//   });
//
//   // https://explorer-test.thestratos.org/api/getAccountHistory?account=st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6&limit=2&operation=cosmos-sdk/MsgSend
//   return dataResult;
// };
