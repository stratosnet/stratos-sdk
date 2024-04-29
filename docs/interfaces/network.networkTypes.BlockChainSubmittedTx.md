[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / BlockChainSubmittedTx

# Interface: BlockChainSubmittedTx

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).BlockChainSubmittedTx

## Table of contents

### Properties

- [type](network.networkTypes.BlockChainSubmittedTx.md#type)
- [value](network.networkTypes.BlockChainSubmittedTx.md#value)

## Properties

### type

• **type**: `string`

#### Defined in

network/networkTypes.ts:260

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fee` | [`TxFee`](network.networkTypes.TxFee.md) |
| `memo` | `string` |
| `msg` | [`BlockChainTxMessage`](network.networkTypes.BlockChainTxMessage.md)[] |
| `signatures` | [`TxSignature`](network.networkTypes.TxSignature.md)[] |

#### Defined in

network/networkTypes.ts:261
