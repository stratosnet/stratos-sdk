[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / FileUserRequestGetOzoneResponse

# Interface: FileUserRequestGetOzoneResponse

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).FileUserRequestGetOzoneResponse

## Hierarchy

- [`MainRpcResponse`](network.networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestGetOzoneResponse`**

## Table of contents

### Properties

- [error](network.networkTypes.FileUserRequestGetOzoneResponse.md#error)
- [id](network.networkTypes.FileUserRequestGetOzoneResponse.md#id)
- [jsonrpc](network.networkTypes.FileUserRequestGetOzoneResponse.md#jsonrpc)
- [result](network.networkTypes.FileUserRequestGetOzoneResponse.md#result)

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
| `ozone?` | `string` |
| `return` | ``"0"`` \| ``"1"`` |
| `sequencynumber?` | `string` |

#### Defined in

network/networkTypes.ts:495
