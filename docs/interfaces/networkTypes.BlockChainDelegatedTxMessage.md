[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / BlockChainDelegatedTxMessage

# Interface: BlockChainDelegatedTxMessage

[networkTypes](../modules/networkTypes.md).BlockChainDelegatedTxMessage

## Hierarchy

- [`BlockChainTxMessage`](networkTypes.BlockChainTxMessage.md)

  ↳ **`BlockChainDelegatedTxMessage`**

## Table of contents

### Properties

- [type](networkTypes.BlockChainDelegatedTxMessage.md#type)
- [value](networkTypes.BlockChainDelegatedTxMessage.md#value)

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
| `amount` | [`TxAmount`](networkTypes.TxAmount.md) |
| `delegator_address` | `string` |
| `validator_address` | `string` |

#### Overrides

[BlockChainTxMessage](networkTypes.BlockChainTxMessage.md).[value](networkTypes.BlockChainTxMessage.md#value)

#### Defined in

network/types.ts:332
