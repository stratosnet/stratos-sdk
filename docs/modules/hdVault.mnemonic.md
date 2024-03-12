[Stratos SDK](../README.md) / [Exports](../modules.md) / [hdVault](hdVault.md) / mnemonic

# Namespace: mnemonic

[hdVault](hdVault.md).mnemonic

## Table of contents

### Type Aliases

- [MnemonicPhrase](hdVault.mnemonic.md#mnemonicphrase)

### Functions

- [convertArrayToString](hdVault.mnemonic.md#convertarraytostring)
- [convertStringToArray](hdVault.mnemonic.md#convertstringtoarray)
- [generateMnemonicPhrase](hdVault.mnemonic.md#generatemnemonicphrase)
- [verifyPhrase](hdVault.mnemonic.md#verifyphrase)

## Type Aliases

### MnemonicPhrase

Ƭ **MnemonicPhrase**: `MnemonicItem`[]

#### Defined in

hdVault/mnemonic.ts:12

## Functions

### convertArrayToString

▸ **convertArrayToString**(`mnemonicArray`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonicArray` | [`MnemonicPhrase`](hdVault.mnemonic.md#mnemonicphrase) |

#### Returns

`string`

#### Defined in

hdVault/mnemonic.ts:16

___

### convertStringToArray

▸ **convertStringToArray**(`mnemonicStr`): [`MnemonicPhrase`](hdVault.mnemonic.md#mnemonicphrase)

#### Parameters

| Name | Type |
| :------ | :------ |
| `mnemonicStr` | `string` |

#### Returns

[`MnemonicPhrase`](hdVault.mnemonic.md#mnemonicphrase)

#### Defined in

hdVault/mnemonic.ts:20

___

### generateMnemonicPhrase

▸ **generateMnemonicPhrase**(`phraseLength`): [`MnemonicPhrase`](hdVault.mnemonic.md#mnemonicphrase)

#### Parameters

| Name | Type |
| :------ | :------ |
| `phraseLength` | `MnemonicLength` |

#### Returns

[`MnemonicPhrase`](hdVault.mnemonic.md#mnemonicphrase)

#### Defined in

hdVault/mnemonic.ts:25

___

### verifyPhrase

▸ **verifyPhrase**(`phrase`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `phrase` | [`MnemonicPhrase`](hdVault.mnemonic.md#mnemonicphrase) |

#### Returns

`boolean`

#### Defined in

hdVault/mnemonic.ts:42
