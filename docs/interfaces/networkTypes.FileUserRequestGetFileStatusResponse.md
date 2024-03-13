[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserRequestGetFileStatusResponse

# Interface: FileUserRequestGetFileStatusResponse

[networkTypes](../modules/networkTypes.md).FileUserRequestGetFileStatusResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestGetFileStatusResponse`**

## Table of contents

### Properties

- [error](networkTypes.FileUserRequestGetFileStatusResponse.md#error)
- [id](networkTypes.FileUserRequestGetFileStatusResponse.md#id)
- [jsonrpc](networkTypes.FileUserRequestGetFileStatusResponse.md#jsonrpc)
- [result](networkTypes.FileUserRequestGetFileStatusResponse.md#result)

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

services/network/types.ts:424

___

### id

• **id**: `string`

#### Inherited from

[MainRpcResponse](networkTypes.MainRpcResponse.md).[id](networkTypes.MainRpcResponse.md#id)

#### Defined in

services/network/types.ts:422

___

### jsonrpc

• **jsonrpc**: `string`

#### Inherited from

[MainRpcResponse](networkTypes.MainRpcResponse.md).[jsonrpc](networkTypes.MainRpcResponse.md#jsonrpc)

#### Defined in

services/network/types.ts:423

___

### result

• **result**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `file_upload_state` | `number` |
| `replicas` | `number` |
| `return` | ``"0"`` \| ``"1"`` \| ``"2"`` \| ``"3"`` |
| `user_has_file` | `boolean` |

#### Defined in

services/network/types.ts:836
