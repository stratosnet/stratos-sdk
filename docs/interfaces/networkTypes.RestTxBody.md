[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / RestTxBody

# Interface: RestTxBody

[networkTypes](../modules/networkTypes.md).RestTxBody

## Hierarchy

- **`RestTxBody`**

  ↳ [`RestSendTxBody`](networkTypes.RestSendTxBody.md)

  ↳ [`RestDelegateTxBody`](networkTypes.RestDelegateTxBody.md)

  ↳ [`RestUndelegateTxBody`](networkTypes.RestUndelegateTxBody.md)

  ↳ [`RestGetRewardsTxBody`](networkTypes.RestGetRewardsTxBody.md)

  ↳ [`RestSdsPrepayTxBody`](networkTypes.RestSdsPrepayTxBody.md)

## Table of contents

### Properties

- [extension\_options](networkTypes.RestTxBody.md#extension_options)
- [memo](networkTypes.RestTxBody.md#memo)
- [messages](networkTypes.RestTxBody.md#messages)
- [non\_critical\_extension\_options](networkTypes.RestTxBody.md#non_critical_extension_options)
- [timeout\_height](networkTypes.RestTxBody.md#timeout_height)

## Properties

### extension\_options

• **extension\_options**: []

#### Defined in

services/network/types.ts:653

___

### memo

• **memo**: `string`

#### Defined in

services/network/types.ts:651

___

### messages

• **messages**: [`RestTxBodyMessage`](networkTypes.RestTxBodyMessage.md)[]

#### Defined in

services/network/types.ts:650

___

### non\_critical\_extension\_options

• **non\_critical\_extension\_options**: []

#### Defined in

services/network/types.ts:654

___

### timeout\_height

• **timeout\_height**: `string`

#### Defined in

services/network/types.ts:652
