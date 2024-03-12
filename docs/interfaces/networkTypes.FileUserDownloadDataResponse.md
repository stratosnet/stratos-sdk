[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserDownloadDataResponse

# Interface: FileUserDownloadDataResponse

[networkTypes](../modules/networkTypes.md).FileUserDownloadDataResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`FileUserDownloadDataResponse`**

## Table of contents

### Properties

- [error](networkTypes.FileUserDownloadDataResponse.md#error)
- [id](networkTypes.FileUserDownloadDataResponse.md#id)
- [jsonrpc](networkTypes.FileUserDownloadDataResponse.md#jsonrpc)
- [result](networkTypes.FileUserDownloadDataResponse.md#result)

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
| `filedata?` | `string` |
| `offsetend?` | `string` |
| `offsetstart?` | `string` |
| `return` | ``"0"`` \| ``"1"`` \| ``"2"`` \| ``"3"`` |

#### Defined in

services/network/types.ts:532
