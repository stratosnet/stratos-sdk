// import { SigningStargateClient } from '@cosmjs/stargate';
import dotenv from 'dotenv';
import fs from 'fs';
// import keccak256 from 'keccak256';
// import md5File from 'md5-file';
// import multihashing from 'multihashing-async';
import path from 'path';
// import { Keccak } from 'sha3';
// import * as bigInteger from 'big-integer';
// import * as BigIntegerM from 'js-big-integer';
import * as accounts from './accounts';
import { mnemonic } from './hdVault';
import { deserializeWithEncryptionKey, serializeWithEncryptionKey } from './hdVault/cosmosUtils';
import { createMasterKeySeed, getSerializedWalletFromPhrase } from './hdVault/keyManager';
import * as keyUtils from './hdVault/keyUtils';
import { deriveKeyPair, deserializeEncryptedWallet } from './hdVault/wallet';
import Sdk from './Sdk';
import { getCosmos } from './services/cosmos';
import * as FilesystemService from './services/filesystem';
import * as Network from './services/network';
import * as transactions from './transactions';
import * as transactionTypes from './transactions/types';
import * as validators from './validators';
// import {
//   DirectSecp256k1HdWallet,
//   DirectSecp256k1Wallet,
//   makeAuthInfoBytes,
//   makeSignDoc,
//   OfflineSigner,
//   Registry,
//   TxBodyEncodeObject,
// } from '@cosmjs/proto-signing';

// import {
//   Bip39,
//   EnglishMnemonic,
//   HdPath,
//   Hmac,
//   ripemd160,
//   Secp256k1,
//   sha256,
//   Sha512,
//   Slip10Curve,
//   Slip10RawIndex,
//   stringToPath,
// } from '@cosmjs/crypto';
import { fromBase64, fromHex, toAscii, toBase64, toBech32, toHex } from '@cosmjs/encoding';
import { hdVault } from './config';

// import md5 from 'blueimp-md5';

// import crypto from 'crypto';
// import multihash from 'multihashes';

// import CID from 'cids';

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

  if (!keyPairZero) {
    return;
  }

  const sendTxMessages = await transactions.getSdsPrepayTx(keyPairZero.address, [{ amount: 30 }]);

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
  const imageFileName = 'file1';
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

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
  // console.log('🚀 ~ file: run.ts ~ line 905 ~ testIt ~ response', JSON.stringify(response, null, 2));

  // now upload itself
  if (!response) {
    return;
  }

  const connectedUrl = `${Sdk.environment.ppNodeUrl}:${Sdk.environment.ppNodePort}`;

  return {
    data: `response from ${connectedUrl}`,
    response,
  };

  // const {
  //   result: { offsetend, offsetstart, return: isContinue },
  // } = response;

  // const chunkSize = offsetstart!;
  // console.log('🚀 ~ file: run.ts ~ line 676 ~ testUploadRequest ~ chunkSize', chunkSize);

  // const encodedFileChunks = await FilesystemService.getEncodedFileChunks(fileReadPath, parseInt(chunkSize));
  // console.log(
  //   '🚀 ~ file: run.ts ~ line 679 ~ testUploadRequest ~ encodedFileChunks',
  //   encodedFileChunks.length,
  // );

  // const pCalls = encodedFileChunks.map(async currentChunk => {
  //   const extraParamsUpload = [
  //     {
  //       filehash: fileInfo.filehash,
  //       data: currentChunk,
  //     },
  //   ];

  //   const chunkUploadResult = await Network.sendUserUploadData(extraParamsUpload);
  //   const { error: chunkUploadError, response: chunkUploadRespons } = chunkUploadResult;
  //   console.log(
  //     '🚀 ~ file: run.ts ~ line 691 ~ pCalls ~ chunkUploadRespons',
  //     JSON.stringify(chunkUploadRespons, null, 2),
  //   );

  //   // console.log('🚀 ~ file: run.ts ~ line 889 ~ testIt ~ result', chunkUploadResult);
  //   if (chunkUploadError) return 'err';
  //   if (chunkUploadRespons) return chunkUploadRespons;
  //   return 'what?';
  // });

  // const res = await Promise.all(pCalls);
  // console.log('🚀 ~ file: run.ts ~ line 891 ~ testIt ~ res', res);
};

