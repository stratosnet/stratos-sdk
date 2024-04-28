[Stratos SDK](../README.md) / [Exports](../modules.md) / [sds](sds.md) / transactions

# Namespace: transactions

[sds](sds.md).transactions

## Table of contents

### Namespaces

- [sdsTxTypes](sds.transactions.sdsTxTypes.md)

### Functions

- [getSdsPrepayTx](sds.transactions.md#getsdsprepaytx)

## Functions

### getSdsPrepayTx

▸ **getSdsPrepayTx**(`senderAddress`, `prepayPayload`): `Promise`\<[`SdsPrepayTxMessage`](../interfaces/sds.transactions.sdsTxTypes.SdsPrepayTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `senderAddress` | `string` |
| `prepayPayload` | [`SdsPrepayTxPayload`](../interfaces/sds.transactions.sdsTxTypes.SdsPrepayTxPayload.md)[] |

#### Returns

`Promise`\<[`SdsPrepayTxMessage`](../interfaces/sds.transactions.sdsTxTypes.SdsPrepayTxMessage.md)[]\>

#### Defined in

sds/transactions/transactions.ts:5
