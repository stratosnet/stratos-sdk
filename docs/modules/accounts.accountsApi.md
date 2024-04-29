[Stratos SDK](../README.md) / [Exports](../modules.md) / [accounts](accounts.md) / accountsApi

# Namespace: accountsApi

[accounts](accounts.md).accountsApi

## Table of contents

### Functions

- [formatBalanceFromWei](accounts.accountsApi.md#formatbalancefromwei)
- [getAccountTrasactions](accounts.accountsApi.md#getaccounttrasactions)
- [getBalance](accounts.accountsApi.md#getbalance)
- [getBalanceCardMetrics](accounts.accountsApi.md#getbalancecardmetrics)
- [getBalanceInWei](accounts.accountsApi.md#getbalanceinwei)
- [getMaxAvailableBalance](accounts.accountsApi.md#getmaxavailablebalance)
- [getOtherBalanceCardMetrics](accounts.accountsApi.md#getotherbalancecardmetrics)
- [increaseBalance](accounts.accountsApi.md#increasebalance)

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

accounts/accounts.ts:75

___

### getAccountTrasactions

▸ **getAccountTrasactions**(`address`, `type?`, `page?`, `pageLimit?`, `userType?`): `Promise`\<`ParsedTxData`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `type` | [`HistoryTxType`](../enums/chain.transactions.chainTxTypes.HistoryTxType.md) | `TxTypes.HistoryTxType.All` |
| `page` | `number` | `1` |
| `pageLimit` | `number` | `5` |
| `userType` | [`TxHistoryUserType`](network.networkTypes.md#txhistoryusertype) | `networkTypes.TxHistoryUser.TxHistorySenderUser` |

#### Returns

`Promise`\<`ParsedTxData`\>

#### Defined in

accounts/accounts.ts:257

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

accounts/accounts.ts:63

___

### getBalanceCardMetrics

▸ **getBalanceCardMetrics**(`keyPairAddress`): `Promise`\<[`BalanceCardMetrics`](../interfaces/accounts.accountsTypes.BalanceCardMetrics.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyPairAddress` | `string` |

#### Returns

`Promise`\<[`BalanceCardMetrics`](../interfaces/accounts.accountsTypes.BalanceCardMetrics.md)\>

#### Defined in

accounts/accounts.ts:124

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

accounts/accounts.ts:46

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

accounts/accounts.ts:239

___

### getOtherBalanceCardMetrics

▸ **getOtherBalanceCardMetrics**(`keyPairAddress`): `Promise`\<[`OtherBalanceCardMetrics`](../interfaces/accounts.accountsTypes.OtherBalanceCardMetrics.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyPairAddress` | `string` |

#### Returns

`Promise`\<[`OtherBalanceCardMetrics`](../interfaces/accounts.accountsTypes.OtherBalanceCardMetrics.md)\>

#### Defined in

accounts/accounts.ts:88

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

accounts/accounts.ts:25
