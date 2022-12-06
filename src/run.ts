import { fromBase64, fromHex, toAscii, toBase64, toBech32, toHex } from '@cosmjs/encoding';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import * as accounts from './accounts';
import { hdVault } from './config';
import { mnemonic } from './hdVault';
import { deserializeWithEncryptionKey, serializeWithEncryptionKey } from './hdVault/cosmosUtils';
import { createMasterKeySeed, getSerializedWalletFromPhrase } from './hdVault/keyManager';
import * as keyUtils from './hdVault/keyUtils';
import { deriveKeyPair, deserializeEncryptedWallet } from './hdVault/wallet';
import Sdk from './Sdk';
import { getCosmos } from './services/cosmos';
import * as FilesystemService from './services/filesystem';
import { log, delay } from './services/helpers';
import * as Network from './services/network';
import * as transactions from './transactions';
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

// export type PathBuilder = (account_index: number) => HdPath;

// creates an account and derives 2 keypairs
const mainFour = async () => {
  // const mm =
  // 'athlete bird sponsor fantasy salute rug erosion run drink unusual immune decade boy blind sorry sad match resemble moment network aim volume diagram beach';
  // const phrase = mnemonic.convertStringToArray(mm);

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();

  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);
  console.log('keyPairZero', keyPairZero);

  // const keyPairOne = await deriveKeyPair(1, password, encryptedMasterKeySeedString);
  // console.log('keyPairOne', keyPairOne);
};

// cosmosjs send
const mainSend = async () => {
  // const firstAddress = 'st1p6xr32qthheenk3v94zkyudz7vmjaght0l4q7j';

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

  const fromAddress = keyPairZero.address;

  const sendAmount = 4.2;

  const sendTxMessages = await transactions.getSendTx(fromAddress, [
    { amount: sendAmount, toAddress: keyPairOne.address },
    { amount: sendAmount + 1, toAddress: keyPairTwo.address },
  ]);

  // const signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);

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

  // const signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);
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
const mainSdsPrepay = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);
  console.log('🚀 ~ file: run.ts ~ line 292 ~ mainSdsPrepay ~ keyPairZero', keyPairZero);

  if (!keyPairZero) {
    return;
  }

  const sendTxMessages = await transactions.getSdsPrepayTx(keyPairZero.address, [{ amount: 3 }]);

  const signedTx = await transactions.sign(keyPairZero.address, sendTxMessages);

  if (signedTx) {
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('broadcast prepay result', result);
    } catch (err) {
      console.log('error broadcasting', (err as Error).message);
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
  const pubkeyMine = await keyUtils.getPublicKeyFromPrivKey(fromHex(keyPairZero.privateKey));
  const valid = await keyUtils.verifySignature(messageToSign, signature, pubkeyMine.value);
  console.log('🚀 ~ file: run.ts ~ line 349 ~ uploadRequest ~ valid', valid);
};

const getAccountTrasactions = async () => {
  const zeroAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';

  const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.All, 1);

  console.log('r!!', r.data);
  console.log('r!!', r.data[1]);
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

const getOzoneBalance = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const callResultB = await Network.sendUserRequestGetOzone([{ walletaddr: keyPairZero.address }]);
  console.log('🚀 ~ file: run.ts ~ line 296 ~ mainSdsPrepay ~ callResultB', callResultB);
};

const getBalanceCardMetrics = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);
  console.log('🚀 ~ file: run.ts ~ line 464 ~ getBalanceCardMetrics ~ keyPairZero', keyPairZero);

  if (!keyPairZero) {
    return;
  }

  const delegatorAddress = keyPairZero.address;
  // const delegatorAddress = wen;
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

const runFaucet = async () => {
  const walletAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';

  // const faucetUrl = 'https://faucet-tropos.thestratos.org/credit';
  // const result = await accounts.increaseBalance(walletAddress, faucetUrl, hdVault.stratosDenom);

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
  // const list = await Network.getValidatorsList();
  const wallet = await keyUtils.createWalletAtPath(0, zeroUserMnemonic);
  const [firstAccount] = await wallet.getAccounts();
  console.log('🚀 ~ file: run.ts ~ line 621 ~ testAccountData ~ firstAccount', firstAccount);
  // const vData = await validators.getValidatorsBondedToDelegator(firstAccount.address);

  // console.log('st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6');
  // console.log('vData', vData);

  // const vInfo = await Network.getValidator('stvaloper1evqx4vnc0jhkgd4f5kruz7vuwt6lse3zfkex5u');
  // console.log('🚀 ~ file: run.ts ~ line 629 ~ testAccountData ~ vInfo', vInfo);

  // const accountsData2 = await accounts.getAccountsData(firstAccount.address);
  // console.log('🚀 ~ file: run.ts ~ line 598 ~ testAccountData ~ accountsData2', accountsData2);
};

