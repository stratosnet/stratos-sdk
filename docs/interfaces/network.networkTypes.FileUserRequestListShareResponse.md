[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / FileUserRequestListShareResponse

# Interface: FileUserRequestListShareResponse

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).FileUserRequestListShareResponse

## Hierarchy

- [`MainRpcResponse`](network.networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestListShareResponse`**

## Table of contents

### Properties

- [error](network.networkTypes.FileUserRequestListShareResponse.md#error)
- [id](network.networkTypes.FileUserRequestListShareResponse.md#id)
- [jsonrpc](network.networkTypes.FileUserRequestListShareResponse.md#jsonrpc)
- [result](network.networkTypes.FileUserRequestListShareResponse.md#result)

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
| `fileinfo?` | [`SharedFileInfoItem`](network.networkTypes.SharedFileInfoItem.md)[] |
| `return` | ``"0"`` \| ``"1"`` \| ``"2"`` |
| `totalnumber?` | `number` |

#### Defined in

network/networkTypes.ts:786
