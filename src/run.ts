import { fromBase64, fromHex, toAscii, toBase64, toBech32, toHex } from '@cosmjs/encoding';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import * as accounts from './accounts';
import { hdVault, tokens } from './config';
import { mnemonic, wallet } from './hdVault';
import { deserializeWithEncryptionKey, serializeWithEncryptionKey } from './hdVault/cosmosUtils';
import * as cosmosWallet from './hdVault/cosmosWallet';
import { createMasterKeySeed, getSerializedWalletFromPhrase } from './hdVault/keyManager';
import * as keyUtils from './hdVault/keyUtils';
import { deriveKeyPair, deserializeEncryptedWallet } from './hdVault/wallet';
import Sdk from './Sdk';
import { getCosmos, resetCosmos } from './services/cosmos';
import * as FilesystemService from './services/filesystem';
import * as RemoteFilesystem from './services/filesystem/remoteFile';
import { log, delay, dirLog } from './services/helpers';
import * as Network from './services/network';
import * as integration from './testing/integration/sdk_inegration_runner';
import * as transactions from './transactions';
import * as evm from './transactions/evm';
import * as transactionTypes from './transactions/types';
import * as validators from './validators';

dotenv.config();

const password = 'XXXX';

const { ZERO_MNEMONIC: zeroUserMnemonic = '' } = process.env;

const sdkEnvDev = {
  restUrl: 'https://rest-dev.thestratos.org',
  rpcUrl: 'https://rpc-dev.thestratos.org',
  chainId: 'dev-chain-46',
  explorerUrl: 'https://explorer-dev.thestratos.org',
};

const sdkEnvTest = {
  key: 'testnet',
  name: 'Tropos-4',
  restUrl: 'https://rest-tropos.thestratos.org',
  rpcUrl: 'https://rpc-tropos.thestratos.org',
  chainId: 'stratos-testnet-2',
  explorerUrl: 'https://big-dipper-tropos.thestratos.org',
  faucetUrl: 'https://faucet-tropos.thestratos.org/credit',
};

// creates an account and derives 2 keypairs
const mainFour = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();

  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);
  console.log('keyPairZero', keyPairZero);
};

const evmSend = async () => {
  // Sdk.init({
  //   ...sdkEnvTest,
  //   ...{
  //     restUrl: 'http://localhost:1317',
  //     rpcUrl: 'http://localhost:26657',
  //     chainId: 'test-chain',
  //   },
  // });

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();

  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const fromAddress = keyPairZero.address;

  const serialized = masterKeySeed.encryptedWalletInfo;

  const _cosmosClient = await getCosmos(serialized, password);

  const { sequence } = await _cosmosClient.getSequence(fromAddress);

  const payload = evm.DynamicFeeTx.fromPartial({
    chainId: '2048',
    nonce: sequence,
    gasFeeCap: (1_000_000_000).toString(),
    gas: 21_000,
    to: '0x000000000000000000000000000000000000dEaD',
    value: '1',
  });
  console.log('simulated gas', await _cosmosClient.execEvm(payload, keyPairZero, true));
  const signedTx = await _cosmosClient.signForEvm(payload, keyPairZero);
  if (signedTx) {
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('broadcasting result!', result);
    } catch (error) {
      const err: Error = error as Error;
      console.log('error broadcasting', err.message);
    }
  }
};

const createKeypairFromMnemonic = async (
  phrase: mnemonic.MnemonicPhrase,
  hdPathIndex = 0,
): Promise<wallet.KeyPairInfo> => {
  const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);
  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  let keyPairZero;
  try {
    keyPairZero = await wallet.deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedString);
  } catch (error) {
    log('Error', error);
    throw new Error('could not create keypar by the helper');
  }
  if (!keyPairZero) {
    throw new Error(`keypar was not derived`);
  }
  return keyPairZero;
};

