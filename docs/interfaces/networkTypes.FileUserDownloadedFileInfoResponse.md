[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserDownloadedFileInfoResponse

# Interface: FileUserDownloadedFileInfoResponse

[networkTypes](../modules/networkTypes.md).FileUserDownloadedFileInfoResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`FileUserDownloadedFileInfoResponse`**

## Table of contents

### Properties

- [error](networkTypes.FileUserDownloadedFileInfoResponse.md#error)
- [id](networkTypes.FileUserDownloadedFileInfoResponse.md#id)
- [jsonrpc](networkTypes.FileUserDownloadedFileInfoResponse.md#jsonrpc)
- [result](networkTypes.FileUserDownloadedFileInfoResponse.md#result)

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
| `return` | ``"0"`` \| ``"1"`` \| ``"2"`` \| ``"3"`` |

#### Defined in

services/network/types.ts:547
