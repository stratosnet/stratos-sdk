[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](../modules/chain.md) / [cosmos](../modules/chain.cosmos.md) / [cosmosService](../modules/chain.cosmos.cosmosService.md) / StratosCosmos

# Class: StratosCosmos

[cosmos](../modules/chain.cosmos.md).[cosmosService](../modules/chain.cosmos.cosmosService.md).StratosCosmos

## Table of contents

### Constructors

- [constructor](chain.cosmos.cosmosService.StratosCosmos.md#constructor)

### Properties

- [cosmosInstance](chain.cosmos.cosmosService.StratosCosmos.md#cosmosinstance)

### Methods

- [create](chain.cosmos.cosmosService.StratosCosmos.md#create)
- [init](chain.cosmos.cosmosService.StratosCosmos.md#init)
- [reset](chain.cosmos.cosmosService.StratosCosmos.md#reset)

## Constructors

### constructor

• **new StratosCosmos**(): [`StratosCosmos`](chain.cosmos.cosmosService.StratosCosmos.md)

#### Returns

[`StratosCosmos`](chain.cosmos.cosmosService.StratosCosmos.md)

## Properties

### cosmosInstance

▪ `Static` **cosmosInstance**: ``null`` \| [`StratosSigningStargateClient`](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md)

#### Defined in

chain/cosmos/cosmos.ts:48

## Methods

### create

▸ **create**(`userMnemonic`, `hdPathIndex`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userMnemonic` | `string` |
| `hdPathIndex` | `number` |

#### Returns

`Promise`\<`void`\>

#### Defined in

chain/cosmos/cosmos.ts:73

___

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

chain/cosmos/cosmos.ts:50

___

### reset

▸ **reset**(): `void`

#### Returns

`void`

#### Defined in

chain/cosmos/cosmos.ts:90
