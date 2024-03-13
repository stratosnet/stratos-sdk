[Stratos SDK](../README.md) / [Exports](../modules.md) / transactionTypes

# Namespace: transactionTypes

## Table of contents

### Enumerations

- [HistoryTxType](../enums/transactionTypes.HistoryTxType.md)
- [TxHistoryTypes](../enums/transactionTypes.TxHistoryTypes.md)
- [TxMsgTypes](../enums/transactionTypes.TxMsgTypes.md)

### Interfaces

- [AmountType](../interfaces/transactionTypes.AmountType.md)
- [BaseTransaction](../interfaces/transactionTypes.BaseTransaction.md)
- [BeginRedelegateTxMessage](../interfaces/transactionTypes.BeginRedelegateTxMessage.md)
- [BeginRedelegateTxPayload](../interfaces/transactionTypes.BeginRedelegateTxPayload.md)
- [BroadcastResult](../interfaces/transactionTypes.BroadcastResult.md)
- [DecodedSignedTransaction](../interfaces/transactionTypes.DecodedSignedTransaction.md)
- [DelegateTransactionValue](../interfaces/transactionTypes.DelegateTransactionValue.md)
- [DelegateTxMessage](../interfaces/transactionTypes.DelegateTxMessage.md)
- [DelegateTxPayload](../interfaces/transactionTypes.DelegateTxPayload.md)
- [EmptyObject](../interfaces/transactionTypes.EmptyObject.md)
- [SdsPrepayTxMessage](../interfaces/transactionTypes.SdsPrepayTxMessage.md)
- [SdsPrepayTxPayload](../interfaces/transactionTypes.SdsPrepayTxPayload.md)
- [SdsPrepayValue](../interfaces/transactionTypes.SdsPrepayValue.md)
- [SendTransactionValue](../interfaces/transactionTypes.SendTransactionValue.md)
- [SendTxMessage](../interfaces/transactionTypes.SendTxMessage.md)
- [SendTxPayload](../interfaces/transactionTypes.SendTxPayload.md)
- [SignedTransaction](../interfaces/transactionTypes.SignedTransaction.md)
- [Transaction](../interfaces/transactionTypes.Transaction.md)
- [TransactionFee](../interfaces/transactionTypes.TransactionFee.md)
- [TransactionMessage](../interfaces/transactionTypes.TransactionMessage.md)
- [TransactionValue](../interfaces/transactionTypes.TransactionValue.md)
- [UnDelegateTxMessage](../interfaces/transactionTypes.UnDelegateTxMessage.md)
- [UnDelegateTxPayload](../interfaces/transactionTypes.UnDelegateTxPayload.md)
- [WithdrawalRewardTxMessage](../interfaces/transactionTypes.WithdrawalRewardTxMessage.md)
- [WithdrawalRewardTxPayload](../interfaces/transactionTypes.WithdrawalRewardTxPayload.md)

### Type Aliases

- [TxMessage](transactionTypes.md#txmessage)
- [TxPayload](transactionTypes.md#txpayload)

### Variables

- [BlockChainTxMsgTypesMap](transactionTypes.md#blockchaintxmsgtypesmap)
- [TxHistoryTypesMap](transactionTypes.md#txhistorytypesmap)
- [TxMsgTypesMap](transactionTypes.md#txmsgtypesmap)

## Type Aliases

### TxMessage

Ƭ **TxMessage**: [`SendTxMessage`](../interfaces/transactionTypes.SendTxMessage.md) \| [`DelegateTxMessage`](../interfaces/transactionTypes.DelegateTxMessage.md) \| [`WithdrawalRewardTxMessage`](../interfaces/transactionTypes.WithdrawalRewardTxMessage.md) \| [`SdsPrepayTxMessage`](../interfaces/transactionTypes.SdsPrepayTxMessage.md) \| [`BeginRedelegateTxMessage`](../interfaces/transactionTypes.BeginRedelegateTxMessage.md)

#### Defined in

transactions/types.ts:212

___

### TxPayload

Ƭ **TxPayload**: [`SendTxPayload`](../interfaces/transactionTypes.SendTxPayload.md) \| [`DelegateTxPayload`](../interfaces/transactionTypes.DelegateTxPayload.md) \| [`BeginRedelegateTxPayload`](../interfaces/transactionTypes.BeginRedelegateTxPayload.md) \| [`UnDelegateTxPayload`](../interfaces/transactionTypes.UnDelegateTxPayload.md) \| [`WithdrawalRewardTxPayload`](../interfaces/transactionTypes.WithdrawalRewardTxPayload.md) \| [`SdsPrepayTxPayload`](../interfaces/transactionTypes.SdsPrepayTxPayload.md)

#### Defined in

transactions/types.ts:245

## Variables

### BlockChainTxMsgTypesMap

• `Const` **BlockChainTxMsgTypesMap**: `Map`\<`number`, `string`\>

#### Defined in

transactions/types.ts:87

___

### TxHistoryTypesMap

• `Const` **TxHistoryTypesMap**: `Map`\<`string`, `number`\>

#### Defined in

transactions/types.ts:97

___

### TxMsgTypesMap

• `Const` **TxMsgTypesMap**: `Map`\<`number`, `string`\>

#### Defined in

transactions/types.ts:66
