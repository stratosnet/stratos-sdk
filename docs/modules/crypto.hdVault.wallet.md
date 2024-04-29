[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](crypto.md) / [hdVault](crypto.hdVault.md) / wallet

# Namespace: wallet

[crypto](crypto.md).[hdVault](crypto.hdVault.md).wallet

## Table of contents

### Variables

- [stratosDenom](crypto.hdVault.wallet.md#stratosdenom)
- [stratosOzDenom](crypto.hdVault.wallet.md#stratosozdenom)
- [stratosTopDenom](crypto.hdVault.wallet.md#stratostopdenom)
- [stratosUozDenom](crypto.hdVault.wallet.md#stratosuozdenom)

### Functions

- [deriveKeyPair](crypto.hdVault.wallet.md#derivekeypair)
- [deriveKeyPairFromMnemonic](crypto.hdVault.wallet.md#derivekeypairfrommnemonic)

## Variables

### stratosDenom

• `Const` **stratosDenom**: ``"wei"``

#### Defined in

config/hdVault.ts:24

___

### stratosOzDenom

• `Const` **stratosOzDenom**: ``"oz"``

#### Defined in

config/hdVault.ts:29

___

### stratosTopDenom

• `Const` **stratosTopDenom**: ``"stos"``

#### Defined in

config/hdVault.ts:26

___

### stratosUozDenom

• `Const` **stratosUozDenom**: ``"uoz"``

#### Defined in

config/hdVault.ts:28

## Functions

### deriveKeyPair

▸ **deriveKeyPair**(`keyIndex`, `password`, `encryptedMasterKeySeed`): `Promise`\<``false`` \| [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyIndex` | `number` |
| `password` | `string` |
| `encryptedMasterKeySeed` | `string` |

#### Returns

`Promise`\<``false`` \| [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md)\>

#### Defined in

crypto/hdVault/wallet.ts:16

___

### deriveKeyPairFromMnemonic

▸ **deriveKeyPairFromMnemonic**(`givenMnemonic`, `hdPathIndex?`, `password?`): `Promise`\<``false`` \| [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `givenMnemonic` | `string` | `undefined` |
| `hdPathIndex` | `number` | `0` |
| `password` | `string` | `''` |

#### Returns

`Promise`\<``false`` \| [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md)\>

#### Defined in

crypto/hdVault/wallet.ts:56
