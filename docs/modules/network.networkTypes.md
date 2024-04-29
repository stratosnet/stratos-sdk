[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](network.md) / networkTypes

# Namespace: networkTypes

[network](network.md).networkTypes

## Table of contents

### Interfaces

- [AccountsDataResult](../interfaces/network.networkTypes.AccountsDataResult.md)
- [Amount](../interfaces/network.networkTypes.Amount.md)
- [AvailableBalanceDataResultN](../interfaces/network.networkTypes.AvailableBalanceDataResultN.md)
- [AvailableBalanceDataResultO](../interfaces/network.networkTypes.AvailableBalanceDataResultO.md)
- [AvailableBalanceResponseN](../interfaces/network.networkTypes.AvailableBalanceResponseN.md)
- [AvailableBalanceResponseO](../interfaces/network.networkTypes.AvailableBalanceResponseO.md)
- [BlockChainDelegatedTxMessage](../interfaces/network.networkTypes.BlockChainDelegatedTxMessage.md)
- [BlockChainSentTxMessage](../interfaces/network.networkTypes.BlockChainSentTxMessage.md)
- [BlockChainSubmittedTx](../interfaces/network.networkTypes.BlockChainSubmittedTx.md)
- [BlockChainTx](../interfaces/network.networkTypes.BlockChainTx.md)
- [BlockChainTxEvent](../interfaces/network.networkTypes.BlockChainTxEvent.md)
- [BlockChainTxEventAttribute](../interfaces/network.networkTypes.BlockChainTxEventAttribute.md)
- [BlockChainTxLog](../interfaces/network.networkTypes.BlockChainTxLog.md)
- [BlockChainTxMessage](../interfaces/network.networkTypes.BlockChainTxMessage.md)
- [DataResult](../interfaces/network.networkTypes.DataResult.md)
- [DelegatedBalanceDataResult](../interfaces/network.networkTypes.DelegatedBalanceDataResult.md)
- [DelegatedBalanceResult](../interfaces/network.networkTypes.DelegatedBalanceResult.md)
- [DelegatedEntry](../interfaces/network.networkTypes.DelegatedEntry.md)
- [EthProtocolRpcResponse](../interfaces/network.networkTypes.EthProtocolRpcResponse.md)
- [EthProtocolRpcResult](../interfaces/network.networkTypes.EthProtocolRpcResult.md)
- [FileInfoItem](../interfaces/network.networkTypes.FileInfoItem.md)
- [FileUserDownloadDataParams](../interfaces/network.networkTypes.FileUserDownloadDataParams.md)
- [FileUserDownloadDataResponse](../interfaces/network.networkTypes.FileUserDownloadDataResponse.md)
- [FileUserDownloadedFileInfoParams](../interfaces/network.networkTypes.FileUserDownloadedFileInfoParams.md)
- [FileUserDownloadedFileInfoResponse](../interfaces/network.networkTypes.FileUserDownloadedFileInfoResponse.md)
- [FileUserRequestDownloadParams](../interfaces/network.networkTypes.FileUserRequestDownloadParams.md)
- [FileUserRequestDownloadResponse](../interfaces/network.networkTypes.FileUserRequestDownloadResponse.md)
- [FileUserRequestDownloadSharedParams](../interfaces/network.networkTypes.FileUserRequestDownloadSharedParams.md)
- [FileUserRequestDownloadSharedResponse](../interfaces/network.networkTypes.FileUserRequestDownloadSharedResponse.md)
- [FileUserRequestGetFileStatusParams](../interfaces/network.networkTypes.FileUserRequestGetFileStatusParams.md)
- [FileUserRequestGetFileStatusResponse](../interfaces/network.networkTypes.FileUserRequestGetFileStatusResponse.md)
- [FileUserRequestGetOzoneParams](../interfaces/network.networkTypes.FileUserRequestGetOzoneParams.md)
- [FileUserRequestGetOzoneResponse](../interfaces/network.networkTypes.FileUserRequestGetOzoneResponse.md)
- [FileUserRequestGetSharedParams](../interfaces/network.networkTypes.FileUserRequestGetSharedParams.md)
- [FileUserRequestGetSharedResponse](../interfaces/network.networkTypes.FileUserRequestGetSharedResponse.md)
- [FileUserRequestListParams](../interfaces/network.networkTypes.FileUserRequestListParams.md)
- [FileUserRequestListResponse](../interfaces/network.networkTypes.FileUserRequestListResponse.md)
- [FileUserRequestListShareParams](../interfaces/network.networkTypes.FileUserRequestListShareParams.md)
- [FileUserRequestListShareResponse](../interfaces/network.networkTypes.FileUserRequestListShareResponse.md)
- [FileUserRequestResult](../interfaces/network.networkTypes.FileUserRequestResult.md)
- [FileUserRequestShareParams](../interfaces/network.networkTypes.FileUserRequestShareParams.md)
- [FileUserRequestShareResponse](../interfaces/network.networkTypes.FileUserRequestShareResponse.md)
- [FileUserRequestStopShareParams](../interfaces/network.networkTypes.FileUserRequestStopShareParams.md)
- [FileUserRequestStopShareResponse](../interfaces/network.networkTypes.FileUserRequestStopShareResponse.md)
- [FileUserRequestUploadParams](../interfaces/network.networkTypes.FileUserRequestUploadParams.md)
- [FileUserRequestUploadResponse](../interfaces/network.networkTypes.FileUserRequestUploadResponse.md)
- [FileUserUploadDataParams](../interfaces/network.networkTypes.FileUserUploadDataParams.md)
- [FileUserUploadDataResponse](../interfaces/network.networkTypes.FileUserUploadDataResponse.md)
- [MainRpcResponse](../interfaces/network.networkTypes.MainRpcResponse.md)
- [NetworkAxiosConfig](../interfaces/network.networkTypes.NetworkAxiosConfig.md)
- [NetworkAxiosDataResult](../interfaces/network.networkTypes.NetworkAxiosDataResult.md)
- [NetworkAxiosHeaders](../interfaces/network.networkTypes.NetworkAxiosHeaders.md)
- [NetworkAxiosResult](../interfaces/network.networkTypes.NetworkAxiosResult.md)
- [ParsedTransactionData](../interfaces/network.networkTypes.ParsedTransactionData.md)
- [RestBeginRedelegateTxBodyMessage](../interfaces/network.networkTypes.RestBeginRedelegateTxBodyMessage.md)
- [RestDelegateTx](../interfaces/network.networkTypes.RestDelegateTx.md)
- [RestDelegateTxBody](../interfaces/network.networkTypes.RestDelegateTxBody.md)
- [RestDelegateTxBodyMessage](../interfaces/network.networkTypes.RestDelegateTxBodyMessage.md)
- [RestGetRewardsTx](../interfaces/network.networkTypes.RestGetRewardsTx.md)
- [RestGetRewardsTxBody](../interfaces/network.networkTypes.RestGetRewardsTxBody.md)
- [RestGetRewardsTxBodyMessage](../interfaces/network.networkTypes.RestGetRewardsTxBodyMessage.md)
- [RestSdsPrepayTx](../interfaces/network.networkTypes.RestSdsPrepayTx.md)
- [RestSdsPrepayTxBody](../interfaces/network.networkTypes.RestSdsPrepayTxBody.md)
- [RestSdsPrepayTxBodyMessage](../interfaces/network.networkTypes.RestSdsPrepayTxBodyMessage.md)
- [RestSendTx](../interfaces/network.networkTypes.RestSendTx.md)
- [RestSendTxBody](../interfaces/network.networkTypes.RestSendTxBody.md)
- [RestSendTxBodyMessage](../interfaces/network.networkTypes.RestSendTxBodyMessage.md)
- [RestTx](../interfaces/network.networkTypes.RestTx.md)
- [RestTxAuthInfo](../interfaces/network.networkTypes.RestTxAuthInfo.md)
- [RestTxBody](../interfaces/network.networkTypes.RestTxBody.md)
- [RestTxBodyMessage](../interfaces/network.networkTypes.RestTxBodyMessage.md)
- [RestTxErrorResponse](../interfaces/network.networkTypes.RestTxErrorResponse.md)
- [RestTxFeeInfo](../interfaces/network.networkTypes.RestTxFeeInfo.md)
- [RestTxHistoryDataResult](../interfaces/network.networkTypes.RestTxHistoryDataResult.md)
- [RestTxHistoryResponse](../interfaces/network.networkTypes.RestTxHistoryResponse.md)
- [RestTxListDataResult](../interfaces/network.networkTypes.RestTxListDataResult.md)
- [RestTxListResponse](../interfaces/network.networkTypes.RestTxListResponse.md)
- [RestTxResponse](../interfaces/network.networkTypes.RestTxResponse.md)
- [RestTxResponseEvent](../interfaces/network.networkTypes.RestTxResponseEvent.md)
- [RestTxResponseEventAttribute](../interfaces/network.networkTypes.RestTxResponseEventAttribute.md)
- [RestTxResponseLog](../interfaces/network.networkTypes.RestTxResponseLog.md)
- [RestTxResponseTx](../interfaces/network.networkTypes.RestTxResponseTx.md)
- [RestTxSignerInfo](../interfaces/network.networkTypes.RestTxSignerInfo.md)
- [RestUndelegateTx](../interfaces/network.networkTypes.RestUndelegateTx.md)
- [RestUndelegateTxBody](../interfaces/network.networkTypes.RestUndelegateTxBody.md)
- [RestUndelegateTxBodyMessage](../interfaces/network.networkTypes.RestUndelegateTxBodyMessage.md)
- [ResultError](../interfaces/network.networkTypes.ResultError.md)
- [RewardBalanceDataResult](../interfaces/network.networkTypes.RewardBalanceDataResult.md)
- [RewardBalanceResult](../interfaces/network.networkTypes.RewardBalanceResult.md)
- [Rewards](../interfaces/network.networkTypes.Rewards.md)
- [RpcStatusDataResult](../interfaces/network.networkTypes.RpcStatusDataResult.md)
- [RpcStatusResponse](../interfaces/network.networkTypes.RpcStatusResponse.md)
- [SharedFileInfoItem](../interfaces/network.networkTypes.SharedFileInfoItem.md)
- [StakingPoolDataResult](../interfaces/network.networkTypes.StakingPoolDataResult.md)
- [StakingPoolResponse](../interfaces/network.networkTypes.StakingPoolResponse.md)
- [SubmitTransactionDataResult](../interfaces/network.networkTypes.SubmitTransactionDataResult.md)
- [TxData](../interfaces/network.networkTypes.TxData.md)
- [TxFee](../interfaces/network.networkTypes.TxFee.md)
- [TxOrigin](../interfaces/network.networkTypes.TxOrigin.md)
- [TxOriginMsg](../interfaces/network.networkTypes.TxOriginMsg.md)
- [TxSignature](../interfaces/network.networkTypes.TxSignature.md)
- [UnboundingBalanceDataResult](../interfaces/network.networkTypes.UnboundingBalanceDataResult.md)
- [UnboundingBalanceResult](../interfaces/network.networkTypes.UnboundingBalanceResult.md)
- [UnboundingEntry](../interfaces/network.networkTypes.UnboundingEntry.md)
- [UserFileSignature](../interfaces/network.networkTypes.UserFileSignature.md)
- [ValidatorDataResult](../interfaces/network.networkTypes.ValidatorDataResult.md)
- [ValidatorItem](../interfaces/network.networkTypes.ValidatorItem.md)
- [ValidatorListDataResult](../interfaces/network.networkTypes.ValidatorListDataResult.md)
- [ValidatorListResponse](../interfaces/network.networkTypes.ValidatorListResponse.md)
- [ValidatorResponse](../interfaces/network.networkTypes.ValidatorResponse.md)

