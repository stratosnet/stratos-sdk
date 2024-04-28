import {
  Bip39,
  EnglishMnemonic,
  HdPath,
  Secp256k1,
  Secp256k1Keypair,
  Slip10,
  Slip10Curve,
  Slip10RawIndex,
} from '@cosmjs/crypto';
import { toBech32 } from '@cosmjs/encoding';
import { toBase64 } from '@cosmjs/encoding';
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1HdWalletOptions,
  DirectSignResponse,
  KdfConfiguration,
  makeSignBytes,
  executeKdf,
} from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import createKeccakHash from 'keccak';
import {
  stratosAddressPrefix,
  slip10RawIndexes as slip10RawIndexesDefault,
  bip39Password as bip39PasswordDefaut,
} from '../../config/hdVault';
import Sdk from '../../Sdk';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto_1 = require('@cosmjs/crypto');

/**
 * Derivation information required to derive a keypair and an address from a mnemonic.
 */
export interface Secp256k1Derivation {
  readonly hdPath: typeof crypto_1.HdPath;
  readonly prefix: string;
}

export type Algo = 'secp256k1' | 'ed25519' | 'sr25519';

export interface AccountData {
  readonly address: string;
  readonly algo: Algo;
  readonly pubkey: Uint8Array;
}

export function pubkeyToRawAddressWithKeccak(pubkey: Uint8Array): Uint8Array {
  const pubkeyBuffer = Buffer.from(pubkey.slice(-64));

  const keccak256HashOfPubkeyBuffer = createKeccakHash('keccak256').update(pubkeyBuffer).digest();
  const fullRawAddress = new Uint8Array(keccak256HashOfPubkeyBuffer);

  const addressChunkOfBytes = fullRawAddress.slice(-20);

  // const hexAddress = toHex(addressChunkOfBytes);
  // console.log('hex address', hexAddress);

  // const prefix = stratosAddressPrefix;
  // const address = toBech32(prefix, addressChunkOfBytes);

  // console.log('bench32 address', address);

  return addressChunkOfBytes;
}

interface AccountDataWithPrivkey extends AccountData {
  readonly privkey: Uint8Array;
}

