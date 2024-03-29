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

Ƭ **TxFormatter**: (`txResponseItemTxBodyMessage`: [`RestTxBodyMessage`](../interfaces/networkTypes.RestTxBodyMessage.md), `txResponseItemLogEntry?`: [`RestTxResponseLog`](../interfaces/networkTypes.RestTxResponseLog.md)) => [`FormattedBlockChainTxMessage`](../interfaces/transformerTypes.FormattedBlockChainTxMessage.md)

#### Type declaration

▸ (`txResponseItemTxBodyMessage`, `txResponseItemLogEntry?`): [`FormattedBlockChainTxMessage`](../interfaces/transformerTypes.FormattedBlockChainTxMessage.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `txResponseItemTxBodyMessage` | [`RestTxBodyMessage`](../interfaces/networkTypes.RestTxBodyMessage.md) |
| `txResponseItemLogEntry?` | [`RestTxResponseLog`](../interfaces/networkTypes.RestTxResponseLog.md) |

##### Returns

[`FormattedBlockChainTxMessage`](../interfaces/transformerTypes.FormattedBlockChainTxMessage.md)

#### Defined in

services/transformers/transactions/types.ts:4
