// import cosmosjs from '@cosmostation/cosmosjs';
import {
  Secp256k1HdWallet,
  makeCosmoshubPath,
  rawSecp256k1PubkeyToRawAddress,
  encodeAminoPubkey,
  encodeBech32Pubkey,
  pubkeyToAddress,
  AccountData,
} from '@cosmjs/amino';
import { fromBase64, fromHex, Bech32, toBase64, toHex } from '@cosmjs/encoding';
import {
  stringToPath,
  HdPath,
  Slip10RawIndex,
  Bip39,
  Secp256k1Keypair,
  EnglishMnemonic,
  Slip10,
  Secp256k1,
  Slip10Curve,
} from '@cosmjs/crypto';

import * as keyUtils from './hdVault/keyUtils';
import { mnemonic } from './hdVault';
import { createMasterKeySeed } from './hdVault/keyManager';
import { deriveKeyPair, sign, verifySignature } from './hdVault/wallet';
import {
  deriveAddress,
  deriveKeyPairFromPrivateKeySeed,
  deriveAddressFromPhrase,
  derivePrivateKeySeed,
} from './hdVault/deriveManager';
import { Random } from './random';
import { uint8ArrayToBase64str, uint8arrayToHexStr } from './hdVault/utils';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// const data = Random.getBytes(12);

// console.log('our data is:', data);

// const phraseN = mnemonic.generateMnemonicPhrase(24);

// console.log('phraseN', phraseN);

// const stringMnemonic = mnemonic.convertArrayToString(phraseN);
// const stringMnemonic =
//   'vacant cool enlist kiss van despair ethics silly route master funny door gossip athlete sword language argue alien any item desk mystery tray parade';

// console.log('stringMnemonic', stringMnemonic);

// const phraseN = mnemonic.convertStringToArray(stringMnemonic);

// const phrase = [
//   { index: 1, word: 'rate' },
//   { index: 2, word: 'seminar' },
//   { index: 3, word: 'essence' },
//   { index: 4, word: 'abandon' },
//   { index: 5, word: 'sure' },
//   { index: 6, word: 'grab' },
//   { index: 7, word: 'submit' },
//   { index: 8, word: 'scare' },
//   { index: 9, word: 'rather' },
//   { index: 10, word: 'front' },
//   { index: 11, word: 'dune' },
//   { index: 12, word: 'planet' },
//   { index: 13, word: 'bag' },
//   { index: 14, word: 'cheap' },
//   { index: 15, word: 'first' },
//   { index: 16, word: 'rude' },
//   { index: 17, word: 'enjoy' },
//   { index: 18, word: 'harvest' },
//   { index: 19, word: 'motor' },
//   { index: 20, word: 'demise' },
//   { index: 21, word: 'tennis' },
//   { index: 22, word: 'erase' },
//   { index: 23, word: 'poet' },
//   { index: 24, word: 'pole' },
// ];

const password = '123456';

const lcdUrl = 'http://localhost:1317';
// const lcdUrl = 'http://localhost:26657';
const chainId = 'test-chain';
// const path = "m/44'/606'/0'/0/1";
// const cosmos = cosmosjs.network(lcdUrl, chainId);

// const mayTwo = async () => {
// const masterKeySeed = createMasterKeySeed(phraseN, password);
// const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
// console.log('masterKeySeed', masterKeySeed);
// console.log('encryptedMasterKeySeedString', encryptedMasterKeySeedString);
// const keyPairZero = await deriveKeyPair(1, password, encryptedMasterKeySeedString);
// console.log('keyPair 0!', keyPairZero);
// };

/**
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
export function makeStratosHubPath(a: number): HdPath {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(606),
    Slip10RawIndex.hardened(0),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(a),
  ];
}

interface DerivationInfo {
  readonly hdPath: HdPath;
  /** The bech32 address prefix (human readable part). */
  readonly prefix: string;
}

interface AccountDataWithPrivkey extends AccountData {
  readonly privkey: Uint8Array;
}

