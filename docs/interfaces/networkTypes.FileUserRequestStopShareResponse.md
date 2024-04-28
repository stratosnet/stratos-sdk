[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserRequestStopShareResponse

# Interface: FileUserRequestStopShareResponse

[networkTypes](../modules/networkTypes.md).FileUserRequestStopShareResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestStopShareResponse`**

## Table of contents

### Properties

- [error](networkTypes.FileUserRequestStopShareResponse.md#error)
- [id](networkTypes.FileUserRequestStopShareResponse.md#id)
- [jsonrpc](networkTypes.FileUserRequestStopShareResponse.md#jsonrpc)
- [result](networkTypes.FileUserRequestStopShareResponse.md#result)

## Properties

### error

• `Optional` **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `data?` | `any` |
| `message` | `string` |

#### Inherited from

[MainRpcResponse](networkTypes.MainRpcResponse.md).[error](networkTypes.MainRpcResponse.md#error)

#### Defined in

network/types.ts:424

___

### id

• **id**: `string`

#### Inherited from

[MainRpcResponse](networkTypes.MainRpcResponse.md).[id](networkTypes.MainRpcResponse.md#id)

#### Defined in

network/types.ts:422

___

### jsonrpc

• **jsonrpc**: `string`

#### Inherited from

[MainRpcResponse](networkTypes.MainRpcResponse.md).[jsonrpc](networkTypes.MainRpcResponse.md#jsonrpc)

#### Defined in

network/types.ts:423

___

### result

• **result**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `return` | ``"0"`` \| ``"1"`` \| ``"2"`` |

#### Defined in

network/types.ts:800
