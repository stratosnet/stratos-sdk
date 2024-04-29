[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](chain.md) / [evm](chain.evm.md) / evmTransactions

# Namespace: evmTransactions

[chain](chain.md).[evm](chain.evm.md).evmTransactions

## Table of contents

### Enumerations

- [MsgTypes](../enums/chain.evm.evmTransactions.MsgTypes.md)
- [TxTypes](../enums/chain.evm.evmTransactions.TxTypes.md)

### Interfaces

- [AccessTuple](../interfaces/chain.evm.evmTransactions.AccessTuple.md)
- [DynamicFeeTx](../interfaces/chain.evm.evmTransactions.DynamicFeeTx.md)
- [ExtensionOptionsEthereumTx](../interfaces/chain.evm.evmTransactions.ExtensionOptionsEthereumTx.md)
- [MsgEthereumTx](../interfaces/chain.evm.evmTransactions.MsgEthereumTx.md)

### Variables

- [AccessTuple](chain.evm.evmTransactions.md#accesstuple)
- [DynamicFeeTx](chain.evm.evmTransactions.md#dynamicfeetx)
- [ExtensionOptionsEthereumTx](chain.evm.evmTransactions.md#extensionoptionsethereumtx)
- [MsgEthereumTx](chain.evm.evmTransactions.md#msgethereumtx)
- [evmExtensionOptions](chain.evm.evmTransactions.md#evmextensionoptions)
- [evmTransactionFields](chain.evm.evmTransactions.md#evmtransactionfields)
- [maxGas](chain.evm.evmTransactions.md#maxgas)
- [registryTypes](chain.evm.evmTransactions.md#registrytypes)

### Functions

- [getEvmMsgs](chain.evm.evmTransactions.md#getevmmsgs)

## Variables

### AccessTuple

• **AccessTuple**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`AccessTuple`](../interfaces/chain.evm.evmTransactions.AccessTuple.md) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`AccessTuple`](../interfaces/chain.evm.evmTransactions.AccessTuple.md) |
| `encode` | (`message`: [`AccessTuple`](../interfaces/chain.evm.evmTransactions.AccessTuple.md), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`AccessTuple`](../interfaces/chain.evm.evmTransactions.AccessTuple.md) |
| `fromPartial` | \<I\>(`object`: `I`) => [`AccessTuple`](../interfaces/chain.evm.evmTransactions.AccessTuple.md) |
| `toJSON` | (`message`: [`AccessTuple`](../interfaces/chain.evm.evmTransactions.AccessTuple.md)) => `unknown` |

#### Defined in

chain/evm/proto/stratos/v1/evm.ts:139

chain/evm/proto/stratos/v1/evm.ts:921

___

### DynamicFeeTx

• **DynamicFeeTx**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`DynamicFeeTx`](../interfaces/chain.evm.evmTransactions.DynamicFeeTx.md) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`DynamicFeeTx`](../interfaces/chain.evm.evmTransactions.DynamicFeeTx.md) |
| `encode` | (`message`: [`DynamicFeeTx`](../interfaces/chain.evm.evmTransactions.DynamicFeeTx.md), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`DynamicFeeTx`](../interfaces/chain.evm.evmTransactions.DynamicFeeTx.md) |
| `fromPartial` | \<I\>(`object`: `I`) => [`DynamicFeeTx`](../interfaces/chain.evm.evmTransactions.DynamicFeeTx.md) |
| `toJSON` | (`message`: [`DynamicFeeTx`](../interfaces/chain.evm.evmTransactions.DynamicFeeTx.md)) => `unknown` |

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:73

chain/evm/proto/stratos/v1/tx.ts:527

___

### ExtensionOptionsEthereumTx

• **ExtensionOptionsEthereumTx**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`ExtensionOptionsEthereumTx`](../interfaces/chain.evm.evmTransactions.ExtensionOptionsEthereumTx.md) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`ExtensionOptionsEthereumTx`](../interfaces/chain.evm.evmTransactions.ExtensionOptionsEthereumTx.md) |
| `encode` | (`_`: [`ExtensionOptionsEthereumTx`](../interfaces/chain.evm.evmTransactions.ExtensionOptionsEthereumTx.md), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`_`: `any`) => [`ExtensionOptionsEthereumTx`](../interfaces/chain.evm.evmTransactions.ExtensionOptionsEthereumTx.md) |
| `fromPartial` | \<I\>(`_`: `I`) => [`ExtensionOptionsEthereumTx`](../interfaces/chain.evm.evmTransactions.ExtensionOptionsEthereumTx.md) |
| `toJSON` | (`_`: [`ExtensionOptionsEthereumTx`](../interfaces/chain.evm.evmTransactions.ExtensionOptionsEthereumTx.md)) => `unknown` |

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:99

chain/evm/proto/stratos/v1/tx.ts:689

___

### MsgEthereumTx

• **MsgEthereumTx**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | \<I\>(`base?`: `I`) => [`MsgEthereumTx`](../interfaces/chain.evm.evmTransactions.MsgEthereumTx.md) |
| `decode` | (`input`: `Uint8Array` \| `Reader`, `length?`: `number`) => [`MsgEthereumTx`](../interfaces/chain.evm.evmTransactions.MsgEthereumTx.md) |
| `encode` | (`message`: [`MsgEthereumTx`](../interfaces/chain.evm.evmTransactions.MsgEthereumTx.md), `writer`: `Writer`) => `Writer` |
| `fromJSON` | (`object`: `any`) => [`MsgEthereumTx`](../interfaces/chain.evm.evmTransactions.MsgEthereumTx.md) |
| `fromPartial` | \<I\>(`object`: `I`) => [`MsgEthereumTx`](../interfaces/chain.evm.evmTransactions.MsgEthereumTx.md) |
| `toJSON` | (`message`: [`MsgEthereumTx`](../interfaces/chain.evm.evmTransactions.MsgEthereumTx.md)) => `unknown` |

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:10

chain/evm/proto/stratos/v1/tx.ts:129

___

### evmExtensionOptions

• `Const` **evmExtensionOptions**: `Any`[]

#### Defined in

chain/evm/transactions/extensions.ts:4

___

### evmTransactionFields

• `Const` **evmTransactionFields**: (\{ `asStruct?`: `undefined` = true; `length?`: `undefined` = 20; `maxLength`: `number` = 32; `name`: `string` = 'chainId' } \| \{ `asStruct?`: `undefined` = true; `length`: `number` = 20; `maxLength?`: `undefined` = 32; `name`: `string` = 'to' } \| \{ `asStruct?`: `undefined` = true; `length?`: `undefined` = 20; `maxLength?`: `undefined` = 32; `name`: `string` = 'data' } \| \{ `asStruct`: `boolean` = true; `length?`: `undefined` = 20; `maxLength?`: `undefined` = 32; `name`: `string` = 'accesses' })[]

#### Defined in

chain/evm/transactions/validations.ts:1

___

### maxGas

• `Const` **maxGas**: ``1000000000``

#### Defined in

chain/evm/transactions/types.ts:11

___

### registryTypes

• `Const` **registryTypes**: `ReadonlyArray`\<[`string`, `GeneratedType`]\>

#### Defined in

chain/evm/transactions/registry.ts:4

## Functions

### getEvmMsgs

▸ **getEvmMsgs**(`payload`): readonly `EncodeObject`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`DynamicFeeTx`](../interfaces/chain.evm.evmTransactions.DynamicFeeTx.md) |

#### Returns

readonly `EncodeObject`[]

#### Defined in

chain/evm/transactions/msgs.ts:5
