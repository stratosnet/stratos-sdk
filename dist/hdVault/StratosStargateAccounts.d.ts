import { // isEd25519Pubkey,
Pubkey } from '@cosmjs/amino';
import { Any } from 'cosmjs-types/google/protobuf/any';
export interface Account {
    readonly address: string;
    readonly pubkey: Pubkey | null;
    readonly accountNumber: number;
    readonly sequence: number;
}
export declare function encodeEthSecp256k1Pubkey(pubkey: Uint8Array): Pubkey;
export declare function anyToStratosSinglePubkey(pubkey: Any): Pubkey;
export declare function decodePubkey(pubkey: Any): Pubkey | null;
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
export declare function accountFromAnyStratos(input: Any): Account;
