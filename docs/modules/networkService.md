[Stratos SDK](../README.md) / [Exports](../modules.md) / networkService

# Namespace: networkService

## Table of contents

### Functions

- [apiGet](networkService.md#apiget)
- [apiPost](networkService.md#apipost)
- [getAvailableBalance](networkService.md#getavailablebalance)
- [getAvailableBalance\_n](networkService.md#getavailablebalance_n)
- [getChainAndProtocolDetails](networkService.md#getchainandprotocoldetails)
- [getChainId](networkService.md#getchainid)
- [getDelegatedBalance](networkService.md#getdelegatedbalance)
- [getNodeProtocolVersion](networkService.md#getnodeprotocolversion)
- [getRewardBalance](networkService.md#getrewardbalance)
- [getRpcPayload](networkService.md#getrpcpayload)
- [getRpcStatus](networkService.md#getrpcstatus)
- [getStakingPool](networkService.md#getstakingpool)
- [getSubmitTransactionData](networkService.md#getsubmittransactiondata)
- [getTxListBlockchain](networkService.md#gettxlistblockchain)
- [getUnboundingBalance](networkService.md#getunboundingbalance)
- [getValidator](networkService.md#getvalidator)
- [getValidatorsBondedToDelegatorList](networkService.md#getvalidatorsbondedtodelegatorlist)
- [getValidatorsList](networkService.md#getvalidatorslist)
- [requestBalanceIncrease](networkService.md#requestbalanceincrease)
- [sendRpcCall](networkService.md#sendrpccall)
- [sendUserDownloadData](networkService.md#senduserdownloaddata)
- [sendUserDownloadedFileInfo](networkService.md#senduserdownloadedfileinfo)
- [sendUserRequestDownload](networkService.md#senduserrequestdownload)
- [sendUserRequestDownloadShared](networkService.md#senduserrequestdownloadshared)
- [sendUserRequestGetFileStatus](networkService.md#senduserrequestgetfilestatus)
- [sendUserRequestGetOzone](networkService.md#senduserrequestgetozone)
- [sendUserRequestGetShared](networkService.md#senduserrequestgetshared)
- [sendUserRequestList](networkService.md#senduserrequestlist)
- [sendUserRequestListShare](networkService.md#senduserrequestlistshare)
- [sendUserRequestShare](networkService.md#senduserrequestshare)
- [sendUserRequestStopShare](networkService.md#senduserrequeststopshare)
- [sendUserRequestUpload](networkService.md#senduserrequestupload)
- [sendUserUploadData](networkService.md#senduseruploaddata)
- [submitTransaction](networkService.md#submittransaction)
- [uploadFile](networkService.md#uploadfile)

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

services/network/network.ts:86

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

services/network/network.ts:56

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

services/network/network.ts:276

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

services/network/network.ts:266

___

### getChainAndProtocolDetails

▸ **getChainAndProtocolDetails**(): `Promise`\<\{ `isNewProtocol`: `boolean` ; `resolvedChainID`: `string` ; `resolvedChainVersion`: `string`  }\>

#### Returns

`Promise`\<\{ `isNewProtocol`: `boolean` ; `resolvedChainID`: `string` ; `resolvedChainVersion`: `string`  }\>

#### Defined in

services/network/network.ts:578

___

### getChainId

▸ **getChainId**(): `Promise`\<`undefined` \| `string`\>

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Defined in

services/network/network.ts:560

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

services/network/network.ts:295

___

### getNodeProtocolVersion

▸ **getNodeProtocolVersion**(): `Promise`\<`undefined` \| `string`\>

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Defined in

services/network/network.ts:569

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

services/network/network.ts:321

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

services/network/network.ts:368

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

services/network/network.ts:349

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

services/network/network.ts:255

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

services/network/network.ts:132

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

services/network/network.ts:173

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

services/network/network.ts:308

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

services/network/network.ts:243

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

services/network/network.ts:230

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

services/network/network.ts:217

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

services/network/network.ts:332

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

services/network/network.ts:112

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

services/network/network.ts:420

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

services/network/network.ts:434

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

services/network/network.ts:406

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

services/network/network.ts:532

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

services/network/network.ts:546

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

services/network/network.ts:448

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

services/network/network.ts:518

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

services/network/network.ts:378

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

services/network/network.ts:490

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

services/network/network.ts:476

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

services/network/network.ts:504

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

services/network/network.ts:392

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

services/network/network.ts:462

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

services/network/network.ts:149

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

services/network/network.ts:358
