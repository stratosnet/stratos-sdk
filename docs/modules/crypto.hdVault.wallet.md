[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](crypto.md) / [hdVault](crypto.hdVault.md) / wallet

# Namespace: wallet

[crypto](crypto.md).[hdVault](crypto.hdVault.md).wallet

## Table of contents

### Functions

- [deriveKeyPair](crypto.hdVault.wallet.md#derivekeypair)
- [deriveKeyPairFromMnemonic](crypto.hdVault.wallet.md#derivekeypairfrommnemonic)

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

crypto/hdVault/wallet.ts:14

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

crypto/hdVault/wallet.ts:54
