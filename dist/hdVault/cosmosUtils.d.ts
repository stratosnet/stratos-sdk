import StratosDirectSecp256k1HdWallet from '../hdVault/StratosDirectSecp256k1HdWallet';
/**
 * Derivation information required to derive a keypair and an address from a mnemonic.
 */
export declare const serializeWithEncryptionKey: (password: string, wallet: StratosDirectSecp256k1HdWallet) => string;
export declare const deserializeWithEncryptionKey: (password: string, serialization: string) => Promise<StratosDirectSecp256k1HdWallet>;
