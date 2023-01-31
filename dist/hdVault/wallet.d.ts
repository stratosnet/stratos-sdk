export { stratosDenom, stratosOzDenom, stratosTopDenom, stratosUozDenom } from '../config/hdVault';
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
export declare const deserializeEncryptedWallet: (serializedWallet: string, password: string) => Promise<import("./StratosDirectSecp256k1HdWallet").default>;
