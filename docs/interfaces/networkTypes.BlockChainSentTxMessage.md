[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / BlockChainSentTxMessage

# Interface: BlockChainSentTxMessage

[networkTypes](../modules/networkTypes.md).BlockChainSentTxMessage

## Hierarchy

- [`BlockChainTxMessage`](networkTypes.BlockChainTxMessage.md)

  ↳ **`BlockChainSentTxMessage`**

## Table of contents

### Properties

- [type](networkTypes.BlockChainSentTxMessage.md#type)
- [value](networkTypes.BlockChainSentTxMessage.md#value)

## Properties

### type

• **type**: `string`

#### Inherited from

[BlockChainTxMessage](networkTypes.BlockChainTxMessage.md).[type](networkTypes.BlockChainTxMessage.md#type)

#### Defined in

network/types.ts:309

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | [`TxAmount`](networkTypes.TxAmount.md)[] |
| `from_address` | `string` |
| `to_address` | `string` |

#### Overrides

[BlockChainTxMessage](networkTypes.BlockChainTxMessage.md).[value](networkTypes.BlockChainTxMessage.md#value)

#### Defined in

network/types.ts:324
