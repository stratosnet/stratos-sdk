[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](chain.md) / [validators](chain.validators.md) / validatorsApi

# Namespace: validatorsApi

[chain](chain.md).[validators](chain.validators.md).validatorsApi

## Table of contents

### Functions

- [getValidators](chain.validators.validatorsApi.md#getvalidators)
- [getValidatorsBondedToDelegator](chain.validators.validatorsApi.md#getvalidatorsbondedtodelegator)

## Functions

### getValidators

▸ **getValidators**(`status?`, `page?`): `Promise`\<[`ParsedValidatorsData`](../interfaces/chain.validators.validatorsTypes.ParsedValidatorsData.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `status` | [`ValidatorStatus`](../enums/chain.validators.validatorsTypes.ValidatorStatus.md) | `Types.ValidatorStatus.Bonded` |
| `page?` | `number` | `undefined` |

#### Returns

`Promise`\<[`ParsedValidatorsData`](../interfaces/chain.validators.validatorsTypes.ParsedValidatorsData.md)\>

#### Defined in

chain/validators/validators.ts:42

___

### getValidatorsBondedToDelegator

▸ **getValidatorsBondedToDelegator**(`delegatorAddress`): `Promise`\<[`ParsedValidatorsData`](../interfaces/chain.validators.validatorsTypes.ParsedValidatorsData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |

#### Returns

`Promise`\<[`ParsedValidatorsData`](../interfaces/chain.validators.validatorsTypes.ParsedValidatorsData.md)\>

#### Defined in

chain/validators/validators.ts:5
