[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](chain.md) / transactions

# Namespace: transactions

[chain](chain.md).transactions

## Table of contents

### Namespaces

- [chainTxTypes](chain.transactions.chainTxTypes.md)

### Functions

- [assembleTxRawFromTx](chain.transactions.md#assembletxrawfromtx)
- [broadcast](chain.transactions.md#broadcast)
- [decodeTxRawToTx](chain.transactions.md#decodetxrawtotx)
- [decodeTxRawToTxHr](chain.transactions.md#decodetxrawtotxhr)
- [encodeTxHrToTx](chain.transactions.md#encodetxhrtotx)
- [encodeTxRawToEncodedTx](chain.transactions.md#encodetxrawtoencodedtx)
- [getBeginRedelegateTx](chain.transactions.md#getbeginredelegatetx)
- [getDelegateTx](chain.transactions.md#getdelegatetx)
- [getSendTx](chain.transactions.md#getsendtx)
- [getStandardDefaultFee](chain.transactions.md#getstandarddefaultfee)
- [getStandardFee](chain.transactions.md#getstandardfee)
- [getUnDelegateTx](chain.transactions.md#getundelegatetx)
- [getWithdrawalAllRewardTx](chain.transactions.md#getwithdrawalallrewardtx)
- [getWithdrawalRewardTx](chain.transactions.md#getwithdrawalrewardtx)
- [sign](chain.transactions.md#sign)

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

chain/transactions/transactions.ts:53

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

chain/transactions/transactions.ts:112

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

chain/transactions/transactions.ts:77

___

### decodeTxRawToTxHr

▸ **decodeTxRawToTxHr**(`signedTx`): `Promise`\<`JsonizedTx`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signedTx` | `TxRaw` |

#### Returns

`Promise`\<`JsonizedTx`\>

#### Defined in

chain/transactions/transactions.ts:91

___

### encodeTxHrToTx

▸ **encodeTxHrToTx**(`jsonizedTx`): `Promise`\<`Tx`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `jsonizedTx` | `JsonizedTx` |

#### Returns

`Promise`\<`Tx`\>

#### Defined in

chain/transactions/transactions.ts:63

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

chain/transactions/transactions.ts:107

___

### getBeginRedelegateTx

▸ **getBeginRedelegateTx**(`delegatorAddress`, `delegatePayload`): `Promise`\<[`BeginRedelegateTxMessage`](../interfaces/chain.transactions.chainTxTypes.BeginRedelegateTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |
| `delegatePayload` | [`BeginRedelegateTxPayload`](../interfaces/chain.transactions.chainTxTypes.BeginRedelegateTxPayload.md)[] |

#### Returns

`Promise`\<[`BeginRedelegateTxMessage`](../interfaces/chain.transactions.chainTxTypes.BeginRedelegateTxMessage.md)[]\>

#### Defined in

chain/transactions/transactions.ts:286

___

### getDelegateTx

▸ **getDelegateTx**(`delegatorAddress`, `delegatePayload`): `Promise`\<[`DelegateTxMessage`](../interfaces/chain.transactions.chainTxTypes.DelegateTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |
| `delegatePayload` | [`DelegateTxPayload`](../interfaces/chain.transactions.chainTxTypes.DelegateTxPayload.md)[] |

#### Returns

`Promise`\<[`DelegateTxMessage`](../interfaces/chain.transactions.chainTxTypes.DelegateTxMessage.md)[]\>

#### Defined in

chain/transactions/transactions.ts:251

___

### getSendTx

▸ **getSendTx**(`keyPairAddress`, `sendPayload`): `Promise`\<[`SendTxMessage`](../interfaces/chain.transactions.chainTxTypes.SendTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyPairAddress` | `string` |
| `sendPayload` | [`SendTxPayload`](../interfaces/chain.transactions.chainTxTypes.SendTxPayload.md)[] |

#### Returns

`Promise`\<[`SendTxMessage`](../interfaces/chain.transactions.chainTxTypes.SendTxMessage.md)[]\>

#### Defined in

chain/transactions/transactions.ts:221

___

### getStandardDefaultFee

▸ **getStandardDefaultFee**(): [`TransactionFee`](../interfaces/chain.transactions.chainTxTypes.TransactionFee.md)

#### Returns

[`TransactionFee`](../interfaces/chain.transactions.chainTxTypes.TransactionFee.md)

#### Defined in

chain/transactions/transactions.ts:128

___

### getStandardFee

▸ **getStandardFee**(`signerAddress?`, `txMessages?`): `Promise`\<[`TransactionFee`](../interfaces/chain.transactions.chainTxTypes.TransactionFee.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerAddress?` | `string` |
| `txMessages?` | [`TxMessage`](chain.transactions.chainTxTypes.md#txmessage)[] |

#### Returns

`Promise`\<[`TransactionFee`](../interfaces/chain.transactions.chainTxTypes.TransactionFee.md)\>

#### Defined in

chain/transactions/transactions.ts:146

___

### getUnDelegateTx

▸ **getUnDelegateTx**(`delegatorAddress`, `unDelegatePayload`): `Promise`\<[`UnDelegateTxMessage`](../interfaces/chain.transactions.chainTxTypes.UnDelegateTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |
| `unDelegatePayload` | [`UnDelegateTxPayload`](../interfaces/chain.transactions.chainTxTypes.UnDelegateTxPayload.md)[] |

#### Returns

`Promise`\<[`UnDelegateTxMessage`](../interfaces/chain.transactions.chainTxTypes.UnDelegateTxMessage.md)[]\>

#### Defined in

chain/transactions/transactions.ts:323

___

### getWithdrawalAllRewardTx

▸ **getWithdrawalAllRewardTx**(`delegatorAddress`): `Promise`\<[`WithdrawalRewardTxMessage`](../interfaces/chain.transactions.chainTxTypes.WithdrawalRewardTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |

#### Returns

`Promise`\<[`WithdrawalRewardTxMessage`](../interfaces/chain.transactions.chainTxTypes.WithdrawalRewardTxMessage.md)[]\>

#### Defined in

chain/transactions/transactions.ts:385

___

### getWithdrawalRewardTx

▸ **getWithdrawalRewardTx**(`delegatorAddress`, `withdrawalPayload`): `Promise`\<[`WithdrawalRewardTxMessage`](../interfaces/chain.transactions.chainTxTypes.WithdrawalRewardTxMessage.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |
| `withdrawalPayload` | [`WithdrawalRewardTxPayload`](../interfaces/chain.transactions.chainTxTypes.WithdrawalRewardTxPayload.md)[] |

#### Returns

`Promise`\<[`WithdrawalRewardTxMessage`](../interfaces/chain.transactions.chainTxTypes.WithdrawalRewardTxMessage.md)[]\>

#### Defined in

chain/transactions/transactions.ts:356

___

### sign

▸ **sign**(`address`, `txMessages`, `memo?`, `givenFee?`): `Promise`\<`TxRaw`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `txMessages` | [`TxMessage`](chain.transactions.chainTxTypes.md#txmessage)[] | `undefined` |
| `memo` | `string` | `''` |
| `givenFee?` | [`TransactionFee`](../interfaces/chain.transactions.chainTxTypes.TransactionFee.md) | `undefined` |

#### Returns

`Promise`\<`TxRaw`\>

#### Defined in

chain/transactions/transactions.ts:192
