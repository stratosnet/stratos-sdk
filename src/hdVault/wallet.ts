/**
 * derive the masterKey from masterKeySeed for Ed25519
 */
export const deriveMasterKey = (masterKeySeed: string): Uint8Array => {
  return Uint8Array.from([1]);
};

export const derivePrivateKeySeed = (masterKey, keyPath): void => {};

export const deriveKeyPair = (privateKeySeed): void => {};

export const deriveAddress = (publicKey): void => {};

export const verifyAddress = (address): void => {};

export const sign = (payload): void => {};

export const verifySignature = (payload): void => {};
