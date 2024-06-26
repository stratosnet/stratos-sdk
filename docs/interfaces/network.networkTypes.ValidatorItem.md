[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / ValidatorItem

# Interface: ValidatorItem

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).ValidatorItem

## Table of contents

### Properties

- [commission](network.networkTypes.ValidatorItem.md#commission)
- [consensus\_pubkey](network.networkTypes.ValidatorItem.md#consensus_pubkey)
- [delegator\_shares](network.networkTypes.ValidatorItem.md#delegator_shares)
- [description](network.networkTypes.ValidatorItem.md#description)
- [jailed](network.networkTypes.ValidatorItem.md#jailed)
- [min\_self\_delegation](network.networkTypes.ValidatorItem.md#min_self_delegation)
- [operator\_address](network.networkTypes.ValidatorItem.md#operator_address)
- [status](network.networkTypes.ValidatorItem.md#status)
- [tokens](network.networkTypes.ValidatorItem.md#tokens)
- [unbonding\_height](network.networkTypes.ValidatorItem.md#unbonding_height)
- [unbonding\_time](network.networkTypes.ValidatorItem.md#unbonding_time)

## Properties

### commission

• **commission**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `commission_rates` | \{ `max_change_rate`: `string` ; `max_rate`: `string` ; `rate`: `string`  } |
| `commission_rates.max_change_rate` | `string` |
| `commission_rates.max_rate` | `string` |
| `commission_rates.rate` | `string` |

#### Defined in

network/networkTypes.ts:187

___

### consensus\_pubkey

• **consensus\_pubkey**: `string`

#### Defined in

network/networkTypes.ts:173

___

### delegator\_shares

• **delegator\_shares**: `string`

#### Defined in

network/networkTypes.ts:177

___

### description

• **description**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `details` | `string` |
| `identity` | `string` |
| `moniker` | `string` |
| `security_contact` | `string` |
| `website` | `string` |

#### Defined in

network/networkTypes.ts:178

___

### jailed

• **jailed**: `boolean`

#### Defined in

network/networkTypes.ts:174

___

### min\_self\_delegation

• **min\_self\_delegation**: `string`

#### Defined in

network/networkTypes.ts:194

___

### operator\_address

• **operator\_address**: `string`

#### Defined in

network/networkTypes.ts:172

___

### status

• **status**: `number`

#### Defined in

network/networkTypes.ts:175

___

### tokens

• **tokens**: `string`

#### Defined in

network/networkTypes.ts:176

___

### unbonding\_height

• **unbonding\_height**: `string`

#### Defined in

network/networkTypes.ts:185

___

### unbonding\_time

• **unbonding\_time**: `string`

#### Defined in

network/networkTypes.ts:186
