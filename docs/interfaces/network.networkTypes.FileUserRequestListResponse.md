[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / FileUserRequestListResponse

# Interface: FileUserRequestListResponse

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).FileUserRequestListResponse

## Hierarchy

- [`MainRpcResponse`](network.networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestListResponse`**

## Table of contents

### Properties

- [error](network.networkTypes.FileUserRequestListResponse.md#error)
- [id](network.networkTypes.FileUserRequestListResponse.md#id)
- [jsonrpc](network.networkTypes.FileUserRequestListResponse.md#jsonrpc)
- [result](network.networkTypes.FileUserRequestListResponse.md#result)

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
| `fileinfo` | [`FileInfoItem`](network.networkTypes.FileInfoItem.md)[] |
| `return` | ``"0"`` \| ``"1"`` |

#### Defined in

network/networkTypes.ts:381
