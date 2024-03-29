[Stratos SDK](../README.md) / [Exports](../modules.md) / [transactionTypes](../modules/transactionTypes.md) / UnDelegateTxMessage

# Interface: UnDelegateTxMessage

[transactionTypes](../modules/transactionTypes.md).UnDelegateTxMessage

## Hierarchy

- [`DelegateTxMessage`](transactionTypes.DelegateTxMessage.md)

  ↳ **`UnDelegateTxMessage`**

## Table of contents

### Properties

- [typeUrl](transactionTypes.UnDelegateTxMessage.md#typeurl)
- [value](transactionTypes.UnDelegateTxMessage.md#value)

## Properties

### typeUrl

• **typeUrl**: [`TxMsgTypes`](../enums/transactionTypes.TxMsgTypes.md)

#### Inherited from

[DelegateTxMessage](transactionTypes.DelegateTxMessage.md).[typeUrl](transactionTypes.DelegateTxMessage.md#typeurl)

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

#### Inherited from

[DelegateTxMessage](transactionTypes.DelegateTxMessage.md).[value](transactionTypes.DelegateTxMessage.md#value)

#### Defined in

transactions/types.ts:175
