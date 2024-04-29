[Stratos SDK](../README.md) / [Exports](../modules.md) / Sdk

# Class: Sdk

## Table of contents

### Constructors

- [constructor](Sdk.md#constructor)

### Properties

- [environment](Sdk.md#environment)

### Methods

- [init](Sdk.md#init)
- [reset](Sdk.md#reset)

## Constructors

### constructor

• **new Sdk**(): [`Sdk`](Sdk.md)

#### Returns

[`Sdk`](Sdk.md)

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
| `keyPathParameters?` | `KeyPathParameters` |
| `nodeProtocolVersion?` | `string` |
| `ppNodePort?` | `string` |
| `ppNodeUrl?` | `string` |
| `restUrl` | `string` |
| `rpcUrl` | `string` |

#### Defined in

Sdk.ts:52

## Methods

### init

▸ **init**(`sdkEnv`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdkEnv` | `SdkEnvironmentConfig` |

#### Returns

`void`

#### Defined in

Sdk.ts:54

___

### reset

▸ **reset**(): `void`

#### Returns

`void`

#### Defined in

Sdk.ts:86
