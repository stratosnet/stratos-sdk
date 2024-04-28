[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / MainRpcResponse

# Interface: MainRpcResponse

[networkTypes](../modules/networkTypes.md).MainRpcResponse

## Hierarchy

- **`MainRpcResponse`**

  ↳ [`EthProtocolRpcResponse`](networkTypes.EthProtocolRpcResponse.md)

  ↳ [`FileUserRequestListResponse`](networkTypes.FileUserRequestListResponse.md)

  ↳ [`FileUserRequestDownloadResponse`](networkTypes.FileUserRequestDownloadResponse.md)

  ↳ [`FileUserDownloadDataResponse`](networkTypes.FileUserDownloadDataResponse.md)

  ↳ [`FileUserDownloadedFileInfoResponse`](networkTypes.FileUserDownloadedFileInfoResponse.md)

  ↳ [`FileUserRequestUploadResponse`](networkTypes.FileUserRequestUploadResponse.md)

  ↳ [`FileUserUploadDataResponse`](networkTypes.FileUserUploadDataResponse.md)

  ↳ [`FileUserRequestGetOzoneResponse`](networkTypes.FileUserRequestGetOzoneResponse.md)

  ↳ [`FileUserRequestShareResponse`](networkTypes.FileUserRequestShareResponse.md)

  ↳ [`FileUserRequestListShareResponse`](networkTypes.FileUserRequestListShareResponse.md)

  ↳ [`FileUserRequestStopShareResponse`](networkTypes.FileUserRequestStopShareResponse.md)

  ↳ [`FileUserRequestGetSharedResponse`](networkTypes.FileUserRequestGetSharedResponse.md)

  ↳ [`FileUserRequestGetFileStatusResponse`](networkTypes.FileUserRequestGetFileStatusResponse.md)

## Table of contents

### Properties

- [error](networkTypes.MainRpcResponse.md#error)
- [id](networkTypes.MainRpcResponse.md#id)
- [jsonrpc](networkTypes.MainRpcResponse.md#jsonrpc)

## Properties

### error

• `Optional` **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `data?` | `any` |
| `message` | `string` |

#### Defined in

network/types.ts:424

___

### id

• **id**: `string`

#### Defined in

network/types.ts:422

___

### jsonrpc

• **jsonrpc**: `string`

#### Defined in

network/types.ts:423
