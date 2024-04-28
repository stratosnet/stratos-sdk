[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / DelegatedBalanceDataResult

# Interface: DelegatedBalanceDataResult

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).DelegatedBalanceDataResult

## Hierarchy

- [`NetworkAxiosDataResult`](network.networkTypes.NetworkAxiosDataResult.md)

  ↳ **`DelegatedBalanceDataResult`**

## Table of contents

### Properties

- [error](network.networkTypes.DelegatedBalanceDataResult.md#error)
- [response](network.networkTypes.DelegatedBalanceDataResult.md#response)

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
| `delegation_responses` | [`DelegatedBalanceResult`](network.networkTypes.DelegatedBalanceResult.md)[] |
| `pagination` | ``null`` \| [`RestPagination`](../modules/network.networkTypes.md#restpagination) |

#### Overrides

[NetworkAxiosDataResult](network.networkTypes.NetworkAxiosDataResult.md).[response](network.networkTypes.NetworkAxiosDataResult.md#response)

#### Defined in

network/networkTypes.ts:132
