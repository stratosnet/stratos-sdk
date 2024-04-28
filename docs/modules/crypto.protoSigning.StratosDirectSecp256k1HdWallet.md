[Stratos SDK](../README.md) / [Exports](../modules.md) / [crypto](crypto.md) / [protoSigning](crypto.protoSigning.md) / StratosDirectSecp256k1HdWallet

# Namespace: StratosDirectSecp256k1HdWallet

[crypto](crypto.md).[protoSigning](crypto.protoSigning.md).StratosDirectSecp256k1HdWallet

## Table of contents

### Classes

- [StratosDirectSecp256k1HdWallet](../classes/crypto.protoSigning.StratosDirectSecp256k1HdWallet.StratosDirectSecp256k1HdWallet.md)

### Interfaces

- [AccountData](../interfaces/crypto.protoSigning.StratosDirectSecp256k1HdWallet.AccountData.md)
- [Pubkey](../interfaces/crypto.protoSigning.StratosDirectSecp256k1HdWallet.Pubkey.md)
- [Secp256k1Derivation](../interfaces/crypto.protoSigning.StratosDirectSecp256k1HdWallet.Secp256k1Derivation.md)
- [StdSignature](../interfaces/crypto.protoSigning.StratosDirectSecp256k1HdWallet.StdSignature.md)

### Type Aliases

- [Algo](crypto.protoSigning.StratosDirectSecp256k1HdWallet.md#algo)

### Variables

- [defaultOptions](crypto.protoSigning.StratosDirectSecp256k1HdWallet.md#defaultoptions)

### Functions

- [makeStratosHubPath](crypto.protoSigning.StratosDirectSecp256k1HdWallet.md#makestratoshubpath)
- [pubkeyToRawAddressWithKeccak](crypto.protoSigning.StratosDirectSecp256k1HdWallet.md#pubkeytorawaddresswithkeccak)

## Type Aliases

### Algo

Ƭ **Algo**: ``"secp256k1"`` \| ``"ed25519"`` \| ``"sr25519"``

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:41

## Variables

### defaultOptions

• `Const` **defaultOptions**: `DirectSecp256k1HdWalletOptions`

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:123

## Functions

### makeStratosHubPath

▸ **makeStratosHubPath**(`a`): typeof `crypto_1.HdPath`

const keyPath =                            "m/44'/606'/0'/0/1";
The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
with 0-based account index `a`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number` |

#### Returns

typeof `crypto_1.HdPath`

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:77

___

### pubkeyToRawAddressWithKeccak

▸ **pubkeyToRawAddressWithKeccak**(`pubkey`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pubkey` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet.ts:49
