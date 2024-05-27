[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / FileUserDownloadDataResponse

# Interface: FileUserDownloadDataResponse

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).FileUserDownloadDataResponse

## Hierarchy

- [`MainRpcResponse`](network.networkTypes.MainRpcResponse.md)

  ↳ **`FileUserDownloadDataResponse`**

## Table of contents

### Properties

- [error](network.networkTypes.FileUserDownloadDataResponse.md#error)
- [id](network.networkTypes.FileUserDownloadDataResponse.md#id)
- [jsonrpc](network.networkTypes.FileUserDownloadDataResponse.md#jsonrpc)
- [result](network.networkTypes.FileUserDownloadDataResponse.md#result)

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

network/networkTypes.ts:339

___

### id

• **id**: `string`

#### Inherited from

[MainRpcResponse](network.networkTypes.MainRpcResponse.md).[id](network.networkTypes.MainRpcResponse.md#id)

#### Defined in

network/networkTypes.ts:337

___

### jsonrpc

• **jsonrpc**: `string`

#### Inherited from

[MainRpcResponse](network.networkTypes.MainRpcResponse.md).[jsonrpc](network.networkTypes.MainRpcResponse.md#jsonrpc)

#### Defined in

network/networkTypes.ts:338

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

network/networkTypes.ts:443