const simulateSend = async (hdPathIndex: number, givenReceiverMnemonic?: string) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  console.log('phrase', phrase);

  const mnemonicToUse = givenReceiverMnemonic ? givenReceiverMnemonic : zeroUserMnemonic;
  console.log('mnemonicToUse', mnemonicToUse);

  const receiverPhrase = mnemonic.convertStringToArray(mnemonicToUse);

  console.log('receiverPhrase', receiverPhrase);

  const keyPairZero = await createKeypairFromMnemonic(phrase, hdPathIndex);
  const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase, hdPathIndex);

  const fromAddress = keyPairZero.address;

  const sendAmount = 0.2;

  const sendTxMessages = await transactions.getSendTx(fromAddress, [
    { amount: sendAmount, toAddress: keyPairReceiver.address },
  ]);

  console.log('keyPairZero.address', keyPairZero.address);
  console.log('keyPairReceiver.address', keyPairReceiver.address);

  const fees = await transactions.getStandardFee(keyPairZero.address, sendTxMessages);

  console.log('fees', fees);
  console.log('standardFeeAmount', tokens.standardFeeAmount());
  console.log('minGasPrice', tokens.minGasPrice.toString());
};

// cosmosjs send
const mainSend = async (
  hdPathIndex: number,
  givenReceiverMnemonic = zeroUserMnemonic,
  hdPathIndexReceiver = 0,
) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  console.log('phrase', phrase);

  const mnemonicToUse = givenReceiverMnemonic ? givenReceiverMnemonic : zeroUserMnemonic;
  console.log('mnemonicToUse', mnemonicToUse);

  const receiverPhrase = mnemonic.convertStringToArray(mnemonicToUse);

  console.log('receiverPhrase', receiverPhrase);

  const keyPairZero = await createKeypairFromMnemonic(phrase, hdPathIndex);
  const keyPairOne = await createKeypairFromMnemonic(receiverPhrase, hdPathIndexReceiver);
  // const keyPairTwo = await createKeypairFromMnemonic(receiverPhrase, 2);

  const fromAddress = keyPairZero.address;

  const sendAmount = 0.4;

  const sendTxMessages = await transactions.getSendTx(fromAddress, [
    { amount: sendAmount, toAddress: keyPairOne.address },
    // { amount: sendAmount + 1, toAddress: keyPairTwo.address },
  ]);

  const signedTx = await transactions.sign(fromAddress, sendTxMessages);

  if (signedTx) {
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('broadcasting result!', result);
    } catch (error) {
      const err: Error = error as Error;
      console.log('error broadcasting', err.message);
    }
  }
};

// cosmosjs delegate
const mainDelegate = async () => {
  const validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const delegatorAddress = keyPairZero.address;
  console.log('🚀 ~ file: run.ts ~ line 138 ~ mainDelegate ~ delegatorAddress', delegatorAddress);

  const sendTxMessages = await transactions.getDelegateTx(delegatorAddress, [
    { amount: 1, validatorAddress },
    { amount: 2, validatorAddress },
  ]);

  // const signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);
  const signedTx = await transactions.sign(delegatorAddress, sendTxMessages);

  if (signedTx) {
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('delegate broadcasting result!!! :)', result);
    } catch (error) {
      const err: Error = error as Error;
      console.log('error broadcasting', err.message);
    }
  }
};

// cosmosjs undelegate
const mainUndelegate = async () => {
  const validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const delegatorAddress = keyPairZero.address;

  const sendTxMessages = await transactions.getUnDelegateTx(delegatorAddress, [
    { amount: 0.3, validatorAddress },
    { amount: 0.2, validatorAddress },
  ]);

  const signedTx = await transactions.sign(delegatorAddress, sendTxMessages);

  if (signedTx) {
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('undelegate result :)', result);
    } catch (error) {
      const err: Error = error as Error;
      console.log('error broadcasting', err.message);
    }
  }
};

// cosmosjs withdraw rewards
const mainWithdrawRewards = async () => {
  const validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const delegatorAddress = keyPairZero.address;

  const sendTxMessages = await transactions.getWithdrawalRewardTx(delegatorAddress, [
    { validatorAddress },
    { validatorAddress },
  ]);

  const signedTx = await transactions.sign(delegatorAddress, sendTxMessages);

  if (signedTx) {
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('delegate withdrawal result :)', result);
    } catch (error) {
      const err: Error = error as Error;
      console.log('error broadcasting', err.message);
    }
  }
};

