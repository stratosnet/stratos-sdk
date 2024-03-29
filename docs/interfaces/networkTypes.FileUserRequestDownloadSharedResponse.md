[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserRequestDownloadSharedResponse

# Interface: FileUserRequestDownloadSharedResponse

[networkTypes](../modules/networkTypes.md).FileUserRequestDownloadSharedResponse

## Hierarchy

- [`FileUserRequestDownloadResponse`](networkTypes.FileUserRequestDownloadResponse.md)

  ↳ **`FileUserRequestDownloadSharedResponse`**

## Table of contents

### Properties

- [error](networkTypes.FileUserRequestDownloadSharedResponse.md#error)
- [id](networkTypes.FileUserRequestDownloadSharedResponse.md#id)
- [jsonrpc](networkTypes.FileUserRequestDownloadSharedResponse.md#jsonrpc)
- [result](networkTypes.FileUserRequestDownloadSharedResponse.md#result)

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

[FileUserRequestDownloadResponse](networkTypes.FileUserRequestDownloadResponse.md).[error](networkTypes.FileUserRequestDownloadResponse.md#error)

#### Defined in

services/network/types.ts:424

___

### id

• **id**: `string`

#### Inherited from

[FileUserRequestDownloadResponse](networkTypes.FileUserRequestDownloadResponse.md).[id](networkTypes.FileUserRequestDownloadResponse.md#id)

#### Defined in

services/network/types.ts:422

___

### jsonrpc

• **jsonrpc**: `string`

#### Inherited from

[FileUserRequestDownloadResponse](networkTypes.FileUserRequestDownloadResponse.md).[jsonrpc](networkTypes.FileUserRequestDownloadResponse.md#jsonrpc)

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

#### Inherited from

[FileUserRequestDownloadResponse](networkTypes.FileUserRequestDownloadResponse.md).[result](networkTypes.FileUserRequestDownloadResponse.md#result)

#### Defined in

services/network/types.ts:515
