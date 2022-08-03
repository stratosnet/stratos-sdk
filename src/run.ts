import { SigningStargateClient } from '@cosmjs/stargate';
import dotenv from 'dotenv';
import fs from 'fs';
// import keccak256 from 'keccak256';
// import md5File from 'md5-file';
import multihashing from 'multihashing-async';
import path from 'path';
// import { Keccak } from 'sha3';
import * as accounts from './accounts';
import { mnemonic } from './hdVault';
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

// import md5 from 'blueimp-md5';

import crypto from 'crypto';
// import multihash from 'multihashes';

import CID from 'cids';

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
  restUrl: 'https://rest-test.thestratos.org',
  rpcUrl: 'https://rpc-test.thestratos.org',
  chainId: 'test-chain-1',
  explorerUrl: 'https://explorer-test.thestratos.org',
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

const getAvailableBalance = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  console.log('keyPairZero', keyPairZero.address);

  const address = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
  const bResult = await Network.getAvailableBalance(address);

  const { response } = bResult;

  console.log('our available balanace', response?.result);
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

const getBalanceCardMetrics = async () => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(2, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  // console.log('keyPairZero', keyPairZero);

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

const getStandardFee = () => {
  const fee = transactions.getStandardFee(3);
  const sendTx = transactions.getSendTx;

  console.log('fee', fee);
};

const runFaucet = async () => {
  const walletAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
  const faucetUrl = 'https://faucet-test.thestratos.org/faucet';

  const result = await accounts.increaseBalance(walletAddress, faucetUrl);
  console.log('faucet result', result);
};

const getChainId = async () => {
  const chain = await Network.getChainId();

  console.log('status result!!', chain);
};

const getTxHistoryN = async () => {
  const zeroAddress = 'st1trlky7dx25er4p85waycqel6lxjnl0qunc7hpt';

  const type = transactionTypes.HistoryTxType.Delegate;
  const txType = transactionTypes.BlockChainTxMsgTypesMap.get(type) || '';
  console.log('🚀 ~ file: run.ts ~ line 558 ~ getTxHistory ~ txType !', txType);

  const result = await Network.getTxListBlockchain(zeroAddress, '', 1);

  console.log('status result!!', result);

  const { response } = result;

  if (!response) {
    return 'aaa!!!';
  }
  const { txs } = response;

  const fTx = txs[0];

  return false;
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
  // const accountsData = await Network.getAccountsData(address);
  // console.log('🚀 ~ file: run.ts ~ line 501 ~ cosmosWalletCreateTest ~ accountsData', accountsData);

  // Old way
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password);
  console.log('🚀 ~ file: run.ts ~ line 512 ~ cosmosWalletCreateTest ~ masterKeySeedInfo', masterKeySeedInfo);

  const { encryptedMasterKeySeed } = masterKeySeedInfo;
  const encryptedMasterKeySeedString = encryptedMasterKeySeed.toString();
  const derivedMasterKeySeed = await keyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeedString);
  console.log(
    '🚀 ~ file: run.ts ~ line 517 ~ cosmosWalletCreateTest ~ derivedMasterKeySeed',
    derivedMasterKeySeed,
  );
  // console.log(
  //   '🚀 ~ file: run.ts ~ line 633 ~ cosmosWalletCreateTest ~ masterKeySeedInfo created',
  //   masterKeySeedInfo,
  // );

  // const keyPairZeroA = await deriveKeyPair(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
  // console.log('keyPairZeroA from crearted masterKeySeedInfo', keyPairZeroA);

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

  // if (!derivedMasterKeySeed) {
  //   return;
  // }

  // const masterKeySeedInfoTwo = await createMasterKeySeedFromGivenSeed(derivedMasterKeySeed, password);

  // const keyPairZeroB = await deriveKeyPair(
  //   0,
  //   password,
  //   masterKeySeedInfoTwo.encryptedMasterKeySeed.toString(),
  // );
  // console.log('keyPairZeroB from descripted and restored masterKeySeedInfoTwo', keyPairZeroB);

  // console.log(
  //   '🚀 ~ file: run.ts ~ line 651 ~ cosmosWalletCreateTest ~ masterKeySeedInfoTwo restored',
  //   masterKeySeedInfoTwo,
  // );

  // const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);
  // console.log('keyPairZero from new wallet seed', keyPairZero);

  // const serialized = masterKeySeedInfo.encryptedWalletInfo;
  // console.log('🚀 ~ file: run.ts ~ line 652 ~ cosmosWalletCreateTest ~ serialized', serialized);

  // const serializedOne = await walletOne.serialize(password);
  // console.log('🚀 ~ file: run.ts ~ line 546 ~ cosmosWalletCreateTest ~ serializedOne', serializedOne);

  // const [firstAccount] = await wallet.getAccounts();
  // console.log('🚀 ~ file: run.ts ~ line 632 ~ cosmosWalletCreateTest ~ firstAccount', firstAccount);
  // const [firstAccountOne] = await walletOne.getAccounts();
  // console.log('🚀 ~ file: run.ts ~ line 548 ~ cosmosWalletCreateTest ~ firstAccountOne', firstAccountOne);

  // const deserializedWallet = await deserializeEncryptedWallet(serialized, password);
  // console.log(
  // '🚀 ~ file: run.ts ~ line 554 ~ cosmosWalletCreateTest ~ deserializedWallet',
  // JSON.stringify(await deserializedWallet.getAccounts(), null, 2),
  // );
  // const deserializedWalletOne = await deserializeEncryptedWallet(serializedOne, password);
  // console.log(
  //   '🚀 ~ file: run.ts ~ line 556 ~ cosmosWalletCreateTest ~ deserializedWalletOne',
  //   JSON.stringify(await deserializedWalletOne.getAccounts(), null, 2),
  // );

  // const [firstAccountRestored] = await deserializedWallet.getAccounts();

  // console.log(
  //   '🚀 ~ file: run.ts ~ line 656 ~ cosmosWalletCreateTest ~ firstAccountRestored',
  //   firstAccountRestored,
  // );

  // const rpcEndpoint = Sdk.environment.rpcUrl;

  // const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, deserializedWallet);

  // const recipient = 'st1trlky7dx25er4p85waycqel6lxjnl0qunc7hpt';

  // const sendAmount = 2;

  // const sendTxMessages = await transactions.getSendTx(firstAccount.address, [
  //   { amount: sendAmount, toAddress: recipient },
  //   { amount: sendAmount + 1, toAddress: recipient },
  // ]);

  // console.log(
  //   '🚀 ~ file: run.ts ~ line 592 ~ cosmosWalletCreateTest ~ sendTxMessages',
  //   JSON.stringify(sendTxMessages, null, 2),
  // );

  // const signedTx = await transactions.sign(firstAccount.address, sendTxMessages);
  // console.log('🚀 ~ file: run.ts ~ line 595 ~ cosmosWalletCreateTest ~ signedTx', signedTx);

  // const result = await transactions.broadcast(signedTx);

  // console.log('🚀 ~ file: run.ts ~ line 598 ~ cosmosWalletCreateTest ~ result!', result);
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
//   const stream = fs.createReadStream(path);
//   for await (const chunk of stream) {
//     await handler(chunk);
//   }
// }

