[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](chain.md) / [cosmos](chain.cosmos.md) / cosmosUtils

# Namespace: cosmosUtils

[chain](chain.md).[cosmos](chain.cosmos.md).cosmosUtils

## Table of contents

### Functions

- [decryptMasterKeySeed](chain.cosmos.cosmosUtils.md#decryptmasterkeyseed)
- [deserializeWithEncryptionKey](chain.cosmos.cosmosUtils.md#deserializewithencryptionkey)
- [encryptMasterKeySeed](chain.cosmos.cosmosUtils.md#encryptmasterkeyseed)
- [isGteN](chain.cosmos.cosmosUtils.md#isgten)
- [isZero](chain.cosmos.cosmosUtils.md#iszero)
- [n](chain.cosmos.cosmosUtils.md#n)
- [serializeWithEncryptionKey](chain.cosmos.cosmosUtils.md#serializewithencryptionkey)

## Functions

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

chain/cosmos/cosmosUtils.ts:41

___

### deserializeWithEncryptionKey

▸ **deserializeWithEncryptionKey**(`password`, `serialization`): `Promise`\<[`StratosDirectSecp256k1HdWallet`](../classes/crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |
| `serialization` | `string` |

#### Returns

`Promise`\<[`StratosDirectSecp256k1HdWallet`](../classes/crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md)\>

#### Defined in

chain/cosmos/cosmosUtils.ts:85

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

chain/cosmos/cosmosUtils.ts:55

___

### isGteN

▸ **isGteN**(`curve`, `privkey`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `curve` | `Slip10Curve` |
| `privkey` | `Uint8Array` |

#### Returns

`boolean`

#### Defined in

chain/cosmos/cosmosUtils.ts:35

___

### isZero

▸ **isZero**(`privkey`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `privkey` | `Uint8Array` |

#### Returns

`boolean`

#### Defined in

chain/cosmos/cosmosUtils.ts:22

___

### n

▸ **n**(`curve`): `BN`

#### Parameters

| Name | Type |
| :------ | :------ |
| `curve` | `Slip10Curve` |

#### Returns

`BN`

#### Defined in

chain/cosmos/cosmosUtils.ts:26

___

### serializeWithEncryptionKey

▸ **serializeWithEncryptionKey**(`password`, `wallet`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `password` | `string` |
| `wallet` | [`StratosDirectSecp256k1HdWallet`](../classes/crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md) |

#### Returns

`string`

#### Defined in

chain/cosmos/cosmosUtils.ts:116
