[Stratos SDK](../README.md) / [Exports](../modules.md) / accounts

# Namespace: accounts

## Table of contents

### Interfaces

- [BalanceCardMetrics](../interfaces/accounts.BalanceCardMetrics.md)
- [OtherBalanceCardMetrics](../interfaces/accounts.OtherBalanceCardMetrics.md)

### Functions

- [formatBalanceFromWei](accounts.md#formatbalancefromwei)
- [getAccountTrasactions](accounts.md#getaccounttrasactions)
- [getBalance](accounts.md#getbalance)
- [getBalanceCardMetrics](accounts.md#getbalancecardmetrics)
- [getBalanceInWei](accounts.md#getbalanceinwei)
- [getMaxAvailableBalance](accounts.md#getmaxavailablebalance)
- [getOtherBalanceCardMetrics](accounts.md#getotherbalancecardmetrics)
- [increaseBalance](accounts.md#increasebalance)

## Functions

### formatBalanceFromWei

▸ **formatBalanceFromWei**(`amount`, `requiredPrecision`, `appendDenom?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `string` | `undefined` |
| `requiredPrecision` | `number` | `undefined` |
| `appendDenom` | `boolean` | `false` |

#### Returns

`string`

#### Defined in

accounts/accounts.ts:97

___

### getAccountTrasactions

▸ **getAccountTrasactions**(`address`, `type?`, `page?`, `pageLimit?`, `userType?`): `Promise`\<[`ParsedTxData`](../interfaces/transformerTypes.ParsedTxData.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `type` | [`HistoryTxType`](../enums/transactionTypes.HistoryTxType.md) | `TxTypes.HistoryTxType.All` |
| `page` | `number` | `1` |
| `pageLimit` | `number` | `5` |
| `userType` | [`TxHistoryUserType`](networkTypes.md#txhistoryusertype) | `TxHistoryUser.TxHistorySenderUser` |

#### Returns

`Promise`\<[`ParsedTxData`](../interfaces/transformerTypes.ParsedTxData.md)\>

#### Defined in

accounts/accounts.ts:280

___

### getBalance

▸ **getBalance**(`keyPairAddress`, `requestedDenom`, `decimals?`): `Promise`\<`string`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keyPairAddress` | `string` | `undefined` |
| `requestedDenom` | `string` | `undefined` |
| `decimals` | `number` | `decimalShortPrecision` |

#### Returns

`Promise`\<`string`\>

#### Defined in

accounts/accounts.ts:85

___

### getBalanceCardMetrics

▸ **getBalanceCardMetrics**(`keyPairAddress`): `Promise`\<[`BalanceCardMetrics`](../interfaces/accounts.BalanceCardMetrics.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyPairAddress` | `string` |

#### Returns

`Promise`\<[`BalanceCardMetrics`](../interfaces/accounts.BalanceCardMetrics.md)\>

#### Defined in

accounts/accounts.ts:146

___

### getBalanceInWei

▸ **getBalanceInWei**(`keyPairAddress`, `requestedDenom`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyPairAddress` | `string` |
| `requestedDenom` | `string` |

#### Returns

`Promise`\<`BigNumber`\>

#### Defined in

accounts/accounts.ts:68

___

### getMaxAvailableBalance

▸ **getMaxAvailableBalance**(`keyPairAddress`, `requestedDenom`, `decimals?`): `Promise`\<`string`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keyPairAddress` | `string` | `undefined` |
| `requestedDenom` | `string` | `undefined` |
| `decimals` | `number` | `4` |

#### Returns

`Promise`\<`string`\>

#### Defined in

accounts/accounts.ts:261

___

### getOtherBalanceCardMetrics

▸ **getOtherBalanceCardMetrics**(`keyPairAddress`): `Promise`\<[`OtherBalanceCardMetrics`](../interfaces/accounts.OtherBalanceCardMetrics.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyPairAddress` | `string` |

#### Returns

`Promise`\<[`OtherBalanceCardMetrics`](../interfaces/accounts.OtherBalanceCardMetrics.md)\>

#### Defined in

accounts/accounts.ts:110

___

### increaseBalance

▸ **increaseBalance**(`walletAddress`, `faucetUrl`, `denom?`): `Promise`\<\{ `errorMessage`: `string` ; `result`: `boolean` = false } \| \{ `errorMessage?`: `undefined` ; `result`: `boolean` = true }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletAddress` | `string` |
| `faucetUrl` | `string` |
| `denom?` | `string` |

#### Returns

`Promise`\<\{ `errorMessage`: `string` ; `result`: `boolean` = false } \| \{ `errorMessage?`: `undefined` ; `result`: `boolean` = true }\>

#### Defined in

accounts/accounts.ts:47
