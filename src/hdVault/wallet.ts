/**
 * derive the masterKey from masterKeySeed for Ed25519
 */
export const deriveMasterKey = (num: number): Uint8Array => {
  return Uint8Array.from([num]);
};

// export const derivePrivateKeySeed = (masterKey: string, keyPath: string): void => {};

// export const deriveKeyPair = (privateKeySeed: string): void => {};

// export const deriveAddress = (publicKey: string): void => {};

// export const verifyAddress = (address: string): void => {};

// export const sign = (payload: string): void => {};

// export const verifySignature = (payload: string): void => {};
