[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / RewardBalanceDataResult

# Interface: RewardBalanceDataResult

[networkTypes](../modules/networkTypes.md).RewardBalanceDataResult

## Hierarchy

- [`NetworkAxiosDataResult`](networkTypes.NetworkAxiosDataResult.md)

  ↳ **`RewardBalanceDataResult`**

## Table of contents

### Properties

- [error](networkTypes.RewardBalanceDataResult.md#error)
- [response](networkTypes.RewardBalanceDataResult.md#response)

## Properties

### error

• `Optional` **error**: [`ResultError`](networkTypes.ResultError.md)

#### Inherited from

[NetworkAxiosDataResult](networkTypes.NetworkAxiosDataResult.md).[error](networkTypes.NetworkAxiosDataResult.md#error)

#### Defined in

services/network/types.ts:8

___

### response

• `Optional` **response**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `rewards` | [`Rewards`](networkTypes.Rewards.md)[] |
| `total` | [`Amount`](networkTypes.Amount.md)[] |

#### Overrides

[NetworkAxiosDataResult](networkTypes.NetworkAxiosDataResult.md).[response](networkTypes.NetworkAxiosDataResult.md#response)

#### Defined in

services/network/types.ts:140
