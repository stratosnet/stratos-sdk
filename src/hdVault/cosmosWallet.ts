import { fromBase64, toAscii, toBase64 } from '@cosmjs/encoding';

import sjcl from 'sjcl';

export const cosmjsSalt = toAscii('The CosmJS salt.');

// export interface KdfConfiguration {
//   /**
//    * An algorithm identifier, such as "argon2id" or "scrypt".
//    */
//   readonly algorithm: string;
//   /** A map of algorithm-specific parameters */
//   readonly params: Record<string, unknown>;
// }

// @todo merge with keyUtils
export const encryptMasterKeySeed = (password: string, plaintext: Uint8Array): sjcl.SjclCipherEncrypted => {
  const strMasterKey = toBase64(plaintext);
  const saltBits = sjcl.random.randomWords(4);
  const encryptParams = {
    v: 1,
    iter: 1000,
    ks: 128,
    mode: 'gcm',
    adata: '',
    cipher: 'aes',
    salt: saltBits,
    iv: saltBits,
  };
  return sjcl.encrypt(password, strMasterKey, encryptParams);
};

export function encrypt(password: string, plaintext: Uint8Array): sjcl.SjclCipherEncrypted {
  const encripted = encryptMasterKeySeed(password, plaintext);
  return encripted;
}

export function decrypt(password: string, encryptedMasterKeySeed: string): Uint8Array {
  const decrypteCypherText = sjcl.decrypt(password, encryptedMasterKeySeed);
  const decryptedMasterKeySeed = fromBase64(decrypteCypherText); // switch (config.algorithm) {
  return decryptedMasterKeySeed;
}
