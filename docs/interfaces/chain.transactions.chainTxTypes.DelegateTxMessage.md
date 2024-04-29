[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](../modules/chain.md) / [transactions](../modules/chain.transactions.md) / [chainTxTypes](../modules/chain.transactions.chainTxTypes.md) / DelegateTxMessage

# Interface: DelegateTxMessage

[transactions](../modules/chain.transactions.md).[chainTxTypes](../modules/chain.transactions.chainTxTypes.md).DelegateTxMessage

## Hierarchy

- **`DelegateTxMessage`**

  ↳ [`UnDelegateTxMessage`](chain.transactions.chainTxTypes.UnDelegateTxMessage.md)

## Table of contents

### Properties

- [typeUrl](chain.transactions.chainTxTypes.DelegateTxMessage.md#typeurl)
- [value](chain.transactions.chainTxTypes.DelegateTxMessage.md#value)

## Properties

### typeUrl

• **typeUrl**: [`TxMsgTypes`](../enums/chain.transactions.chainTxTypes.TxMsgTypes.md)

#### Defined in

chain/transactions/types.ts:141

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `AmountType` |
| `delegatorAddress` | `string` |
| `validatorAddress` | `string` |

#### Defined in

chain/transactions/types.ts:142