interface MySecp256k1Keypair extends Secp256k1Keypair {
  privkeyInHex: string;
  pubkeyInHex: string;
}

const getKeyPair = async (hdPath: HdPath, seed: Uint8Array): Promise<MySecp256k1Keypair> => {
  const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, seed, hdPath);

  const { pubkey } = await Secp256k1.makeKeypair(privkey);

  const compressedPub = Secp256k1.compressPubkey(pubkey);

  // const manuallyAlteredPub = Uint8Array.from([235, 90, 233, 135, 33]);

  // const mergedPub = new Uint8Array(manuallyAlteredPub.length + compressedPub.length);

  // mergedPub.set(manuallyAlteredPub);
  // mergedPub.set(compressedPub, manuallyAlteredPub.length);

  // console.log('mergedPub with amino', mergedPub);
  // const encodedWithManuallyAddedAmino = Bech32.encode('stpub', mergedPub);
  // console.log('encodedWithManuallyAddedAmino', encodedWithManuallyAddedAmino);

  // console.log('compressedPub (without amino)', compressedPub);
  // const encoded = Bech32.encode('stpub', compressedPub);
  // console.log('encodedWithManuallyAddedAmino', encoded);

  const pubkeyMine = {
    type: 'tendermint/PubKeySecp256k1',
    value: toBase64(compressedPub),
  };

  const encodeAminoPub = encodeAminoPubkey(pubkeyMine);
  console.log('encodeAminoPub', encodeAminoPub);
  const encodedTwo = Bech32.encode('stpub', encodeAminoPub);
  console.log('encodedTwo ', encodedTwo);

  // const encodedThree = Bech32.encode('st', encodeAminoPub);
  // console.log('encodedThree ', encodedThree);

  const address = pubkeyToAddress(pubkeyMine, 'st');

  console.log('address', address);
  return {
    privkey: privkey,
    privkeyInHex: uint8arrayToHexStr(privkey),
    pubkey: compressedPub,
    pubkeyInHex: encodedTwo,
  };
};

const getAccountsWithPrivkeys = async (
  accounts: DerivationInfo[],
  seed: Uint8Array,
): Promise<readonly AccountDataWithPrivkey[]> => {
  return Promise.all(
    accounts.map(async ({ hdPath, prefix }) => {
      const { privkey, pubkey, privkeyInHex, pubkeyInHex } = await getKeyPair(hdPath, seed);
      const address = Bech32.encode(prefix, rawSecp256k1PubkeyToRawAddress(pubkey));
      return {
        algo: 'secp256k1' as const,
        privkey: privkey,
        privkeyInHex,
        pubkey: pubkey,
        pubkeyInHex,
        address: address,
      };
    }),
  );
};

const mainThree = async () => {
  const stringMnemonic =
    'vacant cool enlist kiss van despair ethics silly route master funny door gossip athlete sword language argue alien any item desk mystery tray parade';

  // const defaultMnemonic = 'special sign fit simple patrol salute grocery chicken wheat radar tonight ceiling';
  // const defaultPubkey = fromHex('02baa4ef93f2ce84592a49b1d729c074eab640112522a7a89f7d03ebab21ded7b6');
  // const defaultAddress = 'cosmos1jhg0e7s6gn44tfc5k37kr04sznyhedtc9rzys5';

  const bip39Password = '';

  const mnemonicChecked = new EnglishMnemonic(stringMnemonic);
  console.log('mnemonicChecked', mnemonicChecked);
  const seed = await Bip39.mnemonicToSeed(mnemonicChecked, bip39Password);
  const seedInHex = uint8arrayToHexStr(seed);
  // console.log('master seed', seed);
  console.log('seedInHex!!', seedInHex);

  const hdPaths = [makeStratosHubPath(0), makeStratosHubPath(1)];
  const prefix = 'st';

  const accounts = hdPaths.map(hdPath => ({
    hdPath: hdPath,
    prefix,
  }));

  // console.log('accounts', accounts);

  const fullAccounts = await getAccountsWithPrivkeys(accounts, seed);

  console.log('fullAccounts', fullAccounts);
  // const keyPath = "m/44'/606'/0'/0/1";
  // const path = stringToPath(keyPath);

  // console.log('path', path);

  // console.log('paths', paths);

  // const wallet = await Secp256k1HdWallet.fromMnemonic(stringMnemonic, {
  //   bip39Password: '',
  //   hdPaths: paths,
  //   prefix: 'st',
  // });

  // const accounts = await wallet.getAccounts();

  // console.log('accounts!', accounts);

  // const allAccounts = await wallet.getAccountsWithPrivkeys()
};

