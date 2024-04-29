[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](../modules/chain.md) / [evm](../modules/chain.evm.md) / [evmTransactions](../modules/chain.evm.evmTransactions.md) / DynamicFeeTx

# Interface: DynamicFeeTx

[evm](../modules/chain.evm.md).[evmTransactions](../modules/chain.evm.evmTransactions.md).DynamicFeeTx

DynamicFeeTx is the data of EIP-1559 dinamic fee transactions.

## Table of contents

### Properties

- [accesses](chain.evm.evmTransactions.DynamicFeeTx.md#accesses)
- [chainId](chain.evm.evmTransactions.DynamicFeeTx.md#chainid)
- [data](chain.evm.evmTransactions.DynamicFeeTx.md#data)
- [gas](chain.evm.evmTransactions.DynamicFeeTx.md#gas)
- [gasFeeCap](chain.evm.evmTransactions.DynamicFeeTx.md#gasfeecap)
- [gasTipCap](chain.evm.evmTransactions.DynamicFeeTx.md#gastipcap)
- [nonce](chain.evm.evmTransactions.DynamicFeeTx.md#nonce)
- [r](chain.evm.evmTransactions.DynamicFeeTx.md#r)
- [s](chain.evm.evmTransactions.DynamicFeeTx.md#s)
- [to](chain.evm.evmTransactions.DynamicFeeTx.md#to)
- [v](chain.evm.evmTransactions.DynamicFeeTx.md#v)
- [value](chain.evm.evmTransactions.DynamicFeeTx.md#value)

## Properties

### accesses

• **accesses**: [`AccessTuple`](chain.evm.evmTransactions.AccessTuple.md)[]

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:90

___

### chainId

• **chainId**: `string`

destination EVM chain ID

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:75

___

### data

• **data**: `Uint8Array`

input defines the data payload bytes of the transaction.

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:89

___

### gas

• **gas**: `number`

gas defines the gas limit defined for the transaction.

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:83

___

### gasFeeCap

• **gasFeeCap**: `string`

gas fee cap defines the max value for the gas fee

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:81

___

### gasTipCap

• **gasTipCap**: `string`

gas tip cap defines the max value for the gas tip

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:79

___

### nonce

• **nonce**: `number`

nonce corresponds to the account nonce (transaction sequence).

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:77

___

### r

• **r**: `Uint8Array`

r defines the signature value

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:94

___

### s

• **s**: `Uint8Array`

s define the signature value

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:96

___

### to

• **to**: `string`

hex formatted address of the recipient

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:85

___

### v

• **v**: `Uint8Array`

v defines the signature value

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:92

___

### value

• **value**: `string`

value defines the the transaction amount.

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:87
