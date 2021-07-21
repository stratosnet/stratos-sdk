import { HdPath, Slip10RawIndex } from '@cosmjs/crypto';
import * as accounts from './accounts';
import { mnemonic } from './hdVault';
import { createMasterKeySeed } from './hdVault/keyManager';
import { deriveKeyPair } from './hdVault/wallet';
import Sdk from './Sdk';
import * as transactions from './transactions';
import * as transactionTypes from './transactions/types';
import * as validators from './validators';

const password = '123456';

const sdkEnvDev = {
  restUrl: 'https://rest.dev.qsnetwork.info',
  rpcUrl: 'https://rpc.dev.qsnetwork.info',
  chainId: 'dev-chain-2',
  explorerUrl: 'https://explorer.dev.qsnetwork.info',
};

const sdkEnvTest = {
  restUrl: 'http://rest-test.thestratos.org',
  rpcUrl: 'http://rpc-test.thestratos.org',
  chainId: 'test-chain-1',
  explorerUrl: 'https://explorer-test.thestratos.org',
};

Sdk.init(sdkEnvDev);

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

  // const pkey = uint8ArrayToBuffer(fromHex(keyPairZero.privateKey));

  const sendAmount = 1;

  const sendTxMessage = await transactions.getSendTx(sendAmount, fromAddress, firstAddress);
  const signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);

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

  // const pkey = uint8ArrayToBuffer(fromHex(keyPairZero.privateKey));

  // const result = await delegate(10, keyPairZero, delegatorAddress, validatorAddress);

  // console.log('result!!', result);

  // const myTx = await transactions.getDelegateTx(10, keyPairZero.address, delegatorAddress, validatorAddress);
  // const myTxMsg = cosmos.newStdMsg(myTx);
  // const signedTx = cosmos.sign(myTxMsg, pkey);

  const sendTxMessage = await transactions.getDelegateTx(1, delegatorAddress, validatorAddress);
  const signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);

  if (signedTx) {
    console.log('signedTx!', JSON.stringify(signedTx, null, 2));
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

  // const pkey = uint8ArrayToBuffer(fromHex(keyPairZero.privateKey));

  const sendTxMessage = await transactions.getWithdrawalRewardTx(delegatorAddress, validatorAddress);
  const signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);

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

  // const pkey = uint8ArrayToBuffer(fromHex(keyPairZero.privateKey));

  const sendTxMessage = await transactions.getSdsPrepayTx(keyPairZero.address, 10);
  const signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);

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

const getAccountTrasactions = async () => {
  const zeroAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';

  const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Transfer, 1);

  console.log('r!!', r);
};

const getValidators = async () => {
  const vData = await validators.getValidators();
  console.log('vData');
  // const zeroAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';

  // const vPool = await getStakingPool();

  // console.log('vPool', vPool);
  // const vList = await getValidatorsList('bonded');

  // console.log('vList!!', vList);
  // console.log('vList response', vList.response);
  // console.log('vList description', vList!.response.result[0].description);
  // console.log('vList comission', vList!.response.result[0].commission);

  // const v = await getValidator('stvaloper1k4ach36c8qwuckefz94vy83y308h5uzy5ukl63');
  // console.log('v!', v);
  // const {
  //   result: [firstV],
  // } = vList.response;
  // console.log('fVal', firstV);
};

const mainBalance = async () => {
  const zeroUserMnemonic =
    'hope skin cliff bench vanish motion swear reveal police cash street example health object penalty random broom prevent obvious dawn shiver leader prize onion';

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }
  console.log('keyPairZero', keyPairZero.address);

  const delegatorAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
  const b = await accounts.getBalance(delegatorAddress, 'ustos');

  console.log('our bal ', b);
};

// cosmosjs send
// mainSend();
// mainDelegate();
mainBalance();
// mainFour();
// delegate
// mainDelegate();

//withdrawal
// mainWithdrawRewards();

// prepay
// mainSdsPrepay();
