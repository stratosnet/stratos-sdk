import { EnglishMnemonic, HdPath, Secp256k1Keypair } from '@cosmjs/crypto';
import { DirectSecp256k1HdWallet, DirectSecp256k1HdWalletOptions, DirectSignResponse } from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
export type Algo = 'secp256k1' | 'ed25519' | 'sr25519';
export interface AccountData {
    /** A printable address (typically bech32 encoded) */
    readonly address: string;
    readonly algo: Algo;
    readonly pubkey: Uint8Array;
}
export declare function pubkeyToRawAddressWithKeccak(pubkey: Uint8Array): Uint8Array;
interface AccountDataWithPrivkey extends AccountData {
    readonly privkey: Uint8Array;
}
export declare function makeStratosHubPath(a: number): HdPath;
interface DirectSecp256k1HdWalletConstructorOptions extends Partial<DirectSecp256k1HdWalletOptions> {
    readonly seed: Uint8Array;
}
declare class StratosDirectSecp256k1HdWallet extends DirectSecp256k1HdWallet {
    /** Base secret */
    private readonly mySecret;
    /** BIP39 seed */
    private readonly mySeed;
    /** Derivation instructions */
    private readonly myAccounts;
    static fromMnemonic(mnemonic: string, options?: Partial<DirectSecp256k1HdWalletOptions>): Promise<StratosDirectSecp256k1HdWallet>;
    protected constructor(mnemonic: EnglishMnemonic, options: DirectSecp256k1HdWalletConstructorOptions);
    get mnemonic(): string;
    getAccounts(): Promise<readonly AccountData[]>;
    signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse>;
    serialize(password: string): Promise<string>;
    protected getMyKeyPair(hdPath: HdPath): Promise<Secp256k1Keypair>;
    protected getMyAccountsWithPrivkeys(): Promise<readonly AccountDataWithPrivkey[]>;
}
export default StratosDirectSecp256k1HdWallet;
