import {
  Hmac, // ripemd160,
  Secp256k1, // Secp256k1Signature,
  Sha512,
  Slip10Curve, // Slip10RawIndex,
} from '@cosmjs/crypto';
import { toAscii, toBase64 } from '@cosmjs/encoding';
import { DirectSecp256k1HdWalletOptions } from '@cosmjs/proto-signing';
import StratosDirectSecp256k1HdWallet, { // Secp256k1Derivation,
  defaultOptions as hdWalletDefaultOptions,
  makeStratosHubPath,
} from '../../crypto/stratos-proto-signing/StratosDirectSecp256k1HdWallet';
import { Slip10Result, PubKey } from './cosmosTypes';
import { isGteN, isZero, deserializeWithEncryptionKey, serializeWithEncryptionKey } from './cosmosUtils';

export const deserializeEncryptedWallet = async (serializedWallet: string, password: string) => {
  let deserializedWallet;

  try {
    deserializedWallet = await deserializeWithEncryptionKey(password, serializedWallet);
  } catch (error) {
    const msg = `"${(error as Error).message}", w "${serializedWallet}"`;
    const errorMsg = `could not deserialize / decode wallet ${msg}`;
    console.log(errorMsg);
    throw new Error(errorMsg);
  }

  if (!deserializedWallet) {
    return Promise.reject(false);
  }

  return deserializedWallet;
};

export const serializeWallet = async (
  wallet: StratosDirectSecp256k1HdWallet,
  password: string,
): Promise<string> => {
  // log('Beginning serializing..');

  let encryptedWalletInfoFour;

  try {
    // encryptedWalletInfoFour = await serializeWithEncryptionKey(password, wallet);
    encryptedWalletInfoFour = serializeWithEncryptionKey(password, wallet);
    // log('Serialization with prepared cryptoJs data Uint8 is done. ');
  } catch (error) {
    throw new Error(
      `Could not serialize a wallet with the encryption key. Error4 - ${(error as Error).message}`,
    );
  }

  return encryptedWalletInfoFour;
};

export async function createWalletAtPath(
  hdPathIndex: number,
  mnemonic: string,
): Promise<StratosDirectSecp256k1HdWallet> {
  const hdPaths = [makeStratosHubPath(hdPathIndex)];

  const options: DirectSecp256k1HdWalletOptions = { ...hdWalletDefaultOptions, hdPaths };

  const wallet = await StratosDirectSecp256k1HdWallet.fromMnemonic(mnemonic, options);

  return wallet;
}

const getMasterKeyInfo = (curve: Slip10Curve, seed: Uint8Array): Slip10Result => {
  const i = new Hmac(Sha512, toAscii(curve)).update(seed).digest();
  const il = i.slice(0, 32);
  const ir = i.slice(32, 64);

  if (curve !== Slip10Curve.Ed25519 && (isZero(il) || isGteN(curve, il))) {
    return getMasterKeyInfo(curve, i);
  }

  return {
    chainCode: ir,
    privkey: il,
  };
};

export const getMasterKeySeedPriveKey = (masterKeySeed: Uint8Array): Uint8Array => {
  const masterKeyInfo = getMasterKeyInfo(Slip10Curve.Secp256k1, masterKeySeed);

  const { privkey } = masterKeyInfo;

  return privkey;
};

export const getPublicKeyFromPrivKey = async (privkey: Uint8Array): Promise<PubKey> => {
  const { pubkey } = await Secp256k1.makeKeypair(privkey);

  const compressedPub = Secp256k1.compressPubkey(pubkey);

  const pubkeyMine = {
    type: 'stratos/PubKeyEthSecp256k1',
    value: toBase64(compressedPub),
  };

  return pubkeyMine;
};

export const getMasterKeySeedPublicKey = async (masterKeySeed: Uint8Array): Promise<PubKey> => {
  const privkey = getMasterKeySeedPriveKey(masterKeySeed);

  const pubkey = await getPublicKeyFromPrivKey(privkey);

  return pubkey;
};

export const getMasterKeySeedPublicKeyWithKeccak = async (masterKeySeed: Uint8Array): Promise<Uint8Array> => {
  const privkey = getMasterKeySeedPriveKey(masterKeySeed);

  const { pubkey } = await Secp256k1.makeKeypair(privkey);

  return pubkey;
};
