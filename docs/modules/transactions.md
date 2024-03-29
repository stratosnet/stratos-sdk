[Stratos SDK](../README.md) / [Exports](../modules.md) / transactions

# Namespace: transactions

## Table of contents

### Interfaces

- [JsonizedTx](../interfaces/transactions.JsonizedTx.md)

### Functions

- [assembleTxRawFromTx](transactions.md#assembletxrawfromtx)
- [broadcast](transactions.md#broadcast)
- [decodeTxRawToTx](transactions.md#decodetxrawtotx)
- [decodeTxRawToTxHr](transactions.md#decodetxrawtotxhr)
- [encodeTxHrToTx](transactions.md#encodetxhrtotx)
- [encodeTxRawToEncodedTx](transactions.md#encodetxrawtoencodedtx)
- [getBeginRedelegateTx](transactions.md#getbeginredelegatetx)
- [getDelegateTx](transactions.md#getdelegatetx)
- [getSdsPrepayTx](transactions.md#getsdsprepaytx)
- [getSendTx](transactions.md#getsendtx)
- [getStandardAmount](transactions.md#getstandardamount)
- [getStandardDefaultFee](transactions.md#getstandarddefaultfee)
- [getStandardFee](transactions.md#getstandardfee)
- [getUnDelegateTx](transactions.md#getundelegatetx)
- [getWithdrawalAllRewardTx](transactions.md#getwithdrawalallrewardtx)
- [getWithdrawalRewardTx](transactions.md#getwithdrawalrewardtx)
- [sign](transactions.md#sign)

## Functions

### assembleTxRawFromTx

▸ **assembleTxRawFromTx**(`tx`): `TxRaw`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `Tx` |

#### Returns

`TxRaw`

#### Defined in

transactions/transactions.ts:54

___

### broadcast

▸ **broadcast**(`signedTx`): `Promise`\<`DeliverTxResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signedTx` | `TxRaw` |

#### Returns

`Promise`\<`DeliverTxResponse`\>

#### Defined in

transactions/transactions.ts:113

___

### decodeTxRawToTx

▸ **decodeTxRawToTx**(`signedTx`): `Tx`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signedTx` | `TxRaw` |

#### Returns

`Tx`

#### Defined in

transactions/transactions.ts:78

___

### decodeTxRawToTxHr

▸ **decodeTxRawToTxHr**(`signedTx`): `Promise`\<[`JsonizedTx`](../interfaces/transactions.JsonizedTx.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signedTx` | `TxRaw` |

#### Returns

`Promise`\<[`JsonizedTx`](../interfaces/transactions.JsonizedTx.md)\>

#### Defined in

transactions/transactions.ts:92

___

### encodeTxHrToTx

▸ **encodeTxHrToTx**(`jsonizedTx`): `Promise`\<`Tx`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `jsonizedTx` | [`JsonizedTx`](../interfaces/transactions.JsonizedTx.md) |

#### Returns

`Promise`\<`Tx`\>

#### Defined in

transactions/transactions.ts:64

___

### encodeTxRawToEncodedTx

▸ **encodeTxRawToEncodedTx**(`signedTx`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signedTx` | `TxRaw` |

#### Returns

`Uint8Array`

#### Defined in

transactions/transactions.ts:108

___

### getBeginRedelegateTx

▸ **getBeginRedelegateTx**(`delegatorAddress`, `delegatePayload`): `Promise`\<[`BeginRedelegateTxMessage`](../interfaces/transactionTypes.BeginRedelegateTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |
| `delegatePayload` | [`BeginRedelegateTxPayload`](../interfaces/transactionTypes.BeginRedelegateTxPayload.md)[] |

#### Returns

`Promise`\<[`BeginRedelegateTxMessage`](../interfaces/transactionTypes.BeginRedelegateTxMessage.md)[]\>

#### Defined in

transactions/transactions.ts:286

___

### getDelegateTx

▸ **getDelegateTx**(`delegatorAddress`, `delegatePayload`): `Promise`\<[`DelegateTxMessage`](../interfaces/transactionTypes.DelegateTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |
| `delegatePayload` | [`DelegateTxPayload`](../interfaces/transactionTypes.DelegateTxPayload.md)[] |

#### Returns

`Promise`\<[`DelegateTxMessage`](../interfaces/transactionTypes.DelegateTxMessage.md)[]\>

#### Defined in

transactions/transactions.ts:251

___

### getSdsPrepayTx

▸ **getSdsPrepayTx**(`senderAddress`, `prepayPayload`): `Promise`\<[`SdsPrepayTxMessage`](../interfaces/transactionTypes.SdsPrepayTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `senderAddress` | `string` |
| `prepayPayload` | [`SdsPrepayTxPayload`](../interfaces/transactionTypes.SdsPrepayTxPayload.md)[] |

#### Returns

`Promise`\<[`SdsPrepayTxMessage`](../interfaces/transactionTypes.SdsPrepayTxMessage.md)[]\>

#### Defined in

transactions/transactions.ts:421

___

### getSendTx

▸ **getSendTx**(`keyPairAddress`, `sendPayload`): `Promise`\<[`SendTxMessage`](../interfaces/transactionTypes.SendTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyPairAddress` | `string` |
| `sendPayload` | [`SendTxPayload`](../interfaces/transactionTypes.SendTxPayload.md)[] |

#### Returns

`Promise`\<[`SendTxMessage`](../interfaces/transactionTypes.SendTxMessage.md)[]\>

#### Defined in

transactions/transactions.ts:221

___

### getStandardAmount

▸ **getStandardAmount**(`amounts`): [`AmountType`](../interfaces/transactionTypes.AmountType.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `amounts` | `number`[] |

#### Returns

[`AmountType`](../interfaces/transactionTypes.AmountType.md)[]

#### Defined in

transactions/transactions.ts:212

___

### getStandardDefaultFee

▸ **getStandardDefaultFee**(): [`TransactionFee`](../interfaces/transactionTypes.TransactionFee.md)

#### Returns

[`TransactionFee`](../interfaces/transactionTypes.TransactionFee.md)

#### Defined in

transactions/transactions.ts:129

___

### getStandardFee

▸ **getStandardFee**(`signerAddress?`, `txMessages?`): `Promise`\<[`TransactionFee`](../interfaces/transactionTypes.TransactionFee.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerAddress?` | `string` |
| `txMessages?` | [`TxMessage`](transactionTypes.md#txmessage)[] |

#### Returns

`Promise`\<[`TransactionFee`](../interfaces/transactionTypes.TransactionFee.md)\>

#### Defined in

transactions/transactions.ts:147

___

### getUnDelegateTx

▸ **getUnDelegateTx**(`delegatorAddress`, `unDelegatePayload`): `Promise`\<[`UnDelegateTxMessage`](../interfaces/transactionTypes.UnDelegateTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |
| `unDelegatePayload` | [`UnDelegateTxPayload`](../interfaces/transactionTypes.UnDelegateTxPayload.md)[] |

#### Returns

`Promise`\<[`UnDelegateTxMessage`](../interfaces/transactionTypes.UnDelegateTxMessage.md)[]\>

#### Defined in

transactions/transactions.ts:323

___

### getWithdrawalAllRewardTx

▸ **getWithdrawalAllRewardTx**(`delegatorAddress`): `Promise`\<[`WithdrawalRewardTxMessage`](../interfaces/transactionTypes.WithdrawalRewardTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |

#### Returns

`Promise`\<[`WithdrawalRewardTxMessage`](../interfaces/transactionTypes.WithdrawalRewardTxMessage.md)[]\>

#### Defined in

transactions/transactions.ts:385

___

### getWithdrawalRewardTx

▸ **getWithdrawalRewardTx**(`delegatorAddress`, `withdrawalPayload`): `Promise`\<[`WithdrawalRewardTxMessage`](../interfaces/transactionTypes.WithdrawalRewardTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |
| `withdrawalPayload` | [`WithdrawalRewardTxPayload`](../interfaces/transactionTypes.WithdrawalRewardTxPayload.md)[] |

#### Returns

`Promise`\<[`WithdrawalRewardTxMessage`](../interfaces/transactionTypes.WithdrawalRewardTxMessage.md)[]\>

#### Defined in

transactions/transactions.ts:356

___

### sign

▸ **sign**(`address`, `txMessages`, `memo?`, `givenFee?`): `Promise`\<`TxRaw`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `txMessages` | [`TxMessage`](transactionTypes.md#txmessage)[] | `undefined` |
| `memo` | `string` | `''` |
| `givenFee?` | [`TransactionFee`](../interfaces/transactionTypes.TransactionFee.md) | `undefined` |

#### Returns

`Promise`\<`TxRaw`\>

#### Defined in

transactions/transactions.ts:193
