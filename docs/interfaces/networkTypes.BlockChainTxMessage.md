[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / BlockChainTxMessage

# Interface: BlockChainTxMessage

[networkTypes](../modules/networkTypes.md).BlockChainTxMessage

## Hierarchy

- **`BlockChainTxMessage`**

  ↳ [`BlockChainSentTxMessage`](networkTypes.BlockChainSentTxMessage.md)

  ↳ [`BlockChainDelegatedTxMessage`](networkTypes.BlockChainDelegatedTxMessage.md)

## Table of contents

### Properties

- [type](networkTypes.BlockChainTxMessage.md#type)
- [value](networkTypes.BlockChainTxMessage.md#value)

## Properties

### type

• **type**: `string`

#### Defined in

network/types.ts:309

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address?` | `string` |
| `amount` | [`TxAmount`](networkTypes.TxAmount.md) \| [`TxAmount`](networkTypes.TxAmount.md)[] |
| `delegator_address?` | `string` |
| `from?` | `string` |
| `from_address?` | `string` |
| `reporter?` | `string` |
| `sender?` | `string` |
| `to_address?` | `string` |
| `validator_address?` | `string` |

#### Defined in

network/types.ts:310
