import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
/**
 * This interface describes a JSON object holding the encrypted wallet and the meta data.
 * All fields in here must be JSON types.
 */
export declare const serializeWithEncryptionKey: (password: string, wallet: DirectSecp256k1HdWallet) => Promise<string>;
export declare const deserializeWithEncryptionKey: (password: string, serialization: string) => Promise<DirectSecp256k1HdWallet>;
