[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / MainRpcResponse

# Interface: MainRpcResponse

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).MainRpcResponse

## Hierarchy

- **`MainRpcResponse`**

  ↳ [`EthProtocolRpcResponse`](network.networkTypes.EthProtocolRpcResponse.md)

  ↳ [`FileUserRequestListResponse`](network.networkTypes.FileUserRequestListResponse.md)

  ↳ [`FileUserRequestDownloadResponse`](network.networkTypes.FileUserRequestDownloadResponse.md)

  ↳ [`FileUserDownloadDataResponse`](network.networkTypes.FileUserDownloadDataResponse.md)

  ↳ [`FileUserDownloadedFileInfoResponse`](network.networkTypes.FileUserDownloadedFileInfoResponse.md)

  ↳ [`FileUserRequestUploadResponse`](network.networkTypes.FileUserRequestUploadResponse.md)

  ↳ [`FileUserUploadDataResponse`](network.networkTypes.FileUserUploadDataResponse.md)

  ↳ [`FileUserRequestGetOzoneResponse`](network.networkTypes.FileUserRequestGetOzoneResponse.md)

  ↳ [`FileUserRequestShareResponse`](network.networkTypes.FileUserRequestShareResponse.md)

  ↳ [`FileUserRequestListShareResponse`](network.networkTypes.FileUserRequestListShareResponse.md)

  ↳ [`FileUserRequestStopShareResponse`](network.networkTypes.FileUserRequestStopShareResponse.md)

  ↳ [`FileUserRequestGetSharedResponse`](network.networkTypes.FileUserRequestGetSharedResponse.md)

  ↳ [`FileUserRequestGetFileStatusResponse`](network.networkTypes.FileUserRequestGetFileStatusResponse.md)

## Table of contents

### Properties

- [error](network.networkTypes.MainRpcResponse.md#error)
- [id](network.networkTypes.MainRpcResponse.md#id)
- [jsonrpc](network.networkTypes.MainRpcResponse.md#jsonrpc)

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

network/networkTypes.ts:339

___

### id

• **id**: `string`

#### Defined in

network/networkTypes.ts:337

___

### jsonrpc

• **jsonrpc**: `string`

#### Defined in

network/networkTypes.ts:338
