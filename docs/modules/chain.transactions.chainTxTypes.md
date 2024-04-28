[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](chain.md) / [transactions](chain.transactions.md) / chainTxTypes

# Namespace: chainTxTypes

[chain](chain.md).[transactions](chain.transactions.md).chainTxTypes

## Table of contents

### Enumerations

- [HistoryTxType](../enums/chain.transactions.chainTxTypes.HistoryTxType.md)
- [TxMsgTypes](../enums/chain.transactions.chainTxTypes.TxMsgTypes.md)

### Interfaces

- [BaseTransaction](../interfaces/chain.transactions.chainTxTypes.BaseTransaction.md)
- [BeginRedelegateTxMessage](../interfaces/chain.transactions.chainTxTypes.BeginRedelegateTxMessage.md)
- [BeginRedelegateTxPayload](../interfaces/chain.transactions.chainTxTypes.BeginRedelegateTxPayload.md)
- [BroadcastResult](../interfaces/chain.transactions.chainTxTypes.BroadcastResult.md)
- [DecodedSignedTransaction](../interfaces/chain.transactions.chainTxTypes.DecodedSignedTransaction.md)
- [DelegateTransactionValue](../interfaces/chain.transactions.chainTxTypes.DelegateTransactionValue.md)
- [DelegateTxMessage](../interfaces/chain.transactions.chainTxTypes.DelegateTxMessage.md)
- [DelegateTxPayload](../interfaces/chain.transactions.chainTxTypes.DelegateTxPayload.md)
- [SendTransactionValue](../interfaces/chain.transactions.chainTxTypes.SendTransactionValue.md)
- [SendTxMessage](../interfaces/chain.transactions.chainTxTypes.SendTxMessage.md)
- [SendTxPayload](../interfaces/chain.transactions.chainTxTypes.SendTxPayload.md)
- [SignedTransaction](../interfaces/chain.transactions.chainTxTypes.SignedTransaction.md)
- [Transaction](../interfaces/chain.transactions.chainTxTypes.Transaction.md)
- [TransactionFee](../interfaces/chain.transactions.chainTxTypes.TransactionFee.md)
- [TransactionMessage](../interfaces/chain.transactions.chainTxTypes.TransactionMessage.md)
- [UnDelegateTxMessage](../interfaces/chain.transactions.chainTxTypes.UnDelegateTxMessage.md)
- [UnDelegateTxPayload](../interfaces/chain.transactions.chainTxTypes.UnDelegateTxPayload.md)
- [WithdrawalRewardTxMessage](../interfaces/chain.transactions.chainTxTypes.WithdrawalRewardTxMessage.md)
- [WithdrawalRewardTxPayload](../interfaces/chain.transactions.chainTxTypes.WithdrawalRewardTxPayload.md)

### Type Aliases

- [TxMessage](chain.transactions.chainTxTypes.md#txmessage)
- [TxPayload](chain.transactions.chainTxTypes.md#txpayload)

### Variables

- [BlockChainTxMsgTypesMap](chain.transactions.chainTxTypes.md#blockchaintxmsgtypesmap)
- [TxHistoryTypesMap](chain.transactions.chainTxTypes.md#txhistorytypesmap)
- [TxMsgTypesMap](chain.transactions.chainTxTypes.md#txmsgtypesmap)

## Type Aliases

### TxMessage

Ƭ **TxMessage**: [`SendTxMessage`](../interfaces/chain.transactions.chainTxTypes.SendTxMessage.md) \| [`DelegateTxMessage`](../interfaces/chain.transactions.chainTxTypes.DelegateTxMessage.md) \| [`WithdrawalRewardTxMessage`](../interfaces/chain.transactions.chainTxTypes.WithdrawalRewardTxMessage.md) \| [`SdsPrepayTxMessage`](../interfaces/sds.transactions.sdsTxTypes.SdsPrepayTxMessage.md) \| [`BeginRedelegateTxMessage`](../interfaces/chain.transactions.chainTxTypes.BeginRedelegateTxMessage.md)

#### Defined in

chain/transactions/types.ts:184

___

### TxPayload

Ƭ **TxPayload**: [`SendTxPayload`](../interfaces/chain.transactions.chainTxTypes.SendTxPayload.md) \| [`DelegateTxPayload`](../interfaces/chain.transactions.chainTxTypes.DelegateTxPayload.md) \| [`BeginRedelegateTxPayload`](../interfaces/chain.transactions.chainTxTypes.BeginRedelegateTxPayload.md) \| [`UnDelegateTxPayload`](../interfaces/chain.transactions.chainTxTypes.UnDelegateTxPayload.md) \| [`WithdrawalRewardTxPayload`](../interfaces/chain.transactions.chainTxTypes.WithdrawalRewardTxPayload.md) \| [`SdsPrepayTxPayload`](../interfaces/sds.transactions.sdsTxTypes.SdsPrepayTxPayload.md)

#### Defined in

chain/transactions/types.ts:213

## Variables

### BlockChainTxMsgTypesMap

• `Const` **BlockChainTxMsgTypesMap**: `Map`\<`number`, `string`\>

#### Defined in

chain/transactions/types.ts:83

___

### TxHistoryTypesMap

• `Const` **TxHistoryTypesMap**: `Map`\<`string`, `number`\>

#### Defined in

chain/transactions/types.ts:93

___

### TxMsgTypesMap

• `Const` **TxMsgTypesMap**: `Map`\<`number`, `string`\>

#### Defined in

chain/transactions/types.ts:62