// async function processFile(path: string, handler: any) {
const testFile = async () => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = 'stratos_landing_page.png';
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);
  const fileWritePath = path.resolve(SRC_ROOT, `new_${imageFileName}`);
  console.log('🚀 ~ file: run.ts ~ line 631 ~ testFile ~ fileReadPath', fileReadPath);

  let buff = fs.readFileSync(fileReadPath);
  let base64dataOriginal = buff.toString('base64');

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

const testFileHash = async () => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = 'stratos_landing_page.png';

  const expectedHash = 'v05ahm53rv07iscjr3cf5c8cjjmq1q64sb8d4aqo';
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const realFileHash2 = await FilesystemService.calculateFileHash(fileReadPath);

  console.log('🚀 ~  ~ realFileHash2', realFileHash2);
  console.log('🚀 ~   ~ expectedHash', expectedHash);
};

const testUploadRequest = async () => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  // const imageFileName = 'stratos_landing_page.png';
  // const imageFileName = 'img7.png';
  const imageFileName = 'file100M1';
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
  console.log('file info', fileInfo);

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);

  const keyPairZeroA = await deriveKeyPair(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
  // console.log('🚀 ~ file: run.ts ~ line 617 ~ testUploadRequest ~ keyPairZeroA', keyPairZeroA);

  if (!keyPairZeroA) {
    return;
  }

  const { address, publicKey } = keyPairZeroA;

  const messageToSign = `${fileInfo.filehash}${address}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keyPairZeroA.privateKey);
  const extraParams = [
    {
      filename: imageFileName,
      filesize: fileInfo.size,
      filehash: fileInfo.filehash,
      walletaddr: address,
      walletpubkey: publicKey,
      signature,
    },
  ];

  // only requesting the upload
  const callResult = await Network.sendUserRequestUpload(extraParams);

  const { response } = callResult;
  console.log('🚀 ~ file: run.ts ~ line 905 ~ testIt ~ response', JSON.stringify(response, null, 2));

  // now upload itself
  if (!response) {
    return;
  }

  const connectedUrl = `${Sdk.environment.ppNodeUrl}:${Sdk.environment.ppNodePort}`;

  return {
    data: `response from ${connectedUrl}`,
    response,
  };
};

const testRequestUserFileList = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);

  const keyPairZeroA = await deriveKeyPair(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());

  if (!keyPairZeroA) {
    console.log('Error. We dont have a keypair');
    return;
  }

  const { address } = keyPairZeroA;

  const page = 4;
  const userFileList = await FilesystemService.getUserUploadedFileList(address, page);

  console.log('retrieved user file list', userFileList);

  //   const extraParams = [
  //     {
  //       walletaddr: address,
  //       page: 0,
  //     },
  //   ];
  //
  //   const callResult = await Network.sendUserRequestList(extraParams);
  //
  //   const { response } = callResult;
  //
  //   console.log('file list request result', JSON.stringify(callResult));
  //
  //   // now upload itself
  //   if (!response) {
  //     return;
  //   }
  //
  //   const connectedUrl = `${Sdk.environment.ppNodeUrl}:${Sdk.environment.ppNodePort}`;
  //
  //   return {
  //     data: `response from ${connectedUrl}`,
  //     response,
  //   };
};

// move to utils
// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// read local file and write a new one
const testReadAndWriteLocal = async (filename: string) => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = filename;
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

  console.log('fileInfo', fileInfo);

  // const fileStream = await FilesystemService.getUploadFileStream(fileReadPath);

  let readSize = 0;

  const stats = fs.statSync(fileReadPath);
  const fileSize = stats.size;

  console.log('stats', stats);

  const step = 5000000;
  let offsetStart = 0;
  let offsetEnd = step;

  // const maxStep = 65536;

  // const readChunkSize = offsetEnd - offsetStart;

  const encodedFileChunks = [];

  let completedProgress = 0;

  const readBinaryFile = await FilesystemService.getFileBuffer(fileReadPath);

  while (readSize < fileSize) {
    // let fileChunk;

    // if (readChunkSize < maxStep) {
    // fileChunk = await FilesystemService.getFileChunk(fileStream, readChunkSize);
    const fileChunk = readBinaryFile.slice(offsetStart, offsetEnd);
    // }
    // else {
    //   let remained = readChunkSize;
    //   const subChunks = [];
    //   while (remained > 0) {
    //     const currentStep = remained > maxStep ? maxStep : remained;
    //     subChunks.push(currentStep);
    //
    //     remained = remained - currentStep;
    //   }
    //   const myList = [];
    //
    //   for (const chunkLength of subChunks) {
    //     const chunkMini = await FilesystemService.getFileChunk(fileStream, chunkLength);
    //
    //     await delay(100);
    //     myList.push(chunkMini);
    //   }
    //
    //   const filteredList = myList.filter(Boolean);
    //
    //   const aggregatedBuf = Buffer.concat(filteredList);
    //   fileChunk = aggregatedBuf;
    // }

    if (!fileChunk) {
      break;
    }

    // if (fileChunk) {
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
    // }
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
const testReadAndWriteLocalWorking = async (filename: string) => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = filename;
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

  console.log('fileInfo', fileInfo);

  const fileStream = await FilesystemService.getUploadFileStream(fileReadPath);

  let readSize = 0;

  const stats = fs.statSync(fileReadPath);
  const fileSize = stats.size;

  console.log('stats', stats);

  const step = 5000000;
  let offsetStart = 0;
  let offsetEnd = step;

  const maxStep = 65536;

  const readChunkSize = offsetEnd - offsetStart;

  const encodedFileChunks = [];

  let completedProgress = 0;

  while (readSize < fileSize) {
    let fileChunk;

    if (readChunkSize < maxStep) {
      fileChunk = await FilesystemService.getFileChunk(fileStream, readChunkSize);
    } else {
      let remained = readChunkSize;
      const subChunks = [];
      while (remained > 0) {
        const currentStep = remained > maxStep ? maxStep : remained;
        subChunks.push(currentStep);

        remained = remained - currentStep;
      }
      const myList = [];

      for (const chunkLength of subChunks) {
        const chunkMini = await FilesystemService.getFileChunk(fileStream, chunkLength);

        await delay(100);
        myList.push(chunkMini);
      }

      const filteredList = myList.filter(Boolean);

      const aggregatedBuf = Buffer.concat(filteredList);
      fileChunk = aggregatedBuf;
    }

    if (!fileChunk) {
      break;
    }

    if (fileChunk) {
      const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
      readSize = readSize + fileChunk.length;

      completedProgress = (100 * readSize) / fileSize;

      console.log(
        `completed ${readSize} from ${fileSize} bytes, or ${(
          Math.round(completedProgress * 100) / 100
        ).toFixed(2)}%`,
      );
      offsetStart = offsetEnd;
      offsetEnd = offsetEnd + step;
      encodedFileChunks.push(encodedFileChunk);
    }
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

// request upload and upload
const testIt = async (filename: string) => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = filename;
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);

  const keyPairZeroA = await deriveKeyPair(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());

  if (!keyPairZeroA) {
    return;
  }

  const { address, publicKey } = keyPairZeroA;
  const messageToSign = `${fileInfo.filehash}${address}`;

  const stats = fs.statSync(fileReadPath);
  const fileSize = stats.size;
  console.log('stats', stats);

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keyPairZeroA.privateKey);
  const extraParams = [
    {
      filename: imageFileName,
      filesize: fileInfo.size,
      filehash: fileInfo.filehash,
      walletaddr: address,
      walletpubkey: publicKey,
      signature,
    },
  ];

  const callResultInit = await Network.sendUserRequestUpload(extraParams);

  const { response: responseInit } = callResultInit;

  console.log('call result init', JSON.stringify(callResultInit));

  if (!responseInit) {
    console.log('we dont have response. it might be an error', callResultInit);
    return;
  }

  const { result: resultWithOffesets } = responseInit;
  console.log('result with offesets', resultWithOffesets);

  let offsetStartGlobal = 0;
  let offsetEndGlobal = 0;
  let isContinueGlobal = 0;

  const {
    offsetend: offsetendInit,
    offsetstart: offsetstartInit,
    return: isContinueInit,
  } = resultWithOffesets;

  if (offsetendInit === undefined) {
    console.log('a we dont have an offest. could be an error. response is', responseInit);
    return;
  }
  if (offsetstartInit === undefined) {
    console.log('b we dont have an offest. could be an error. response is', responseInit);
    return;
  }

  // const fileStream = await FilesystemService.getUploadFileStream(fileReadPath);

  let readSize = 0;

  // const maxStep = 65536;

  let completedProgress = 0;

  isContinueGlobal = +isContinueInit;
  offsetStartGlobal = +offsetstartInit;
  offsetEndGlobal = +offsetendInit;

  const readBinaryFile = await FilesystemService.getFileBuffer(fileReadPath);

  while (isContinueGlobal === 1) {
    // const readChunkSize = offsetEndGlobal - offsetStartGlobal;

    // let fileChunk;

    // if (readChunkSize < maxStep) {
    const fileChunk = readBinaryFile.slice(offsetStartGlobal, offsetEndGlobal);
    // fileChunk = await FilesystemService.getFileChunk(fileStream, readChunkSize);
    // } else {
    //   let remained = readChunkSize;
    //   const subChunks = [];
    //   while (remained > 0) {
    //     const currentStep = remained > maxStep ? maxStep : remained;
    //     subChunks.push(currentStep);
    //
    //     remained = remained - currentStep;
    //   }
    //   const myList = [];
    //
    //   for (const chunkLength of subChunks) {
    //     const chunkMini = await FilesystemService.getFileChunk(fileStream, chunkLength);
    //
    //     await delay(10);
    //     myList.push(chunkMini);
    //   }
    //   const filteredList = myList.filter(Boolean);
    //
    //   const aggregatedBuf = Buffer.concat(filteredList);
    //   // console.log('aggregatedBuf', aggregatedBuf);
    //   fileChunk = aggregatedBuf;
    // }

    if (!fileChunk) {
      console.log('fileChunk is missing, Exiting ', fileChunk);
      break;
    }

    log('from run.ts - completed before encoding a chunk to base64', completedProgress);

    if (fileChunk) {
      const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
      readSize = readSize + fileChunk.length;

      completedProgress = (100 * readSize) / fileSize;

      log(
        `from run.ts - completed ${readSize} from ${fileSize} bytes, or ${(
          Math.round(completedProgress * 100) / 100
        ).toFixed(2)}%`,
      );

      // upload
      const extraParamsForUpload = [
        {
          filehash: fileInfo.filehash,
          data: encodedFileChunk,
        },
      ];

      // isContinueGlobal = 0;
      // log('from run.ts - completed', completedProgress);
      log('from run.ts - will call upload', offsetStartGlobal, offsetEndGlobal);

      const callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);

      log('call result upload', JSON.stringify(callResultUpload));

      const { response: responseUpload } = callResultUpload;

      log('🚀 ~ file: run.ts ~ line 766 ~ testIt ~ result', callResultUpload);

      if (!responseUpload) {
        console.log('we dont have response. it might be an error', callResultUpload);

        return;
      }

      const {
        result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload },
      } = responseUpload;

      if (offsetendUpload === undefined) {
        console.log('1 we dont have an offest. could be an error. response is', responseUpload);
        return;
      }

      if (offsetstartUpload === undefined) {
        console.log('2 we dont have an offest. could be an error. response is', responseUpload);
        return;
      }

      isContinueGlobal = +isContinueUpload;
      offsetStartGlobal = +offsetstartUpload;
      offsetEndGlobal = +offsetendUpload;
    }
  }
};

// request upload and upload (multiple IO)
const testItWorking = async (filename: string) => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = filename;
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);

  const keyPairZeroA = await deriveKeyPair(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());

  if (!keyPairZeroA) {
    return;
  }

  const { address, publicKey } = keyPairZeroA;
  const messageToSign = `${fileInfo.filehash}${address}`;

  const stats = fs.statSync(fileReadPath);
  const fileSize = stats.size;
  console.log('stats', stats);

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keyPairZeroA.privateKey);
  const extraParams = [
    {
      filename: imageFileName,
      filesize: fileInfo.size,
      filehash: fileInfo.filehash,
      walletaddr: address,
      walletpubkey: publicKey,
      signature,
    },
  ];

  const callResultInit = await Network.sendUserRequestUpload(extraParams);

  const { response: responseInit } = callResultInit;

  console.log('call result init', JSON.stringify(callResultInit));

  if (!responseInit) {
    console.log('we dont have response. it might be an error', callResultInit);
    return;
  }

  const { result: resultWithOffesets } = responseInit;
  console.log('result with offesets', resultWithOffesets);

  let offsetStartGlobal = 0;
  let offsetEndGlobal = 0;
  let isContinueGlobal = 0;

  const {
    offsetend: offsetendInit,
    offsetstart: offsetstartInit,
    return: isContinueInit,
  } = resultWithOffesets;

  if (offsetendInit === undefined) {
    console.log('a we dont have an offest. could be an error. response is', responseInit);
    return;
  }
  if (offsetstartInit === undefined) {
    console.log('b we dont have an offest. could be an error. response is', responseInit);
    return;
  }

  const fileStream = await FilesystemService.getUploadFileStream(fileReadPath);

  let readSize = 0;

  // const stats = fs.statSync(fileReadPath);
  // const fileSize = stats.size;
  // console.log('stats', stats);

  const maxStep = 65536;

  let completedProgress = 0;

  isContinueGlobal = +isContinueInit;
  offsetStartGlobal = +offsetstartInit;
  offsetEndGlobal = +offsetendInit;

  while (isContinueGlobal === 1) {
    const readChunkSize = offsetEndGlobal - offsetStartGlobal;

    let fileChunk;

    if (readChunkSize < maxStep) {
      fileChunk = await FilesystemService.getFileChunk(fileStream, readChunkSize);
    } else {
      let remained = readChunkSize;
      const subChunks = [];
      while (remained > 0) {
        const currentStep = remained > maxStep ? maxStep : remained;
        subChunks.push(currentStep);

        remained = remained - currentStep;
      }
      const myList = [];

      for (const chunkLength of subChunks) {
        const chunkMini = await FilesystemService.getFileChunk(fileStream, chunkLength);

        await delay(10);
        myList.push(chunkMini);
      }
      const filteredList = myList.filter(Boolean);

      const aggregatedBuf = Buffer.concat(filteredList);
      // console.log('aggregatedBuf', aggregatedBuf);
      fileChunk = aggregatedBuf;
    }

    if (!fileChunk) {
      console.log('fileChunk is missing, Exiting ', fileChunk);
      break;
    }

    if (fileChunk) {
      const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
      readSize = readSize + fileChunk.length;

      completedProgress = (100 * readSize) / fileSize;

      console.log(
        `completed ${readSize} from ${fileSize} bytes, or ${(
          Math.round(completedProgress * 100) / 100
        ).toFixed(2)}%`,
      );

      // upload
      const extraParamsForUpload = [
        {
          filehash: fileInfo.filehash,
          data: encodedFileChunk,
        },
      ];

      // isContinueGlobal = 0;
      log('from run.ts params for upload', extraParamsForUpload);

      const callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);

      console.log('call result upload', JSON.stringify(callResultUpload));

      const { response: responseUpload } = callResultUpload;

      console.log('🚀 ~ file: run.ts ~ line 766 ~ testIt ~ result', callResultUpload);

      if (!responseUpload) {
        console.log('we dont have response. it might be an error', callResultUpload);

        return;
      }

      const {
        result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload },
      } = responseUpload;

      if (offsetendUpload === undefined) {
        console.log('1 we dont have an offest. could be an error. response is', responseUpload);
        return;
      }

      if (offsetstartUpload === undefined) {
        console.log('2 we dont have an offest. could be an error. response is', responseUpload);
        return;
      }

      isContinueGlobal = +isContinueUpload;
      offsetStartGlobal = +offsetstartUpload;
      offsetEndGlobal = +offsetendUpload;
    }
  }
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
    // pp a
    // ppNodeUrl: 'http://13.115.18.9',
    // ppNodePort: '8137',
    //
    // pp b
    ppNodeUrl: 'http://54.185.84.33',
    ppNodePort: '8148',

    // ppNodeUrl: 'http://localhost',
    // ppNodePort: '8080',
  });

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);
  const serialized = masterKeySeedInfo.encryptedWalletInfo;

  const _cosmosClient = await getCosmos(serialized, password);

  const filename = 'file1_30M_dec_6';

  // request and upload
  // await testIt(filename);

  await testRequestUserFileList();

  // await testReadAndWriteLocal(filename);

  // await getBalanceCardMetrics();

  // await mainSdsPrepay();

  // await testUploadRequest();

  // await testRequestUsetFileList();
  //
  // 100000000 100 M
  //   3500000 3.5 M
  // await testRequestData();
  // cosmosWalletCreateTest();
  // testFile();
  // testFileHash();

  // await runFaucet();
  // uploadRequest();

  // testBigInt();
};

main();
