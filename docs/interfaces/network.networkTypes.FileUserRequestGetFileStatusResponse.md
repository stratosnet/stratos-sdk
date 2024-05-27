[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / FileUserRequestGetFileStatusResponse

# Interface: FileUserRequestGetFileStatusResponse

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).FileUserRequestGetFileStatusResponse

## Hierarchy

- [`MainRpcResponse`](network.networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestGetFileStatusResponse`**

## Table of contents

### Properties

- [error](network.networkTypes.FileUserRequestGetFileStatusResponse.md#error)
- [id](network.networkTypes.FileUserRequestGetFileStatusResponse.md#id)
- [jsonrpc](network.networkTypes.FileUserRequestGetFileStatusResponse.md#jsonrpc)
- [result](network.networkTypes.FileUserRequestGetFileStatusResponse.md#result)

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
| `file_upload_state` | `number` |
| `replicas` | `number` |
| `return` | ``"0"`` \| ``"1"`` \| ``"2"`` \| ``"3"`` |
| `user_has_file` | `boolean` |

#### Defined in

network/networkTypes.ts:739