// cosmosjs withdraw all rewards
const mainWithdrawAllRewards = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const delegatorAddress = keyPairZero.address;
  console.log('🚀 ~ file: run.ts ~ line 295 ~ mainWithdrawAllRewards ~ delegatorAddress', delegatorAddress);

  const sendTxMessage = await transactions.getWithdrawalAllRewardTx(delegatorAddress);
  const signedTx = await transactions.sign(delegatorAddress, sendTxMessage);

  if (signedTx) {
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('delegate withdrawal all result :)', result);
    } catch (error) {
      const err: Error = error as Error;
      console.log('error broadcasting', err.message);
    }
  }
};

// cosmosjs withdraw rewards
const mainSdsPrepay = async (hdPathIndex: number, givenReceiverMnemonic?: string) => {
  // console.log('mnemonic ', zeroUserMnemonic);
  const mnemonicToUse = givenReceiverMnemonic ? givenReceiverMnemonic : zeroUserMnemonic;

  const phrase = mnemonic.convertStringToArray(mnemonicToUse);
  // console.log('phrase', phrase);
  const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const sendTxMessages = await transactions.getSdsPrepayTx(keyPairZero.address, [{ amount: 0.1 }]);

  dirLog('from mainSdsPrepay - calling tx sign with this messageToSign', sendTxMessages);
  const signedTx = await transactions.sign(keyPairZero.address, sendTxMessages);

  let attempts = 0;
  if (signedTx) {
    try {
      console.log('from mainSdsPrepay - calling tx broadcast');
      const result = await transactions.broadcast(signedTx);
      console.log('broadcast prepay result', result);
    } catch (err) {
      console.log('error broadcasting', (err as Error).message);
      if (attempts <= 2) {
        attempts += 1;
        dirLog(`attempts ${attempts}, trying again the same signedTx`, signedTx);
        const result = await transactions.broadcast(signedTx);
        console.log('broadcast prepay result', result);
      }
    }
  }
};

const uploadRequest = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);
  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);
  console.log('🚀 ~ file: run.ts ~ line 311 ~ uploadRequest ~ keyPairZero', keyPairZero);
  if (!keyPairZero) {
    return;
  }
  const filehash = 'v05ahm53rv07iscjr3cf5c8cjjmq1q64sb8d4aqo';
  const walletaddr = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
  const messageToSign = `${filehash}${walletaddr}`;
  const signature = await keyUtils.signWithPrivateKey(messageToSign, keyPairZero.privateKey);
  console.log('🚀 ~ file: run.ts ~ line 342 ~ uploadRequest ~ signature', signature);
  const pubkeyMine = await cosmosWallet.getPublicKeyFromPrivKey(fromHex(keyPairZero.privateKey));
  const valid = await keyUtils.verifySignature(messageToSign, signature, pubkeyMine.value);
  console.log('🚀 ~ file: run.ts ~ line 349 ~ uploadRequest ~ valid', valid);
};

const getAccountTrasactions = async () => {
  const zeroAddress = 'st19nn9fnlzkpm3hah3pstz0wq496cehclpru8m3u';
  // const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.All, 1);
  // const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Transfer, 1);
  // const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Delegate, 1);
  // const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Undelegate, 1);
  // const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.GetReward, 3, 2);
  const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.SdsPrepay, 1);
};

const getValidators = async () => {
  const vData = await validators.getValidators();
  console.log('vData');
};

const mainBalance = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const keyPairOne = await deriveKeyPair(1, password, encryptedMasterKeySeedString);

  if (!keyPairOne) {
    return;
  }

  const keyPairTwo = await deriveKeyPair(2, password, encryptedMasterKeySeedString);

  if (!keyPairTwo) {
    return;
  }

  console.log('keyPairZero', keyPairZero.address);
  console.log('keyPairOne', keyPairOne.address);
  console.log('keyPairTwo', keyPairTwo.address);

  const b0 = await accounts.getBalance(keyPairZero.address, 'ustos');
  const b1 = await accounts.getBalance(keyPairOne.address, 'ustos');
  const b2 = await accounts.getBalance(keyPairTwo.address, 'ustos');

  console.log('our bal keyPairZero', b0);
  console.log('our bal keyPairOne', b1);
  console.log('our bal keyPairTwo', b2);
};

