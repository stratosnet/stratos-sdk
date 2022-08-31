import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
export declare const serializeWithEncryptionKey: (password: string, wallet: DirectSecp256k1HdWallet) => Promise<string>;
export declare const deserializeWithEncryptionKey: (password: string, serialization: string) => Promise<DirectSecp256k1HdWallet>;
