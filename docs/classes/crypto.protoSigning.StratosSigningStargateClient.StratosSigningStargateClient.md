[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](../modules/crypto.md) / [protoSigning](../modules/crypto.protoSigning.md) / [StratosSigningStargateClient](../modules/crypto.protoSigning.StratosSigningStargateClient.md) / StratosSigningStargateClient

# Class: StratosSigningStargateClient

[protoSigning](../modules/crypto.protoSigning.md).[StratosSigningStargateClient](../modules/crypto.protoSigning.StratosSigningStargateClient.md).StratosSigningStargateClient

## Hierarchy

- `SigningStargateClient`

  ↳ **`StratosSigningStargateClient`**

## Table of contents

### Methods

- [decodeMessagesFromTheTxBody](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md#decodemessagesfromthetxbody)
- [ecdsaSignatures](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md#ecdsasignatures)
- [encodeMessagesFromTheTxBody](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md#encodemessagesfromthetxbody)
- [execEvm](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md#execevm)
- [getQueryService](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md#getqueryservice)
- [sign](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md#sign)
- [signForEvm](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md#signforevm)
- [connectWithSigner](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md#connectwithsigner)
- [createWithSigner](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md#createwithsigner)

## Methods

### decodeMessagesFromTheTxBody

▸ **decodeMessagesFromTheTxBody**(`messages`): `Promise`\<``null`` \| \{ `typeUrl`: `any` = message.typeUrl; `value`: `any` = decodedMessage }[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messages` | `undefined` \| `any`[] |

#### Returns

`Promise`\<``null`` \| \{ `typeUrl`: `any` = message.typeUrl; `value`: `any` = decodedMessage }[]\>

#### Defined in

crypto/stratos-proto-signing/StratosSigningStargateClient.ts:190

___

### ecdsaSignatures

▸ **ecdsaSignatures**(`raw`, `keyPair`, `prefix?`): `Promise`\<`ExtendedSecp256k1Signature`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `raw` | `any` |
| `keyPair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) |
| `prefix?` | `number` |

#### Returns

`Promise`\<`ExtendedSecp256k1Signature`\>

#### Defined in

crypto/stratos-proto-signing/StratosSigningStargateClient.ts:100

___

### encodeMessagesFromTheTxBody

▸ **encodeMessagesFromTheTxBody**(`messages`): `Promise`\<``null`` \| \{ `typeUrl`: `any` = message.typeUrl; `value`: `string`  }[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messages` | `undefined` \| `any`[] |

#### Returns

`Promise`\<``null`` \| \{ `typeUrl`: `any` = message.typeUrl; `value`: `string`  }[]\>

#### Defined in

crypto/stratos-proto-signing/StratosSigningStargateClient.ts:174

___

### execEvm

▸ **execEvm**(`payload`, `keyPair`, `simulate`): `Promise`\<`number` \| `TxRaw`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`DynamicFeeTx`](../interfaces/chain.evm.evmTransactions.DynamicFeeTx.md) |
| `keyPair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) |
| `simulate` | `boolean` |

#### Returns

`Promise`\<`number` \| `TxRaw`\>

#### Defined in

crypto/stratos-proto-signing/StratosSigningStargateClient.ts:205

___

### getQueryService

▸ **getQueryService**(): `undefined` \| `ServiceClientImpl`

#### Returns

`undefined` \| `ServiceClientImpl`

#### Defined in

crypto/stratos-proto-signing/StratosSigningStargateClient.ts:93

___

### sign

▸ **sign**(`signerAddress`, `messages`, `fee`, `memo`, `explicitSignerData?`, `extensionOptions?`): `Promise`\<`TxRaw`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerAddress` | `string` |
| `messages` | readonly `EncodeObject`[] |
| `fee` | `StdFee` |
| `memo` | `string` |
| `explicitSignerData?` | `SignerData` |
| `extensionOptions?` | `Any`[] |

#### Returns

`Promise`\<`TxRaw`\>

#### Overrides

SigningStargateClient.sign

#### Defined in

crypto/stratos-proto-signing/StratosSigningStargateClient.ts:138

___

### signForEvm

▸ **signForEvm**(`payload`, `keyPair`): `Promise`\<`TxRaw`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | [`DynamicFeeTx`](../interfaces/chain.evm.evmTransactions.DynamicFeeTx.md) |
| `keyPair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) |

#### Returns

`Promise`\<`TxRaw`\>

#### Defined in

crypto/stratos-proto-signing/StratosSigningStargateClient.ts:298

___

### connectWithSigner

▸ **connectWithSigner**(`endpoint`, `signer`, `options?`): `Promise`\<[`StratosSigningStargateClient`](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | `string` \| `HttpEndpoint` |
| `signer` | `OfflineSigner` |
| `options` | `SigningStargateClientOptions` |

#### Returns

`Promise`\<[`StratosSigningStargateClient`](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md)\>

#### Overrides

SigningStargateClient.connectWithSigner

#### Defined in

crypto/stratos-proto-signing/StratosSigningStargateClient.ts:36

___

### createWithSigner

▸ **createWithSigner**(`tmClient`, `signer`, `options?`): `Promise`\<[`StratosSigningStargateClient`](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md)\>

Creates an instance from a manually created Tendermint client.
Use this to use `Tendermint37Client` instead of `Tendermint34Client`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tmClient` | `any` |
| `signer` | `OfflineSigner` |
| `options` | `SigningStargateClientOptions` |

#### Returns

`Promise`\<[`StratosSigningStargateClient`](crypto.protoSigning.StratosSigningStargateClient.StratosSigningStargateClient.md)\>

#### Overrides

SigningStargateClient.createWithSigner

#### Defined in

crypto/stratos-proto-signing/StratosSigningStargateClient.ts:62
