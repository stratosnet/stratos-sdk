[Stratos SDK](../README.md) / [Exports](../modules.md) / [hdVault](hdVault.md) / keyManager

# Namespace: keyManager

[hdVault](hdVault.md).keyManager

## Table of contents

### Interfaces

- [LegacyMasterKeyInfo](../interfaces/hdVault.keyManager.LegacyMasterKeyInfo.md)
- [MasterKeyInfo](../interfaces/hdVault.keyManager.MasterKeyInfo.md)

### Functions

- [createMasterKeySeed](hdVault.keyManager.md#createmasterkeyseed)
- [createMasterKeySeedFromGivenSeed](hdVault.keyManager.md#createmasterkeyseedfromgivenseed)
- [getSerializedWalletFromPhrase](hdVault.keyManager.md#getserializedwalletfromphrase)
- [unlockMasterKeySeed](hdVault.keyManager.md#unlockmasterkeyseed)

## Functions

### createMasterKeySeed

▸ **createMasterKeySeed**(`phrase`, `password`, `hdPathIndex?`): `Promise`\<[`MasterKeyInfo`](../interfaces/hdVault.keyManager.MasterKeyInfo.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `phrase` | [`MnemonicPhrase`](hdVault.mnemonic.md#mnemonicphrase) | `undefined` |
| `password` | `string` | `undefined` |
| `hdPathIndex` | `number` | `0` |

#### Returns

`Promise`\<[`MasterKeyInfo`](../interfaces/hdVault.keyManager.MasterKeyInfo.md)\>

#### Defined in

hdVault/keyManager.ts:50

___

### createMasterKeySeedFromGivenSeed

▸ **createMasterKeySeedFromGivenSeed**(`derivedMasterKeySeed`, `password`): `Promise`\<[`LegacyMasterKeyInfo`](../interfaces/hdVault.keyManager.LegacyMasterKeyInfo.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `derivedMasterKeySeed` | `Uint8Array` |
| `password` | `string` |

#### Returns

`Promise`\<[`LegacyMasterKeyInfo`](../interfaces/hdVault.keyManager.LegacyMasterKeyInfo.md)\>

#### Defined in

hdVault/keyManager.ts:21

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

hdVault/keyManager.ts:89

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

hdVault/keyManager.ts:81
