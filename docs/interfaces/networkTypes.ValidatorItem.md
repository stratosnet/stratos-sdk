[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / ValidatorItem

# Interface: ValidatorItem

[networkTypes](../modules/networkTypes.md).ValidatorItem

## Table of contents

### Properties

- [commission](networkTypes.ValidatorItem.md#commission)
- [consensus\_pubkey](networkTypes.ValidatorItem.md#consensus_pubkey)
- [delegator\_shares](networkTypes.ValidatorItem.md#delegator_shares)
- [description](networkTypes.ValidatorItem.md#description)
- [jailed](networkTypes.ValidatorItem.md#jailed)
- [min\_self\_delegation](networkTypes.ValidatorItem.md#min_self_delegation)
- [operator\_address](networkTypes.ValidatorItem.md#operator_address)
- [status](networkTypes.ValidatorItem.md#status)
- [tokens](networkTypes.ValidatorItem.md#tokens)
- [unbonding\_height](networkTypes.ValidatorItem.md#unbonding_height)
- [unbonding\_time](networkTypes.ValidatorItem.md#unbonding_time)

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

services/network/types.ts:263

___

### consensus\_pubkey

• **consensus\_pubkey**: `string`

#### Defined in

services/network/types.ts:249

___

### delegator\_shares

• **delegator\_shares**: `string`

#### Defined in

services/network/types.ts:253

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

services/network/types.ts:254

___

### jailed

• **jailed**: `boolean`

#### Defined in

services/network/types.ts:250

___

### min\_self\_delegation

• **min\_self\_delegation**: `string`

#### Defined in

services/network/types.ts:270

___

### operator\_address

• **operator\_address**: `string`

#### Defined in

services/network/types.ts:248

___

### status

• **status**: `number`

#### Defined in

services/network/types.ts:251

___

### tokens

• **tokens**: `string`

#### Defined in

services/network/types.ts:252

___

### unbonding\_height

• **unbonding\_height**: `string`

#### Defined in

services/network/types.ts:261

___

### unbonding\_time

• **unbonding\_time**: `string`

#### Defined in

services/network/types.ts:262
