import sjcl from 'sjcl';
export declare const cosmjsSalt: Uint8Array;
export declare const encryptMasterKeySeed: (password: string, plaintext: Uint8Array) => sjcl.SjclCipherEncrypted;
export declare function encrypt(password: string, plaintext: Uint8Array): sjcl.SjclCipherEncrypted;
export declare function decrypt(password: string, encryptedMasterKeySeed: string): Uint8Array;
