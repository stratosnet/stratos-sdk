[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / BlockChainSentTxMessage

# Interface: BlockChainSentTxMessage

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).BlockChainSentTxMessage

## Hierarchy

- [`BlockChainTxMessage`](network.networkTypes.BlockChainTxMessage.md)

  ↳ **`BlockChainSentTxMessage`**

## Table of contents

### Properties

- [type](network.networkTypes.BlockChainSentTxMessage.md#type)
- [value](network.networkTypes.BlockChainSentTxMessage.md#value)

## Properties

### type

• **type**: `string`

#### Inherited from

[BlockChainTxMessage](network.networkTypes.BlockChainTxMessage.md).[type](network.networkTypes.BlockChainTxMessage.md#type)

#### Defined in

network/networkTypes.ts:309

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | [`TxAmount`](network.networkTypes.TxAmount.md)[] |
| `from_address` | `string` |
| `to_address` | `string` |

#### Overrides

[BlockChainTxMessage](network.networkTypes.BlockChainTxMessage.md).[value](network.networkTypes.BlockChainTxMessage.md#value)

#### Defined in

network/networkTypes.ts:324
