[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](chain.md) / [transformers](chain.transformers.md) / TransactionTransformers

# Namespace: TransactionTransformers

[chain](chain.md).[transformers](chain.transformers.md).TransactionTransformers

## Table of contents

### Variables

- [TxHistoryTypesMap](chain.transformers.TransactionTransformers.md#txhistorytypesmap)

### Functions

- [getTransformer](chain.transformers.TransactionTransformers.md#gettransformer)
- [transformTx](chain.transformers.TransactionTransformers.md#transformtx)

## Variables

### TxHistoryTypesMap

• `Const` **TxHistoryTypesMap**: `Map`\<`string`, [`TxFormatter`](transformerTypes.md#txformatter)\>

#### Defined in

chain/transformers/transactions/index.ts:8

## Functions

### getTransformer

▸ **getTransformer**(`txType`): [`TxFormatter`](transformerTypes.md#txformatter)

#### Parameters

| Name | Type |
| :------ | :------ |
| `txType` | [`TxMsgTypes`](../enums/chain.transactions.chainTxTypes.TxMsgTypes.md) |

#### Returns

[`TxFormatter`](transformerTypes.md#txformatter)

#### Defined in

chain/transformers/transactions/index.ts:32

___

### transformTx

▸ **transformTx**(`txResponseItem`): [`FormattedBlockChainTx`](../interfaces/transformerTypes.FormattedBlockChainTx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `txResponseItem` | [`RestTxResponse`](../interfaces/network.networkTypes.RestTxResponse.md) |

#### Returns

[`FormattedBlockChainTx`](../interfaces/transformerTypes.FormattedBlockChainTx.md)

#### Defined in

chain/transformers/transactions/index.ts:36
