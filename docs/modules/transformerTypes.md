[Stratos SDK](../README.md) / [Exports](../modules.md) / transformerTypes

# Namespace: transformerTypes

## Table of contents

### Interfaces

- [FormattedBlockChainTx](../interfaces/transformerTypes.FormattedBlockChainTx.md)
- [FormattedBlockChainTxMessage](../interfaces/transformerTypes.FormattedBlockChainTxMessage.md)
- [ParsedTxData](../interfaces/transformerTypes.ParsedTxData.md)

### Type Aliases

- [TxFormatter](transformerTypes.md#txformatter)

## Type Aliases

### TxFormatter

Ƭ **TxFormatter**: (`txResponseItemTxBodyMessage`: [`RestTxBodyMessage`](../interfaces/network.networkTypes.RestTxBodyMessage.md), `txResponseItemLogEntry?`: [`RestTxResponseLog`](../interfaces/network.networkTypes.RestTxResponseLog.md)) => [`FormattedBlockChainTxMessage`](../interfaces/transformerTypes.FormattedBlockChainTxMessage.md)

#### Type declaration

▸ (`txResponseItemTxBodyMessage`, `txResponseItemLogEntry?`): [`FormattedBlockChainTxMessage`](../interfaces/transformerTypes.FormattedBlockChainTxMessage.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `txResponseItemTxBodyMessage` | [`RestTxBodyMessage`](../interfaces/network.networkTypes.RestTxBodyMessage.md) |
| `txResponseItemLogEntry?` | [`RestTxResponseLog`](../interfaces/network.networkTypes.RestTxResponseLog.md) |

##### Returns

[`FormattedBlockChainTxMessage`](../interfaces/transformerTypes.FormattedBlockChainTxMessage.md)

#### Defined in

chain/transformers/transactions/types.ts:4
