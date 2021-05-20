import { encodeAminoPubkey, pubkeyToAddress } from '@cosmjs/amino';
import { Secp256k1, Slip10, Slip10Curve, stringToPath } from '@cosmjs/crypto';
import { Bech32, toBase64 } from '@cosmjs/encoding';
import * as bech32 from 'bech32';
import sjcl from 'sjcl';
import nacl from 'tweetnacl';

import { stratosAddressPrefix } from '../config/hdVault';
import { generateMasterKeySeed, getMasterKeySeedPublicKey } from './keyUtils';
import { MnemonicPhrase } from './mnemonic';
import {
  // bufferToHexStr,
  hexStrToUint8Array,
  uint8ArrayToBuffer,
  uint8arrayToHexStr,
} from './utils';

export interface KeyPair {
  address: string; // string uses pubkey
  publicKey: Uint8Array; // aminopub
  encodedPublicKey: string; // string uses aminopub
  privateKey: string;
  // pubkey: Uint8Array;
  // privateKey: string;
  // privateKeySeed?: any;
  // secretKey?: any;
  // privateKeySeedAsHex?: any;
  // secretKeyAsHex?: any;
}

export type KeyPairCurve = Slip10Curve.Ed25519 | Slip10Curve.Secp256k1;

interface PubKey {
  type: string;
  value: string;
}

export const deriveAddress = (pubkey: PubKey): string => {
  // const pubkeyMine = {
  //   type: 'tendermint/PubKeySecp256k1',
  //   value: toBase64(compressedPub),
  // };

  // const encodeAminoPub = encodeAminoPubkey(pubkeyMine);
  // console.log('encodeAminoPub', encodeAminoPub);
  // const encodedTwo = Bech32.encode('stpub', encodeAminoPub);
  // console.log('encodedTwo ', encodedTwo);

  // const encodedThree = Bech32.encode('st', encodeAminoPub);
  // console.log('encodedThree ', encodedThree);

  const address = pubkeyToAddress(pubkey, stratosAddressPrefix);

  // const base64PublicKey = sjcl.codec.base64.toBits(publicKey);
  // const hash = new sjcl.hash.sha256();
  // hash.update(base64PublicKey);
  // const hashResult = hash.finalize();
  // const hashedData = sjcl.codec.hex.fromBits(hashResult);
  // hash.reset();
  // const data = hexStrToUint8Array(hashedData.substring(0, 40));
  // const address = bech32.encode(stratosAddressPrefix, bech32.toWords(data));

  return address;
};

export const deriveAddressFromPhrase = async (phrase: MnemonicPhrase): Promise<string> => {
  const masterKeySeed = await generateMasterKeySeed(phrase);
  const pubkey = await getMasterKeySeedPublicKey(masterKeySeed);
  return deriveAddress(pubkey);
};

export const deriveKeyPairFromPrivateKeySeed = async (privkey: Uint8Array): Promise<KeyPair> => {
  // try {
  //   const result = nacl.sign.keyPair.fromSeed(privateKeySeed);
  //   const { publicKey, secretKey } = result;

  //   return {
  //     publicKey: uint8arrayToHexStr(publicKey),
  //     privateKey: uint8arrayToHexStr(secretKey),
  //   };
  // } catch (e) {
  //   return Promise.reject(false);
  // }

  const { pubkey } = await Secp256k1.makeKeypair(privkey);

  const compressedPub = Secp256k1.compressPubkey(pubkey);

  const pubkeyMine = {
    type: 'tendermint/PubKeySecp256k1',
    value: toBase64(compressedPub),
  };

  const encodeAminoPub = encodeAminoPubkey(pubkeyMine);
  console.log('encodeAminoPub', encodeAminoPub);

  const encodedPublicKey = Bech32.encode('stpub', encodeAminoPub);

  const address = pubkeyToAddress(pubkeyMine, 'st');

  return {
    address,
    publicKey: encodeAminoPub,
    encodedPublicKey,
    privateKey: uint8arrayToHexStr(privkey),
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

  // const privateKeySeed = uint8ArrayToBuffer(privkey);

  // return privateKeySeed;
};
