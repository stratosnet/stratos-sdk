[Stratos SDK](../README.md) / [Exports](../modules.md) / [hdVault](hdVault.md) / wallet

# Namespace: wallet

[hdVault](hdVault.md).wallet

## Table of contents

### Interfaces

- [KeyPairInfo](../interfaces/hdVault.wallet.KeyPairInfo.md)
- [TransactionMessage](../interfaces/hdVault.wallet.TransactionMessage.md)

### Variables

- [stratosDenom](hdVault.wallet.md#stratosdenom)
- [stratosOzDenom](hdVault.wallet.md#stratosozdenom)
- [stratosTopDenom](hdVault.wallet.md#stratostopdenom)
- [stratosUozDenom](hdVault.wallet.md#stratosuozdenom)

### Functions

- [deriveKeyPair](hdVault.wallet.md#derivekeypair)
- [deserializeEncryptedWallet](hdVault.wallet.md#deserializeencryptedwallet)

## Variables

### stratosDenom

• `Const` **stratosDenom**: ``"wei"``

#### Defined in

config/hdVault.ts:13

___

### stratosOzDenom

• `Const` **stratosOzDenom**: ``"oz"``

#### Defined in

config/hdVault.ts:18

___

### stratosTopDenom

• `Const` **stratosTopDenom**: ``"stos"``

#### Defined in

config/hdVault.ts:15

___

### stratosUozDenom

• `Const` **stratosUozDenom**: ``"uoz"``

#### Defined in

config/hdVault.ts:17

## Functions

### deriveKeyPair

▸ **deriveKeyPair**(`keyIndex`, `password`, `encryptedMasterKeySeed`): `Promise`\<``false`` \| [`KeyPairInfo`](../interfaces/hdVault.wallet.KeyPairInfo.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyIndex` | `number` |
| `password` | `string` |
| `encryptedMasterKeySeed` | `string` |

#### Returns

`Promise`\<``false`` \| [`KeyPairInfo`](../interfaces/hdVault.wallet.KeyPairInfo.md)\>

#### Defined in

hdVault/wallet.ts:22

___

### deserializeEncryptedWallet

▸ **deserializeEncryptedWallet**(`serializedWallet`, `password`): `Promise`\<`StratosDirectSecp256k1HdWallet`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serializedWallet` | `string` |
| `password` | `string` |

#### Returns

`Promise`\<`StratosDirectSecp256k1HdWallet`\>

#### Defined in

hdVault/wallet.ts:53
