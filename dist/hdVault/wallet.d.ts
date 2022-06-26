import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
export interface KeyPairInfo {
    keyIndex: number;
    address: string;
    publicKey: string;
    privateKey: string;
}
export interface TransactionMessage {
    message: string;
    password: string;
    encryptedMasterKeySeed: string;
    signingKeyPath: string;
}
export declare const deriveKeyPair: (keyIndex: number, password: string, encryptedMasterKeySeed: string) => Promise<KeyPairInfo | false>;
export declare const deserializeEncryptedWallet: (serializedWallet: string, password: string) => Promise<DirectSecp256k1HdWallet>;
