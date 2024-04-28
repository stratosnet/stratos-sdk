[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / BlockChainTxMessage

# Interface: BlockChainTxMessage

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).BlockChainTxMessage

## Hierarchy

- **`BlockChainTxMessage`**

  ↳ [`BlockChainSentTxMessage`](network.networkTypes.BlockChainSentTxMessage.md)

  ↳ [`BlockChainDelegatedTxMessage`](network.networkTypes.BlockChainDelegatedTxMessage.md)

## Table of contents

### Properties

- [type](network.networkTypes.BlockChainTxMessage.md#type)
- [value](network.networkTypes.BlockChainTxMessage.md#value)

## Properties

### type

• **type**: `string`

#### Defined in

network/networkTypes.ts:309

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address?` | `string` |
| `amount` | [`TxAmount`](network.networkTypes.TxAmount.md) \| [`TxAmount`](network.networkTypes.TxAmount.md)[] |
| `delegator_address?` | `string` |
| `from?` | `string` |
| `from_address?` | `string` |
| `reporter?` | `string` |
| `sender?` | `string` |
| `to_address?` | `string` |
| `validator_address?` | `string` |

#### Defined in

network/networkTypes.ts:310
