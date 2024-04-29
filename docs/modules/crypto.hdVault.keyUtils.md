[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](crypto.md) / [hdVault](crypto.hdVault.md) / keyUtils

# Namespace: keyUtils

[crypto](crypto.md).[hdVault](crypto.hdVault.md).keyUtils

## Table of contents

### Type Aliases

- [PathBuilder](crypto.hdVault.keyUtils.md#pathbuilder)

### Functions

- [convertEvmToNativeToAddress](crypto.hdVault.keyUtils.md#convertevmtonativetoaddress)
- [convertNativeToEvmAddress](crypto.hdVault.keyUtils.md#convertnativetoevmaddress)
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

crypto/hdVault/keyUtils.ts:113

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

crypto/hdVault/keyUtils.ts:69

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

crypto/hdVault/keyUtils.ts:64

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

crypto/hdVault/keyUtils.ts:132

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

crypto/hdVault/keyUtils.ts:15

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

crypto/hdVault/keyUtils.ts:55

___

### getAminoPublicKey

▸ **getAminoPublicKey**(`pubkey`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pubkey` | [`PubKey`](../interfaces/chain.cosmos.cosmosTypes.PubKey.md) |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

crypto/hdVault/keyUtils.ts:49

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

crypto/hdVault/keyUtils.ts:74

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

crypto/hdVault/keyUtils.ts:94

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

crypto/hdVault/keyUtils.ts:115

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

crypto/hdVault/keyUtils.ts:140

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

crypto/hdVault/keyUtils.ts:81

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

crypto/hdVault/keyUtils.ts:150
