[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserRequestDownloadResponse

# Interface: FileUserRequestDownloadResponse

[networkTypes](../modules/networkTypes.md).FileUserRequestDownloadResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestDownloadResponse`**

  ↳↳ [`FileUserRequestDownloadSharedResponse`](networkTypes.FileUserRequestDownloadSharedResponse.md)

## Table of contents

### Properties

- [error](networkTypes.FileUserRequestDownloadResponse.md#error)
- [id](networkTypes.FileUserRequestDownloadResponse.md#id)
- [jsonrpc](networkTypes.FileUserRequestDownloadResponse.md#jsonrpc)
- [result](networkTypes.FileUserRequestDownloadResponse.md#result)

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
| `filedata` | `string` |
| `offsetend` | `string` |
| `offsetstart` | `string` |
| `reqid` | `string` |
| `return` | ``"0"`` \| ``"1"`` \| ``"2"`` \| ``"3"`` \| ``"4"`` |

#### Defined in

services/network/types.ts:515
