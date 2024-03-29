[Stratos SDK](../README.md) / [Exports](../modules.md) / [transactionTypes](../modules/transactionTypes.md) / BeginRedelegateTxMessage

# Interface: BeginRedelegateTxMessage

[transactionTypes](../modules/transactionTypes.md).BeginRedelegateTxMessage

## Table of contents

### Properties

- [typeUrl](transactionTypes.BeginRedelegateTxMessage.md#typeurl)
- [value](transactionTypes.BeginRedelegateTxMessage.md#value)

## Properties

### typeUrl

• **typeUrl**: [`TxMsgTypes`](../enums/transactionTypes.TxMsgTypes.md)

#### Defined in

transactions/types.ts:183

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `amount` | [`AmountType`](transactionTypes.AmountType.md) |
| `delegatorAddress` | `string` |
| `validatorDstAddress` | `string` |
| `validatorSrcAddress` | `string` |

#### Defined in

transactions/types.ts:184
