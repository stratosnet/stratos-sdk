import { encodeAminoPubkey, pubkeyToAddress } from '@cosmjs/amino';
import { Secp256k1, Slip10, Slip10Curve, stringToPath } from '@cosmjs/crypto';
import { Bech32, toBase64, toHex } from '@cosmjs/encoding';

import { stratosAddressPrefix, stratosPubkeyPrefix } from '../config/hdVault';
import { generateMasterKeySeed, getMasterKeySeedPublicKey } from './keyUtils';
import { MnemonicPhrase } from './mnemonic';

export interface KeyPair {
  address: string;
  publicKey: Uint8Array;
  encodedPublicKey: string;
  privateKey: string;
}

export type KeyPairCurve = Slip10Curve.Ed25519 | Slip10Curve.Secp256k1;

interface PubKey {
  type: string;
  value: string;
}

export const deriveAddress = (pubkey: PubKey): string => {
  const address = pubkeyToAddress(pubkey, stratosAddressPrefix);
  return address;
};

export const deriveAddressFromPhrase = async (phrase: MnemonicPhrase): Promise<string> => {
  const masterKeySeed = await generateMasterKeySeed(phrase);
  const pubkey = await getMasterKeySeedPublicKey(masterKeySeed);
  return deriveAddress(pubkey);
};

export const deriveKeyPairFromPrivateKeySeed = async (privkey: Uint8Array): Promise<KeyPair> => {
  const { pubkey } = await Secp256k1.makeKeypair(privkey);

  const compressedPub = Secp256k1.compressPubkey(pubkey);

  const pubkeyMine = {
    type: 'tendermint/PubKeySecp256k1',
    value: toBase64(compressedPub),
  };

  const encodeAminoPub = encodeAminoPubkey(pubkeyMine);

  const encodedPublicKey = Bech32.encode(stratosPubkeyPrefix, encodeAminoPub);

  const address = pubkeyToAddress(pubkeyMine, stratosAddressPrefix);

  return {
    address,
    publicKey: encodeAminoPub,
    encodedPublicKey,
    privateKey: toHex(privkey),
  };
};

export const derivePrivateKeySeed = (
  masterKey: Uint8Array,
  keyPath: string,
  curve: KeyPairCurve = Slip10Curve.Secp256k1,
): Uint8Array => {
  const convertedPath = stringToPath(keyPath);

  const { privkey } = Slip10.derivePath(curve, masterKey, convertedPath);

  return privkey;
};
