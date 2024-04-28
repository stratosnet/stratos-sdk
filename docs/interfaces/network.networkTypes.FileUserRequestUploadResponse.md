[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / FileUserRequestUploadResponse

# Interface: FileUserRequestUploadResponse

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).FileUserRequestUploadResponse

## Hierarchy

- [`MainRpcResponse`](network.networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestUploadResponse`**

## Table of contents

### Properties

- [error](network.networkTypes.FileUserRequestUploadResponse.md#error)
- [id](network.networkTypes.FileUserRequestUploadResponse.md#id)
- [jsonrpc](network.networkTypes.FileUserRequestUploadResponse.md#jsonrpc)
- [result](network.networkTypes.FileUserRequestUploadResponse.md#result)

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
| `offsetend?` | `string` |
| `offsetstart?` | `string` |
| `return` | ``"0"`` \| ``"1"`` |

#### Defined in

network/networkTypes.ts:554
