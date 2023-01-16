// import { fromBase64, fromHex, toAscii, toBase64, toBech32, toHex } from '@cosmjs/encoding';
import {
  // encodeEd25519Pubkey,
  encodeSecp256k1Pubkey, // isEd25519Pubkey,
  // isMultisigThresholdPubkey,
  // isSecp256k1Pubkey,
  // MultisigThresholdPubkey,
  Pubkey, // SinglePubkey,
} from '@cosmjs/amino';
import { toBase64 } from '@cosmjs/encoding';
import { Uint64 } from '@cosmjs/math';
import { decodePubkey as decodePubkeyOriginal } from '@cosmjs/proto-signing';
import { accountFromAny as accountFromAnyOriginal } from '@cosmjs/stargate';
import { assert } from '@cosmjs/utils';
import * as stratosTypes from '@stratos-network/stratos-cosmosjs-types';
import { BaseAccount, ModuleAccount } from 'cosmjs-types/cosmos/auth/v1beta1/auth';
import { PubKey as CosmosCryptoEd25519Pubkey } from 'cosmjs-types/cosmos/crypto/ed25519/keys';
import { PubKey as CosmosCryptoSecp256k1Pubkey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
// import {
//   BaseVestingAccount,
//   ContinuousVestingAccount,
//   DelayedVestingAccount,
//   PeriodicVestingAccount,
// } from 'cosmjs-types/cosmos/vesting/v1beta1/vesting';
import { Any } from 'cosmjs-types/google/protobuf/any';
import Long from 'long';

const StratosPubKey = stratosTypes.stratos.crypto.v1.ethsecp256k1.PubKey;

export interface Account {
  readonly address: string;
  readonly pubkey: Pubkey | null;
  readonly accountNumber: number;
  readonly sequence: number;
}

function uint64FromProto(input: number | Long): Uint64 {
  return Uint64.fromString(input.toString());
}

// https://github.com/cosmos/cosmjs/blob/33271bc51cdc865cadb647a1b7ab55d873637f39/packages/amino/src/encoding.ts#L20
export function encodeEthSecp256k1Pubkey(pubkey: Uint8Array): Pubkey {
  if (pubkey.length !== 33 || (pubkey[0] !== 0x02 && pubkey[0] !== 0x03)) {
    throw new Error('Public key must be compressed secp256k1, i.e. 33 bytes starting with 0x02 or 0x03');
  }

  return {
    type: 'stratos/PubKeyEthSecp256k1',
    // type: pubkeyType.secp256k1,
    value: toBase64(pubkey),
  };
}

// https://github.com/cosmos/cosmjs/blob/main/packages/proto-signing/src/pubkey.ts
export function anyToStratosSinglePubkey(pubkey: Any): Pubkey {
  switch (pubkey.typeUrl) {
    case '/stratos.crypto.v1.ethsecp256k1.PubKey': {
      const { key } = StratosPubKey.decode(pubkey.value);
      return encodeEthSecp256k1Pubkey(key);
    }
    case '/cosmos.crypto.secp256k1.PubKey': {
      const { key } = CosmosCryptoSecp256k1Pubkey.decode(pubkey.value);
      return encodeSecp256k1Pubkey(key);
    }
    // we need to update amino since encodeEd25519Pubkey is not exported in version we use here
    // case '/cosmos.crypto.ed25519.PubKey': {
    //   const { key } = CosmosCryptoEd25519Pubkey.decode(pubkey.value);
    //   return encodeEd25519Pubkey(key);
    // }
    default:
      throw new Error(`Pubkey type_url ${pubkey.typeUrl} not recognized as single public key type`);
  }
}

// https://github.com/cosmos/cosmjs/blob/main/packages/proto-signing/src/pubkey.ts
export function decodePubkey(pubkey: Any): Pubkey | null {
  switch (pubkey.typeUrl) {
    // case "/cosmos.crypto.secp256k1.PubKey":
    // case "/cosmos.crypto.ed25519.PubKey": {
    //   return anyToSinglePubkey(pubkey);
    // }
    // case "/cosmos.crypto.multisig.LegacyAminoPubKey": {
    //   const { threshold, publicKeys } = LegacyAminoPubKey.decode(pubkey.value);
    //   const out: MultisigThresholdPubkey = {
    //     type: "tendermint/PubKeyMultisigThreshold",
    //     value: {
    //       threshold: threshold.toString(),
    //       pubkeys: publicKeys.map(anyToSinglePubkey),
    //     },
    //   };
    //   return out;
    // }

    case '/stratos.crypto.v1.ethsecp256k1.PubKey': {
      console.log('StratosStargateAccounts - decodePubkey !!', pubkey);
      return anyToStratosSinglePubkey(pubkey);
    }
    default:
      return decodePubkeyOriginal(pubkey);
  }
}

// https://github.com/cosmos/cosmjs/blob/33271bc51cdc865cadb647a1b7ab55d873637f39/packages/stargate/src/accounts.ts
function accountFromBaseAccount(input: BaseAccount): Account {
  const { address, pubKey, accountNumber, sequence } = input;
  const pubkey = pubKey ? decodePubkey(pubKey) : null;
  return {
    address: address,
    pubkey: pubkey,
    accountNumber: uint64FromProto(accountNumber).toNumber(),
    sequence: uint64FromProto(sequence).toNumber(),
  };
}

/**
 * Represents a generic function that takes an `Any` encoded account from the chain
 * and extracts some common `Account` information from it.
 */
export type AccountParser = (any: Any) => Account;

/**
 * Basic implementation of AccountParser. This is supposed to support the most relevant
 * common Cosmos SDK account types. If you need support for exotic account types,
 * you'll need to write your own account decoder.
 */
export function accountFromAnyStratos(input: Any): Account {
  const { typeUrl, value } = input;

  console.log('StratosStargateAccounts - accountFromAnyStratos was called ,input ', input);

  switch (typeUrl) {
    // stratos

    // case '/stratos.crypto.v1.ethsecp256k1.PubKey': {
    //   const stratosDecodedAccount = StratosPubKey.decode(value); // ?? do we need that?
    //   console.log('stratosDecodedAccount', stratosDecodedAccount);
    //   const baseAccount = ModuleAccount.decode(value).baseAccount;
    //
    //   assert(baseAccount);
    //   return accountFromBaseAccount(baseAccount);
    // }

    case '/cosmos.auth.v1beta1.BaseAccount': {
      const baseAccount = accountFromBaseAccount(BaseAccount.decode(value));
      console.log('StratosStargateAccounts - got baseAccount', baseAccount);

      assert(baseAccount);
      return baseAccount;
    }
    // auth

    // case '/cosmos.auth.v1beta1.BaseAccount':
    //   return accountFromBaseAccount(BaseAccount.decode(value));
    // case '/cosmos.auth.v1beta1.ModuleAccount': {
    //   const baseAccount = ModuleAccount.decode(value).baseAccount;
    //   assert(baseAccount);
    //   return accountFromBaseAccount(baseAccount);
    // }

    // vesting

    // case '/cosmos.vesting.v1beta1.BaseVestingAccount': {
    //   const baseAccount = BaseVestingAccount.decode(value)?.baseAccount;
    //   assert(baseAccount);
    //   return accountFromBaseAccount(baseAccount);
    // }
    // case '/cosmos.vesting.v1beta1.ContinuousVestingAccount': {
    //   const baseAccount = ContinuousVestingAccount.decode(value)?.baseVestingAccount?.baseAccount;
    //   assert(baseAccount);
    //   return accountFromBaseAccount(baseAccount);
    // }
    // case '/cosmos.vesting.v1beta1.DelayedVestingAccount': {
    //   const baseAccount = DelayedVestingAccount.decode(value)?.baseVestingAccount?.baseAccount;
    //   assert(baseAccount);
    //   return accountFromBaseAccount(baseAccount);
    // }
    // case '/cosmos.vesting.v1beta1.PeriodicVestingAccount': {
    //   const baseAccount = PeriodicVestingAccount.decode(value)?.baseVestingAccount?.baseAccount;
    //   assert(baseAccount);
    //   return accountFromBaseAccount(baseAccount);
    // }

    default: {
      const account = accountFromAnyOriginal(input);

      if (!account) {
        console.log(`Stratos Account was not parsed`, account);
        throw new Error(`Unsupported type: '${typeUrl}'`);
      }
      return account;
    }
  }
}
