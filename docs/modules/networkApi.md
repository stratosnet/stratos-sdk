[Stratos SDK](../README.md) / [Exports](../modules.md) / networkApi

# Namespace: networkApi

## Table of contents

### Functions

- [apiGet](networkApi.md#apiget)
- [apiPost](networkApi.md#apipost)
- [getAvailableBalance](networkApi.md#getavailablebalance)
- [getAvailableBalance\_n](networkApi.md#getavailablebalance_n)
- [getChainAndProtocolDetails](networkApi.md#getchainandprotocoldetails)
- [getChainId](networkApi.md#getchainid)
- [getDelegatedBalance](networkApi.md#getdelegatedbalance)
- [getNodeProtocolVersion](networkApi.md#getnodeprotocolversion)
- [getRewardBalance](networkApi.md#getrewardbalance)
- [getRpcPayload](networkApi.md#getrpcpayload)
- [getRpcStatus](networkApi.md#getrpcstatus)
- [getStakingPool](networkApi.md#getstakingpool)
- [getSubmitTransactionData](networkApi.md#getsubmittransactiondata)
- [getTxListBlockchain](networkApi.md#gettxlistblockchain)
- [getUnboundingBalance](networkApi.md#getunboundingbalance)
- [getValidator](networkApi.md#getvalidator)
- [getValidatorsBondedToDelegatorList](networkApi.md#getvalidatorsbondedtodelegatorlist)
- [getValidatorsList](networkApi.md#getvalidatorslist)
- [requestBalanceIncrease](networkApi.md#requestbalanceincrease)
- [sendRpcCall](networkApi.md#sendrpccall)
- [sendUserDownloadData](networkApi.md#senduserdownloaddata)
- [sendUserDownloadedFileInfo](networkApi.md#senduserdownloadedfileinfo)
- [sendUserRequestDownload](networkApi.md#senduserrequestdownload)
- [sendUserRequestDownloadShared](networkApi.md#senduserrequestdownloadshared)
- [sendUserRequestGetFileStatus](networkApi.md#senduserrequestgetfilestatus)
- [sendUserRequestGetOzone](networkApi.md#senduserrequestgetozone)
- [sendUserRequestGetShared](networkApi.md#senduserrequestgetshared)
- [sendUserRequestList](networkApi.md#senduserrequestlist)
- [sendUserRequestListShare](networkApi.md#senduserrequestlistshare)
- [sendUserRequestShare](networkApi.md#senduserrequestshare)
- [sendUserRequestStopShare](networkApi.md#senduserrequeststopshare)
- [sendUserRequestUpload](networkApi.md#senduserrequestupload)
- [sendUserUploadData](networkApi.md#senduseruploaddata)
- [submitTransaction](networkApi.md#submittransaction)
- [uploadFile](networkApi.md#uploadfile)

## Functions

### apiGet

▸ **apiGet**(`url`, `config?`): `Promise`\<[`NetworkAxiosDataResult`](../interfaces/networkTypes.NetworkAxiosDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`NetworkAxiosDataResult`](../interfaces/networkTypes.NetworkAxiosDataResult.md)\>

#### Defined in

network/network.ts:86

___

### apiPost

▸ **apiPost**(`url`, `data?`, `config?`): `Promise`\<[`NetworkAxiosDataResult`](../interfaces/networkTypes.NetworkAxiosDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data?` | [`ParsedTransactionData`](../interfaces/networkTypes.ParsedTransactionData.md) |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`NetworkAxiosDataResult`](../interfaces/networkTypes.NetworkAxiosDataResult.md)\>

#### Defined in

network/network.ts:56

___

### getAvailableBalance

▸ **getAvailableBalance**(`address`, `config?`): `Promise`\<[`AvailableBalanceDataResult`](networkTypes.md#availablebalancedataresult)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`AvailableBalanceDataResult`](networkTypes.md#availablebalancedataresult)\>

#### Defined in

network/network.ts:276

___

### getAvailableBalance\_n

▸ **getAvailableBalance_n**(`address`, `config?`): `Promise`\<[`AvailableBalanceDataResultN`](../interfaces/networkTypes.AvailableBalanceDataResultN.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`AvailableBalanceDataResultN`](../interfaces/networkTypes.AvailableBalanceDataResultN.md)\>

#### Defined in

network/network.ts:266

___

### getChainAndProtocolDetails

▸ **getChainAndProtocolDetails**(): `Promise`\<\{ `isNewProtocol`: `boolean` ; `resolvedChainID`: `string` ; `resolvedChainVersion`: `string`  }\>

#### Returns

`Promise`\<\{ `isNewProtocol`: `boolean` ; `resolvedChainID`: `string` ; `resolvedChainVersion`: `string`  }\>

#### Defined in

network/network.ts:574

___

### getChainId

▸ **getChainId**(): `Promise`\<`undefined` \| `string`\>

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Defined in

network/network.ts:556

___

### getDelegatedBalance

▸ **getDelegatedBalance**(`delegatorAddr`, `config?`): `Promise`\<[`DelegatedBalanceDataResult`](../interfaces/networkTypes.DelegatedBalanceDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddr` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`DelegatedBalanceDataResult`](../interfaces/networkTypes.DelegatedBalanceDataResult.md)\>

#### Defined in

network/network.ts:295

___

### getNodeProtocolVersion

▸ **getNodeProtocolVersion**(): `Promise`\<`undefined` \| `string`\>

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Defined in

network/network.ts:565

___

### getRewardBalance

▸ **getRewardBalance**(`delegatorAddr`, `config?`): `Promise`\<[`RewardBalanceDataResult`](../interfaces/networkTypes.RewardBalanceDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddr` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`RewardBalanceDataResult`](../interfaces/networkTypes.RewardBalanceDataResult.md)\>

#### Defined in

network/network.ts:317

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

network/network.ts:364

___

### getRpcStatus

▸ **getRpcStatus**(`config?`): `Promise`\<[`RpcStatusDataResult`](../interfaces/networkTypes.RpcStatusDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`RpcStatusDataResult`](../interfaces/networkTypes.RpcStatusDataResult.md)\>

#### Defined in

network/network.ts:345

___

### getStakingPool

▸ **getStakingPool**(`config?`): `Promise`\<[`StakingPoolDataResult`](../interfaces/networkTypes.StakingPoolDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`StakingPoolDataResult`](../interfaces/networkTypes.StakingPoolDataResult.md)\>

#### Defined in

network/network.ts:256

___

### getSubmitTransactionData

▸ **getSubmitTransactionData**\<`T`\>(`data?`): [`DataResult`](../interfaces/networkTypes.DataResult.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `data?` | `T` |

#### Returns

[`DataResult`](../interfaces/networkTypes.DataResult.md)

#### Defined in

network/network.ts:134

___

### getTxListBlockchain

▸ **getTxListBlockchain**(`address`, `type`, `givenPage?`, `pageLimit?`, `userType?`, `config?`): `Promise`\<[`RestTxHistoryDataResult`](../interfaces/networkTypes.RestTxHistoryDataResult.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `type` | `string` | `undefined` |
| `givenPage` | `number` | `1` |
| `pageLimit` | `number` | `5` |
| `userType` | [`TxHistoryUserType`](networkTypes.md#txhistoryusertype) | `TxHistoryUser.TxHistorySenderUser` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) | `undefined` |

#### Returns

`Promise`\<[`RestTxHistoryDataResult`](../interfaces/networkTypes.RestTxHistoryDataResult.md)\>

#### Defined in

network/network.ts:175

___

### getUnboundingBalance

▸ **getUnboundingBalance**(`delegatorAddr`, `config?`): `Promise`\<[`UnboundingBalanceDataResult`](../interfaces/networkTypes.UnboundingBalanceDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddr` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`UnboundingBalanceDataResult`](../interfaces/networkTypes.UnboundingBalanceDataResult.md)\>

#### Defined in

network/network.ts:306

___

### getValidator

▸ **getValidator**(`address`, `config?`): `Promise`\<[`ValidatorDataResult`](../interfaces/networkTypes.ValidatorDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`ValidatorDataResult`](../interfaces/networkTypes.ValidatorDataResult.md)\>

#### Defined in

network/network.ts:245

___

### getValidatorsBondedToDelegatorList

▸ **getValidatorsBondedToDelegatorList**(`status`, `delegatorAddress`, `config?`): `Promise`\<[`ValidatorListDataResult`](../interfaces/networkTypes.ValidatorListDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `status` | `string` |
| `delegatorAddress` | `string` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`ValidatorListDataResult`](../interfaces/networkTypes.ValidatorListDataResult.md)\>

#### Defined in

network/network.ts:232

___

### getValidatorsList

▸ **getValidatorsList**(`status`, `page?`, `config?`): `Promise`\<[`ValidatorListDataResult`](../interfaces/networkTypes.ValidatorListDataResult.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `status` | `string` | `undefined` |
| `page` | `number` | `1` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) | `undefined` |

#### Returns

`Promise`\<[`ValidatorListDataResult`](../interfaces/networkTypes.ValidatorListDataResult.md)\>

#### Defined in

network/network.ts:219

___

### requestBalanceIncrease

▸ **requestBalanceIncrease**(`walletAddress`, `faucetUrl`, `denom?`, `config?`): `Promise`\<[`SubmitTransactionDataResult`](../interfaces/networkTypes.SubmitTransactionDataResult.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `walletAddress` | `string` | `undefined` |
| `faucetUrl` | `string` | `undefined` |
| `denom` | `string` | `hdVault.stratosDenom` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) | `undefined` |

#### Returns

`Promise`\<[`SubmitTransactionDataResult`](../interfaces/networkTypes.SubmitTransactionDataResult.md)\>

#### Defined in

network/network.ts:328

___

### sendRpcCall

▸ **sendRpcCall**\<`N`\>(`givenPayload`, `config?`): `Promise`\<[`NetworkAxiosDataResult`](../interfaces/networkTypes.NetworkAxiosDataResult.md)\>

#### Type parameters

| Name |
| :------ |
| `N` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `givenPayload` | `N` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`NetworkAxiosDataResult`](../interfaces/networkTypes.NetworkAxiosDataResult.md)\>

#### Defined in

network/network.ts:112

___

### sendUserDownloadData

▸ **sendUserDownloadData**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserDownloadDataResponse`](../interfaces/networkTypes.FileUserDownloadDataResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserDownloadDataParams`](../interfaces/networkTypes.FileUserDownloadDataParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserDownloadDataResponse`](../interfaces/networkTypes.FileUserDownloadDataResponse.md)\>\>

#### Defined in

network/network.ts:416

___

### sendUserDownloadedFileInfo

▸ **sendUserDownloadedFileInfo**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserDownloadedFileInfoResponse`](../interfaces/networkTypes.FileUserDownloadedFileInfoResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserDownloadedFileInfoParams`](../interfaces/networkTypes.FileUserDownloadedFileInfoParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserDownloadedFileInfoResponse`](../interfaces/networkTypes.FileUserDownloadedFileInfoResponse.md)\>\>

#### Defined in

network/network.ts:430

___

### sendUserRequestDownload

▸ **sendUserRequestDownload**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestDownloadResponse`](../interfaces/networkTypes.FileUserRequestDownloadResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserRequestDownloadParams`](../interfaces/networkTypes.FileUserRequestDownloadParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestDownloadResponse`](../interfaces/networkTypes.FileUserRequestDownloadResponse.md)\>\>

#### Defined in

network/network.ts:402

___

### sendUserRequestDownloadShared

▸ **sendUserRequestDownloadShared**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestDownloadSharedResponse`](../interfaces/networkTypes.FileUserRequestDownloadSharedResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestDownloadSharedParams`](../interfaces/networkTypes.FileUserRequestDownloadSharedParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestDownloadSharedResponse`](../interfaces/networkTypes.FileUserRequestDownloadSharedResponse.md)\>\>

#### Defined in

network/network.ts:528

___

### sendUserRequestGetFileStatus

▸ **sendUserRequestGetFileStatus**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetFileStatusResponse`](../interfaces/networkTypes.FileUserRequestGetFileStatusResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestGetFileStatusParams`](../interfaces/networkTypes.FileUserRequestGetFileStatusParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetFileStatusResponse`](../interfaces/networkTypes.FileUserRequestGetFileStatusResponse.md)\>\>

#### Defined in

network/network.ts:542

___

### sendUserRequestGetOzone

▸ **sendUserRequestGetOzone**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetOzoneResponse`](../interfaces/networkTypes.FileUserRequestGetOzoneResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserRequestGetOzoneParams`](../interfaces/networkTypes.FileUserRequestGetOzoneParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetOzoneResponse`](../interfaces/networkTypes.FileUserRequestGetOzoneResponse.md)\>\>

#### Defined in

network/network.ts:444

___

### sendUserRequestGetShared

▸ **sendUserRequestGetShared**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetSharedResponse`](../interfaces/networkTypes.FileUserRequestGetSharedResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestGetSharedParams`](../interfaces/networkTypes.FileUserRequestGetSharedParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestGetSharedResponse`](../interfaces/networkTypes.FileUserRequestGetSharedResponse.md)\>\>

#### Defined in

network/network.ts:514

___

### sendUserRequestList

▸ **sendUserRequestList**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestListResponse`](../interfaces/networkTypes.FileUserRequestListResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserRequestListParams`](../interfaces/networkTypes.FileUserRequestListParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestListResponse`](../interfaces/networkTypes.FileUserRequestListResponse.md)\>\>

#### Defined in

network/network.ts:374

___

### sendUserRequestListShare

▸ **sendUserRequestListShare**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestListShareResponse`](../interfaces/networkTypes.FileUserRequestListShareResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestListShareParams`](../interfaces/networkTypes.FileUserRequestListShareParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestListShareResponse`](../interfaces/networkTypes.FileUserRequestListShareResponse.md)\>\>

#### Defined in

network/network.ts:486

___

### sendUserRequestShare

▸ **sendUserRequestShare**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestShareResponse`](../interfaces/networkTypes.FileUserRequestShareResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestShareParams`](../interfaces/networkTypes.FileUserRequestShareParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestShareResponse`](../interfaces/networkTypes.FileUserRequestShareResponse.md)\>\>

#### Defined in

network/network.ts:472

___

### sendUserRequestStopShare

▸ **sendUserRequestStopShare**\<`T`\>(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestStopShareResponse`](../interfaces/networkTypes.FileUserRequestStopShareResponse.md)\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`FileUserRequestStopShareParams`](../interfaces/networkTypes.FileUserRequestStopShareParams.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | `T`[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestStopShareResponse`](../interfaces/networkTypes.FileUserRequestStopShareResponse.md)\>\>

#### Defined in

network/network.ts:500

___

### sendUserRequestUpload

▸ **sendUserRequestUpload**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestUploadResponse`](../interfaces/networkTypes.FileUserRequestUploadResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserRequestUploadParams`](../interfaces/networkTypes.FileUserRequestUploadParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserRequestUploadResponse`](../interfaces/networkTypes.FileUserRequestUploadResponse.md)\>\>

#### Defined in

network/network.ts:388

___

### sendUserUploadData

▸ **sendUserUploadData**(`extraParams`, `config?`): `Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserUploadDataResponse`](../interfaces/networkTypes.FileUserUploadDataResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraParams` | [`FileUserUploadDataParams`](../interfaces/networkTypes.FileUserUploadDataParams.md)[] |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`FileUserRequestResult`](../interfaces/networkTypes.FileUserRequestResult.md)\<[`FileUserUploadDataResponse`](../interfaces/networkTypes.FileUserUploadDataResponse.md)\>\>

#### Defined in

network/network.ts:458

___

### submitTransaction

▸ **submitTransaction**\<`T`\>(`delegatorAddr`, `data?`, `config?`): `Promise`\<[`SubmitTransactionDataResult`](../interfaces/networkTypes.SubmitTransactionDataResult.md)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddr` | `string` |
| `data?` | `T` |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`SubmitTransactionDataResult`](../interfaces/networkTypes.SubmitTransactionDataResult.md)\>

#### Defined in

network/network.ts:151

___

### uploadFile

▸ **uploadFile**(`config?`): `Promise`\<[`RpcStatusDataResult`](../interfaces/networkTypes.RpcStatusDataResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`NetworkAxiosConfig`](../interfaces/networkTypes.NetworkAxiosConfig.md) |

#### Returns

`Promise`\<[`RpcStatusDataResult`](../interfaces/networkTypes.RpcStatusDataResult.md)\>

#### Defined in

network/network.ts:354
