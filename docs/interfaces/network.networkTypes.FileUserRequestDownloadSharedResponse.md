[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / FileUserRequestDownloadSharedResponse

# Interface: FileUserRequestDownloadSharedResponse

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).FileUserRequestDownloadSharedResponse

## Hierarchy

- [`FileUserRequestDownloadResponse`](network.networkTypes.FileUserRequestDownloadResponse.md)

  ↳ **`FileUserRequestDownloadSharedResponse`**

## Table of contents

### Properties

- [error](network.networkTypes.FileUserRequestDownloadSharedResponse.md#error)
- [id](network.networkTypes.FileUserRequestDownloadSharedResponse.md#id)
- [jsonrpc](network.networkTypes.FileUserRequestDownloadSharedResponse.md#jsonrpc)
- [result](network.networkTypes.FileUserRequestDownloadSharedResponse.md#result)

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

[FileUserRequestDownloadResponse](network.networkTypes.FileUserRequestDownloadResponse.md).[error](network.networkTypes.FileUserRequestDownloadResponse.md#error)

#### Defined in

network/networkTypes.ts:424

___

### id

• **id**: `string`

#### Inherited from

[FileUserRequestDownloadResponse](network.networkTypes.FileUserRequestDownloadResponse.md).[id](network.networkTypes.FileUserRequestDownloadResponse.md#id)

#### Defined in

network/networkTypes.ts:422

___

### jsonrpc

• **jsonrpc**: `string`

#### Inherited from

[FileUserRequestDownloadResponse](network.networkTypes.FileUserRequestDownloadResponse.md).[jsonrpc](network.networkTypes.FileUserRequestDownloadResponse.md#jsonrpc)

#### Defined in

network/networkTypes.ts:423

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

[FileUserRequestDownloadResponse](network.networkTypes.FileUserRequestDownloadResponse.md).[result](network.networkTypes.FileUserRequestDownloadResponse.md#result)

#### Defined in

network/networkTypes.ts:516
