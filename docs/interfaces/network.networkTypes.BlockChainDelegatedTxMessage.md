[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / BlockChainDelegatedTxMessage

# Interface: BlockChainDelegatedTxMessage

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).BlockChainDelegatedTxMessage

## Hierarchy

- [`BlockChainTxMessage`](network.networkTypes.BlockChainTxMessage.md)

  ↳ **`BlockChainDelegatedTxMessage`**

## Table of contents

### Properties

- [type](network.networkTypes.BlockChainDelegatedTxMessage.md#type)
- [value](network.networkTypes.BlockChainDelegatedTxMessage.md#value)

## Properties

### type

• **type**: `string`

#### Inherited from

[BlockChainTxMessage](network.networkTypes.BlockChainTxMessage.md).[type](network.networkTypes.BlockChainTxMessage.md#type)

#### Defined in

network/networkTypes.ts:229

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | [`Amount`](network.networkTypes.Amount.md) |
| `delegator_address` | `string` |
| `validator_address` | `string` |

#### Overrides

[BlockChainTxMessage](network.networkTypes.BlockChainTxMessage.md).[value](network.networkTypes.BlockChainTxMessage.md#value)

#### Defined in

network/networkTypes.ts:252
