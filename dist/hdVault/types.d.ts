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
