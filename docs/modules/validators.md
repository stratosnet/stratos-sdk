[Stratos SDK](../README.md) / [Exports](../modules.md) / validators

# Namespace: validators

## Table of contents

### Functions

- [getValidators](validators.md#getvalidators)
- [getValidatorsBondedToDelegator](validators.md#getvalidatorsbondedtodelegator)

## Functions

### getValidators

▸ **getValidators**(`status?`, `page?`): `Promise`\<[`ParsedValidatorsData`](../interfaces/validatorTypes.ParsedValidatorsData.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `status` | [`ValidatorStatus`](../enums/validatorTypes.ValidatorStatus.md) | `Types.ValidatorStatus.Bonded` |
| `page?` | `number` | `undefined` |

#### Returns

`Promise`\<[`ParsedValidatorsData`](../interfaces/validatorTypes.ParsedValidatorsData.md)\>

#### Defined in

validators/validators.ts:42

___

### getValidatorsBondedToDelegator

▸ **getValidatorsBondedToDelegator**(`delegatorAddress`): `Promise`\<[`ParsedValidatorsData`](../interfaces/validatorTypes.ParsedValidatorsData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegatorAddress` | `string` |

#### Returns

`Promise`\<[`ParsedValidatorsData`](../interfaces/validatorTypes.ParsedValidatorsData.md)\>

#### Defined in

validators/validators.ts:5
