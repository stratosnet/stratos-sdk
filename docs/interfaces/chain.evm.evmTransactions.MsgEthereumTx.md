[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](../modules/chain.md) / [evm](../modules/chain.evm.md) / [evmTransactions](../modules/chain.evm.evmTransactions.md) / MsgEthereumTx

# Interface: MsgEthereumTx

[evm](../modules/chain.evm.md).[evmTransactions](../modules/chain.evm.evmTransactions.md).MsgEthereumTx

MsgEthereumTx encapsulates an Ethereum transaction as an SDK message.

## Table of contents

### Properties

- [data](chain.evm.evmTransactions.MsgEthereumTx.md#data)
- [from](chain.evm.evmTransactions.MsgEthereumTx.md#from)
- [hash](chain.evm.evmTransactions.MsgEthereumTx.md#hash)
- [size](chain.evm.evmTransactions.MsgEthereumTx.md#size)

## Properties

### data

• **data**: `undefined` \| `Any`

inner transaction data

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:12

___

### from

• **from**: `string`

ethereum signer address in hex format. This address value is checked
against the address derived from the signature (V, R, S) using the
secp256k1 elliptic curve

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:22

___

### hash

• **hash**: `string`

transaction hash in hex format

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:16

___

### size

• **size**: `number`

encoded storage size of the transaction

#### Defined in

chain/evm/proto/stratos/v1/tx.ts:14
