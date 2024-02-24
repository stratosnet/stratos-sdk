import { HdPath, Secp256k1Keypair } from '@cosmjs/crypto';
import { DirectSecp256k1HdWallet, DirectSecp256k1HdWalletOptions, DirectSignResponse } from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
declare const crypto_1: any;
/**
 * Derivation information required to derive a keypair and an address from a mnemonic.
 */
export interface Secp256k1Derivation {
    readonly hdPath: typeof crypto_1.HdPath;
    readonly prefix: string;
}
export type Algo = 'secp256k1' | 'ed25519' | 'sr25519';
export interface AccountData {
    readonly address: string;
    readonly algo: Algo;
    readonly pubkey: Uint8Array;
}
export declare function pubkeyToRawAddressWithKeccak(pubkey: Uint8Array): Uint8Array;
interface AccountDataWithPrivkey extends AccountData {
    readonly privkey: Uint8Array;
}
/**
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
export declare function makeStratosHubPath(a: number): typeof crypto_1.HdPath;
interface DirectSecp256k1HdWalletConstructorOptions extends Partial<DirectSecp256k1HdWalletOptions> {
    readonly seed: Uint8Array;
}
export interface Pubkey {
    readonly type: string;
    readonly value: any;
}
export interface StdSignature {
    readonly pub_key: Pubkey;
    readonly signature: string;
}
declare class StratosDirectSecp256k1HdWallet extends DirectSecp256k1HdWallet {
    /** Base secret */
    private readonly mySecret;
    /** BIP39 seed */
    private readonly mySeed;
    /** Derivation instructions */
    private readonly myAccounts;
    static fromMnemonic(mnemonic: string, options?: Partial<DirectSecp256k1HdWalletOptions>): Promise<StratosDirectSecp256k1HdWallet>;
    protected constructor(mnemonic: typeof crypto_1.EnglishMnemonic, options: DirectSecp256k1HdWalletConstructorOptions);
    get mnemonic(): string;
    getAccounts(): Promise<readonly AccountData[]>;
    signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse>;
    protected encodeSecp256k1Signature(pubkey: Uint8Array, signature: Uint8Array): StdSignature;
    serialize(password: string): Promise<string>;
    protected getMyKeyPair(hdPath: HdPath): Promise<Secp256k1Keypair>;
    protected getMyAccountsWithPrivkeys(): Promise<readonly AccountDataWithPrivkey[]>;
}
export default StratosDirectSecp256k1HdWallet;
