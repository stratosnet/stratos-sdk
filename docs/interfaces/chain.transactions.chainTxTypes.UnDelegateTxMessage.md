[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](../modules/chain.md) / [transactions](../modules/chain.transactions.md) / [chainTxTypes](../modules/chain.transactions.chainTxTypes.md) / UnDelegateTxMessage

# Interface: UnDelegateTxMessage

[transactions](../modules/chain.transactions.md).[chainTxTypes](../modules/chain.transactions.chainTxTypes.md).UnDelegateTxMessage

## Hierarchy

- [`DelegateTxMessage`](chain.transactions.chainTxTypes.DelegateTxMessage.md)

  ↳ **`UnDelegateTxMessage`**

## Table of contents

### Properties

- [typeUrl](chain.transactions.chainTxTypes.UnDelegateTxMessage.md#typeurl)
- [value](chain.transactions.chainTxTypes.UnDelegateTxMessage.md#value)

## Properties

### typeUrl

• **typeUrl**: [`TxMsgTypes`](../enums/chain.transactions.chainTxTypes.TxMsgTypes.md)

#### Inherited from

[DelegateTxMessage](chain.transactions.chainTxTypes.DelegateTxMessage.md).[typeUrl](chain.transactions.chainTxTypes.DelegateTxMessage.md#typeurl)

#### Defined in

chain/transactions/types.ts:156

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | `AmountType` |
| `delegatorAddress` | `string` |
| `validatorAddress` | `string` |

#### Inherited from

[DelegateTxMessage](chain.transactions.chainTxTypes.DelegateTxMessage.md).[value](chain.transactions.chainTxTypes.DelegateTxMessage.md#value)

#### Defined in

chain/transactions/types.ts:157
