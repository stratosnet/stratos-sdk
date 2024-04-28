[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserRequestListResponse

# Interface: FileUserRequestListResponse

[networkTypes](../modules/networkTypes.md).FileUserRequestListResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestListResponse`**

## Table of contents

### Properties

- [error](networkTypes.FileUserRequestListResponse.md#error)
- [id](networkTypes.FileUserRequestListResponse.md#id)
- [jsonrpc](networkTypes.FileUserRequestListResponse.md#jsonrpc)
- [result](networkTypes.FileUserRequestListResponse.md#result)

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
| `fileinfo` | [`FileInfoItem`](networkTypes.FileInfoItem.md)[] |
| `return` | ``"0"`` \| ``"1"`` |

#### Defined in

network/types.ts:468
