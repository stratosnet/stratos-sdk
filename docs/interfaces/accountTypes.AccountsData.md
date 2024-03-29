[Stratos SDK](../README.md) / [Exports](../modules.md) / [accountTypes](../modules/accountTypes.md) / AccountsData

# Interface: AccountsData

[accountTypes](../modules/accountTypes.md).AccountsData

## Table of contents

### Properties

- [height](accountTypes.AccountsData.md#height)
- [result](accountTypes.AccountsData.md#result)

## Properties

### height

• **height**: `string`

#### Defined in

accounts/types.ts:8

___

### result

• **result**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | [`Account`](../enums/transactionTypes.TxMsgTypes.md#account) |
| `value` | \{ `account_number`: `string` ; `address`: `string` ; `coins`: [`AmountType`](transactionTypes.AmountType.md)[] ; `public_key`: `any` ; `sequence`: `string`  } |
| `value.account_number` | `string` |
| `value.address` | `string` |
| `value.coins` | [`AmountType`](transactionTypes.AmountType.md)[] |
| `value.public_key` | `any` |
| `value.sequence` | `string` |

#### Defined in

accounts/types.ts:9
