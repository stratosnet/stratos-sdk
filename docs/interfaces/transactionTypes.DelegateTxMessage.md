[Stratos SDK](../README.md) / [Exports](../modules.md) / [transactionTypes](../modules/transactionTypes.md) / DelegateTxMessage

# Interface: DelegateTxMessage

[transactionTypes](../modules/transactionTypes.md).DelegateTxMessage

## Hierarchy

- **`DelegateTxMessage`**

  ↳ [`UnDelegateTxMessage`](transactionTypes.UnDelegateTxMessage.md)

## Table of contents

### Properties

- [typeUrl](transactionTypes.DelegateTxMessage.md#typeurl)
- [value](transactionTypes.DelegateTxMessage.md#value)

## Properties

### typeUrl

• **typeUrl**: [`TxMsgTypes`](../enums/transactionTypes.TxMsgTypes.md)

#### Defined in

transactions/types.ts:174

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | [`AmountType`](transactionTypes.AmountType.md) |
| `delegatorAddress` | `string` |
| `validatorAddress` | `string` |

#### Defined in

transactions/types.ts:175
