[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserUploadDataResponse

# Interface: FileUserUploadDataResponse

[networkTypes](../modules/networkTypes.md).FileUserUploadDataResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`FileUserUploadDataResponse`**

## Table of contents

### Properties

- [error](networkTypes.FileUserUploadDataResponse.md#error)
- [id](networkTypes.FileUserUploadDataResponse.md#id)
- [jsonrpc](networkTypes.FileUserUploadDataResponse.md#jsonrpc)
- [result](networkTypes.FileUserUploadDataResponse.md#result)

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
| `offsetend?` | `string` |
| `offsetstart?` | `string` |
| `return` | ``"0"`` \| ``"1"`` |

#### Defined in

services/network/types.ts:567