const getDelegatedBalance = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  console.log('keyPairZero', keyPairZero.address);

  const address = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
  const bResult = await Network.getDelegatedBalance(address);

  const { response } = bResult;

  console.log('our delegated balanace', response?.result[0].balance);
};

const getUnboundingBalance = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  console.log('keyPairZero', keyPairZero.address);

  const address = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
  const bResult = await Network.getUnboundingBalance(address);

  const { response } = bResult;

  console.log('our unbounding balanace', response?.result); // an array ?
};

const getRewardBalance = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  console.log('keyPairZero', keyPairZero.address);

  const address = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
  const bResult = await Network.getRewardBalance(address);

  const { response } = bResult;

  console.log('our reward balanace', response?.result.rewards); // an array ?
};

const getOzoneBalance = async (hdPathIndex: number) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const b = await accounts.getOtherBalanceCardMetrics(keyPairZero.address);

  console.log('other balanace card metrics ', b);
};

const getBalanceCardMetrics = async (hdPathIndex: number) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedString);
  console.log('🚀 ~ file: run.ts ~ line 464 ~ getBalanceCardMetrics ~ keyPairZero', keyPairZero);

  if (!keyPairZero) {
    return;
  }

  const delegatorAddress = keyPairZero.address;
  const b = await accounts.getBalanceCardMetrics(delegatorAddress);

  console.log('balanace card metrics ', b);
};

const formatBalanceFromWei = () => {
  const amount = '50000';
  const balanceOne = accounts.formatBalanceFromWei(amount, 4);
  console.log('🚀 ~ file: run.ts ~ line 464 ~ formatBalanceFromWei ~ balanceOne', balanceOne);
  const balanceTwo = accounts.formatBalanceFromWei(amount, 5, true);
  console.log('🚀 ~ file: run.ts ~ line 466 ~ formatBalanceFromWei ~ balanceTwo', balanceTwo);
};

const runFaucet = async (hdPathIndex: number) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }
  const walletAddress = keyPairZero.address;
  console.log('walletAddress', walletAddress);

  const faucetUrl = 'https://faucet-dev.thestratos.org/credit';
  const result = await accounts.increaseBalance(walletAddress, faucetUrl, hdVault.stratosTopDenom);
  console.log('faucet result', result);
};

const getTxHistory = async () => {
  const wallet = await keyUtils.createWalletAtPath(0, zeroUserMnemonic);

  console.log('running getTxHistory');
  const [firstAccount] = await wallet.getAccounts();

  const zeroAddress = firstAccount.address;

  const result = await accounts.getAccountTrasactions(
    zeroAddress,
    transactionTypes.HistoryTxType.Transfer,
    1,
  );

  console.log('hist result!! !', result);

  return true;
};

const cosmosWalletCreateTest = async () => {
  // Old way
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);
  console.log('🚀 ~ file: run.ts ~ line 512 ~ cosmosWalletCreateTest ~ masterKeySeedInfo', masterKeySeedInfo);

  const { encryptedMasterKeySeed, encryptedWalletInfo } = masterKeySeedInfo;
  const encryptedMasterKeySeedString = encryptedMasterKeySeed.toString();
  const derivedMasterKeySeed = await keyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeedString);
  console.log(
    '🚀 ~ file: run.ts ~ line 517 ~ cosmosWalletCreateTest ~ derivedMasterKeySeed',
    derivedMasterKeySeed,
  );

  const newWallet = await deserializeWithEncryptionKey(password, encryptedWalletInfo);
  console.log('🚀 ~ file: run.ts ~ line 524 ~ cosmosWalletCreateTest ~ newWallet', newWallet);

  const [f] = await newWallet.getAccounts();
  console.log('🚀 ~ file: run.ts ~ line 527 ~ cosmosWalletCreateTest ~ f', f);

  const keyPairZeroA = await deriveKeyPair(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
  console.log('keyPairZeroA from crearted masterKeySeedInfo', keyPairZeroA);

  // 1
  // const wallet = await keyUtils.createWalletAtPath(0, zeroUserMnemonic);
  // const walletOne = await keyUtils.createWalletAtPath(1, zeroUserMnemonic);

  // 2
  // const wallets = await keyUtils.generateWallets(3, zeroUserMnemonic);
  // const [walletInfo] = wallets;
  // const [_walletAddress, wallet] = walletInfo;

  // const walletMasterKeySeed = (wallet as any).seed; // accessing a private field
  // const encryptedMasterKeySeed = keyUtils.encryptMasterKeySeed(password, walletMasterKeySeed);
  // const encryptedMasterKeySeedString = encryptedMasterKeySeed.toString();
  // const derivedMasterKeySeed = await keyUtils.decryptMasterKeySeed(password, encryptedMasterKeySeedString);
};

