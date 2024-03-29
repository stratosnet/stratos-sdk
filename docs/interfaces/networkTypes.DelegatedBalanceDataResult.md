[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / DelegatedBalanceDataResult

# Interface: DelegatedBalanceDataResult

[networkTypes](../modules/networkTypes.md).DelegatedBalanceDataResult

## Hierarchy

- [`NetworkAxiosDataResult`](networkTypes.NetworkAxiosDataResult.md)

  ↳ **`DelegatedBalanceDataResult`**

## Table of contents

### Properties

- [error](networkTypes.DelegatedBalanceDataResult.md#error)
- [response](networkTypes.DelegatedBalanceDataResult.md#response)

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
| `delegation_responses` | [`DelegatedBalanceResult`](networkTypes.DelegatedBalanceResult.md)[] |
| `pagination` | ``null`` \| [`RestPagination`](../modules/networkTypes.md#restpagination) |

#### Overrides

[NetworkAxiosDataResult](networkTypes.NetworkAxiosDataResult.md).[response](networkTypes.NetworkAxiosDataResult.md#response)

#### Defined in

services/network/types.ts:132
