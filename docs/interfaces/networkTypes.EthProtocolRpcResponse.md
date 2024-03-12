[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / EthProtocolRpcResponse

# Interface: EthProtocolRpcResponse

[networkTypes](../modules/networkTypes.md).EthProtocolRpcResponse

## Hierarchy

- [`MainRpcResponse`](networkTypes.MainRpcResponse.md)

  ↳ **`EthProtocolRpcResponse`**

## Table of contents

### Properties

- [error](networkTypes.EthProtocolRpcResponse.md#error)
- [id](networkTypes.EthProtocolRpcResponse.md#id)
- [jsonrpc](networkTypes.EthProtocolRpcResponse.md#jsonrpc)
- [result](networkTypes.EthProtocolRpcResponse.md#result)

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

• **result**: `string`

#### Defined in

services/network/types.ts:433
