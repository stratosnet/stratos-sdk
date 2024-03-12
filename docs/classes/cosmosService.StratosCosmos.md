[Stratos SDK](../README.md) / [Exports](../modules.md) / [cosmosService](../modules/cosmosService.md) / StratosCosmos

# Class: StratosCosmos

[cosmosService](../modules/cosmosService.md).StratosCosmos

## Table of contents

### Constructors

- [constructor](cosmosService.StratosCosmos.md#constructor)

### Properties

- [cosmosInstance](cosmosService.StratosCosmos.md#cosmosinstance)

### Methods

- [init](cosmosService.StratosCosmos.md#init)
- [reset](cosmosService.StratosCosmos.md#reset)

## Constructors

### constructor

• **new StratosCosmos**(): [`StratosCosmos`](cosmosService.StratosCosmos.md)

#### Returns

[`StratosCosmos`](cosmosService.StratosCosmos.md)

## Properties

### cosmosInstance

▪ `Static` **cosmosInstance**: ``null`` \| `StratosSigningStargateClient`

#### Defined in

services/cosmos.ts:52

## Methods

### init

▸ **init**(`serialized`, `password`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `string` |
| `password` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

services/cosmos.ts:54

___

### reset

▸ **reset**(): `void`

#### Returns

`void`

#### Defined in

services/cosmos.ts:77
