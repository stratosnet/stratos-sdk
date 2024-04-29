[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / UnboundingBalanceDataResult

# Interface: UnboundingBalanceDataResult

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).UnboundingBalanceDataResult

## Hierarchy

- [`NetworkAxiosDataResult`](network.networkTypes.NetworkAxiosDataResult.md)

  ↳ **`UnboundingBalanceDataResult`**

## Table of contents

### Properties

- [error](network.networkTypes.UnboundingBalanceDataResult.md#error)
- [response](network.networkTypes.UnboundingBalanceDataResult.md#response)

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
| `pagination` | ``null`` \| [`RestPagination`](../modules/network.networkTypes.md#restpagination) |
| `unbonding_responses` | [`UnboundingBalanceResult`](network.networkTypes.UnboundingBalanceResult.md)[] |

#### Overrides

[NetworkAxiosDataResult](network.networkTypes.NetworkAxiosDataResult.md).[response](network.networkTypes.NetworkAxiosDataResult.md#response)

#### Defined in

network/networkTypes.ts:108
