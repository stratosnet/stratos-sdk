[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](crypto.md) / [protoSigning](crypto.protoSigning.md) / StratosStargateAccounts

# Namespace: StratosStargateAccounts

[crypto](crypto.md).[protoSigning](crypto.protoSigning.md).StratosStargateAccounts

## Table of contents

### Interfaces

- [Account](../interfaces/crypto.protoSigning.StratosStargateAccounts.Account.md)

### Type Aliases

- [AccountParser](crypto.protoSigning.StratosStargateAccounts.md#accountparser)

### Functions

- [accountFromAnyStratos](crypto.protoSigning.StratosStargateAccounts.md#accountfromanystratos)
- [anyToStratosSinglePubkey](crypto.protoSigning.StratosStargateAccounts.md#anytostratossinglepubkey)
- [decodePubkey](crypto.protoSigning.StratosStargateAccounts.md#decodepubkey)
- [encodeEthSecp256k1Pubkey](crypto.protoSigning.StratosStargateAccounts.md#encodeethsecp256k1pubkey)

## Type Aliases

### AccountParser

Ƭ **AccountParser**: (`any`: `Any`) => [`Account`](../interfaces/crypto.protoSigning.StratosStargateAccounts.Account.md)

Represents a generic function that takes an `Any` encoded account from the chain
and extracts some common `Account` information from it.

#### Type declaration

▸ (`any`): [`Account`](../interfaces/crypto.protoSigning.StratosStargateAccounts.Account.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `any` | `Any` |

##### Returns

[`Account`](../interfaces/crypto.protoSigning.StratosStargateAccounts.Account.md)

#### Defined in

crypto/stratos-proto-signing/StratosStargateAccounts.ts:90

## Functions

### accountFromAnyStratos

▸ **accountFromAnyStratos**(`input`): [`Account`](../interfaces/crypto.protoSigning.StratosStargateAccounts.Account.md)

Basic implementation of AccountParser. This is supposed to support the most relevant
common Cosmos SDK account types. If you need support for exotic account types,
you'll need to write your own account decoder.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Any` |

#### Returns

[`Account`](../interfaces/crypto.protoSigning.StratosStargateAccounts.Account.md)

#### Defined in

crypto/stratos-proto-signing/StratosStargateAccounts.ts:97

___

### anyToStratosSinglePubkey

▸ **anyToStratosSinglePubkey**(`pubkey`): `Pubkey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pubkey` | `Any` |

#### Returns

`Pubkey`

#### Defined in

crypto/stratos-proto-signing/StratosStargateAccounts.ts:43

___

### decodePubkey

▸ **decodePubkey**(`pubkey`): `Pubkey` \| ``null``

#### Parameters

| Name | Type |
| :------ | :------ |
| `pubkey` | `Any` |

#### Returns

`Pubkey` \| ``null``

#### Defined in

crypto/stratos-proto-signing/StratosStargateAccounts.ts:64

___

### encodeEthSecp256k1Pubkey

▸ **encodeEthSecp256k1Pubkey**(`pubkey`): `Pubkey`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pubkey` | `Uint8Array` |

#### Returns

`Pubkey`

#### Defined in

crypto/stratos-proto-signing/StratosStargateAccounts.ts:30
