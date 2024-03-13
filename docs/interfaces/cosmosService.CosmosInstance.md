[Stratos SDK](../README.md) / [Exports](../modules.md) / [cosmosService](../modules/cosmosService.md) / CosmosInstance

# Interface: CosmosInstance

[cosmosService](../modules/cosmosService.md).CosmosInstance

## Table of contents

### Properties

- [bech32MainPrefix](cosmosService.CosmosInstance.md#bech32mainprefix)
- [chainId](cosmosService.CosmosInstance.md#chainid)
- [path](cosmosService.CosmosInstance.md#path)
- [url](cosmosService.CosmosInstance.md#url)

### Methods

- [getAccounts](cosmosService.CosmosInstance.md#getaccounts)

## Properties

### bech32MainPrefix

• **bech32MainPrefix**: `string`

#### Defined in

services/cosmos.ts:18

___

### chainId

• **chainId**: `string`

#### Defined in

services/cosmos.ts:16

___

### path

• **path**: `string`

#### Defined in

services/cosmos.ts:17

___

### url

• **url**: `string`

#### Defined in

services/cosmos.ts:15

## Methods

### getAccounts

▸ **getAccounts**(`address`): `Promise`\<[`AccountsData`](accountTypes.AccountsData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`\<[`AccountsData`](accountTypes.AccountsData.md)\>

#### Defined in

services/cosmos.ts:22
