[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / FileUserRequestDownloadResponse

# Interface: FileUserRequestDownloadResponse

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).FileUserRequestDownloadResponse

## Hierarchy

- [`MainRpcResponse`](network.networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestDownloadResponse`**

  ↳↳ [`FileUserRequestDownloadSharedResponse`](network.networkTypes.FileUserRequestDownloadSharedResponse.md)

## Table of contents

### Properties

- [error](network.networkTypes.FileUserRequestDownloadResponse.md#error)
- [id](network.networkTypes.FileUserRequestDownloadResponse.md#id)
- [jsonrpc](network.networkTypes.FileUserRequestDownloadResponse.md#jsonrpc)
- [result](network.networkTypes.FileUserRequestDownloadResponse.md#result)

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

[MainRpcResponse](network.networkTypes.MainRpcResponse.md).[error](network.networkTypes.MainRpcResponse.md#error)

#### Defined in

network/networkTypes.ts:424

___

### id

• **id**: `string`

#### Inherited from

[MainRpcResponse](network.networkTypes.MainRpcResponse.md).[id](network.networkTypes.MainRpcResponse.md#id)

#### Defined in

network/networkTypes.ts:422

___

### jsonrpc

• **jsonrpc**: `string`

#### Inherited from

[MainRpcResponse](network.networkTypes.MainRpcResponse.md).[jsonrpc](network.networkTypes.MainRpcResponse.md#jsonrpc)

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

#### Defined in

network/networkTypes.ts:516
