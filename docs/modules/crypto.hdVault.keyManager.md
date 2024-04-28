[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](crypto.md) / [hdVault](crypto.hdVault.md) / keyManager

# Namespace: keyManager

[crypto](crypto.md).[hdVault](crypto.hdVault.md).keyManager

## Table of contents

### Functions

- [createMasterKeySeed](crypto.hdVault.keyManager.md#createmasterkeyseed)
- [createMasterKeySeedFromGivenSeed](crypto.hdVault.keyManager.md#createmasterkeyseedfromgivenseed)
- [getSerializedWalletFromPhrase](crypto.hdVault.keyManager.md#getserializedwalletfromphrase)
- [unlockMasterKeySeed](crypto.hdVault.keyManager.md#unlockmasterkeyseed)

## Functions

### createMasterKeySeed

▸ **createMasterKeySeed**(`phrase`, `password`, `hdPathIndex?`): `Promise`\<[`MasterKeyInfo`](../interfaces/crypto.hdVault.hdVaultTypes.MasterKeyInfo.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `phrase` | [`MnemonicPhrase`](crypto.hdVault.mnemonic.md#mnemonicphrase) | `undefined` |
| `password` | `string` | `undefined` |
| `hdPathIndex` | `number` | `0` |

#### Returns

`Promise`\<[`MasterKeyInfo`](../interfaces/crypto.hdVault.hdVaultTypes.MasterKeyInfo.md)\>

#### Defined in

crypto/hdVault/keyManager.ts:52

___

### createMasterKeySeedFromGivenSeed

▸ **createMasterKeySeedFromGivenSeed**(`derivedMasterKeySeed`, `password`): `Promise`\<[`LegacyMasterKeyInfo`](../interfaces/crypto.hdVault.hdVaultTypes.LegacyMasterKeyInfo.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `derivedMasterKeySeed` | `Uint8Array` |
| `password` | `string` |

#### Returns

`Promise`\<[`LegacyMasterKeyInfo`](../interfaces/crypto.hdVault.hdVaultTypes.LegacyMasterKeyInfo.md)\>

#### Defined in

crypto/hdVault/keyManager.ts:23

___

### getSerializedWalletFromPhrase

▸ **getSerializedWalletFromPhrase**(`userMnemonic`, `password`, `hdPathIndex?`): `Promise`\<`string`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `userMnemonic` | `string` | `undefined` |
| `password` | `string` | `undefined` |
| `hdPathIndex` | `number` | `0` |

#### Returns

`Promise`\<`string`\>

#### Defined in

crypto/hdVault/keyManager.ts:93

___

### unlockMasterKeySeed

▸ **unlockMasterKeySeed**(`password`, `encryptedMasterKeySeed`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |
| `encryptedMasterKeySeed` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

crypto/hdVault/keyManager.ts:85
