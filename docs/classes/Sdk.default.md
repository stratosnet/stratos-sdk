[Stratos SDK](../README.md) / [Exports](../modules.md) / [Sdk](../modules/Sdk.md) / default

# Class: default

[Sdk](../modules/Sdk.md).default

## Table of contents

### Constructors

- [constructor](Sdk.default.md#constructor)

### Properties

- [environment](Sdk.default.md#environment)

### Methods

- [init](Sdk.default.md#init)
- [reset](Sdk.default.md#reset)

## Constructors

### constructor

• **new default**(): [`default`](Sdk.default.md)

#### Returns

[`default`](Sdk.default.md)

## Properties

### environment

▪ `Static` **environment**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `string` |
| `explorerUrl` | `string` |
| `faucetUrl?` | `string` |
| `isNewProtocol?` | `boolean` |
| `nodeProtocolVersion?` | `string` |
| `ppNodePort?` | `string` |
| `ppNodeUrl?` | `string` |
| `restUrl` | `string` |
| `rpcUrl` | `string` |

#### Defined in

Sdk.ts:24

## Methods

### init

▸ **init**(`sdkEnv`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdkEnv` | [`SdkEnvironmentConfig`](../interfaces/Sdk.SdkEnvironmentConfig.md) |

#### Returns

`void`

#### Defined in

Sdk.ts:26

___

### reset

▸ **reset**(): `void`

#### Returns

`void`

#### Defined in

Sdk.ts:30
