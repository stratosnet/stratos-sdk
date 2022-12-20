import { encodeSecp256k1Signature } from '@cosmjs/amino';
import {
  Bip39,
  EnglishMnemonic,
  HdPath,
  Secp256k1,
  Secp256k1Keypair,
  sha256,
  Slip10,
  Slip10Curve,
  Slip10RawIndex,
} from '@cosmjs/crypto';
import { toHex, toBech32 } from '@cosmjs/encoding';
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
import { stratosAddressPrefix } from '../config/hdVault';
import { mergeUint8Arrays } from './utils';

interface Secp256k1Derivation {
  readonly hdPath: HdPath;
  readonly prefix: string;
}

// export type Algo = 'secp256k1' | 'ed25519' | 'sr25519' | 'eth_secp256k1';
export type Algo = 'secp256k1' | 'ed25519' | 'sr25519';

export interface AccountData {
  /** A printable address (typically bech32 encoded) */
  readonly address: string;
  readonly algo: Algo;
  readonly pubkey: Uint8Array;
}
export function pubkeyToRawAddressWithKeccak(pubkey: Uint8Array): Uint8Array {
  const pubkeyBuffer = Buffer.from(pubkey.slice(-64));

  const keccak256HashOfPubkeyBuffer = createKeccakHash('keccak256').update(pubkeyBuffer).digest();
  const fullRawAddress = new Uint8Array(keccak256HashOfPubkeyBuffer);

  const addressChunkOfBytes = fullRawAddress.slice(-20);

  const hexAddress = toHex(addressChunkOfBytes);
  console.log('hex address', hexAddress);

  const prefix = stratosAddressPrefix;
  const address = toBech32(prefix, addressChunkOfBytes);

  console.log('bench32 address', address);

  return addressChunkOfBytes;
}

interface AccountDataWithPrivkey extends AccountData {
  readonly privkey: Uint8Array;
}

export function makeStratosHubPath(a: number): HdPath {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(606),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(a),
  ];
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

const defaultOptions: DirectSecp256k1HdWalletOptions = {
  bip39Password: '',
  hdPaths: [makeStratosHubPath(0)],
  prefix: 'cosmos',
};

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

  protected constructor(mnemonic: EnglishMnemonic, options: DirectSecp256k1HdWalletConstructorOptions) {
    const prefix = options.prefix ?? defaultOptions.prefix;
    const hdPaths = options.hdPaths ?? defaultOptions.hdPaths;
    super(mnemonic, options);

    this.mySecret = mnemonic;
    this.mySeed = options.seed;
    this.myAccounts = hdPaths.map(hdPath => ({
      hdPath: hdPath,
      prefix: prefix,
    }));
  }

  public get mnemonic(): string {
    return this.mySecret.toString();
  }

  public async getAccounts(): Promise<readonly AccountData[]> {
    const accountsWithPrivkeys = await this.getMyAccountsWithPrivkeys();
    return accountsWithPrivkeys.map(({ algo, pubkey, address }) => ({
      algo: algo,
      pubkey: pubkey,
      address: address,
    }));
  }

  public async signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> {
    const accounts = await this.getMyAccountsWithPrivkeys();
    console.log(' sign direct was called', signDoc);
    const account = accounts.find(({ address }) => address === signerAddress);
    if (account === undefined) {
      throw new Error(`Address ${signerAddress} not found in wallet`);
    }
    const { privkey, pubkey } = account;
    const signBytes = makeSignBytes(signDoc);
    const hashedMessage = sha256(signBytes);
    const signature = await Secp256k1.createSignature(hashedMessage, privkey);
    // const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);
    const r32 = Array.from(signature.r(32));
    const s32 = Array.from(signature.s(32));
    const signatureBytes = new Uint8Array([...r32, ...s32]);
    // const signatureBytes = mergeUint8Arrays(signature.r(32), signature.s(32));
    const stdSignature = encodeSecp256k1Signature(pubkey, signatureBytes);
    return {
      signed: signDoc,
      signature: stdSignature,
    };
  }

  public async serialize(password: string): Promise<string> {
    const kdfConfiguration = basicPasswordHashingOptions;
    const encryptionKey = await executeKdf(password, kdfConfiguration);
    return this.serializeWithEncryptionKey(encryptionKey, kdfConfiguration);
  }

  // public async serializeWithEncryptionKey(
  //   encryptionKey: Uint8Array,
  //   kdfConfiguration: KdfConfiguration,
  // ): Promise<string> {
  //   console.log('encryptionKey', encryptionKey);
  //   console.log('kdfConfiguration', kdfConfiguration);
  //   return '';
  // const dataToEncrypt: DirectSecp256k1HdWalletData = {
  //   mnemonic: this.mnemonic,
  //   accounts: this.accounts.map(({ hdPath, prefix }) => ({
  //     hdPath: pathToString(hdPath),
  //     prefix: prefix,
  //   })),
  // };
  // const dataToEncryptRaw = toUtf8(JSON.stringify(dataToEncrypt));
  //
  // const encryptionConfiguration: EncryptionConfiguration = {
  //   algorithm: supportedAlgorithms.xchacha20poly1305Ietf,
  // };
  // const encryptedData = await encrypt(dataToEncryptRaw, encryptionKey, encryptionConfiguration);
  //
  // const out: DirectSecp256k1HdWalletSerialization = {
  //   type: serializationTypeV1,
  //   kdf: kdfConfiguration,
  //   encryption: encryptionConfiguration,
  //   data: toBase64(encryptedData),
  // };
  // return JSON.stringify(out);
  // }

  protected async getMyKeyPair(hdPath: HdPath): Promise<Secp256k1Keypair> {
    const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, this.mySeed, hdPath);
    const { pubkey } = await Secp256k1.makeKeypair(privkey);
    const myKeypair = {
      privkey: privkey,
      pubkey: Secp256k1.compressPubkey(pubkey),
    };
    console.log('myKeypair', myKeypair);
    return myKeypair;
  }

  protected async getMyAccountsWithPrivkeys(): Promise<readonly AccountDataWithPrivkey[]> {
    return Promise.all(
      this.myAccounts.map(async ({ hdPath, prefix }) => {
        const { privkey, pubkey } = await this.getMyKeyPair(hdPath);

        const { pubkey: fullPubkey } = await Secp256k1.makeKeypair(privkey);

        // const address = toBech32(prefix, rawSecp256k1PubkeyToRawAddress(pubkey));
        const address = toBech32(prefix, pubkeyToRawAddressWithKeccak(fullPubkey));

        return {
          algo: 'secp256k1' as const,
          // algo: 'eth_secp256k1' as const,
          privkey: privkey,
          pubkey: pubkey,
          address: address,
        };
      }),
    );
  }
}

export default StratosDirectSecp256k1HdWallet;
// export default DirectSecp256k1HdWallet;
