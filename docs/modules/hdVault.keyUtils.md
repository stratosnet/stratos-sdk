[Stratos SDK](../README.md) / [Exports](../modules.md) / [hdVault](hdVault.md) / keyUtils

# Namespace: keyUtils

[hdVault](hdVault.md).keyUtils

## Table of contents

### Type Aliases

- [PathBuilder](hdVault.keyUtils.md#pathbuilder)

### Functions

- [convertEvmToNativeToAddress](hdVault.keyUtils.md#convertevmtonativetoaddress)
- [convertNativeToEvmAddress](hdVault.keyUtils.md#convertnativetoevmaddress)
- [createWalletAtPath](hdVault.keyUtils.md#createwalletatpath)
- [decryptMasterKeySeed](hdVault.keyUtils.md#decryptmasterkeyseed)
- [encodeSignatureMessage](hdVault.keyUtils.md#encodesignaturemessage)
- [encryptMasterKeySeed](hdVault.keyUtils.md#encryptmasterkeyseed)
- [generateMasterKeySeed](hdVault.keyUtils.md#generatemasterkeyseed)
- [getAddressFromPubKey](hdVault.keyUtils.md#getaddressfrompubkey)
- [getAddressFromPubKeyWithKeccak](hdVault.keyUtils.md#getaddressfrompubkeywithkeccak)
- [getAminoPublicKey](hdVault.keyUtils.md#getaminopublickey)
- [getEncodedPublicKey](hdVault.keyUtils.md#getencodedpublickey)
- [getEncryptionKey](hdVault.keyUtils.md#getencryptionkey)
- [getMasterKeySeed](hdVault.keyUtils.md#getmasterkeyseed)
- [makePathBuilder](hdVault.keyUtils.md#makepathbuilder)
- [serializeWallet](hdVault.keyUtils.md#serializewallet)
- [signWithPrivateKey](hdVault.keyUtils.md#signwithprivatekey)
- [unlockMasterKeySeed](hdVault.keyUtils.md#unlockmasterkeyseed)
- [verifySignature](hdVault.keyUtils.md#verifysignature)

## Type Aliases

### PathBuilder

Ƭ **PathBuilder**: (`account_index`: `number`) => `HdPath`

#### Type declaration

▸ (`account_index`): `HdPath`

##### Parameters

| Name | Type |
| :------ | :------ |
| `account_index` | `number` |

##### Returns

`HdPath`

#### Defined in

hdVault/keyUtils.ts:241

## Functions

### convertEvmToNativeToAddress

▸ **convertEvmToNativeToAddress**(`evmAddress`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `evmAddress` | `string` |

#### Returns

`string`

#### Defined in

hdVault/keyUtils.ts:163

___

### convertNativeToEvmAddress

▸ **convertNativeToEvmAddress**(`nativeAddress`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nativeAddress` | `string` |

#### Returns

`string`

#### Defined in

hdVault/keyUtils.ts:158

___

### createWalletAtPath

▸ **createWalletAtPath**(`hdPathIndex`, `mnemonic`): `Promise`\<`StratosDirectSecp256k1HdWallet`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hdPathIndex` | `number` |
| `mnemonic` | `string` |

#### Returns

`Promise`\<`StratosDirectSecp256k1HdWallet`\>

#### Defined in

hdVault/keyUtils.ts:282

___

### decryptMasterKeySeed

▸ **decryptMasterKeySeed**(`password`, `encryptedMasterKeySeed`): `Promise`\<``false`` \| `Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |
| `encryptedMasterKeySeed` | `string` |

#### Returns

`Promise`\<``false`` \| `Uint8Array`\>

#### Defined in

hdVault/keyUtils.ts:195

___

### encodeSignatureMessage

▸ **encodeSignatureMessage**(`message`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Uint8Array`

#### Defined in

hdVault/keyUtils.ts:353

___

### encryptMasterKeySeed

▸ **encryptMasterKeySeed**(`password`, `masterKeySeed`): `SjclCipherEncrypted`

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |
| `masterKeySeed` | `Uint8Array` |

#### Returns

`SjclCipherEncrypted`

#### Defined in

hdVault/keyUtils.ts:175

___

### generateMasterKeySeed

▸ **generateMasterKeySeed**(`phrase`): `Promise`\<`Uint8Array`\>

const keyPath =                            "m/44'/606'/0'/0/1";
The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
with 0-based account index `a`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `phrase` | [`MnemonicPhrase`](hdVault.mnemonic.md#mnemonicphrase) |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

hdVault/keyUtils.ts:50

___

### getAddressFromPubKey

▸ **getAddressFromPubKey**(`pubkey`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pubkey` | `PubKey` |

#### Returns

`string`

#### Defined in

hdVault/keyUtils.ts:129

___

### getAddressFromPubKeyWithKeccak

▸ **getAddressFromPubKeyWithKeccak**(`pubkey`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pubkey` | `Uint8Array` |

#### Returns

`string`

#### Defined in

hdVault/keyUtils.ts:142

___

### getAminoPublicKey

▸ **getAminoPublicKey**(`pubkey`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pubkey` | `PubKey` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

hdVault/keyUtils.ts:106

___

### getEncodedPublicKey

▸ **getEncodedPublicKey**(`encodedAminoPub`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `encodedAminoPub` | `Uint8Array` |

#### Returns

`Promise`\<`string`\>

#### Defined in

hdVault/keyUtils.ts:168

___

### getEncryptionKey

▸ **getEncryptionKey**(`password`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

hdVault/keyUtils.ts:63

___

### getMasterKeySeed

▸ **getMasterKeySeed**(`password`, `encryptedMasterKeySeed`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |
| `encryptedMasterKeySeed` | `string` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

hdVault/keyUtils.ts:222

___

### makePathBuilder

▸ **makePathBuilder**(`pattern`): [`PathBuilder`](hdVault.keyUtils.md#pathbuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `string` |

#### Returns

[`PathBuilder`](hdVault.keyUtils.md#pathbuilder)

#### Defined in

hdVault/keyUtils.ts:243

___

### serializeWallet

▸ **serializeWallet**(`wallet`, `password`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | `StratosDirectSecp256k1HdWallet` |
| `password` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

hdVault/keyUtils.ts:261

___

### signWithPrivateKey

▸ **signWithPrivateKey**(`signMessageString`, `privateKey`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signMessageString` | `string` |
| `privateKey` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

hdVault/keyUtils.ts:367

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

hdVault/keyUtils.ts:209

___

### verifySignature

▸ **verifySignature**(`signatureMessage`, `signature`, `publicKey`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signatureMessage` | `string` |
| `signature` | `string` |
| `publicKey` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

hdVault/keyUtils.ts:381
