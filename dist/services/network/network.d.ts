import * as Types from './types';
export declare const apiPostLegacy: (url: string, data?: Types.ParsedTransactionData | undefined, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.NetworkAxiosDataResult>;
export declare const apiPost: (url: string, data?: Types.ParsedTransactionData | undefined, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.NetworkAxiosDataResult>;
export declare const apiGet: (url: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.NetworkAxiosDataResult>;
export declare const sendRpcCall: <N>(givenPayload: N, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.NetworkAxiosDataResult>;
export declare const getAccountsData: (address: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.CosmosAccountsDataResult>;
export declare const getAccountBalance: (address: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.CosmosAccountBalanceDataResult>;
export declare const getStakingValidators: (address: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.AccountsDataResult>;
export declare const getSubmitTransactionData: <T extends string>(data?: T | undefined) => Types.DataResult;
export declare const submitTransaction: <T extends string>(delegatorAddr: string, data?: T | undefined, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.SubmitTransactionDataResult>;
export declare const getTxListBlockchain: (address: string, type: string, page?: number, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.RestTxListDataResult>;
/**
 * @param address
 * @deprecated
 * @param type
 * @param page
 * @param config
 * @returns
 */
export declare const getTxList: (address: string, type: string, page?: number, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.ExplorerTxListDataResult>;
export declare const getValidatorsList: (status: string, page?: number, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.ValidatorListDataResult>;
export declare const getValidatorsBondedToDelegatorList: (status: string, delegatorAddress: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.ValidatorListDataResult>;
export declare const getValidator: (address: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.ValidatorDataResult>;
export declare const getStakingPool: (config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.StakingPoolDataResult>;
export declare const getAvailableBalance: (address: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.AvailableBalanceDataResult>;
export declare const getDelegatedBalance: (delegatorAddr: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.DelegatedBalanceDataResult>;
export declare const getUnboundingBalance: (delegatorAddr: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.UnboundingBalanceDataResult>;
export declare const getRewardBalance: (delegatorAddr: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.RewardBalanceDataResult>;
export declare const requestBalanceIncrease: (walletAddress: string, faucetUrl: string, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.SubmitTransactionDataResult>;
export declare const getRpcStatus: (config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.RpcStatusDataResult>;
export declare const uploadFile: (config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.RpcStatusDataResult>;
export declare const getRpcPayload: <T>(msgId: number, method: string, extraParams?: T | undefined) => {
    id: number;
    method: string;
    params: T | undefined;
};
export declare const sendUserRequestList: (extraParams: Types.FileUserRequestListParams[], config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.FileUserRequestResult<Types.FileUserRequestListResponse>>;
export declare const sendUserRequestUpload: (extraParams: Types.FileUserRequestUploadParams[], config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.FileUserRequestResult<Types.FileUserRequestUploadResponse>>;
export declare const sendUserRequestGetOzone: (extraParams: Types.FileUserRequestGetOzoneParams[], config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.FileUserRequestResult<Types.FileUserRequestGetOzoneResponse>>;
export declare const sendUserUploadData: (extraParams: Types.FileUserUploadDataParams, config?: Types.NetworkAxiosConfig | undefined) => Promise<Types.FileUserRequestResult<Types.FileUserUploadDataResponse>>;
export declare const getChainId: () => Promise<string | undefined>;
