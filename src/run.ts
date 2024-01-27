import { fromBase64, fromHex, toAscii, toBase64, toBech32, toHex } from '@cosmjs/encoding';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import * as accounts from './accounts';
import { hdVault, tokens, options } from './config';
import { mnemonic, wallet } from './hdVault';
import { deserializeWithEncryptionKey, serializeWithEncryptionKey } from './hdVault/cosmosUtils';
import * as cosmosWallet from './hdVault/cosmosWallet';
import { createMasterKeySeed, getSerializedWalletFromPhrase } from './hdVault/keyManager';
import * as keyUtils from './hdVault/keyUtils';
import { deriveKeyPair, deserializeEncryptedWallet } from './hdVault/wallet';
import Sdk from './Sdk';
import * as RemoteFilesystem from './sds/remoteFile';
import { getCosmos, resetCosmos } from './services/cosmos';
import * as FilesystemService from './services/filesystem';
import { delay, dirLog, getTimestampInSeconds, log } from './services/helpers';
import * as Network from './services/network';
import * as NetworkTypes from './services/network/types';
import * as integration from './testing/integration/sdk_inegration_runner';
import * as transactions from './transactions';
import * as evm from './transactions/evm';
import * as transactionTypes from './transactions/types';
import * as validators from './validators';

dotenv.config();

const password = 'XXXX';

// that is the mnemonic from the .env file
const { ZERO_MNEMONIC: zeroUserMnemonic = '' } = process.env;

const sdkEnvDev = {
  restUrl: 'https://rest-dev.thestratos.org',
  rpcUrl: 'https://rpc-dev.thestratos.org',
  chainId: 'dev-0',
  explorerUrl: 'https://explorer-dev.thestratos.org',
  faucetUrl: 'https://faucet-dev.thestratos.org/credit',
};

const sdkEnvTest = {
  key: 'testnet',
  name: 'Mesos',
  restUrl: 'https://rest-mesos.thestratos.org',
  rpcUrl: 'https://rpc-mesos.thestratos.org',
  chainId: 'stratos-testnet-2',
  explorerUrl: 'https://big-dipper-mesos.thestratos.org',
  faucetUrl: 'https://faucet-mesos.thestratos.org/credit',
};

const sdkEnvMainNet = {
  key: 'mainnet',
  name: 'Mainnet',
  stratosFaucetDenom: 'stos',
  restUrl: 'https://rest.thestratos.org',
  rpcUrl: 'https://rpc.thestratos.org',
  chainId: 'stratos-1',
  explorerUrl: 'https://big-dipper.thestratos.org',
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
    chainId: '2047',
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
  // console.log('phrase', phrase);

  const mnemonicToUse = givenReceiverMnemonic ? givenReceiverMnemonic : zeroUserMnemonic;
  // console.log('mnemonicToUse', mnemonicToUse);

  const receiverPhrase = mnemonic.convertStringToArray(mnemonicToUse);

  // console.log('receiverPhrase', receiverPhrase);

  const keyPairZero = await createKeypairFromMnemonic(phrase, hdPathIndex);
  const keyPairOne = await createKeypairFromMnemonic(receiverPhrase, hdPathIndexReceiver);
  // const keyPairTwo = await createKeypairFromMnemonic(receiverPhrase, 2);

  const fromAddress = keyPairZero.address;

  const sendAmount = 0.04;

  const sendTxMessages = await transactions.getSendTx(fromAddress, [
    { amount: sendAmount, toAddress: keyPairOne.address },
    // { amount: sendAmount + 1, toAddress: keyPairTwo.address },
  ]);

  // TxRaw
  const signedTx = await transactions.sign(fromAddress, sendTxMessages);
  // dirLog('signedTx run', signedTx);

  // Tx with sibstituted message
  const decodedToTest = await transactions.decodeTxRawToTxHr(signedTx);
  // dirLog('decodedToTest', decodedToTest);

  // Tx with substituted as a string
  const decodedInString = JSON.stringify(decodedToTest, null, 2);
  // Tx with substituted as a string parsed back to decodedToTest
  const decodeReAssembled = JSON.parse(decodedInString);

  // Pure Tx (so value , signature and auth are bytes)
  const encodedToTest = await transactions.encodeTxHrToTx(decodeReAssembled);
  // const encodedToTest = await transactions.encodeTxHrToTx(decodedToTest);

  // dirLog('encodedToTest', encodedToTest);

  const assembled = transactions.assembleTxRawFromTx(encodedToTest);

  // if (signedTx) {
  if (assembled) {
    try {
      const result = await transactions.broadcast(assembled);
      console.log('broadcasting result!', result);
    } catch (error) {
      const err: Error = error as Error;
      console.log('error broadcasting', err.message);
    }
  }
};