const testIt = async () => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = 'stratos_landing_page.png';
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const fileWritePath = path.resolve(SRC_ROOT, 'my_image_new2.png');

  const encodedFileChunks = await FilesystemService.getEncodedFileChunks(fileReadPath);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

  console.log('encoded file chunks', encodedFileChunks);
  const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);
  const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
  const encodedFile = await FilesystemService.encodeFile(decodedFile);
  FilesystemService.writeFileToPath(fileWritePath, encodedFile);

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);
  // console.log('🚀 ~ file: run.ts ~ line 512 ~ cosmosWalletCreateTest ~ masterKeySeedInfo', masterKeySeedInfo);

  const keyPairZeroA = await deriveKeyPair(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
  // console.log('keyPairZeroA from crearted masterKeySeedInfo', keyPairZeroA);

  if (!keyPairZeroA) {
    return;
  }

  const { address, publicKey } = keyPairZeroA;
  const extraParams = [
    {
      filename: imageFileName,
      filesize: fileInfo.size,
      filehash: fileInfo.filehash,
      walletaddr: address,
      walletpubkey: publicKey,
    },
  ];

  const callResult = await Network.sendUserRequestUpload(extraParams);
  // const callResult = await Network.sendUserRequestList(extraParamsFilelist);

  const { response } = callResult;

  // if (!response) {
  //   return;
  // }

  // const {
  //   result: { offsetend, offsetstart, return: isContinue },
  // } = response;

  // const chunkSize = offsetstart!;

  // const encodedFileChunks = await FilesystemService.getEncodedFileChunks(fileReadPath);

  // const pCalls = encodedFileChunks.map(async currentChunk => {
  //   const extraParamsUpload = {
  //     filehash: 'v05ahm57soq8erhnhv70m8pek9rprtu8v0d9g3mg',
  //     data: currentChunk,
  //   };

  //   const callTwoResult = await Network.sendUserUploadData(extraParamsUpload);

  //   console.log('🚀 ~ file: run.ts ~ line 889 ~ testIt ~ result', callTwoResult);
  // });

  // const res = await Promise.all(pCalls);
  // console.log('🚀 ~ file: run.ts ~ line 891 ~ testIt ~ res', res);
};

// const testA = async () => {
//   const extraParams: Network.networkTypes.MonitorSubscribeParams = [
//     'subscription',
//     // '19618fc6b51f0b076fa38db10bbb6bb5b1d9edeaf3271a62d88f0c68c3a5d40d',
//     '442fe1b54cbbee74375ce1d057a31fdf046b95eaa909a90bb664d9b21469be83',
//   ];

//   const callResult = await Network.sendMonitorSubscirbe(extraParams);
//   console.log('🚀 ~ file: run.ts ~ line 794 ~ testA ~ callResult', callResult);
// };

const main = async () => {
  let resolvedChainID: string;

  // const sdkEnv = sdkEnvTest;
  const sdkEnv = sdkEnvDev;

  await Sdk.init({ ...sdkEnv });

  try {
    const resolvedChainIDToTest = await Network.getChainId();

    if (!resolvedChainIDToTest) {
      throw new Error('Chain id is empty. Exiting');
    }
    resolvedChainID = resolvedChainIDToTest;
  } catch (error) {
    console.log('🚀 ~ file: 494 ~ init ~ resolvedChainID error', error);
    throw new Error('Could not resolve chain id');
  }

  // 2
  await Sdk.init({
    ...sdkEnv,
    chainId: resolvedChainID,
    ppNodeUrl: 'http://13.115.18.9',
    ppNodePort: '8145',
  });

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);
  const serialized = masterKeySeedInfo.encryptedWalletInfo;

  const _cosmosClient = await getCosmos(serialized, password);

  // await getOzoneBalance();
  // await mainSdsPrepay();

  // testUploadRequest();

  // cosmosWalletCreateTest();
  // testFile();
  // testFileHash();
  // await mainSdsPrepay();

  await getBalanceCardMetrics();
  // await runFaucet();
  // uploadRequest();

  // testBigInt();
};

main();
// 19,518.6212
