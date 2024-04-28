[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](chain.md) / [cosmos](chain.cosmos.md) / cosmosService

# Namespace: cosmosService

[chain](chain.md).[cosmos](chain.cosmos.md).cosmosService

## Table of contents

### Classes

- [StratosCosmos](../classes/chain.cosmos.cosmosService.StratosCosmos.md)

### Functions

- [create](chain.cosmos.cosmosService.md#create)
- [getCosmos](chain.cosmos.cosmosService.md#getcosmos)
- [resetCosmos](chain.cosmos.cosmosService.md#resetcosmos)

## Functions

### create

▸ **create**(`userMnemonic?`, `hdPathIndex?`): `Promise`\<[`StratosSigningStargateClient`](../classes/crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `userMnemonic` | `string` | `''` |
| `hdPathIndex` | `number` | `0` |

#### Returns

`Promise`\<[`StratosSigningStargateClient`](../classes/crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md)\>

#### Defined in

chain/cosmos/cosmos.ts:111

___

### getCosmos

▸ **getCosmos**(`serialized?`, `password?`): `Promise`\<[`StratosSigningStargateClient`](../classes/crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `serialized` | `string` | `''` |
| `password` | `string` | `''` |

#### Returns

`Promise`\<[`StratosSigningStargateClient`](../classes/crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md)\>

#### Defined in

chain/cosmos/cosmos.ts:99

___

### resetCosmos

▸ **resetCosmos**(): `void`

#### Returns

`void`

#### Defined in

chain/cosmos/cosmos.ts:95