async function processChunk(chunk: any) {
  console.log('process chunk...');

  await delay(2000);

  console.log('process chunk... done');

  const base64data = chunk.toString('base64');

  return base64data;
}

async function wait(fn: any, ms: number) {
  while (!fn()) {
    await delay(ms);
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processFileByChunk(filePath: string, chunkSize = 10000) {
  let foo: Buffer[] = [];
  try {
    const fileStream = fs.createReadStream(filePath);
    const stats = fs.statSync(filePath);

    foo = await new Promise((resolve, reject) => {
      let bytesRead = 0;
      const result: Buffer[] = [];

      fileStream.on('readable', async function () {
        /* eslint-disable-next-line no-constant-condition */
        while (true) {
          // await wait(() => countCurrentUploads <= 0, 10000);

          const chunk = fileStream.read(chunkSize);

          if (!chunk || !chunk.length) {
            break;
          }

          bytesRead += chunk.length;

          result.push(chunk);
        }

        if (bytesRead >= stats.size) {
          resolve(result);
        }
      });
      fileStream.on('error', function (error) {
        reject(error);
      });
    });
  } catch (error) {
    console.log(error);
  }
  return foo;
}

const testFile = async () => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const fileReadPath = path.resolve(SRC_ROOT, 'my_image.png');
  const fileWritePath = path.resolve(SRC_ROOT, 'my_image_new.png');
  console.log('🚀 ~ file: run.ts ~ line 631 ~ testFile ~ fileReadPath', fileReadPath);

  let buff = fs.readFileSync(fileReadPath);
  let base64dataOriginal = buff.toString('base64');

  const chunksOfBuffers = await processFileByChunk(fileReadPath);
  const fullBuf = Buffer.concat(chunksOfBuffers);
  const base64dataFullBuf = fullBuf.toString('base64');

  const chunksOfBase64Promises = chunksOfBuffers.map(async chunk => {
    const pp = await processChunk(chunk);
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
  const buffWrite = Buffer.from(base64dataFullBuf, 'base64'); // ok 3
  // const buffWrite = buffWriteT; // ok 4
  // const buffWrite = Buffer.from(base64data, 'base64'); // ok 5

  fs.writeFileSync(fileWritePath, buffWrite);
};

const calcFileHash = async (fileBuffer: Buffer) => {
  const md5Digest = crypto.createHash('md5').update(fileBuffer).digest();
  console.log(
    '🚀 ~ file: run.ts ~ line 823 ~ calcFileHash2 ~ md5Digest in string',
    md5Digest.toString('hex'),
  );

  console.log('🚀 ~ file: run.ts ~ line 807 ~ calcFileHash2 ~ md5Digest (buffer in hex)', md5Digest);

  const data = new Uint8Array(md5Digest);
  console.log('🚀 ~ file: run.ts ~ line 831 ~ calcFileHash2 ~ data (in dec, matching w go, 16 bites)', data);

  const ecodedHash = await multihashing(md5Digest, 'keccak-256');

  console.log('🚀 ~ file: run.ts ~ line 811 ~ calcFileHash2 ~ ecodedHash (flieHash in go)', ecodedHash);

  const cid = new CID(1, 'raw', ecodedHash, 'base32hex');

  console.log('🚀 ~ file: run.ts ~ line 813 ~ calcFileHash2 ~ cid', cid);

  const realFileHash = cid.toString();

  // old
  // const ecodedHash2 = await multihash.encode(md5Digest, 'keccak-256');
  // console.log(
  //   '🚀 ~ file: run.ts ~ line 845 ~ calcFileHash2 ~ ecodedHash2 (thats where it is fucked. it looks like data, but prepended with 27 and 16)',
  //   ecodedHash2,
  // );

  // const cid2 = new CID(1, 'raw', ecodedHash2, 'base32hex');

  // const realFileHash2 = cid2.toString();
  // console.log('🚀 ~ file: run.ts ~ line 853 ~ calcFileHash2 ~ fucked realFileHash2', realFileHash2);
  //

  return realFileHash;
};

const calcFileHash3 = async (fileHash: string) => {
  const a = Buffer.from(fileHash);
  console.log('🚀 ~ file: run.ts ~ line 808 ~ calcFileHash3 ~ a', a);
  const ecodedHash = await multihashing(a, 'keccak-256', 20);
  console.log('🚀 ~ file: run.ts ~ line 809 ~ calcFileHash3 ~ ecodedHash', ecodedHash);

  const cid = new CID(1, 'raw', ecodedHash, 'base32hex');

  console.log('🚀 ~ file: run.ts ~ line 813 ~ calcFileHash2 ~ cid', cid);

  const realFileHash = cid.toString();

  return realFileHash;
};

// working file hash
const calcFileHash2 = async (fileBuffer: Buffer) => {
  const md5Digest = crypto.createHash('md5').update(fileBuffer).digest();

  console.log(
    '🚀 ~ file: run.ts ~ line 823 ~ calcFileHash2 ~ md5Digest in string',
    md5Digest.toString('hex'),
  );

  console.log('🚀 ~ file: run.ts ~ line 807 ~ calcFileHash2 ~ md5Digest (buffer in hex)', md5Digest);

  // const data = new Uint8Array(md5Digest);
  // console.log('🚀 ~ file: run.ts ~ line 831 ~ calcFileHash2 ~ data (in dec, matching w go, 16 bites)', data);

  const ecodedHash = await multihashing(md5Digest, 'keccak-256', 20);

  console.log('🚀 ~ file: run.ts ~ line 811 ~ calcFileHash2 ~ ecodedHash (flieHash in go)', ecodedHash);

  const cid = new CID(1, 'raw', ecodedHash, 'base32hex');

  console.log('🚀 ~ file: run.ts ~ line 813 ~ calcFileHash2 ~ cid', cid);

  const realFileHash = cid.toString();

  return realFileHash;
};

const testB = async () => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const expectedHash = 'v05ahm57soq8erhnhv70m8pek9rprtu8v0d9g3mg';
  const fileReadPath = path.resolve(SRC_ROOT, 'my_test_read.t');

  const fileBuffer = fs.readFileSync(fileReadPath);

  const realFileHash2 = await calcFileHash2(fileBuffer);

  console.log('🚀 ~  ~ realFileHash2', realFileHash2);
  console.log('🚀 ~   ~ expectedHash', expectedHash);
};

const testIt = async () => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  // const expectedHash = 'v05ahm57soq8erhnhv70m8pek9rprtu8v0d9g3mg';
  // const fileReadPath = path.resolve(SRC_ROOT, 'my_test_read.t');
  const fileReadPath = path.resolve(SRC_ROOT, 'my_image.png');

  const realHash = await FilesystemService.calculateFileHash(fileReadPath);

  // console.log('expected:', expectedHash);
  // console.log('real:', realHash);

  //  const fileWritePath = path.resolve(SRC_ROOT, 'my_image_new2.png');

  // const encodedFileChunks = await FilesystemService.getEncodedFileChunks(fileReadPath);

  //console.log('encoded file chunks', encodedFileChunks);
  //  const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);
  //const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
  // const encodedFile = await FilesystemService.encodeFile(decodedFile);
  //   FilesystemService.writeFileToPath(fileWritePath, encodedFile);

  const extraParams = {
    filename: 't9.t',
    filesize: 68,
    filehash: 'v05ahm57soq8erhnhv70m8pek9rprtu8v0d9g3mg',
    walletaddr: 'st1macvxhdy33kphmwv7kvvk28hpg0xn7nums5klu',
    walletpubkey: 'stpub1',
  };

  const callResult = await Network.sendUserRequestUpload(extraParams);

  const { response } = callResult;

  if (!response) {
    return;
  }

  const {
    result: { offsetend, offsetstart, return: isContinue },
  } = response;

  const chunkSize = offsetstart!;

  const encodedFileChunks = await FilesystemService.getEncodedFileChunks(fileReadPath);

  const pCalls = encodedFileChunks.map(async currentChunk => {
    const extraParamsUpload = {
      filehash: 'v05ahm57soq8erhnhv70m8pek9rprtu8v0d9g3mg',
      data: currentChunk,
    };

    const callTwoResult = await Network.sendUserUploadData(extraParamsUpload);

    console.log('🚀 ~ file: run.ts ~ line 889 ~ testIt ~ result', callTwoResult);
  });

  const res = await Promise.all(pCalls);
  console.log('🚀 ~ file: run.ts ~ line 891 ~ testIt ~ res', res);
};

const main = async () => {
  let resolvedChainID;

  // // const sdkEnv = sdkEnvTest;
  const sdkEnv = sdkEnvDev;

  await Sdk.init({ ...sdkEnv });

  try {
    resolvedChainID = await Network.getChainId();
  } catch (error) {
    console.log('🚀 ~ file: 494 ~ init ~ resolvedChainID error', error);
    throw new Error('Could not resolve chain id');
  }

  if (!resolvedChainID) {
    throw new Error('Chain id is empty. Exiting');
  }

  await Sdk.init({ ...sdkEnv, chainId: resolvedChainID });

  // const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  // const masterKeySeedInfo = await createMasterKeySeed(phrase, password);
  // const serialized = masterKeySeedInfo.encryptedWalletInfo;
  // const serialized = await getSerializedWalletFromPhrase(zeroUserMnemonic, password);

  // we have to initialize a client prior to use cosmos
  // const _cosmosClient = await getCosmos(serialized, password);

  // cosmosWalletCreateTest();
  // testAccountData();
  // mainSend();
  // mainDelegate();
  // mainUndelegate();
  // mainWithdrawRewards();
  // mainWithdrawAllRewards();
  // mainSdsPrepay();
  // mainFour();

  //   mainBalance();
  // testFile();
  // testB();
  // testIt();
  getTxHistory();
};

main();
