[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserRequestListShareResponse

# Interface: FileUserRequestListShareResponse

[networkTypes](../modules/networkTypes.md).FileUserRequestListShareResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestListShareResponse`**

## Table of contents

### Properties

- [error](networkTypes.FileUserRequestListShareResponse.md#error)
- [id](networkTypes.FileUserRequestListShareResponse.md#id)
- [jsonrpc](networkTypes.FileUserRequestListShareResponse.md#jsonrpc)
- [result](networkTypes.FileUserRequestListShareResponse.md#result)

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
| `fileinfo?` | [`SharedFileInfoItem`](networkTypes.SharedFileInfoItem.md)[] |
| `return` | ``"0"`` \| ``"1"`` \| ``"2"`` |
| `totalnumber?` | `number` |

#### Defined in

network/types.ts:786
