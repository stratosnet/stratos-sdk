[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / FileUserRequestGetOzoneResponse

# Interface: FileUserRequestGetOzoneResponse

[networkTypes](../modules/networkTypes.md).FileUserRequestGetOzoneResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`FileUserRequestGetOzoneResponse`**

## Table of contents

### Properties

- [error](networkTypes.FileUserRequestGetOzoneResponse.md#error)
- [id](networkTypes.FileUserRequestGetOzoneResponse.md#id)
- [jsonrpc](networkTypes.FileUserRequestGetOzoneResponse.md#jsonrpc)
- [result](networkTypes.FileUserRequestGetOzoneResponse.md#result)

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

network/types.ts:424

___

### id

• **id**: `string`

#### Inherited from

[MainRpcResponse](networkTypes.MainRpcResponse.md).[id](networkTypes.MainRpcResponse.md#id)

#### Defined in

network/types.ts:422

___

### jsonrpc

• **jsonrpc**: `string`

#### Inherited from

[MainRpcResponse](networkTypes.MainRpcResponse.md).[jsonrpc](networkTypes.MainRpcResponse.md#jsonrpc)

#### Defined in

network/types.ts:423

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

network/types.ts:584