const mainFour = async () => {
  const stringMnemonic =
    'vacant cool enlist kiss van despair ethics silly route master funny door gossip athlete sword language argue alien any item desk mystery tray parade';

  const phrase = mnemonic.convertStringToArray(stringMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);
  console.log('masterKeySeed', masterKeySeed);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  // console.log('encryptedMasterKeySeedString', encryptedMasterKeySeedString);
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  console.log('keyPairZero', keyPairZero);
  const keyPairOne = await deriveKeyPair(1, password, encryptedMasterKeySeedString);

  console.log('keyPairOne', keyPairOne);
};

const mainF = async () => {
  // const masterKeySeed = createMasterKeySeed(phraseN, password);
  // const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();

  // const masterKeySeedInt = await keyUtils.getMasterKeySeed(password, encryptedMasterKeySeedString);

  // console.log('masterKeySeedInt!!', masterKeySeedInt);
  // const privateKeySeed = derivePrivateKeySeed(masterKeySeedInt, path);
  // console.log('privateKeySeed!!', privateKeySeed);

  // const masterKeySeedIntBu = keyUtils.generateMasterKeySeed(phrase);
  // console.log('!!aa masterKeySeedIntBu', masterKeySeedIntBu);

  // const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  // console.log('keyPair 0!', keyPairZero);
  // const keyPairOne = await deriveKeyPair(1, password, encryptedMasterKeySeedString);

  // console.log('keyPair 1!', keyPairOne);

  // const sourceAddress = 'st14e2wee4zhfg0q29y5ehk2dt8nmc9ta4rj6s598';

  // const privateKeySeed = derivePrivateKeySeed(masterKeySeedInt, path);

  // const { privateKey, privateKeySeed: privateKeySeedK } = await deriveKeyPairFromPrivateKeySeed(
  //   privateKeySeed,
  // );

  // console.log('privateKeySeedK!!!!', privateKeySeedK);

  let accountsData;

  // try {
  //   accountsData = await cosmos.getAccounts('st1m7ch70gtpug94h3vklhqmwa4jm59egez7uvjqz');
  //   console.log('accountsData!', accountsData);
  // } catch (error) {
  //   console.log('Could not get accounts', error.message);
  // }

  let signedTx;

  if (accountsData) {
    // let stdSignMsg = cosmos.newStdMsg({
    //   msgs: [
    //     {
    //       type: 'cosmos-sdk/MsgSend',
    //       value: {
    //         amount: [
    //           {
    //             amount: String(100000),
    //             denom: 'atom',
    //           },
    //         ],
    //         from_address: keyPair.address,
    //         to_address: 'st1sdj4dcyf5y5f24q8h57xj4dfvnuz20a2a5hun7',
    //       },
    //     },
    //   ],
    //   chain_id: chainId,
    //   fee: { amount: [{ amount: String(5000), denom: 'atom' }], gas: String(200000) },
    //   memo: '',
    //   account_number: String(accountsData.result.value.account_number),
    //   sequence: String(accountsData.result.value.account_number),
    // });
    // signedTx = cosmos.sign(stdSignMsg, keyPair.privateKeySeedK);
  }

  let result;
  if (signedTx) {
    try {
      // result = await cosmos.broadcast(signedTx);
      console.log('result!', result);
    } catch (error) {
      console.log('Could not broadcast', error.message);
    }
  }
};

// mainThree();

mainFour();