const testAccountData = async () => {
  const wallet = await keyUtils.createWalletAtPath(0, zeroUserMnemonic);
  const [firstAccount] = await wallet.getAccounts();
  console.log('🚀 ~ file: run.ts ~ line 621 ~ testAccountData ~ firstAccount', firstAccount);
};

const testFile = async () => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = 'stratos_landing_page.png';
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);
  const fileWritePath = path.resolve(SRC_ROOT, `new_${imageFileName}`);
  console.log('🚀 ~ file: run.ts ~ line 631 ~ testFile ~ fileReadPath', fileReadPath);

  const buff = fs.readFileSync(fileReadPath);
  const base64dataOriginal = buff.toString('base64');

  const chunksOfBuffers = await FilesystemService.getFileChunks(fileReadPath);
  const fullBuf = Buffer.concat(chunksOfBuffers);
  const base64dataFullBuf = fullBuf.toString('base64');

  const chunksOfBase64Promises = chunksOfBuffers.map(async chunk => {
    const pp = await FilesystemService.encodeBuffer(chunk);
    return pp;
  });

  const chunksOfBase64 = await Promise.all(chunksOfBase64Promises);

  const restoredChunksOfBuffers = chunksOfBase64.map(base64dataChunk =>
    Buffer.from(base64dataChunk, 'base64'),
  );

  const buffWriteT = Buffer.concat(restoredChunksOfBuffers);
  const base64data = buffWriteT.toString('base64');

  console.log('🚀 ~ file: run.ts ~ line 720 ~ testFile ~ base64dataOriginal', base64dataOriginal.length);
  console.log('🚀 ~ file: run.ts ~ line 729 ~ testFile ~ base64data', base64data.length);
  console.log('🚀 ~ file: run.ts ~ line 729 ~ testFile ~ base64dataFullBuf', base64dataFullBuf.length);

  // const buffWrite = Buffer.from(base64dataOriginal, 'base64'); // ok 1
  // const buffWrite = fullBuf; // ok 2
  // const buffWrite = Buffer.from(base64dataFullBuf, 'base64'); // ok 3
  // const buffWrite = buffWriteT; // ok 4
  const buffWrite = Buffer.from(base64data, 'base64'); // ok 5

  fs.writeFileSync(fileWritePath, buffWrite);
};

const testRequestUserFileShare = async (filehash: string, hdPathIndex: number) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);

  const keyPairZero = await deriveKeyPair(
    hdPathIndex,
    password,
    masterKeySeedInfo.encryptedMasterKeySeed.toString(),
  );

  if (!keyPairZero) {
    log('Error. We dont have a keypair');
    return;
  }

  const userShareFileResult = await RemoteFilesystem.shareFile(keyPairZero, filehash);

  console.log('retrieved user shared file result', userShareFileResult);
};

const testRequestUserStopFileShare = async (shareid: string, hdPathIndex: number) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);

  const keyPairZero = await deriveKeyPair(
    hdPathIndex,
    password,
    masterKeySeedInfo.encryptedMasterKeySeed.toString(),
  );

  if (!keyPairZero) {
    log('Error. We dont have a keypair');
    return;
  }

  const userFileList = await RemoteFilesystem.stopFileSharing(keyPairZero, shareid);

  console.log('retrieved user shared file list', userFileList);
};