### Type Aliases

- [AvailableBalanceDataResult](network.networkTypes.md#availablebalancedataresult)
- [AvailableBalanceResponse](network.networkTypes.md#availablebalanceresponse)
- [RestPagination](network.networkTypes.md#restpagination)
- [TransactionData](network.networkTypes.md#transactiondata)
- [TxDataDataAmount](network.networkTypes.md#txdatadataamount)
- [TxHistoryUserType](network.networkTypes.md#txhistoryusertype)
- [TxHistoryUserTypes](network.networkTypes.md#txhistoryusertypes)

### Variables

- [TxHistoryUser](network.networkTypes.md#txhistoryuser)

## Type Aliases

### AvailableBalanceDataResult

Ƭ **AvailableBalanceDataResult**: [`AvailableBalanceDataResultO`](../interfaces/network.networkTypes.AvailableBalanceDataResultO.md) \| [`AvailableBalanceDataResultN`](../interfaces/network.networkTypes.AvailableBalanceDataResultN.md)

#### Defined in

network/networkTypes.ts:92

___

### AvailableBalanceResponse

Ƭ **AvailableBalanceResponse**: [`AvailableBalanceResponseN`](../interfaces/network.networkTypes.AvailableBalanceResponseN.md) \| [`AvailableBalanceResponseO`](../interfaces/network.networkTypes.AvailableBalanceResponseO.md)

#### Defined in

network/networkTypes.ts:82

___

### RestPagination

Ƭ **RestPagination**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `next_key` | ``null`` \| `number` |
| `total` | `string` |

#### Defined in

network/networkTypes.ts:30

___

### TransactionData

Ƭ **TransactionData**: `string`

#### Defined in

network/networkTypes.ts:114

___

### TxDataDataAmount

Ƭ **TxDataDataAmount**: [`Amount`](../interfaces/network.networkTypes.Amount.md)[] \| [`Amount`](../interfaces/network.networkTypes.Amount.md)

#### Defined in

network/networkTypes.ts:132

___

### TxHistoryUserType

Ƭ **TxHistoryUserType**: typeof [`TxHistoryUser`](network.networkTypes.md#txhistoryuser)[keyof [`TxHistoryUserTypes`](network.networkTypes.md#txhistoryusertypes)]

#### Defined in

network/networkTypes.ts:754

___

### TxHistoryUserTypes

Ƭ **TxHistoryUserTypes**: typeof [`TxHistoryUser`](network.networkTypes.md#txhistoryuser)

#### Defined in

network/networkTypes.ts:753

## Variables

### TxHistoryUser

• `Const` **TxHistoryUser**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `TxHistoryReceiverUser` | ``2`` |
| `TxHistorySenderUser` | ``1`` |

#### Defined in

network/networkTypes.ts:756
