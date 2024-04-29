import * as CosmosCrypto from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';
import {
  getPublicKeyFromPrivKey,
  getMasterKeySeedPublicKeyWithKeccak,
} from '../../chain/cosmos/cosmosWallet';
import { type KeyPair, type KeyPairCurve } from './hdVaultTypes';
import {
  generateMasterKeySeed,
  getEncodedPublicKey,
  getAminoPublicKey,
  getAddressFromPubKeyWithKeccak,
} from './keyUtils';
import { MnemonicPhrase } from './mnemonic';

export const deriveAddressFromPhrase = async (phrase: MnemonicPhrase): Promise<string> => {
  const masterKeySeed = await generateMasterKeySeed(phrase);

  const pubkey = await getMasterKeySeedPublicKeyWithKeccak(masterKeySeed);
  const address = getAddressFromPubKeyWithKeccak(pubkey);

  return address;
};

export const deriveKeyPairFromPrivateKeySeed = async (privkey: Uint8Array): Promise<KeyPair> => {
  const pubkeyMine = await getPublicKeyFromPrivKey(privkey);

  const encodeAminoPub = await getAminoPublicKey(pubkeyMine);

  const { pubkey } = await CosmosCrypto.Secp256k1.makeKeypair(privkey);
  const address = getAddressFromPubKeyWithKeccak(pubkey);

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
