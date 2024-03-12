[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / BlockChainSubmittedTx

# Interface: BlockChainSubmittedTx

[networkTypes](../modules/networkTypes.md).BlockChainSubmittedTx

## Table of contents

### Properties

- [type](networkTypes.BlockChainSubmittedTx.md#type)
- [value](networkTypes.BlockChainSubmittedTx.md#value)

## Properties

### type

• **type**: `string`

#### Defined in

services/network/types.ts:340

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fee` | [`TxFee`](networkTypes.TxFee.md) |
| `memo` | `string` |
| `msg` | [`BlockChainTxMessage`](networkTypes.BlockChainTxMessage.md)[] |
| `signatures` | [`TxSignature`](networkTypes.TxSignature.md)[] |

#### Defined in

services/network/types.ts:341