const testRequestUserSharedFileList = async (page: number, hdPathIndex: number) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);

  const keyPairZeroA = await deriveKeyPair(
    hdPathIndex,
    password,
    masterKeySeedInfo.encryptedMasterKeySeed.toString(),
  );

  if (!keyPairZeroA) {
    log('Error. We dont have a keypair');
    return;
  }

  const { address } = keyPairZeroA;

  const userFileList = await RemoteFilesystem.getSharedFileList(address, page);

  console.log('retrieved user shared file list', userFileList);
};

const testRequestUserDownloadSharedFile = async (hdPathIndex: number, sharelink: string) => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);

  const keyPairZeroA = await deriveKeyPair(
    hdPathIndex,
    password,
    masterKeySeedInfo.encryptedMasterKeySeed.toString(),
  );

  if (!keyPairZeroA) {
    log('Error. We dont have a keypair');
    return;
  }
  const { address } = keyPairZeroA;

  const filePathToSave = path.resolve(SRC_ROOT, `my_super_new_from_shared_${sharelink}`);

  const userDownloadSharedFileResult = await RemoteFilesystem.downloadSharedFile(
    keyPairZeroA,
    filePathToSave,
    sharelink,
  );

  console.log('retrieved user shared file list', userDownloadSharedFileResult);
};

const testRequestUserFileList = async (page: number, hdPathIndex: number) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);

  const keyPairZeroA = await deriveKeyPair(
    hdPathIndex,
    password,
    masterKeySeedInfo.encryptedMasterKeySeed.toString(),
  );

  if (!keyPairZeroA) {
    log('Error. We dont have a keypair');
    return;
  }

  const { address } = keyPairZeroA;

  // const page = 4;
  const userFileList = await RemoteFilesystem.getUploadedFileList(address, page);

  console.log('retrieved user file list', userFileList);
};

// read local file and write a new one
const testReadAndWriteLocal = async (filename: string) => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = filename;
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

  console.log('fileInfo', fileInfo);

  let readSize = 0;

  const stats = fs.statSync(fileReadPath);
  const fileSize = stats.size;

  console.log('stats', stats);

  const step = 5000000;
  let offsetStart = 0;
  let offsetEnd = step;

  const encodedFileChunks = [];

  let completedProgress = 0;

  const readBinaryFile = await FilesystemService.getFileBuffer(fileReadPath);

  while (readSize < fileSize) {
    const fileChunk = readBinaryFile.slice(offsetStart, offsetEnd);

    if (!fileChunk) {
      break;
    }

    const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
    readSize = readSize + fileChunk.length;

    completedProgress = (100 * readSize) / fileSize;

    console.log(
      `completed ${readSize} from ${fileSize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(
        2,
      )}%`,
    );
    offsetStart = offsetEnd;
    offsetEnd = offsetEnd + step;
    encodedFileChunks.push(encodedFileChunk);
  }

  const fileWritePath = path.resolve(SRC_ROOT, `my_new_${filename}`);
  const fileWritePathFromBuff = path.resolve(SRC_ROOT, `my_new_from_buff_${filename}`);

  console.log('fileWritePath ', fileWritePath);

  console.log('encoded file chunks length', encodedFileChunks.length);

  const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);
  console.log('decodeFileChunks length - should be 576', decodedChunksList.length);

  const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
  console.log('we should see decodedFile length (combined from decodedChunksList array)', decodedFile.length);

  FilesystemService.writeFile(fileWritePathFromBuff, decodedFile);
  console.log('we should have an entire file written');

  const encodedFile = await FilesystemService.encodeFile(decodedFile);
  console.log('this is not be shown as the string is way too long');
  await FilesystemService.writeFileToPath(fileWritePath, encodedFile);
};

