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
export declare const sign: ({ message, password, encryptedMasterKeySeed, signingKeyPath, }: TransactionMessage) => Promise<string>;
export declare const verifySignature: (message: string, signature: string, publicKey: string) => Promise<boolean>;