/**
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
export function makeStratosHubPath(a: number): typeof crypto_1.HdPath {
  const { keyPathParameters } = Sdk.environment;

  const defaultPath = [
    Slip10RawIndex.hardened(slip10RawIndexesDefault[0]), // 44
    Slip10RawIndex.hardened(slip10RawIndexesDefault[1]), // 606
    Slip10RawIndex.hardened(slip10RawIndexesDefault[2]), // 0
    Slip10RawIndex.normal(slip10RawIndexesDefault[3]), // 0
    Slip10RawIndex.normal(a),
  ];

  if (!keyPathParameters) {
    return defaultPath;
  }

  const { slip10RawIndexes: slip10RawIndexesToUse } = keyPathParameters;

  try {
    // console.log('using slip10RawIndexesToUse', slip10RawIndexesToUse);

    return [
      Slip10RawIndex.hardened(slip10RawIndexesToUse[0]),
      Slip10RawIndex.hardened(slip10RawIndexesToUse[1]),
      Slip10RawIndex.hardened(slip10RawIndexesToUse[2]),
      Slip10RawIndex.normal(slip10RawIndexesToUse[3]),
      Slip10RawIndex.normal(a),
    ];
  } catch (error) {
    console.log('could not parse  keyPathParameters from sdk', keyPathParameters);
    return defaultPath;
  }
}

const basicPasswordHashingOptions: KdfConfiguration = {
  algorithm: 'argon2id',
  params: {
    outputLength: 32,
    opsLimit: 24,
    memLimitKib: 12 * 1024,
  },
};

interface DirectSecp256k1HdWalletConstructorOptions extends Partial<DirectSecp256k1HdWalletOptions> {
  readonly seed: Uint8Array;
}

export const defaultOptions: DirectSecp256k1HdWalletOptions = {
  bip39Password: bip39PasswordDefaut(Sdk.environment.keyPathParameters?.bip39Password),
  hdPaths: [makeStratosHubPath(0)],
  prefix: stratosAddressPrefix,
};

export interface Pubkey {
  readonly type: string;
  readonly value: any;
}

export interface StdSignature {
  readonly pub_key: Pubkey;
  readonly signature: string;
}

class StratosDirectSecp256k1HdWallet extends DirectSecp256k1HdWallet {
  /** Base secret */
  private readonly mySecret: EnglishMnemonic;
  /** BIP39 seed */
  private readonly mySeed: Uint8Array;
  /** Derivation instructions */
  private readonly myAccounts: Secp256k1Derivation[];

  public static async fromMnemonic(
    mnemonic: string,
    options: Partial<DirectSecp256k1HdWalletOptions> = {},
  ): Promise<StratosDirectSecp256k1HdWallet> {
    const mnemonicChecked = new EnglishMnemonic(mnemonic);
    const seed = await Bip39.mnemonicToSeed(mnemonicChecked, options.bip39Password);

    return new StratosDirectSecp256k1HdWallet(mnemonicChecked, {
      ...options,
      seed: seed,
    });
  }

  protected constructor(
    mnemonic: typeof crypto_1.EnglishMnemonic,
    options: DirectSecp256k1HdWalletConstructorOptions,
  ) {
    const prefix = options.prefix ?? defaultOptions.prefix;
    const hdPaths = options.hdPaths ?? defaultOptions.hdPaths;
    super(mnemonic, options);

    this.mySecret = mnemonic;
    this.mySeed = options.seed;

    const a = hdPaths.map(hdPath => ({
      hdPath: hdPath,
      prefix: prefix,
    }));

    this.myAccounts = a;
  }

  public get mnemonic(): string {
    return this.mySecret.toString();
  }

  public async getAccounts(): Promise<readonly AccountData[]> {
    // console.log('stratos DirectSecp256k1HdWallet  getAccounts was called');
    const accountsWithPrivkeys = await this.getMyAccountsWithPrivkeys();
    return accountsWithPrivkeys.map(({ algo, pubkey, address }) => ({
      algo: algo,
      pubkey: pubkey,
      address: address,
    }));
  }

  public async signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> {
    const accounts = await this.getMyAccountsWithPrivkeys();
    // console.log('stratos DirectSecp256k1HdWallet  sign direct was called', signDoc);

    const account = accounts.find(({ address }) => address === signerAddress);

    if (account === undefined) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }

    const { privkey, pubkey } = account;

    const signBytes = makeSignBytes(signDoc);

    const signBytesBuffer = Buffer.from(signBytes);
    const keccak256HashOfSigningBytes = createKeccakHash('keccak256').update(signBytesBuffer).digest();

    const signBytesWithKeccak = new Uint8Array(keccak256HashOfSigningBytes);

    const hashedMessage = signBytesWithKeccak;
    // const hashedMessage = sha256(signBytes);

    const signature = await Secp256k1.createSignature(hashedMessage, privkey);

    const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);
    const stdSignature = this.encodeSecp256k1Signature(pubkey, signatureBytes);

    return {
      signed: signDoc,
      signature: stdSignature,
    };
  }

  protected encodeSecp256k1Signature(pubkey: Uint8Array, signature: Uint8Array): StdSignature {
    if (signature.length !== 64) {
      throw new Error(
        'Signature must be 64 bytes long. Cosmos SDK uses a 2x32 byte fixed length encoding for the secp256k1 signature integers r and s.',
      );
    }

    const base64ofPubkey = toBase64(pubkey);

    const pubkeyEncodedStratos = {
      type: '/stratos.crypto.v1.ethsecp256k1.PubKey' as const,
      value: base64ofPubkey,
    };

    // console.log(
    //   'from DirectSecp256k1HdWallet - pubkeyEncodedStratos (must have stratos type now)',
    //   pubkeyEncodedStratos,
    // );

    return {
      pub_key: pubkeyEncodedStratos,
      signature: toBase64(signature),
    };
  }

  public async serialize(password: string): Promise<string> {
    const kdfConfiguration = basicPasswordHashingOptions;
    const encryptionKey = await executeKdf(password, kdfConfiguration);
    return this.serializeWithEncryptionKey(encryptionKey, kdfConfiguration);
  }

  protected async getMyKeyPair(hdPath: HdPath): Promise<Secp256k1Keypair> {
    const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, this.mySeed, hdPath);
    const { pubkey } = await Secp256k1.makeKeypair(privkey);
    const myKeypair = {
      privkey: privkey,
      pubkey: Secp256k1.compressPubkey(pubkey),
    };
    return myKeypair;
  }

  protected async getMyAccountsWithPrivkeys(): Promise<readonly AccountDataWithPrivkey[]> {
    return Promise.all(
      this.myAccounts.map(async ({ hdPath, prefix }) => {
        const { privkey, pubkey } = await this.getMyKeyPair(hdPath);

        // console.log('stratos DirectSecp256k1HdWallet fullPubkeyHex 1', pubkey);
        const { pubkey: fullPubkey } = await Secp256k1.makeKeypair(privkey);

        // const fullPubkeyHex = Buffer.from(fullPubkey).toString('hex');

        // const compressedPub = Secp256k1.compressPubkey(fullPubkey);
        // const compressedPubHex = Buffer.from(compressedPub).toString('hex');

        // console.log('from DirectSecp256k1HdWallet pub compressedPub ', compressedPub);
        // console.log('from DirectSecp256k1HdWallet pub compressedPub compressedPubHex ', compressedPubHex);

        // const addressOld = toBech32(prefix, rawSecp256k1PubkeyToRawAddress(pubkey));
        const address = toBech32(prefix, pubkeyToRawAddressWithKeccak(fullPubkey));

        // console.log('from DirectSecp256k1HdWallet old address ', addressOld);
        // console.log('from DirectSecp256k1HdWallet new address ', address);

        return {
          algo: 'secp256k1' as const,
          privkey: privkey,
          pubkey: pubkey,
          address: address,
        };
      }),
    );
  }
}

export default StratosDirectSecp256k1HdWallet;
