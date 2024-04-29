[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](network.md) / networkApi

# Namespace: networkApi

[network](network.md).networkApi

## Table of contents

### Functions

- [apiGet](network.networkApi.md#apiget)
- [apiPost](network.networkApi.md#apipost)
- [getAvailableBalance](network.networkApi.md#getavailablebalance)
- [getAvailableBalance\_n](network.networkApi.md#getavailablebalance_n)
- [getChainAndProtocolDetails](network.networkApi.md#getchainandprotocoldetails)
- [getChainId](network.networkApi.md#getchainid)
- [getDelegatedBalance](network.networkApi.md#getdelegatedbalance)
- [getNodeProtocolVersion](network.networkApi.md#getnodeprotocolversion)
- [getRewardBalance](network.networkApi.md#getrewardbalance)
- [getRpcPayload](network.networkApi.md#getrpcpayload)
- [getRpcStatus](network.networkApi.md#getrpcstatus)
- [getStakingPool](network.networkApi.md#getstakingpool)
- [getSubmitTransactionData](network.networkApi.md#getsubmittransactiondata)
- [getTxListBlockchain](network.networkApi.md#gettxlistblockchain)
- [getUnboundingBalance](network.networkApi.md#getunboundingbalance)
- [getValidator](network.networkApi.md#getvalidator)
- [getValidatorsBondedToDelegatorList](network.networkApi.md#getvalidatorsbondedtodelegatorlist)
- [getValidatorsList](network.networkApi.md#getvalidatorslist)
- [requestBalanceIncrease](network.networkApi.md#requestbalanceincrease)
- [sendRpcCall](network.networkApi.md#sendrpccall)
- [sendUserDownloadData](network.networkApi.md#senduserdownloaddata)
- [sendUserDownloadedFileInfo](network.networkApi.md#senduserdownloadedfileinfo)
- [sendUserRequestDownload](network.networkApi.md#senduserrequestdownload)
- [sendUserRequestDownloadShared](network.networkApi.md#senduserrequestdownloadshared)
- [sendUserRequestGetFileStatus](network.networkApi.md#senduserrequestgetfilestatus)
- [sendUserRequestGetOzone](network.networkApi.md#senduserrequestgetozone)
- [sendUserRequestGetShared](network.networkApi.md#senduserrequestgetshared)
- [sendUserRequestList](network.networkApi.md#senduserrequestlist)
- [sendUserRequestListShare](network.networkApi.md#senduserrequestlistshare)
- [sendUserRequestShare](network.networkApi.md#senduserrequestshare)
- [sendUserRequestStopShare](network.networkApi.md#senduserrequeststopshare)
- [sendUserRequestUpload](network.networkApi.md#senduserrequestupload)
- [sendUserUploadData](network.networkApi.md#senduseruploaddata)
- [submitTransaction](network.networkApi.md#submittransaction)
- [uploadFile](network.networkApi.md#uploadfile)

## Functions

### apiGet

▸ **apiGet**(`url`, `config?`): `Promise`\<[`NetworkAxiosDataResult`](../interfaces/network.networkTypes.NetworkAxiosDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`NetworkAxiosDataResult`](../interfaces/network.networkTypes.NetworkAxiosDataResult.md)\>

#### Defined in

network/network.ts:76

___

### apiPost

▸ **apiPost**(`url`, `data?`, `config?`): `Promise`\<[`NetworkAxiosDataResult`](../interfaces/network.networkTypes.NetworkAxiosDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | [`ParsedTransactionData`](../interfaces/network.networkTypes.ParsedTransactionData.md) |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`NetworkAxiosDataResult`](../interfaces/network.networkTypes.NetworkAxiosDataResult.md)\>

#### Defined in

network/network.ts:47

___

### getAvailableBalance

▸ **getAvailableBalance**(`address`, `config?`): `Promise`\<[`AvailableBalanceDataResult`](network.networkTypes.md#availablebalancedataresult)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`AvailableBalanceDataResult`](network.networkTypes.md#availablebalancedataresult)\>

#### Defined in

network/network.ts:258

___

### getAvailableBalance\_n

▸ **getAvailableBalance_n**(`address`, `config?`): `Promise`\<[`AvailableBalanceDataResultN`](../interfaces/network.networkTypes.AvailableBalanceDataResultN.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`AvailableBalanceDataResultN`](../interfaces/network.networkTypes.AvailableBalanceDataResultN.md)\>

#### Defined in

network/network.ts:248

___

### getChainAndProtocolDetails

▸ **getChainAndProtocolDetails**(): `Promise`\<\{ `isNewProtocol`: `boolean` ; `resolvedChainID`: `string` ; `resolvedChainVersion`: `string`  }\>

#### Returns

`Promise`\<\{ `isNewProtocol`: `boolean` ; `resolvedChainID`: `string` ; `resolvedChainVersion`: `string`  }\>

#### Defined in

network/network.ts:554

___

### getChainId

▸ **getChainId**(): `Promise`\<`undefined` \| `string`\>

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Defined in

network/network.ts:536

___

### getDelegatedBalance

▸ **getDelegatedBalance**(`delegatorAddr`, `config?`): `Promise`\<[`DelegatedBalanceDataResult`](../interfaces/network.networkTypes.DelegatedBalanceDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddr` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`DelegatedBalanceDataResult`](../interfaces/network.networkTypes.DelegatedBalanceDataResult.md)\>

#### Defined in

network/network.ts:276

___

### getNodeProtocolVersion

▸ **getNodeProtocolVersion**(): `Promise`\<`undefined` \| `string`\>

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Defined in

network/network.ts:545

___

### getRewardBalance

▸ **getRewardBalance**(`delegatorAddr`, `config?`): `Promise`\<[`RewardBalanceDataResult`](../interfaces/network.networkTypes.RewardBalanceDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddr` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`RewardBalanceDataResult`](../interfaces/network.networkTypes.RewardBalanceDataResult.md)\>

#### Defined in

network/network.ts:298

___

### getRpcPayload

▸ **getRpcPayload**\<`T`\>(`msgId`, `method`, `extraParams?`): `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgId` | `number` |
| `method` | `string` |
| `extraParams?` | `T` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `id` | `number` |
| `method` | `string` |
| `params` | `undefined` \| `T` |

#### Defined in

network/network.ts:344

___

### getRpcStatus

▸ **getRpcStatus**(`config?`): `Promise`\<[`RpcStatusDataResult`](../interfaces/network.networkTypes.RpcStatusDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`RpcStatusDataResult`](../interfaces/network.networkTypes.RpcStatusDataResult.md)\>

#### Defined in

network/network.ts:326

___

### getStakingPool

▸ **getStakingPool**(`config?`): `Promise`\<[`StakingPoolDataResult`](../interfaces/network.networkTypes.StakingPoolDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`StakingPoolDataResult`](../interfaces/network.networkTypes.StakingPoolDataResult.md)\>

#### Defined in

network/network.ts:238

___

### getSubmitTransactionData

▸ **getSubmitTransactionData**\<`T`\>(`data?`): [`DataResult`](../interfaces/network.networkTypes.DataResult.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `data?` | `T` |

#### Returns

[`DataResult`](../interfaces/network.networkTypes.DataResult.md)

#### Defined in

network/network.ts:121

___

### getTxListBlockchain

▸ **getTxListBlockchain**(`address`, `type`, `givenPage?`, `pageLimit?`, `userType?`, `config?`): `Promise`\<[`RestTxHistoryDataResult`](../interfaces/network.networkTypes.RestTxHistoryDataResult.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `type` | `string` | `undefined` |
| `givenPage` | `number` | `1` |
| `pageLimit` | `number` | `5` |
| `userType` | [`TxHistoryUserType`](network.networkTypes.md#txhistoryusertype) | `TxHistoryUser.TxHistorySenderUser` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) | `undefined` |

#### Returns

`Promise`\<[`RestTxHistoryDataResult`](../interfaces/network.networkTypes.RestTxHistoryDataResult.md)\>

#### Defined in

network/network.ts:160

___

### getUnboundingBalance

▸ **getUnboundingBalance**(`delegatorAddr`, `config?`): `Promise`\<[`UnboundingBalanceDataResult`](../interfaces/network.networkTypes.UnboundingBalanceDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddr` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`UnboundingBalanceDataResult`](../interfaces/network.networkTypes.UnboundingBalanceDataResult.md)\>

#### Defined in

network/network.ts:287

___

### getValidator

▸ **getValidator**(`address`, `config?`): `Promise`\<[`ValidatorDataResult`](../interfaces/network.networkTypes.ValidatorDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`ValidatorDataResult`](../interfaces/network.networkTypes.ValidatorDataResult.md)\>

#### Defined in

network/network.ts:227

___

### getValidatorsBondedToDelegatorList

▸ **getValidatorsBondedToDelegatorList**(`status`, `delegatorAddress`, `config?`): `Promise`\<[`ValidatorListDataResult`](../interfaces/network.networkTypes.ValidatorListDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `string` |
| `delegatorAddress` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`ValidatorListDataResult`](../interfaces/network.networkTypes.ValidatorListDataResult.md)\>

#### Defined in

network/network.ts:215

___

### getValidatorsList

▸ **getValidatorsList**(`status`, `page?`, `config?`): `Promise`\<[`ValidatorListDataResult`](../interfaces/network.networkTypes.ValidatorListDataResult.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `status` | `string` | `undefined` |
| `page` | `number` | `1` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) | `undefined` |

#### Returns

`Promise`\<[`ValidatorListDataResult`](../interfaces/network.networkTypes.ValidatorListDataResult.md)\>

#### Defined in

network/network.ts:203

___

### requestBalanceIncrease

▸ **requestBalanceIncrease**(`walletAddress`, `faucetUrl`, `denom?`, `config?`): `Promise`\<[`SubmitTransactionDataResult`](../interfaces/network.networkTypes.SubmitTransactionDataResult.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `walletAddress` | `string` | `undefined` |
| `faucetUrl` | `string` | `undefined` |
| `denom` | `string` | `hdVault.stratosDenom` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) | `undefined` |

#### Returns

`Promise`\<[`SubmitTransactionDataResult`](../interfaces/network.networkTypes.SubmitTransactionDataResult.md)\>

#### Defined in

network/network.ts:309

___

### sendRpcCall

▸ **sendRpcCall**\<`N`\>(`givenPayload`, `config?`): `Promise`\<[`NetworkAxiosDataResult`](../interfaces/network.networkTypes.NetworkAxiosDataResult.md)\>

#### Type parameters

| Name |
| :------ |
| `N` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `givenPayload` | `N` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`NetworkAxiosDataResult`](../interfaces/network.networkTypes.NetworkAxiosDataResult.md)\>

#### Defined in

network/network.ts:102

___

### sendUserDownloadData

▸ **sendUserDownloadData**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserDownloadDataResponse`](../interfaces/network.networkTypes.FileUserDownloadDataResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserDownloadDataParams`](../interfaces/network.networkTypes.FileUserDownloadDataParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserDownloadDataResponse`](../interfaces/network.networkTypes.FileUserDownloadDataResponse.md)\>\>

#### Defined in

network/network.ts:396

___

### sendUserDownloadedFileInfo

▸ **sendUserDownloadedFileInfo**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserDownloadedFileInfoResponse`](../interfaces/network.networkTypes.FileUserDownloadedFileInfoResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserDownloadedFileInfoParams`](../interfaces/network.networkTypes.FileUserDownloadedFileInfoParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserDownloadedFileInfoResponse`](../interfaces/network.networkTypes.FileUserDownloadedFileInfoResponse.md)\>\>

#### Defined in

network/network.ts:410

___

### sendUserRequestDownload

▸ **sendUserRequestDownload**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestDownloadResponse`](../interfaces/network.networkTypes.FileUserRequestDownloadResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserRequestDownloadParams`](../interfaces/network.networkTypes.FileUserRequestDownloadParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestDownloadResponse`](../interfaces/network.networkTypes.FileUserRequestDownloadResponse.md)\>\>

#### Defined in

network/network.ts:382

___

### sendUserRequestDownloadShared

▸ **sendUserRequestDownloadShared**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestDownloadSharedResponse`](../interfaces/network.networkTypes.FileUserRequestDownloadSharedResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestDownloadSharedParams`](../interfaces/network.networkTypes.FileUserRequestDownloadSharedParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestDownloadSharedResponse`](../interfaces/network.networkTypes.FileUserRequestDownloadSharedResponse.md)\>\>

#### Defined in

network/network.ts:508

___

### sendUserRequestGetFileStatus

▸ **sendUserRequestGetFileStatus**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetFileStatusResponse`](../interfaces/network.networkTypes.FileUserRequestGetFileStatusResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestGetFileStatusParams`](../interfaces/network.networkTypes.FileUserRequestGetFileStatusParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetFileStatusResponse`](../interfaces/network.networkTypes.FileUserRequestGetFileStatusResponse.md)\>\>

#### Defined in

network/network.ts:522

___

### sendUserRequestGetOzone

▸ **sendUserRequestGetOzone**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetOzoneResponse`](../interfaces/network.networkTypes.FileUserRequestGetOzoneResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserRequestGetOzoneParams`](../interfaces/network.networkTypes.FileUserRequestGetOzoneParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetOzoneResponse`](../interfaces/network.networkTypes.FileUserRequestGetOzoneResponse.md)\>\>

#### Defined in

network/network.ts:424

___

### sendUserRequestGetShared

▸ **sendUserRequestGetShared**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetSharedResponse`](../interfaces/network.networkTypes.FileUserRequestGetSharedResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestGetSharedParams`](../interfaces/network.networkTypes.FileUserRequestGetSharedParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetSharedResponse`](../interfaces/network.networkTypes.FileUserRequestGetSharedResponse.md)\>\>

#### Defined in

network/network.ts:494

___

### sendUserRequestList

▸ **sendUserRequestList**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestListResponse`](../interfaces/network.networkTypes.FileUserRequestListResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserRequestListParams`](../interfaces/network.networkTypes.FileUserRequestListParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestListResponse`](../interfaces/network.networkTypes.FileUserRequestListResponse.md)\>\>

#### Defined in

network/network.ts:354

___

### sendUserRequestListShare

▸ **sendUserRequestListShare**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestListShareResponse`](../interfaces/network.networkTypes.FileUserRequestListShareResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestListShareParams`](../interfaces/network.networkTypes.FileUserRequestListShareParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestListShareResponse`](../interfaces/network.networkTypes.FileUserRequestListShareResponse.md)\>\>

#### Defined in

network/network.ts:466

___

### sendUserRequestShare

▸ **sendUserRequestShare**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestShareResponse`](../interfaces/network.networkTypes.FileUserRequestShareResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestShareParams`](../interfaces/network.networkTypes.FileUserRequestShareParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestShareResponse`](../interfaces/network.networkTypes.FileUserRequestShareResponse.md)\>\>

#### Defined in

network/network.ts:452

___

### sendUserRequestStopShare

▸ **sendUserRequestStopShare**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestStopShareResponse`](../interfaces/network.networkTypes.FileUserRequestStopShareResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestStopShareParams`](../interfaces/network.networkTypes.FileUserRequestStopShareParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestStopShareResponse`](../interfaces/network.networkTypes.FileUserRequestStopShareResponse.md)\>\>

#### Defined in

network/network.ts:480

___

### sendUserRequestUpload

▸ **sendUserRequestUpload**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestUploadResponse`](../interfaces/network.networkTypes.FileUserRequestUploadResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserRequestUploadParams`](../interfaces/network.networkTypes.FileUserRequestUploadParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestUploadResponse`](../interfaces/network.networkTypes.FileUserRequestUploadResponse.md)\>\>

#### Defined in

network/network.ts:368

___

### sendUserUploadData

▸ **sendUserUploadData**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserUploadDataResponse`](../interfaces/network.networkTypes.FileUserUploadDataResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserUploadDataParams`](../interfaces/network.networkTypes.FileUserUploadDataParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserUploadDataResponse`](../interfaces/network.networkTypes.FileUserUploadDataResponse.md)\>\>

#### Defined in

network/network.ts:438

___

### submitTransaction

▸ **submitTransaction**\<`T`\>(`delegatorAddr`, `data?`, `config?`): `Promise`\<[`SubmitTransactionDataResult`](../interfaces/network.networkTypes.SubmitTransactionDataResult.md)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddr` | `string` |
| `data?` | `T` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`SubmitTransactionDataResult`](../interfaces/network.networkTypes.SubmitTransactionDataResult.md)\>

#### Defined in

network/network.ts:138

___

### uploadFile

▸ **uploadFile**(`config?`): `Promise`\<[`RpcStatusDataResult`](../interfaces/network.networkTypes.RpcStatusDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`NetworkAxiosConfig`](../interfaces/network.networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`RpcStatusDataResult`](../interfaces/network.networkTypes.RpcStatusDataResult.md)\>

#### Defined in

network/network.ts:334
