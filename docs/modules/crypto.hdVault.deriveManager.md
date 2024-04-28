[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](crypto.md) / [hdVault](crypto.hdVault.md) / deriveManager

# Namespace: deriveManager

[crypto](crypto.md).[hdVault](crypto.hdVault.md).deriveManager

## Table of contents

### Functions

- [deriveAddressFromPhrase](crypto.hdVault.deriveManager.md#deriveaddressfromphrase)
- [deriveKeyPairFromPrivateKeySeed](crypto.hdVault.deriveManager.md#derivekeypairfromprivatekeyseed)
- [derivePrivateKeySeed](crypto.hdVault.deriveManager.md#deriveprivatekeyseed)

## Functions

### deriveAddressFromPhrase

▸ **deriveAddressFromPhrase**(`phrase`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `phrase` | [`MnemonicPhrase`](crypto.hdVault.mnemonic.md#mnemonicphrase) |

#### Returns

`Promise`\<`string`\>

#### Defined in

crypto/hdVault/deriveManager.ts:16

___

### deriveKeyPairFromPrivateKeySeed

▸ **deriveKeyPairFromPrivateKeySeed**(`privkey`): `Promise`\<[`KeyPair`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPair.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `privkey` | `Uint8Array` |

#### Returns

`Promise`\<[`KeyPair`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPair.md)\>

#### Defined in

crypto/hdVault/deriveManager.ts:29

___

### derivePrivateKeySeed

▸ **derivePrivateKeySeed**(`masterKey`, `keyPath`, `curve?`): `Uint8Array`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `masterKey` | `Uint8Array` | `undefined` |
| `keyPath` | `string` | `undefined` |
| `curve` | [`KeyPairCurve`](crypto.hdVault.hdVaultTypes.md#keypaircurve) | `CosmosCrypto.Slip10Curve.Secp256k1` |

#### Returns

`Uint8Array`

#### Defined in

crypto/hdVault/deriveManager.ts:56
