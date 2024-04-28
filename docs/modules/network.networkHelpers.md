[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](network.md) / networkHelpers

# Namespace: networkHelpers

[network](network.md).networkHelpers

## Table of contents

### Functions

- [getNewProtocolFlag](network.networkHelpers.md#getnewprotocolflag)
- [isNewBalanceVersion](network.networkHelpers.md#isnewbalanceversion)
- [isOldBalanceVersion](network.networkHelpers.md#isoldbalanceversion)
- [isValidPagination](network.networkHelpers.md#isvalidpagination)

## Functions

### getNewProtocolFlag

▸ **getNewProtocolFlag**(`currentVersion`, `minRequiredNewVersion`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `currentVersion` | `string` |
| `minRequiredNewVersion` | `string` |

#### Returns

`boolean`

#### Defined in

network/helpers.ts:8

___

### isNewBalanceVersion

▸ **isNewBalanceVersion**(`response`): response is AvailableBalanceResponseN

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`AvailableBalanceResponse`](network.networkTypes.md#availablebalanceresponse) |

#### Returns

response is AvailableBalanceResponseN

#### Defined in

network/helpers.ts:22

___

### isOldBalanceVersion

▸ **isOldBalanceVersion**(`response`): response is AvailableBalanceResponseO

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`AvailableBalanceResponse`](network.networkTypes.md#availablebalanceresponse) |

#### Returns

response is AvailableBalanceResponseO

#### Defined in

network/helpers.ts:28

___

### isValidPagination

▸ **isValidPagination**(`pagination`): pagination is RestPagination

#### Parameters

| Name | Type |
| :------ | :------ |
| `pagination` | ``null`` \| [`RestPagination`](network.networkTypes.md#restpagination) |

#### Returns

pagination is RestPagination

#### Defined in

network/helpers.ts:34
