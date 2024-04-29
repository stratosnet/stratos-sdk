[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / RewardBalanceDataResult

# Interface: RewardBalanceDataResult

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).RewardBalanceDataResult

## Hierarchy

- [`NetworkAxiosDataResult`](network.networkTypes.NetworkAxiosDataResult.md)

  ↳ **`RewardBalanceDataResult`**

## Table of contents

### Properties

- [error](network.networkTypes.RewardBalanceDataResult.md#error)
- [response](network.networkTypes.RewardBalanceDataResult.md#response)

## Properties

### error

• `Optional` **error**: [`ResultError`](network.networkTypes.ResultError.md)

#### Inherited from

[NetworkAxiosDataResult](network.networkTypes.NetworkAxiosDataResult.md).[error](network.networkTypes.NetworkAxiosDataResult.md#error)

#### Defined in

network/networkTypes.ts:8

___

### response

• `Optional` **response**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `rewards` | [`Rewards`](network.networkTypes.Rewards.md)[] |
| `total` | [`Amount`](network.networkTypes.Amount.md)[] |

#### Overrides

[NetworkAxiosDataResult](network.networkTypes.NetworkAxiosDataResult.md).[response](network.networkTypes.NetworkAxiosDataResult.md#response)

#### Defined in

network/networkTypes.ts:101
