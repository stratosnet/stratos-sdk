[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](chain.md) / [cosmos](chain.cosmos.md) / cosmosWallet

# Namespace: cosmosWallet

[chain](chain.md).[cosmos](chain.cosmos.md).cosmosWallet

## Table of contents

### Functions

- [createWalletAtPath](chain.cosmos.cosmosWallet.md#createwalletatpath)
- [deserializeEncryptedWallet](chain.cosmos.cosmosWallet.md#deserializeencryptedwallet)
- [getMasterKeySeedPriveKey](chain.cosmos.cosmosWallet.md#getmasterkeyseedprivekey)
- [getMasterKeySeedPublicKey](chain.cosmos.cosmosWallet.md#getmasterkeyseedpublickey)
- [getMasterKeySeedPublicKeyWithKeccak](chain.cosmos.cosmosWallet.md#getmasterkeyseedpublickeywithkeccak)
- [getPublicKeyFromPrivKey](chain.cosmos.cosmosWallet.md#getpublickeyfromprivkey)
- [serializeWallet](chain.cosmos.cosmosWallet.md#serializewallet)

## Functions

### createWalletAtPath

▸ **createWalletAtPath**(`hdPathIndex`, `mnemonic`): `Promise`\<[`StratosDirectSecp256k1HdWallet`](../classes/crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `hdPathIndex` | `number` |
| `mnemonic` | `string` |

#### Returns

`Promise`\<[`StratosDirectSecp256k1HdWallet`](../classes/crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md)\>

#### Defined in

chain/cosmos/cosmosWallet.ts:48

___

### deserializeEncryptedWallet

▸ **deserializeEncryptedWallet**(`serializedWallet`, `password`): `Promise`\<[`StratosDirectSecp256k1HdWallet`](../classes/crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serializedWallet` | `string` |
| `password` | `string` |

#### Returns

`Promise`\<[`StratosDirectSecp256k1HdWallet`](../classes/crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md)\>

#### Defined in

chain/cosmos/cosmosWallet.ts:12

___

### getMasterKeySeedPriveKey

▸ **getMasterKeySeedPriveKey**(`masterKeySeed`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `masterKeySeed` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

chain/cosmos/cosmosWallet.ts:76

___

### getMasterKeySeedPublicKey

▸ **getMasterKeySeedPublicKey**(`masterKeySeed`): `Promise`\<[`PubKey`](../interfaces/chain.cosmos.cosmosTypes.PubKey.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `masterKeySeed` | `Uint8Array` |

#### Returns

`Promise`\<[`PubKey`](../interfaces/chain.cosmos.cosmosTypes.PubKey.md)\>

#### Defined in

chain/cosmos/cosmosWallet.ts:97

___

### getMasterKeySeedPublicKeyWithKeccak

▸ **getMasterKeySeedPublicKeyWithKeccak**(`masterKeySeed`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `masterKeySeed` | `Uint8Array` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

chain/cosmos/cosmosWallet.ts:105

___

### getPublicKeyFromPrivKey

▸ **getPublicKeyFromPrivKey**(`privkey`): `Promise`\<[`PubKey`](../interfaces/chain.cosmos.cosmosTypes.PubKey.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `privkey` | `Uint8Array` |

#### Returns

`Promise`\<[`PubKey`](../interfaces/chain.cosmos.cosmosTypes.PubKey.md)\>

#### Defined in

chain/cosmos/cosmosWallet.ts:84

___

### serializeWallet

▸ **serializeWallet**(`wallet`, `password`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | [`StratosDirectSecp256k1HdWallet`](../classes/crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md) |
| `password` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

chain/cosmos/cosmosWallet.ts:31
