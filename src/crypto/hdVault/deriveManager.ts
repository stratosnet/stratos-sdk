import * as CosmosCrypto from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';
import {
  // getMasterKeySeedPublicKey,
  getPublicKeyFromPrivKey,
  getMasterKeySeedPublicKeyWithKeccak,
} from '../../chain/cosmos/cosmosWallet';
import { type KeyPair, type KeyPairCurve } from './hdVaultTypes';
import {
  generateMasterKeySeed,
  getEncodedPublicKey, // getAddressFromPubKey,
  getAminoPublicKey,
  getAddressFromPubKeyWithKeccak,
} from './keyUtils';
import { MnemonicPhrase } from './mnemonic';

export const deriveAddressFromPhrase = async (phrase: MnemonicPhrase): Promise<string> => {
  const masterKeySeed = await generateMasterKeySeed(phrase);

  // new, eth address
  const pubkey = await getMasterKeySeedPublicKeyWithKeccak(masterKeySeed);
  const address = getAddressFromPubKeyWithKeccak(pubkey);

  // old address
  // const pubkeyOld = await getMasterKeySeedPublicKey(masterKeySeed);
  // const addressOld = getAddressFromPubKey(pubkeyOld);
  return address;
};

export const deriveKeyPairFromPrivateKeySeed = async (privkey: Uint8Array): Promise<KeyPair> => {
  const pubkeyMine = await getPublicKeyFromPrivKey(privkey);

  const encodeAminoPub = await getAminoPublicKey(pubkeyMine); // 1 amino dep - amino encodeAminoPubkey

  // new, eth address
  const { pubkey } = await CosmosCrypto.Secp256k1.makeKeypair(privkey);
  const address = getAddressFromPubKeyWithKeccak(pubkey);

  // old address
  // const addressOld = getAddressFromPubKey(pubkeyMine);

  // console.log('old add 2', addressOld);
  const encodedPublicKey = await getEncodedPublicKey(encodeAminoPub);

  return {
    address,
    publicKey: encodeAminoPub,
    encodedPublicKey,
    privateKey: toHex(privkey),
  };
};

const getSlip10 = () => {
  return CosmosCrypto.Slip10;
};

export const derivePrivateKeySeed = (
  masterKey: Uint8Array,
  keyPath: string,
  curve: KeyPairCurve = CosmosCrypto.Slip10Curve.Secp256k1,
): Uint8Array => {
  const convertedPath = CosmosCrypto.stringToPath(keyPath);

  const { privkey } = getSlip10().derivePath(curve, masterKey, convertedPath);

  return privkey;
};
