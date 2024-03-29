[Stratos SDK](../README.md) / [Exports](../modules.md) / [Transformers](Transformers.md) / TransactionTransformers

# Namespace: TransactionTransformers

[Transformers](Transformers.md).TransactionTransformers

## Table of contents

### Variables

- [TxHistoryTypesMap](Transformers.TransactionTransformers.md#txhistorytypesmap)

### Functions

- [getTransformer](Transformers.TransactionTransformers.md#gettransformer)
- [transformTx](Transformers.TransactionTransformers.md#transformtx)

## Variables

### TxHistoryTypesMap

• `Const` **TxHistoryTypesMap**: `Map`\<`string`, [`TxFormatter`](transformerTypes.md#txformatter)\>

#### Defined in

services/transformers/transactions/index.ts:7

## Functions

### getTransformer

▸ **getTransformer**(`txType`): [`TxFormatter`](transformerTypes.md#txformatter)

#### Parameters

| Name | Type |
| :------ | :------ |
| `txType` | [`TxMsgTypes`](../enums/transactionTypes.TxMsgTypes.md) |

#### Returns

[`TxFormatter`](transformerTypes.md#txformatter)

#### Defined in

services/transformers/transactions/index.ts:31

___

### transformTx

▸ **transformTx**(`txResponseItem`): [`FormattedBlockChainTx`](../interfaces/transformerTypes.FormattedBlockChainTx.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `txResponseItem` | [`RestTxResponse`](../interfaces/networkTypes.RestTxResponse.md) |

#### Returns

[`FormattedBlockChainTx`](../interfaces/transformerTypes.FormattedBlockChainTx.md)

#### Defined in

services/transformers/transactions/index.ts:35