// read local file and write a new one (multiple IO)
// const testReadAndWriteLocalWorking = async (filename: string) => {
//   const PROJECT_ROOT = path.resolve(__dirname, '../');
//   const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');
//
//   const imageFileName = filename;
//   const fileReadPath = path.resolve(SRC_ROOT, imageFileName);
//
//   const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
//
//   console.log('fileInfo', fileInfo);
//
//   const fileStream = await FilesystemService.getUploadFileStream(fileReadPath);
//
//   let readSize = 0;
//
//   const stats = fs.statSync(fileReadPath);
//   const fileSize = stats.size;
//
//   console.log('stats', stats);
//
//   const step = 5000000;
//   let offsetStart = 0;
//   let offsetEnd = step;
//
//   const maxStep = 65536;
//
//   const readChunkSize = offsetEnd - offsetStart;
//
//   const encodedFileChunks = [];
//
//   let completedProgress = 0;
//
//   while (readSize < fileSize) {
//     let fileChunk;
//
//     if (readChunkSize < maxStep) {
//       fileChunk = await FilesystemService.getFileChunk(fileStream, readChunkSize);
//     } else {
//       let remained = readChunkSize;
//
//       const subChunks = [];
//
//       while (remained > 0) {
//         const currentStep = remained > maxStep ? maxStep : remained;
//         subChunks.push(currentStep);
//
//         remained = remained - currentStep;
//       }
//
//       const myList = [];
//
//       for (const chunkLength of subChunks) {
//         const chunkMini = await FilesystemService.getFileChunk(fileStream, chunkLength);
//
//         await delay(100);
//         myList.push(chunkMini);
//       }
//
//       const filteredList = myList.filter(Boolean);
//
//       const aggregatedBuf = Buffer.concat(filteredList);
//       fileChunk = aggregatedBuf;
//     }
//
//     if (!fileChunk) {
//       break;
//     }
//
//     if (fileChunk) {
//       const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
//       readSize = readSize + fileChunk.length;
//
//       completedProgress = (100 * readSize) / fileSize;
//
//       console.log(
//         `completed ${readSize} from ${fileSize} bytes, or ${(
//           Math.round(completedProgress * 100) / 100
//         ).toFixed(2)}%`,
//       );
//       offsetStart = offsetEnd;
//       offsetEnd = offsetEnd + step;
//       encodedFileChunks.push(encodedFileChunk);
//     }
//   }
//
//   const fileWritePath = path.resolve(SRC_ROOT, `my_new_${filename}`);
//   const fileWritePathFromBuff = path.resolve(SRC_ROOT, `my_new_from_buff_${filename}`);
//
//   console.log('fileWritePath ', fileWritePath);
//
//   console.log('encoded file chunks length', encodedFileChunks.length);
//
//   const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);
//   console.log('decodeFileChunks length - should be 576', decodedChunksList.length);
//
//   const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
//   console.log('we should see decodedFile length (combined from decodedChunksList array)', decodedFile.length);
//
//   FilesystemService.writeFile(fileWritePathFromBuff, decodedFile);
//   console.log('we should have an entire file written');
//
//   const encodedFile = await FilesystemService.encodeFile(decodedFile);
//   console.log('this is not be shown as the string is way too long');
//   await FilesystemService.writeFileToPath(fileWritePath, encodedFile);
// };

const testFileDl = async (hdPathIndex: number, filename: string, filehash: string) => {
  console.log(`downloading file ${filename}`);

  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);

  const keyPairZeroA = await deriveKeyPair(
    hdPathIndex,
    password,
    masterKeySeedInfo.encryptedMasterKeySeed.toString(),
  );

  if (!keyPairZeroA) {
    return;
  }

  const filePathToSave = path.resolve(SRC_ROOT, `my_super_new_from_buff_${filename}`);

  await RemoteFilesystem.downloadFile(keyPairZeroA, filePathToSave, filehash);

  log('done. filePathToSave', filePathToSave);
};

const testItFileUp = async (filename: string, hdPathIndex: number) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);

  const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);

  const keypair = await deriveKeyPair(hdPathIndex, password, masterKeySeed.encryptedMasterKeySeed.toString());

  if (!keypair) {
    return;
  }

  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const fileReadPath = path.resolve(SRC_ROOT, filename);

  await RemoteFilesystem.updloadFile(keypair, fileReadPath);
  log('done!');
};

