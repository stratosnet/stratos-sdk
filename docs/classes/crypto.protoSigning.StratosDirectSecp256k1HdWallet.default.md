[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](../modules/crypto.md) / [protoSigning](../modules/crypto.protoSigning.md) / [StratosDirectSecp256k1HdWallet](../modules/crypto.protoSigning.StratosDirectSecp256k1HdWallet.md) / default

# Class: default

[protoSigning](../modules/crypto.protoSigning.md).[StratosDirectSecp256k1HdWallet](../modules/crypto.protoSigning.StratosDirectSecp256k1HdWallet.md).default

## Hierarchy

- `DirectSecp256k1HdWallet`

  ↳ **`default`**

## Table of contents

### Accessors

- [mnemonic](crypto.protoSigning.StratosDirectSecp256k1HdWallet.default.md#mnemonic)

### Methods

- [getAccounts](crypto.protoSigning.StratosDirectSecp256k1HdWallet.default.md#getaccounts)
- [serialize](crypto.protoSigning.StratosDirectSecp256k1HdWallet.default.md#serialize)
- [signDirect](crypto.protoSigning.StratosDirectSecp256k1HdWallet.default.md#signdirect)
- [fromMnemonic](crypto.protoSigning.StratosDirectSecp256k1HdWallet.default.md#frommnemonic)

## Accessors

### mnemonic

• `get` **mnemonic**(): `string`

#### Returns

`string`

#### Overrides

DirectSecp256k1HdWallet.mnemonic

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:179

## Methods

### getAccounts

▸ **getAccounts**(): `Promise`\<readonly [`AccountData`](../interfaces/crypto.protoSigning.StratosDirectSecp256k1HdWallet.AccountData.md)[]\>

#### Returns

`Promise`\<readonly [`AccountData`](../interfaces/crypto.protoSigning.StratosDirectSecp256k1HdWallet.AccountData.md)[]\>

#### Overrides

DirectSecp256k1HdWallet.getAccounts

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:183

___

### serialize

▸ **serialize**(`password`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |

#### Returns

`Promise`\<`string`\>

#### Overrides

DirectSecp256k1HdWallet.serialize

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:251

___

### signDirect

▸ **signDirect**(`signerAddress`, `signDoc`): `Promise`\<`DirectSignResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerAddress` | `string` |
| `signDoc` | `SignDoc` |

#### Returns

`Promise`\<`DirectSignResponse`\>

#### Overrides

DirectSecp256k1HdWallet.signDirect

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:193

___

### fromMnemonic

▸ **fromMnemonic**(`mnemonic`, `options?`): `Promise`\<[`default`](crypto.protoSigning.StratosDirectSecp256k1HdWallet.default.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string` |
| `options` | `Partial`\<`DirectSecp256k1HdWalletOptions`\> |

#### Returns

`Promise`\<[`default`](crypto.protoSigning.StratosDirectSecp256k1HdWallet.default.md)\>

#### Overrides

DirectSecp256k1HdWallet.fromMnemonic

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:147