// cosmosjs delegate
const mainDelegate = async (
  hdPathIndex: number,
  givenMnemonic: string,
  validatorAddressToDelegate: string,
  amount: number,
) => {
  // const validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';
  const validatorAddress = validatorAddressToDelegate;

  const phrase = mnemonic.convertStringToArray(givenMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const delegatorAddress = keyPairZero.address;
  console.log('🚀 ~ file: run.ts ~ line 138 ~ mainDelegate ~ delegatorAddress', delegatorAddress);

  const sendTxMessages = await transactions.getDelegateTx(delegatorAddress, [
    { amount, validatorAddress },
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

// cosmosjs redelegate
const mainReDelegate = async (
  hdPathIndex: number,
  givenMnemonic: string,
  validatorAddressDelegateFrom: string,
  validatorAddressDelegateTo: string,
  amount: number,
) => {
  // const validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';
  const phrase = mnemonic.convertStringToArray(givenMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const delegatorAddress = keyPairZero.address;
  console.log('🚀 ~ mainRedelegate ~ delegatorAddress', delegatorAddress);

  const sendTxMessages = await transactions.getBeginRedelegateTx(delegatorAddress, [
    {
      amount,
      validatorSrcAddress: validatorAddressDelegateFrom,
      validatorDstAddress: validatorAddressDelegateTo,
    },
    // {
    //   amount: 3,
    //   validatorSrcAddress: 'stvaloper1dnt7mjfxskza094cwjvt70707ts2lc2hv9zrkh',
    //   validatorDstAddress: validatorAddressDelegateTo,
    // },
  ]);

  console.log('sendTxMessages ', sendTxMessages);

  const signedTx = await transactions.sign(delegatorAddress, sendTxMessages);

  if (signedTx) {
    try {
      const result = await transactions.broadcast(signedTx);
      console.log('redelegate broadcasting result!!! :)', result);
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

  const sendTxMessages = await transactions.getSdsPrepayTx(keyPairZero.address, [{ amount: 10 }]);

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
  // const zeroAddress = 'st19nn9fnlzkpm3hah3pstz0wq496cehclpru8m3u';
  // const zeroAddress = 'st1ztngz8zmdl3tzz9xjf86tjtvkup0tc04q5h6vm';
  const zeroAddress = 'st1ev0mv8wl0pqdn99wq5zkldxl527jv9y92ugz7g';
  const r1 = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.All, 1, 2);
  // const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Transfer, 1);
  // const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Delegate, 1);
  // const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Undelegate, 1);
  // const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.GetReward, 1);
  // dirLog('r', r?.data[0]?.txMessages);
  // dirLog('r1.d',r1);
  const a = r1.data.map(element => element.txMessages);
  dirLog('a', a);

  // const r = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.SdsPrepay, 1);
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

const getOzoneBalance = async (hdPathIndex: number, givenMnemonic: string) => {
  const phrase = mnemonic.convertStringToArray(givenMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(0, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const b = await accounts.getOtherBalanceCardMetrics(keyPairZero.address);

  console.log(' new other balanace card metrics ', b);
};

const getBalanceCardMetrics = async (hdPathIndex: number, givenMnemonic: string) => {
  const phrase = mnemonic.convertStringToArray(givenMnemonic);
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

const runFaucet = async (hdPathIndex: number, givenMnemonic: string) => {
  const phrase = mnemonic.convertStringToArray(givenMnemonic);
  const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);

  const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
  const keyPairZero = await deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedString);

  if (!keyPairZero) {
    return;
  }

  const walletAddress = keyPairZero.address;
  console.log('walletAddress', walletAddress);

  // const faucetUrl = 'https://faucet-dev.thestratos.org/credit';
  const faucetUrl = Sdk.environment.faucetUrl || '';
  log(`will be useing faucetUrl - "${faucetUrl}"`);

  const result = await accounts.increaseBalance(walletAddress, faucetUrl, hdVault.stratosTopDenom);
  console.log('faucet result', result);
};

const getTxHistory = async (userMnemonic: string, hdPathIndex: number) => {
  const wallet = await keyUtils.createWalletAtPath(hdPathIndex, userMnemonic);

  console.log('running getTxHistory');
  const [firstAccount] = await wallet.getAccounts();

  const zeroAddress = firstAccount.address;

  const pageNumber = 1;
  const pageLimit = 100;

  const result = await accounts.getAccountTrasactions(
    zeroAddress,
    transactionTypes.HistoryTxType.All,
    pageNumber,
    pageLimit,
    NetworkTypes.TxHistoryUser.TxHistoryReceiverUser,
    // NetworkTypes.TxHistoryUser.TxHistorySenderUser,
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

  // const { address } = keyPairZeroA;

  const userFileList = await RemoteFilesystem.getSharedFileList(keyPairZeroA, page);

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
  // const { address } = keyPairZeroA;

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

  // const { address , publicKey } = keyPairZeroA;

  // const page = 4;
  const userFileList = await RemoteFilesystem.getUploadedFileList(keyPairZeroA, page);

  console.log('retrieved user file list', userFileList);
};

// read local file and write a new one
// 33 sec for 1gb, 1m 1sec for 2 gb
const testReadAndWriteLocal = async (filename: string) => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = filename;
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

  log('fileInfo', fileInfo);

  let readSize = 0;

  const stats = fs.statSync(fileReadPath);
  const fileSize = stats.size;

  log('stats', stats);

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

    log(
      `completed ${readSize} from ${fileSize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(
        2,
      )}%`,
    );
    offsetStart = offsetEnd;
    offsetEnd = offsetEnd + step;
    encodedFileChunks.push(encodedFileChunk);
  }

  const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);

  const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
  const fileWritePathFromBuff = path.resolve(SRC_ROOT, `my_new_from_decoded_${filename}`);
  FilesystemService.writeFile(fileWritePathFromBuff, decodedFile);
  log('write of the decoded file is done');

  // const fileWritePath = path.resolve(SRC_ROOT, `my_new_encoded_from_decoded_${filename}`);
  // const encodedFile = await FilesystemService.encodeFile(decodedFile);
  // await FilesystemService.writeFileToPath(fileWritePath, encodedFile);
  // log('writeFileToPath of the encodedFile from decoded file is done');
};

// read local file and write a new one (multiple IO)
// 51 sec for 1gb, 1m 38sec for 2gb
const testReadAndWriteLocalMultipleIo = async (filename: string) => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const imageFileName = filename;
  const fileReadPath = path.resolve(SRC_ROOT, imageFileName);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

  log('fileInfo', fileInfo);

  const fileStream = await FilesystemService.getLocalFileReadStream(fileReadPath);

  let readSize = 0;

  const stats = fs.statSync(fileReadPath);
  const fileSize = stats.size;

  log('stats', stats);

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

        await delay(1);
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

      log(
        `completed ${readSize} from ${fileSize} bytes, or ${(
          Math.round(completedProgress * 100) / 100
        ).toFixed(2)}%`,
      );
      offsetStart = offsetEnd;
      offsetEnd = offsetEnd + step;
      encodedFileChunks.push(encodedFileChunk);
    }
  }

  // console.log('fileWritePath ', fileWritePath);

  // console.log('encoded file chunks length', encodedFileChunks.length);

  const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);

  const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
  const fileWritePathFromBuff = path.resolve(SRC_ROOT, `my_new_from_decoded_io_${filename}`);
  FilesystemService.writeFile(fileWritePathFromBuff, decodedFile);
  log('write of the decoded file is done');

  // const fileWritePath = path.resolve(SRC_ROOT, `my_new_encoded_from_decoded_io_${filename}`);
  // const encodedFile = await FilesystemService.encodeFile(decodedFile);
  // await FilesystemService.writeFileToPath(fileWritePath, encodedFile);
  // log('writeFileToPath of the encodedFile from decoded file is done');
};

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

const testFileHash = async (filename: string, hdPathIndex: number) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);

  const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);

  const keypair = await deriveKeyPair(hdPathIndex, password, masterKeySeed.encryptedMasterKeySeed.toString());

  if (!keypair) {
    return;
  }

  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const fileReadPath = path.resolve(SRC_ROOT, filename);

  // await RemoteFilesystem.updloadFile(keypair, fileReadPath);

  const oldFileHash = await FilesystemService.calculateFileHashOld(fileReadPath);
  const newFileHash = await FilesystemService.calculateFileHash(fileReadPath);

  console.log('oldFileHash', oldFileHash);
  console.log('newFileHash', newFileHash);
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

