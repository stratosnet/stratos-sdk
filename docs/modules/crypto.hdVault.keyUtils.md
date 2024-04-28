[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](crypto.md) / [hdVault](crypto.hdVault.md) / keyUtils

# Namespace: keyUtils

[crypto](crypto.md).[hdVault](crypto.hdVault.md).keyUtils

## Table of contents

### Type Aliases

- [PathBuilder](crypto.hdVault.keyUtils.md#pathbuilder)

### Functions

- [convertEvmToNativeToAddress](crypto.hdVault.keyUtils.md#convertevmtonativetoaddress)
- [convertNativeToEvmAddress](crypto.hdVault.keyUtils.md#convertnativetoevmaddress)
- [decryptMasterKeySeed](crypto.hdVault.keyUtils.md#decryptmasterkeyseed)
- [encodeSignatureMessage](crypto.hdVault.keyUtils.md#encodesignaturemessage)
- [generateMasterKeySeed](crypto.hdVault.keyUtils.md#generatemasterkeyseed)
- [getAddressFromPubKeyWithKeccak](crypto.hdVault.keyUtils.md#getaddressfrompubkeywithkeccak)
- [getAminoPublicKey](crypto.hdVault.keyUtils.md#getaminopublickey)
- [getEncodedPublicKey](crypto.hdVault.keyUtils.md#getencodedpublickey)
- [getMasterKeySeed](crypto.hdVault.keyUtils.md#getmasterkeyseed)
- [makePathBuilder](crypto.hdVault.keyUtils.md#makepathbuilder)
- [signWithPrivateKey](crypto.hdVault.keyUtils.md#signwithprivatekey)
- [unlockMasterKeySeed](crypto.hdVault.keyUtils.md#unlockmasterkeyseed)
- [verifySignature](crypto.hdVault.keyUtils.md#verifysignature)

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

crypto/hdVault/keyUtils.ts:163

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

crypto/hdVault/keyUtils.ts:85

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

crypto/hdVault/keyUtils.ts:80

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

crypto/hdVault/keyUtils.ts:117

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

crypto/hdVault/keyUtils.ts:182

___

### generateMasterKeySeed

▸ **generateMasterKeySeed**(`phrase`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `phrase` | [`MnemonicPhrase`](crypto.hdVault.mnemonic.md#mnemonicphrase) |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

crypto/hdVault/keyUtils.ts:24

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

crypto/hdVault/keyUtils.ts:64

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

crypto/hdVault/keyUtils.ts:58

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

crypto/hdVault/keyUtils.ts:90

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

crypto/hdVault/keyUtils.ts:144

___

### makePathBuilder

▸ **makePathBuilder**(`pattern`): [`PathBuilder`](crypto.hdVault.keyUtils.md#pathbuilder)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `string` |

#### Returns

[`PathBuilder`](crypto.hdVault.keyUtils.md#pathbuilder)

#### Defined in

crypto/hdVault/keyUtils.ts:165

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

crypto/hdVault/keyUtils.ts:196

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

crypto/hdVault/keyUtils.ts:131

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

crypto/hdVault/keyUtils.ts:210
