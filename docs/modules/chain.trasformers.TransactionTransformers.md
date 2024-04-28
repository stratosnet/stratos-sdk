[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](chain.md) / [trasformers](chain.trasformers.md) / TransactionTransformers

# Namespace: TransactionTransformers

[chain](chain.md).[trasformers](chain.trasformers.md).TransactionTransformers

## Table of contents

### Variables

- [TxHistoryTypesMap](chain.trasformers.TransactionTransformers.md#txhistorytypesmap)

### Functions

- [getTransformer](chain.trasformers.TransactionTransformers.md#gettransformer)
- [transformTx](chain.trasformers.TransactionTransformers.md#transformtx)

## Variables

### TxHistoryTypesMap

• `Const` **TxHistoryTypesMap**: `Map`\<`string`, `TxFormatter`\>

#### Defined in

chain/transformers/transactions/index.ts:8

## Functions

### getTransformer

▸ **getTransformer**(`txType`): `TxFormatter`

#### Parameters

| Name | Type |
| :------ | :------ |
| `txType` | [`TxMsgTypes`](../enums/chain.transactions.chainTxTypes.TxMsgTypes.md) |

#### Returns

`TxFormatter`

#### Defined in

chain/transformers/transactions/index.ts:32

___

### transformTx

▸ **transformTx**(`txResponseItem`): `FormattedBlockChainTx`

#### Parameters

| Name | Type |
| :------ | :------ |
| `txResponseItem` | [`RestTxResponse`](../interfaces/network.networkTypes.RestTxResponse.md) |

#### Returns

`FormattedBlockChainTx`

#### Defined in

chain/transformers/transactions/index.ts:36
