import { HdPath, Slip10RawIndex } from '@cosmjs/crypto';
import { fromHex } from '@cosmjs/encoding';
import { mnemonic } from './hdVault';
import { createMasterKeySeed } from './hdVault/keyManager';
import { uint8ArrayToBuffer } from './hdVault/utils';
import { deriveKeyPair } from './hdVault/wallet';
import { getTxList } from './services/network';
import * as transactions from './transactions';
import * as transactionTypes from './transactions/types';

const password = '123456';

/**
 * // temp helper
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

// creates an account and derives 2 keypairs
const mainFour = async () => {
  /**
   *
- name: user1
  type: local
  address: st1p6xr32qthheenk3v94zkyudz7vmjaght0l4q7j
  pubkey: stpub1addwnpepqfafvmf6nvvqvsxhettht004fxmnp464u6y4gqfl6vfchsg0t0hhuqwmacg
  mnemonic: ""
  threshold: 0
  pubkeys: []


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

athlete bird sponsor fantasy salute rug erosion run drink unusual immune decade boy blind sorry sad match resemble moment network aim volume diagram beach



- name: user0
  type: local
  address: st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6
  pubkey: stpub1addwnpepqdaazld397esglujfxsvwwtd8ygytzqnj5ven52guvvdpvaqdnn524sdzmh
  mnemonic: ""
  threshold: 0
  pubkeys: []


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

hope skin cliff bench vanish motion swear reveal police cash street example health object penalty random broom prevent obvious dawn shiver leader prize onion

   */

  // const stringMnemonic =
  //   'vacant cool enlist kiss van despair ethics silly route master funny door gossip athlete sword language argue alien any item desk mystery tray parade';

  const zeroUserMnemonic =
    'hope skin cliff bench vanish motion swear reveal police cash street example health object penalty random broom prevent obvious dawn shiver leader prize onion';

  const firstUserMnemonic =
    'athlete bird sponsor fantasy salute rug erosion run drink unusual immune decade boy blind sorry sad match resemble moment network aim volume diagram beach';

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);
  console.log('masterKeySeed!', masterKeySeed);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();

  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  console.log('keyPairZero', keyPairZero);
  const keyPairOne = await deriveKeyPair(1, password, encryptedMasterKeySeedString);

  console.log('keyPairOne', keyPairOne);
};

// cosmosjs send
const mainSend = async () => {
  // const zeroAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
  const firstAddress = 'st1p6xr32qthheenk3v94zkyudz7vmjaght0l4q7j';

  const zeroUserMnemonic =
    'hope skin cliff bench vanish motion swear reveal police cash street example health object penalty random broom prevent obvious dawn shiver leader prize onion';
  // const encryptedMnenomicFromKeyChain =
  // 'U2FsdGVkX191iHA1MroblptDqlsyCHzBzFiG4Q9STT2wxnWM39QbCevQgsyyfZNEQxCPmNYPrDwuYLInXRxtMD8FR92LB3Psf0Gc7aSI9JuyDSrKrJHlspTRkr4SNsHMbWSxltjcLdsZiQlqUTkbQR1Ogkngg2y022fkoPIvjAX66GBSnKR/e88feyDbHzUYhmpKBE6222eyUOZrYOnUgS4tbqPbkH2K22ZGzCDRbQs=';
  // const firstUserMnemonic =
  //   'athlete bird sponsor fantasy salute rug erosion run drink unusual immune decade boy blind sorry sad match resemble moment network aim volume diagram beach';
  /**
   * account: "w1"
address: "cosmos1avx4zwskj36tmktp0mj60qyxffu7ep9mwmjjd6"
   */
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const fromAddress = keyPairZero.address;

  const pkey = uint8ArrayToBuffer(fromHex(keyPairZero.privateKey));

  const sendTxMessage = await transactions.getSendTx(100000, fromAddress, firstAddress);
  const signedTx = transactions.sign(sendTxMessage, pkey);

  if (signedTx) {
    console.log('signedTx send', JSON.stringify(signedTx, null, 2));

    try {
      const result = await transactions.broadcast(signedTx);
      console.log('broadcasting result!', result);
    } catch (err) {
      console.log('error broadcasting', err.message);
    }
  }
};

// cosmosjs delegate
const mainDelegate = async () => {
  const validatorAddress = 'stvaloper1k4ach36c8qwuckefz94vy83y308h5uzy5ukl63';

  const zeroUserMnemonic =
    'hope skin cliff bench vanish motion swear reveal police cash street example health object penalty random broom prevent obvious dawn shiver leader prize onion';

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }
  const delegatorAddress = keyPairZero.address;

  const pkey = uint8ArrayToBuffer(fromHex(keyPairZero.privateKey));

  // const result = await delegate(10, keyPairZero, delegatorAddress, validatorAddress);

  // console.log('result!!', result);

  // const myTx = await transactions.getDelegateTx(10, keyPairZero.address, delegatorAddress, validatorAddress);
  // const myTxMsg = cosmos.newStdMsg(myTx);
  // const signedTx = cosmos.sign(myTxMsg, pkey);

  const sendTxMessage = await transactions.getDelegateTx(10, delegatorAddress, validatorAddress);
  const signedTx = transactions.sign(sendTxMessage, pkey);

  if (signedTx) {
    console.log('signedTx', JSON.stringify(signedTx, null, 2));
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('delegate broadcasting result!!! :)', result);
    } catch (err) {
      console.log('error broadcasting', err.message);
    }
  }
};

// cosmosjs withdraw rewards
const mainWithdrawRewards = async () => {
  const validatorAddress = 'stvaloper1k4ach36c8qwuckefz94vy83y308h5uzy5ukl63';

  const zeroUserMnemonic =
    'hope skin cliff bench vanish motion swear reveal police cash street example health object penalty random broom prevent obvious dawn shiver leader prize onion';

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }
  const delegatorAddress = keyPairZero.address;

  const pkey = uint8ArrayToBuffer(fromHex(keyPairZero.privateKey));

  const sendTxMessage = await transactions.getWithdrawalRewardTx(delegatorAddress, validatorAddress);
  const signedTx = transactions.sign(sendTxMessage, pkey);

  if (signedTx) {
    console.log('signedTx', JSON.stringify(signedTx, null, 2));
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('delegate withdrawal result :)', result);
    } catch (err) {
      console.log('error broadcasting', err.message);
    }
  }
};

// cosmosjs withdraw rewards
const mainSdsPrepay = async () => {
  const zeroUserMnemonic =
    'hope skin cliff bench vanish motion swear reveal police cash street example health object penalty random broom prevent obvious dawn shiver leader prize onion';

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const pkey = uint8ArrayToBuffer(fromHex(keyPairZero.privateKey));

  const sendTxMessage = await transactions.getSdsPrepayTx(keyPairZero.address, 10);
  const signedTx = transactions.sign(sendTxMessage, pkey);

  if (signedTx) {
    console.log('signedTx', JSON.stringify(signedTx, null, 2));
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('broadcast prepay result :)', result);
    } catch (err) {
      console.log('error broadcasting', err.message);
    }
  }
};

const getNewTx = async () => {
  const zeroAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';

  const r = await transactions.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Transfer, 1);

  console.log('r!!', r);
};

// cosmosjs send
// mainSend();
getNewTx();

// delegate
// mainDelegate();

//withdrawal
// mainWithdrawRewards();

// prepay
// mainSdsPrepay();