const main = async () => {
  let resolvedChainID: string;

  // const sdkEnv = sdkEnvTest;
  const sdkEnv = sdkEnvDev;

  Sdk.init({ ...sdkEnv });

  try {
    const resolvedChainIDToTest = await Network.getChainId();

    if (!resolvedChainIDToTest) {
      throw new Error('Chain id is empty. Exiting');
    }

    console.log('🚀 ~ file: run.ts ~ line 817 ~ main ~ resolvedChainIDToTest', resolvedChainIDToTest);
    resolvedChainID = resolvedChainIDToTest;
  } catch (error) {
    console.log('🚀 ~ file: 494 ~ init ~ resolvedChainID error', error);
    throw new Error('Could not resolve chain id');
  }

  // 2
  Sdk.init({
    ...sdkEnv,
    chainId: resolvedChainID,
    // ppNodeUrl: 'http://35.233.85.255',
    // ppNodePort: '8142',
    ppNodeUrl: 'http://34.145.36.237',
    ppNodePort: '8135',
  });

  // tropos
  // ppNodeUrl: 'http://35.233.251.112',
  //     ppNodePort: '8159',

  // await evmSend();

  const hdPathIndex = 0;
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password, hdPathIndex);

  const serialized = masterKeySeedInfo.encryptedWalletInfo;

  const _cosmosClient = await getCosmos(serialized, password);

  // 10M
  // const filehash = 'v05ahm50fffve5i7oh69094ct0infbvk6rsojig0';
  // const filename = 'file10_29_05_4';
  // const filesize = 10000001;

  // 200M
  // const filehash = 'v05ahm50gdn2hf32tssmcea80kanv4n78scr03d0';
  // const filesize = 200000000;
  // const filename = 'file200_29_05';

  // 1000M
  // const filehash = 'v05ahm531j2qid25m8271loap55blqfi35vddv20';
  // const filesize = 1000000000;
  // const filename = 'file1000_29_05';

  // 750M
  // const filehash = 'v05ahm52ebav0nc5bb47u0kmr7iucgrf8lnqrluo';
  // const filesize = 750000000;
  // const filename = 'file750_29_05';

  // 500M
  // const filehash = 'v05ahm5742n3kcoanqk3ml9eqpkbgr1csh4g3jb8';
  // const filesize = 500000000;
  // const filename = 'file500_29_05';

  // 1a
  // await testRequestUserFileList(0, hdPathIndex);

  // 2a
  // await testItFileUp(filename, hdPathIndex);

  // 3a
  const filehash = 'v05ahm547ksp8qnsa3neguk67b39j3fu3m396juo';
  const filesize = 250000000;
  const filename = 'file250_06_06';
  await testFileDl(hdPathIndex, filename, filehash);

  // 4a
  // await testRequestUserSharedFileList(0, hdPathIndex);

  // 5a
  // await testRequestUserFileShare(filehash, hdPathIndex);

  // 6a
  // await testRequestUserStopFileShare(shareid, hdPathIndex);

  // 7a

  // filehash: 'v05ahm547ksp8qnsa3neguk67b39j3fu3m396juo',
  // filesize: 250000000,
  // filename: 'file250_06_06',
  // linktime: 1686242085,
  // linktimeexp: 1701794085,
  // shareid: 'd898cb2c8ca8635e',
  // sharelink: 'gObhyW_d898cb2c8ca8635e'
  const sharelink = 'gObhyW_d898cb2c8ca8635e';
  await testRequestUserDownloadSharedFile(hdPathIndex, sharelink);

  // 1 Check balance
  // await getBalanceCardMetrics(hdPathIndex);

  // 2 Add funds via faucet
  // await runFaucet(hdPathIndex);

  // await simulateSend(hdPathIndex, receiverMnemonic);
  // await mainSdsPrepay(hdPathIndex);
  // await getOzoneBalance(hdPathIndex);

  // const receiverPhrase = mnemonic.generateMnemonicPhrase(24);
  // const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  // const receiverMnemonic = zeroUserMnemonic;
  // const hdPathIndexReceiver = 10;
  // await mainSend(hdPathIndex, receiverMnemonic, hdPathIndexReceiver);
};

main();
