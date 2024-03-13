[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserRequestGetSharedResponse

# Interface: FileUserRequestGetSharedResponse

[networkTypes](../modules/networkTypes.md).FileUserRequestGetSharedResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestGetSharedResponse`**

## Table of contents

### Properties

- [error](networkTypes.FileUserRequestGetSharedResponse.md#error)
- [id](networkTypes.FileUserRequestGetSharedResponse.md#id)
- [jsonrpc](networkTypes.FileUserRequestGetSharedResponse.md#jsonrpc)
- [result](networkTypes.FileUserRequestGetSharedResponse.md#result)

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

[MainRpcResponse](networkTypes.MainRpcResponse.md).[error](networkTypes.MainRpcResponse.md#error)

#### Defined in

services/network/types.ts:424

___

### id

• **id**: `string`

#### Inherited from

[MainRpcResponse](networkTypes.MainRpcResponse.md).[id](networkTypes.MainRpcResponse.md#id)

#### Defined in

services/network/types.ts:422

___

### jsonrpc

• **jsonrpc**: `string`

#### Inherited from

[MainRpcResponse](networkTypes.MainRpcResponse.md).[jsonrpc](networkTypes.MainRpcResponse.md#jsonrpc)

#### Defined in

services/network/types.ts:423

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

services/network/types.ts:807
