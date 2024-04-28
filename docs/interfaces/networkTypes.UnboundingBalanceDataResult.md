[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / UnboundingBalanceDataResult

# Interface: UnboundingBalanceDataResult

[networkTypes](../modules/networkTypes.md).UnboundingBalanceDataResult

## Hierarchy

- [`NetworkAxiosDataResult`](networkTypes.NetworkAxiosDataResult.md)

  ↳ **`UnboundingBalanceDataResult`**

## Table of contents

### Properties

- [error](networkTypes.UnboundingBalanceDataResult.md#error)
- [response](networkTypes.UnboundingBalanceDataResult.md#response)

## Properties

### error

• `Optional` **error**: [`ResultError`](networkTypes.ResultError.md)

#### Inherited from

[NetworkAxiosDataResult](networkTypes.NetworkAxiosDataResult.md).[error](networkTypes.NetworkAxiosDataResult.md#error)

#### Defined in

network/types.ts:8

___

### response

• `Optional` **response**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pagination` | ``null`` \| [`RestPagination`](../modules/networkTypes.md#restpagination) |
| `unbonding_responses` | [`UnboundingBalanceResult`](networkTypes.UnboundingBalanceResult.md)[] |

#### Overrides

[NetworkAxiosDataResult](networkTypes.NetworkAxiosDataResult.md).[response](networkTypes.NetworkAxiosDataResult.md#response)

#### Defined in

network/types.ts:149
