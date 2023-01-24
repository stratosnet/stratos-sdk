import { HdPath, pathToString, stringToPath } from '@cosmjs/crypto';
import { fromUtf8, toUtf8 } from '@cosmjs/encoding';
// import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { assert, isNonNullObject } from '@cosmjs/utils';
import StratosDirectSecp256k1HdWallet from '../hdVault/StratosDirectSecp256k1HdWallet';
import { decrypt, encrypt } from './cosmosWallet';

/**
 * Derivation information required to derive a keypair and an address from a mnemonic.
 * All fields in here must be JSON types.
 */
interface DerivationInfoJson {
  readonly hdPath: string;
  readonly prefix: string;
}

/**
 * The data of a wallet serialization that is encrypted.
 * All fields in here must be JSON types.
 */
interface DirectSecp256k1HdWalletData {
  readonly mnemonic: string;
  readonly accounts: readonly DerivationInfoJson[];
}

/**
 * Derivation information required to derive a keypair and an address from a mnemonic.
 */
interface Secp256k1Derivation {
  readonly hdPath: HdPath;
  readonly prefix: string;
}
// const serializationTypeV1 = 'directsecp256k1hdwallet-v1';

export const serializeWithEncryptionKey = (
  password: string,
  wallet: StratosDirectSecp256k1HdWallet,
): string => {
  // const walletAccounts = wallet['accounts'] as Secp256k1Derivation[];
  const walletAccounts = wallet['myAccounts'] as Secp256k1Derivation[];

  const dataToEncrypt: DirectSecp256k1HdWalletData = {
    mnemonic: wallet.mnemonic,
    accounts: walletAccounts.map(({ hdPath, prefix }) => ({
      hdPath: pathToString(hdPath),
      prefix: prefix,
    })),
  };

  const dataToEncryptRaw = toUtf8(JSON.stringify(dataToEncrypt));

  // const encryptedData = await encrypt(password, dataToEncryptRaw);
  const encryptedData = encrypt(password, dataToEncryptRaw);

  const out = {
    data: encryptedData.toString(),
  };
  return JSON.stringify(out);
};

function isDerivationJson(thing: unknown): thing is DerivationInfoJson {
  if (!isNonNullObject(thing)) return false;
  if (typeof (thing as DerivationInfoJson).hdPath !== 'string') return false;
  if (typeof (thing as DerivationInfoJson).prefix !== 'string') return false;
  return true;
}

export const deserializeWithEncryptionKey = async (
  password: string,
  serialization: string,
): Promise<StratosDirectSecp256k1HdWallet> => {
  const root = JSON.parse(serialization);
  if (!isNonNullObject(root)) throw new Error('Root document is not an object.');
  const untypedRoot: any = root;
  const decryptedBytes = decrypt(password, untypedRoot.data);
  const decryptedDocument = JSON.parse(fromUtf8(decryptedBytes));
  const { mnemonic, accounts } = decryptedDocument;
  assert(typeof mnemonic === 'string');
  if (!Array.isArray(accounts)) throw new Error("Property 'accounts' is not an array");
  if (!accounts.every(account => isDerivationJson(account))) {
    throw new Error('Account is not in the correct format.');
  }
  const firstPrefix = accounts[0].prefix;
  if (!accounts.every(({ prefix }) => prefix === firstPrefix)) {
    throw new Error('Accounts do not all have the same prefix');
  }
  const hdPaths = accounts.map(({ hdPath }) => stringToPath(hdPath));

  return StratosDirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    hdPaths: hdPaths,
    prefix: firstPrefix,
  });
};
