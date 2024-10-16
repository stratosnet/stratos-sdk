[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](../modules/crypto.md) / [protoSigning](../modules/crypto.protoSigning.md) / [StratosDirectSecp256k1HdWallet](../modules/crypto.protoSigning.StratosDirectSecp256k1HdWallet.md) / StratosDirectSecp256k1HdWallet

# Class: StratosDirectSecp256k1HdWallet

[protoSigning](../modules/crypto.protoSigning.md).[StratosDirectSecp256k1HdWallet](../modules/crypto.protoSigning.StratosDirectSecp256k1HdWallet.md).StratosDirectSecp256k1HdWallet

## Hierarchy

- `DirectSecp256k1HdWallet`

  ↳ **`StratosDirectSecp256k1HdWallet`**

## Table of contents

### Accessors

- [mnemonic](crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md#mnemonic)

### Methods

- [getAccounts](crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md#getaccounts)
- [serialize](crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md#serialize)
- [signDirect](crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md#signdirect)
- [fromMnemonic](crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md#frommnemonic)

## Accessors

### mnemonic

• `get` **mnemonic**(): `string`

#### Returns

`string`

#### Overrides

DirectSecp256k1HdWallet.mnemonic

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:168

## Methods

### getAccounts

▸ **getAccounts**(): `Promise`\<readonly [`AccountData`](../interfaces/crypto.protoSigning.StratosDirectSecp256k1HdWallet.AccountData.md)[]\>

#### Returns

`Promise`\<readonly [`AccountData`](../interfaces/crypto.protoSigning.StratosDirectSecp256k1HdWallet.AccountData.md)[]\>

#### Overrides

DirectSecp256k1HdWallet.getAccounts

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:172

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

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:232

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

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:181

___

### fromMnemonic

▸ **fromMnemonic**(`mnemonic`, `options?`): `Promise`\<[`StratosDirectSecp256k1HdWallet`](crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonic` | `string` |
| `options` | `Partial`\<`DirectSecp256k1HdWalletOptions`\> |

#### Returns

`Promise`\<[`StratosDirectSecp256k1HdWallet`](crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md)\>

#### Overrides

DirectSecp256k1HdWallet.fromMnemonic

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:136
