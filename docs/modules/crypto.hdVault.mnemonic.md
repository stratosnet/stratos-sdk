[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](crypto.md) / [hdVault](crypto.hdVault.md) / mnemonic

# Namespace: mnemonic

[crypto](crypto.md).[hdVault](crypto.hdVault.md).mnemonic

## Table of contents

### Type Aliases

- [MnemonicPhrase](crypto.hdVault.mnemonic.md#mnemonicphrase)

### Functions

- [convertArrayToString](crypto.hdVault.mnemonic.md#convertarraytostring)
- [convertStringToArray](crypto.hdVault.mnemonic.md#convertstringtoarray)
- [generateMnemonicPhrase](crypto.hdVault.mnemonic.md#generatemnemonicphrase)
- [verifyPhrase](crypto.hdVault.mnemonic.md#verifyphrase)

## Type Aliases

### MnemonicPhrase

Ƭ **MnemonicPhrase**: `MnemonicItem`[]

#### Defined in

crypto/hdVault/mnemonic.ts:12

## Functions

### convertArrayToString

▸ **convertArrayToString**(`mnemonicArray`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonicArray` | [`MnemonicPhrase`](crypto.hdVault.mnemonic.md#mnemonicphrase) |

#### Returns

`string`

#### Defined in

crypto/hdVault/mnemonic.ts:16

___

### convertStringToArray

▸ **convertStringToArray**(`mnemonicStr`): [`MnemonicPhrase`](crypto.hdVault.mnemonic.md#mnemonicphrase)

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonicStr` | `string` |

#### Returns

[`MnemonicPhrase`](crypto.hdVault.mnemonic.md#mnemonicphrase)

#### Defined in

crypto/hdVault/mnemonic.ts:20

___

### generateMnemonicPhrase

▸ **generateMnemonicPhrase**(`phraseLength`): [`MnemonicPhrase`](crypto.hdVault.mnemonic.md#mnemonicphrase)

#### Parameters

| Name | Type |
| :------ | :------ |
| `phraseLength` | `MnemonicLength` |

#### Returns

[`MnemonicPhrase`](crypto.hdVault.mnemonic.md#mnemonicphrase)

#### Defined in

crypto/hdVault/mnemonic.ts:25

___

### verifyPhrase

▸ **verifyPhrase**(`phrase`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `phrase` | [`MnemonicPhrase`](crypto.hdVault.mnemonic.md#mnemonicphrase) |

#### Returns

`boolean`

#### Defined in

crypto/hdVault/mnemonic.ts:42
