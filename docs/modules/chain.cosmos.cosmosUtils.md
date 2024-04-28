[Stratos SDK](../README.md) / [Exports](../modules.md) / [chain](chain.md) / [cosmos](chain.cosmos.md) / cosmosUtils

# Namespace: cosmosUtils

[chain](chain.md).[cosmos](chain.cosmos.md).cosmosUtils

## Table of contents

### Functions

- [deserializeWithEncryptionKey](chain.cosmos.cosmosUtils.md#deserializewithencryptionkey)
- [encryptMasterKeySeed](chain.cosmos.cosmosUtils.md#encryptmasterkeyseed)
- [isGteN](chain.cosmos.cosmosUtils.md#isgten)
- [isZero](chain.cosmos.cosmosUtils.md#iszero)
- [n](chain.cosmos.cosmosUtils.md#n)
- [serializeWithEncryptionKey](chain.cosmos.cosmosUtils.md#serializewithencryptionkey)

## Functions

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

chain/cosmos/cosmosUtils.ts:75

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

chain/cosmos/cosmosUtils.ts:43

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

chain/cosmos/cosmosUtils.ts:37

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

chain/cosmos/cosmosUtils.ts:24

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

chain/cosmos/cosmosUtils.ts:28

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

chain/cosmos/cosmosUtils.ts:106
