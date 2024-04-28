[Stratos SDK](../README.md) / [Exports](../modules.md) / [network](../modules/network.md) / [networkTypes](../modules/network.networkTypes.md) / FileUserRequestGetSharedResponse

# Interface: FileUserRequestGetSharedResponse

[network](../modules/network.md).[networkTypes](../modules/network.networkTypes.md).FileUserRequestGetSharedResponse

## Hierarchy

- [`MainRpcResponse`](network.networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestGetSharedResponse`**

## Table of contents

### Properties

- [error](network.networkTypes.FileUserRequestGetSharedResponse.md#error)
- [id](network.networkTypes.FileUserRequestGetSharedResponse.md#id)
- [jsonrpc](network.networkTypes.FileUserRequestGetSharedResponse.md#jsonrpc)
- [result](network.networkTypes.FileUserRequestGetSharedResponse.md#result)

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
| `filehash` | `string` |
| `reqid` | `string` |
| `return` | ``"0"`` \| ``"1"`` \| ``"2"`` \| ``"3"`` \| ``"4"`` |
| `sequencenumber` | `string` |

#### Defined in

network/networkTypes.ts:812
