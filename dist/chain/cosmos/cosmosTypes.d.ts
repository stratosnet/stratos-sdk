/**
 * Derivation information required to derive a keypair and an address from a mnemonic.
 * All fields in here must be JSON types.
 */
export interface DerivationInfoJson {
    readonly hdPath: string;
    readonly prefix: string;
}
/**
 * The data of a wallet serialization that is encrypted.
 * All fields in here must be JSON types.
 */
export interface DirectSecp256k1HdWalletData {
    readonly mnemonic: string;
    readonly accounts: readonly DerivationInfoJson[];
}
export interface Slip10Result {
    readonly chainCode: Uint8Array;
    readonly privkey: Uint8Array;
}
export interface PubKey {
    type: string;
    value: string;
}