const testAddressConverstion = async (hdPathIndex: number) => {
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);

  const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);

  const keypair = await deriveKeyPair(hdPathIndex, password, masterKeySeed.encryptedMasterKeySeed.toString());

  if (!keypair) {
    return;
  }

  const { address } = keypair;
  log('address to convert ', address);

  const evmAddress = keyUtils.convertNativeToEvmAddress(address);
  log('converted evmAddress', evmAddress);

  const nativeAddress = keyUtils.convertEvmToNativeToAddress(evmAddress);

  log('converted nativeAddress', nativeAddress);
};

const main = async () => {
  let resolvedChainID: string;
  let resolvedChainVersion: string;
  let isNewProtocol = false;

  const sdkEnv = sdkEnvDev;

  // that is the mesos config
  // const sdkEnv = sdkEnvTest;

  // const sdkEnv = sdkEnvMainNet;

  Sdk.init({ ...sdkEnv });

  try {
    const resolvedChainIDToTest = await Network.getChainId();

    if (!resolvedChainIDToTest) {
      throw new Error('Chain id is empty. Exiting');
    }

    resolvedChainID = resolvedChainIDToTest;

    const resolvedChainVersionToTest = await Network.getNodeProtocolVersion();

    if (!resolvedChainVersionToTest) {
      throw new Error('Protocol version id is empty. Exiting');
    }

    resolvedChainVersion = resolvedChainVersionToTest;

    console.log('🚀 ~ file: run.ts ~ line 817 ~ main ~ resolvedChainIDToTest', resolvedChainIDToTest);
    console.log(
      '🚀 ~ file: run.ts ~ line 817 ~ main ~ resolvedChainVersionToTest',
      resolvedChainVersionToTest,
    );

    const { MIN_NEW_PROTOCOL_VERSION } = options;

    isNewProtocol = Sdk.getNewProtocolFlag(resolvedChainVersion, MIN_NEW_PROTOCOL_VERSION);
  } catch (error) {
    console.log('🚀 ~ file: 494 ~ init ~ resolvedChainID error', error);
    throw new Error('Could not resolve chain id');
  }

  // 2
  Sdk.init({
    ...sdkEnv,
    chainId: resolvedChainID,
    nodeProtocolVersion: resolvedChainVersion,
    isNewProtocol,
    // devnet
    ppNodeUrl: 'http://35.187.47.46',
    ppNodePort: '8142',

    // ppNodeUrl: 'http://35.233.85.255',
    // ppNodePort: '8142',

    // mesos - we connect to mesos pp
    // ppNodeUrl: 'http://34.78.29.120',
    // ppNodePort: '8142',
  });

  console.log('sdkEnv', Sdk.environment);

  // tropos
  // ppNodeUrl: 'http://35.233.251.112',
  //     ppNodePort: '8159',

  // await evmSend();

  const hdPathIndex = 0;

  const testMnemonic =
    'gossip magic please parade album ceiling cereal jealous common chimney cushion bounce bridge saddle elegant laptop across exhaust wasp garlic high flash near dad';

  // here is that mnemonic
  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  // const phrase = mnemonic.convertStringToArray(testMnemonic);

  const masterKeySeedInfo = await createMasterKeySeed(phrase, password, hdPathIndex);

  const serialized = masterKeySeedInfo.encryptedWalletInfo;

  const _cosmosClient = await getCosmos(serialized, password);

  // 1a
  // await testRequestUserFileList(0, hdPathIndex);

  // 2a - that is the file name - it has to be in ./src
  // const filename = 'text_test.txt';
  const filename = 'file1G_Jan_9_v1';

  // await testItFileUp(filename, hdPathIndex);

  // await testFileHash(filename, hdPathIndex);

  // 3a
  // const filename = 'file10_test_1689623710986';
  // const filehash = 'v05ahm504fq2q53pucu87do4cdcurggsoonhsmfo';
  // await testFileDl(hdPathIndex, filename, filehash);

  // 4a
  // await testRequestUserSharedFileList(0, hdPathIndex);

  // 5a
  // const filehash = 'v05ahm504fq2q53pucu87do4cdcurggsoonhsmfo';
  // await testRequestUserFileShare(filehash, hdPathIndex);

  // 6a
  // const shareid= '0755919d9815ea92';
  // await testRequestUserStopFileShare(shareid, hdPathIndex);

  // 7a
  // const sharelink = 'VkAHq3_0755919d9815ea92';
  // await testRequestUserDownloadSharedFile(hdPathIndex, sharelink);

  // 1 Check balance
  // st1ev0mv8wl0pqdn99wq5zkldxl527jv9y92ugz7g
  await getBalanceCardMetrics(hdPathIndex, zeroUserMnemonic);

  // await getAccountTrasactions();

  // const faucetMnemonic =
  //   'gossip magic please parade album ceiling cereal jealous common chimney cushion bounce bridge saddle elegant laptop across exhaust wasp garlic high flash near dad';
  //
  // await getBalanceCardMetrics(hdPathIndex, faucetMnemonic);

  // 2 Add funds via faucet
  // await runFaucet(hdPathIndex, zeroUserMnemonic);
  // await runFaucet(hdPathIndex, testMnemonic);

  // await mainSdsPrepay(hdPathIndex, zeroUserMnemonic);
  // await getOzoneBalance(hdPathIndex, zeroUserMnemonic);

  // await mainSdsPrepay(hdPathIndex, testMnemonic);
  // await getOzoneBalance(hdPathIndex, testMnemonic);

  // const receiverPhrase = mnemonic.generateMnemonicPhrase(24);
  // const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  // const receiverMnemonic = zeroUserMnemonic;

  // stvaloper1ql2uj69zf8xvrtfyj6pzehh8xhd2dt8enefsep: '21.9600 STOS',
  // stvaloper1zy9qal508nvc9h0xqmyz500mkuxhteu7wn4sgp: '2,097.6794 STOS',
  // stvaloper1dnt7mjfxskza094cwjvt70707ts2lc2hv9zrkh: '1,024.0000 STOS'
  // const validatorSrcAddress = 'stvaloper1dnt7mjfxskza094cwjvt70707ts2lc2hv9zrkh';
  // const validatorDstAddress = 'stvaloper1zy9qal508nvc9h0xqmyz500mkuxhteu7wn4sgp';
  // const redelegateAmount = 5;

  // await mainReDelegate(0, zeroUserMnemonic, validatorSrcAddress, validatorDstAddress, redelegateAmount);
  // const hdPathIndexReceiver = 1;

  // await mainSend(hdPathIndex, receiverMnemonic, hdPathIndexReceiver);

  // const vAddress = 'stvaloper1dnt7mjfxskza094cwjvt70707ts2lc2hv9zrkh';
  // await mainDelegate(hdPathIndex, zeroUserMnemonic, vAddress, 1000);

  // 33 sec, 1m 1sec
  // testReadAndWriteLocal(filename);
  // 51 sec, 1m 38sec
  // testReadAndWriteLocalMultipleIo(filename);

  // const randomPrefix = Date.now() + '';
  // const rr = await integration.uploadFileToRemote(filename, randomPrefix, 0, zeroUserMnemonic);
  const mainnetDev =
    'group sustain bracket dinner wrong forest dash honey farm bitter planet swift suspect radar reveal loyal boring renew edge fetch unlock path rule push';
  // await getTxHistory(zeroUserMnemonic, 0);
  // await getTxHistory(mainnetDev, 0);
};

main();
