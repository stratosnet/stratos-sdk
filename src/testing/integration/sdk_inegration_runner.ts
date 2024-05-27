import { exit } from 'process';
import { accountsApi } from '../../accounts';
import { cosmosService } from '../../chain/cosmos';
import * as transactions from '../../chain/transactions/transactions';
import { validatorsApi as validators } from '../../chain/validators';
import { mnemonic, wallet } from '../../crypto/hdVault';
import * as WalletTypes from '../../crypto/hdVault/hdVaultTypes';
import { createMasterKeySeed } from '../../crypto/hdVault/keyManager';
import { filesystemApi } from '../../filesystem';
import { networkApi } from '../../network';
import Sdk from '../../Sdk';
import { remoteFileSystemApi } from '../../sds/remoteFileSystem';
import * as transactionsSds from '../../sds/transactions/transactions';
import { delay, dirLog, log } from '../../services/helpers';
import { OZONE_BALANCE_CHECK_WAIT_TIME } from '../config';

/* eslint-disable @typescript-eslint/naming-convention */
interface DetailedDelegationInfo {
  [key: string]: string;
}

type SendDelegateTxDetailedResponse = {
  validatorsToUse: Array<{ validatorAddress: string }>;
  totalDelegated: string;
  detailedBalance: { delegated: DetailedDelegationInfo };
};

type SendDelegateTxResponse = true | SendDelegateTxDetailedResponse;

export const isDetailedDelegateTxResponse = (
  delegateTxResponse: SendDelegateTxResponse,
): delegateTxResponse is SendDelegateTxDetailedResponse => {
  return (
    typeof delegateTxResponse !== 'boolean' &&
    'validatorsToUse' in delegateTxResponse &&
    'totalDelegated' in delegateTxResponse &&
    'detailedBalance' in delegateTxResponse
  );
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getAppRootDir() {
  let currentDir = __dirname;
  while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    currentDir = path.join(currentDir, '..');
    log('currentDir', currentDir);
    if (currentDir === '/') {
      throw new Error(`could not resolve app root path, or package.json is missing in ${currentDir}`);
    }
  }
  return currentDir;
}

function buildPpNodeUrl(givenUrl: string): string[] {
  const ppProtocolPostition = givenUrl.lastIndexOf('://');

  if (!(ppProtocolPostition > 1)) {
    log(`pp node config value must be proved. "${givenUrl}" is not a valid value`);
    log('ppProtocolPostition', ppProtocolPostition);
    exit(1);
  }
  const ppPortPostition = givenUrl.lastIndexOf(':');

  if (ppProtocolPostition === ppPortPostition) {
    return [givenUrl, ''];
  }

  const ppUrl = givenUrl.slice(0, ppPortPostition || givenUrl.length);
  const ppPort = ppPortPostition ? givenUrl.slice(ppPortPostition + 1) : '';

  return [ppUrl, ppPort];
}

async function createLocalTestFile(
  fileReadPath: string,
  fileWritePath: string,
  randomPrefix?: string,
): Promise<boolean> {
  let readSize = 0;

  const stats = fs.statSync(fileReadPath);
  const fileSize = stats.size;

  const step = 5000000;
  let offsetStart = 0;
  let offsetEnd = step;

  const encodedFileChunks = [];

  let completedProgress = 0;

  const readBinaryFile = await filesystemApi.getFileBuffer(fileReadPath);

  while (readSize < fileSize) {
    const fileChunk = readBinaryFile.slice(offsetStart, offsetEnd);

    if (!fileChunk) {
      break;
    }

    const encodedFileChunk = await filesystemApi.encodeBuffer(fileChunk);
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

  // that adds a given pseudo randon string from the current timestamp to created a pseudo random file
  if (randomPrefix) {
    encodedFileChunks.push(randomPrefix);
  }

  const decodedChunksList = await filesystemApi.decodeFileChunks(encodedFileChunks);

  const decodedFile = filesystemApi.combineDecodedChunks(decodedChunksList);
  filesystemApi.writeFile(fileWritePath, decodedFile);
  log('write of the decoded file is done');
  return true;
}
// /////

let APP_ROOT_DIR = '';

try {
  APP_ROOT_DIR = getAppRootDir();
} catch (error) {
  log('test init - could not resolve the APP_ROOT_DIR', error);
  throw error;
}
log('Resolved APP_ROOT_DIR', APP_ROOT_DIR);

const TESTING_INTEGRATION_NAME = process.env.INTEGRATION_ENV_NAME || 'local';

const envConfigFile = `${APP_ROOT_DIR}/.env_integration_${TESTING_INTEGRATION_NAME}.json`;

try {
  if (!fs.existsSync(envConfigFile)) {
    throw new Error(`config file ${envConfigFile} does not exist. Exiting`);
  }
} catch (err) {
  log('We got an error', err);
  throw new Error(`could not check if config file ${envConfigFile} does not exist. Exiting`);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const envConfig = require(envConfigFile);

const { keys: walletKeys, hostUrl: ppNodeAndPort, faucetMnemonic, sdkEnvTest } = envConfig;

const { mainFaucet } = walletKeys;

log('loaded config ', envConfig);
log('faucet pkey from the config ', mainFaucet);
log('pp node url and port from the config', ppNodeAndPort);
log('faucet mnemonic from the config', faucetMnemonic);
log('sdkEnv from the config', sdkEnvTest);

let GLOBAL_CHAIN_ID = '';
let GLOBAL_CHAIN_VERSION = '';
let GLOBAL_IS_NEW_PROTOCOL = false;

const sdkEnvDev = sdkEnvTest;

log('Using sdk config', sdkEnvDev);

const password = 'yourSecretPassword';

const main = async (zeroUserMnemonic: string, hdPathIndex = 0): Promise<boolean> => {
  const sdkEnv = sdkEnvDev;

  cosmosService.resetCosmos();

  Sdk.init({ ...sdkEnv });

  if (!GLOBAL_CHAIN_ID) {
    const { resolvedChainID, resolvedChainVersion, isNewProtocol } =
      await networkApi.getChainAndProtocolDetails();

    GLOBAL_CHAIN_ID = resolvedChainID;
    GLOBAL_CHAIN_VERSION = resolvedChainVersion;
    GLOBAL_IS_NEW_PROTOCOL = isNewProtocol;
  }

  const ppNodeAndPortToUse = buildPpNodeUrl(ppNodeAndPort);
  const [ppUrl, ppPort] = ppNodeAndPortToUse;

  log('main - will be using ppNodeAndPortToUse', ppNodeAndPortToUse);

  Sdk.init({
    ...sdkEnv,
    chainId: GLOBAL_CHAIN_ID,
    nodeProtocolVersion: GLOBAL_CHAIN_VERSION,
    isNewProtocol: GLOBAL_IS_NEW_PROTOCOL,
    ppNodeUrl: ppUrl,
    ppNodePort: ppPort,
  });

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password, hdPathIndex);

  log('main - sdk initialized user mnemonic', zeroUserMnemonic);

  const serialized = masterKeySeedInfo.encryptedWalletInfo;

  await cosmosService.getCosmos(serialized, password);

  return true;
};

const createKeypairFromMnemonic = async (
  phrase: mnemonic.MnemonicPhrase,
  hdPathIndex = 0,
): Promise<WalletTypes.KeyPairInfo> => {
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

export const createAnAccount = async (hdPathIndex = 0): Promise<boolean> => {
  log('////////////////  createAnAccount //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const phrase = mnemonic.generateMnemonicPhrase(24);
  const keyPairZero = await createKeypairFromMnemonic(phrase, hdPathIndex);

  const { address, publicKey, keyIndex } = keyPairZero;

  if (keyIndex !== hdPathIndex) {
    throw new Error(`keypar index ${keyIndex} does not match with expected ${hdPathIndex}`);
  }

  if (!address.startsWith('st')) {
    throw new Error(`keypar address "${address}" does not start with "st"`);
  }

  if (!publicKey.startsWith('stpub')) {
    throw new Error(`keypar publicKey "${publicKey}" does not start with "stput"`);
  }

  return true;
};

export const restoreAccount = async (hdPathIndex = 0): Promise<boolean> => {
  log('////////////////  restoreAnAccount //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const mnemonicToCheck =
    'hope skin cliff bench vanish motion swear reveal police cash street example health object penalty random broom prevent obvious dawn shiver leader prize onion';

  const phrase = mnemonic.convertStringToArray(mnemonicToCheck);
  const keyPairZero = await createKeypairFromMnemonic(phrase, hdPathIndex);

  const { address, publicKey, keyIndex } = keyPairZero;

  const expectedKeyIndex = 0;
  const expectedAddress = 'st19nn9fnlzkpm3hah3pstz0wq496cehclpru8m3u';
  const expectedPublicKey = 'stpub1qdaazld397esglujfxsvwwtd8ygytzqnj5ven52guvvdpvaqdnn52ecsjms';

  if (keyIndex !== expectedKeyIndex) {
    throw new Error(`keypar index ${keyIndex} does not match with expected ${expectedKeyIndex}`);
  }

  if (address !== expectedAddress) {
    throw new Error(`keypar address "${address}" does not match with expected "${expectedAddress}"`);
  }

  if (publicKey !== expectedPublicKey) {
    throw new Error(`keypar publicKey "${publicKey}" does not match with expected "${expectedPublicKey}"`);
  }

  return true;
};

export const getFaucetAvailableBalance = async (hdPathIndex = 0): Promise<boolean> => {
  log('////////////////  getFaucetAvailableBalance //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const phrase = mnemonic.convertStringToArray(faucetMnemonic);
  const keyPairZero = await createKeypairFromMnemonic(phrase, hdPathIndex);

  const { address } = keyPairZero;

  const b = await accountsApi.getBalanceCardMetrics(address);

  const { available } = b;

  if (!available) {
    log('Balances', b);
    throw new Error(`faucet account "${address}" must have available balanace`);
  }

  try {
    const [balanceValue] = available.split(' ');
    if (!(parseFloat(balanceValue) > 0)) {
      log(`faucet account "${address}" must have available balanace, but its balance is ${balanceValue}`);
      exit(1);
    }
  } catch (error) {
    log('Error', error);
    log('Balances', b);
    throw new Error(`could not check faucet account "${address}" balance`);
  }

  return true;
};

const sendFromFaucetToReceiver = async (
  senderHdPathIndex: number,
  keyPairReceiver: WalletTypes.KeyPairInfo,
  amount: number,
): Promise<boolean> => {
  const senderPhrase = mnemonic.convertStringToArray(faucetMnemonic);
  const keyPairZero = await createKeypairFromMnemonic(senderPhrase, senderHdPathIndex);

  const { address: fromAddress } = keyPairZero;

  const sendAmount = amount;

  const sendTxMessages = await transactions.getSendTx(fromAddress, [
    { amount: sendAmount, toAddress: keyPairReceiver.address },
  ]);

  const signedTx = await transactions.sign(fromAddress, sendTxMessages);

  if (!signedTx) {
    throw new Error('Could not sign the transfer transaction');
  }
  try {
    const result = await transactions.broadcast(signedTx);
    log('result', result);
  } catch (error) {
    log('Error', error);
    throw new Error('Could not broadcast the transfer transaction');
  }
  return true;
};

export const sendTransferTx = async (hdPathIndex = 0, givenReceiverMnemonic = ''): Promise<boolean> => {
  log('////////////////  sendTransferTx //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);

  await sendFromFaucetToReceiver(hdPathIndex, keyPairReceiver, 0.5);

  const b = await accountsApi.getBalanceCardMetrics(keyPairReceiver.address);

  const { available } = b;

  if (!available) {
    log('Balances', b);
    throw new Error(
      `receiver account "${keyPairReceiver.address}" have not received transfer transaction or balance was not updated `,
    );
  }

  try {
    const [balanceValue] = available.split(' ');
    if (!(parseFloat(balanceValue) > 0)) {
      throw new Error(
        `account "${keyPairReceiver.address}" must have available balanace, but its balance is ${balanceValue}`,
      );
    }
  } catch (error) {
    log('Error', error);
    log('Balances', b);
    throw new Error(`could not check account "${keyPairReceiver.address}" balance`);
  }
  return true;
};

export const sendDelegateTx = async (
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
  expectedDelegated = '0.2',
  isCalledAsAHelper = false,
): Promise<SendDelegateTxResponse> => {
  log('//////////////// sendDelegateTx //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);

  await sendFromFaucetToReceiver(hdPathIndex, keyPairReceiver, 0.5);

  await main(receiverMnemonic, hdPathIndex);

  const { address } = keyPairReceiver;

  const validatorsInfo = await validators.getValidators();

  if (!validatorsInfo) {
    throw new Error('validatorsInfo is empty');
  }

  const { data: validatorsList } = validatorsInfo;

  const validatorAddresses = validatorsList.map(validator => ({
    validatorAddress: validator.address,
  }));

  if (!validatorAddresses.length) {
    throw new Error('validatorsList is empty');
  }

  const validatorsToUse = validatorAddresses.slice(0, 2);

  log('validatorsToUse', validatorsToUse);

  const delegationInfo = validatorsToUse.map(({ validatorAddress }) => ({ amount: 0.1, validatorAddress }));

  const sendTxMessages = await transactions.getDelegateTx(address, delegationInfo);
  const signedTx = await transactions.sign(address, sendTxMessages);

  if (!signedTx) {
    throw new Error('Could not sign the delegate transaction');
  }

  try {
    const result = await transactions.broadcast(signedTx);
    log('result', result);
  } catch (error) {
    log('Error', error);
    throw new Error('Could not broadcast the delegate transaction');
  }

  const b = await accountsApi.getBalanceCardMetrics(address);

  dirLog('balance from delegated', b);

  const { delegated, detailedBalance } = b;

  if (!delegated) {
    log('Balances', b);
    throw new Error(
      `receiver account "${keyPairReceiver.address}" have not received delegation transaction or balance was not updated `,
    );
  }

  let totalDelegated;

  try {
    const [balanceValue] = delegated.split(' ');
    const a = parseFloat(balanceValue).toFixed(1);
    if (!(a === expectedDelegated)) {
      throw new Error(
        `account "${keyPairReceiver.address}" must have available delegate balance, but its balance is ${balanceValue}`,
      );
    }
    totalDelegated = a;
  } catch (error) {
    log('Error', error);
    log('Balances', b);
    throw new Error(`could not check account "${keyPairReceiver.address}" balance`);
  }

  if (!isCalledAsAHelper) {
    return true;
  }

  // from here it is returning the list of validators and delegations for the redelegate tx
  return {
    validatorsToUse,
    totalDelegated,
    detailedBalance,
  };
};

export const sendBeginRedelegateTx = async (
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
  expectedDelegated = '0.2',
): Promise<boolean> => {
  log('//////////////// sendBeginRedelegateTx  //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);

  await sendFromFaucetToReceiver(hdPathIndex, keyPairReceiver, 0.5);

  await main(receiverMnemonic, hdPathIndex);

  const { address } = keyPairReceiver;

  const sendDelegateTxInfo = await sendDelegateTx(
    hdPathIndex,
    givenReceiverMnemonic,
    expectedDelegated,
    true,
  );

  if (!isDetailedDelegateTxResponse(sendDelegateTxInfo)) {
    return false;
  }

  const { validatorsToUse, detailedBalance, totalDelegated } = sendDelegateTxInfo;

  const validatorAddresses = validatorsToUse.map(validator => validator.validatorAddress);

  const { delegated } = detailedBalance;

  const vBalances = validatorAddresses.map(validatorAddress => {
    const vAmount = delegated[validatorAddress];
    const [parsedAmount] = vAmount.split(' ');
    const a = parseFloat(parsedAmount);
    return a;
  });

  const reDelegationInfo = [
    {
      amount: vBalances[0],
      validatorSrcAddress: validatorAddresses[0],
      validatorDstAddress: validatorAddresses[1],
    },
  ];

  const sendTxMessages = await transactions.getBeginRedelegateTx(address, reDelegationInfo);
  const signedTx = await transactions.sign(address, sendTxMessages);

  if (!signedTx) {
    throw new Error('Could not sign the redelegate transaction');
  }
  try {
    const result = await transactions.broadcast(signedTx);
    log('result', result);
  } catch (error) {
    log('Error', error);
    throw new Error('Could not broadcast the redelegate transaction');
  }

  const b = await accountsApi.getBalanceCardMetrics(address);

  dirLog('balance from re-delegated', b);

  const { delegated: delegatedAfter, detailedBalance: detailedBalanceAfter } = b;

  if (!delegatedAfter) {
    log('Balances', b);
    throw new Error(
      `receiver account "${keyPairReceiver.address}" have not received delegation transaction or balance was not updated `,
    );
  }

  try {
    const [balanceValue] = delegatedAfter.split(' ');
    const a = parseFloat(balanceValue).toFixed(1);
    console.log('a after and totalDelegated', a, totalDelegated);
    if (!(a === expectedDelegated)) {
      throw new Error(
        `account "${keyPairReceiver.address}" must have available delegate balance after redelegation, but its balance is ${balanceValue}`,
      );
    }
    if (!(a === totalDelegated)) {
      throw new Error(
        `account "${keyPairReceiver.address}" must have equal delegate balance after redelegation, but its delegated balance ${totalDelegated} is different from the redelegate balance of ${a}`,
      );
    }

    const { delegated: delegatedDetailedAfter } = detailedBalanceAfter;

    const vBalancesAfter = validatorAddresses.map(validatorAddress => {
      const vAmount = delegatedDetailedAfter[validatorAddress];
      if (!vAmount) return 0;
      const [parsedAmount] = vAmount.split(' ');
      const aAfter = parseFloat(parsedAmount);
      return aAfter;
    });

    const isFirstValidatorHasNoBalance = vBalancesAfter[0] === 0;

    if (!isFirstValidatorHasNoBalance) {
      throw new Error(
        `validatorAddress "${validatorAddresses[0]}" still has balance of ${vBalancesAfter[0]} but it has to be 0`,
      );
    }

    const isSecondValidatorHasAllBalance = `${vBalancesAfter[1]}` === expectedDelegated;

    if (!isSecondValidatorHasAllBalance) {
      throw new Error(
        `validatorAddress "${validatorAddresses[1]}" must have balance of ${expectedDelegated} but it has ${vBalancesAfter[1]}`,
      );
    }
  } catch (error) {
    log('Error', error);
    log('Balances after redelegation', b);
    throw new Error(`could not check account "${keyPairReceiver.address}" balance`);
  }

  return true;
};

export const sendWithdrawRewardsTx = async (
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
): Promise<boolean> => {
  log('//////////////// sendWithdrawRewardsTx //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);

  await main(receiverMnemonic, hdPathIndex);

  const { address } = keyPairReceiver;

  const validatorsInfo = await validators.getValidators();

  if (!validatorsInfo) {
    throw new Error('validatorsInfo is empty');
  }

  const { data: validatorsList } = validatorsInfo;

  const validatorAddresses = validatorsList.map(validator => ({
    validatorAddress: validator.address,
  }));

  if (!validatorAddresses.length) {
    throw new Error('validatorsList is empty');
  }

  const validatorsToUse = validatorAddresses.slice(0, 2);

  log('validatorsToUse', validatorsToUse);

  const sendTxMessages = await transactions.getWithdrawalRewardTx(address, validatorsToUse);
  const signedTx = await transactions.sign(address, sendTxMessages);

  if (!signedTx) {
    throw new Error('Could not sign the get withdrawal rewards transaction');
  }
  try {
    const result = await transactions.broadcast(signedTx);
    log('result', result);
  } catch (error) {
    log('Error', error);
    throw new Error('Could not broadcast the get withdrawal rewards transaction');
  }

  return true;
};

export const sendWithdrawAllRewardsTx = async (
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
): Promise<boolean> => {
  log('//////////////// sendWithdrawAllRewardsTx //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);

  await main(receiverMnemonic, hdPathIndex);

  const { address } = keyPairReceiver;

  const validatorsInfo = await validators.getValidators();

  if (!validatorsInfo) {
    throw new Error('validatorsInfo is empty');
  }

  const { data: validatorsList } = validatorsInfo;

  const validatorAddresses = validatorsList.map(validator => ({
    validatorAddress: validator.address,
  }));

  if (!validatorAddresses.length) {
    throw new Error('validatorsList is empty');
  }

  const sendTxMessages = await transactions.getWithdrawalAllRewardTx(address);
  const signedTx = await transactions.sign(address, sendTxMessages);

  if (!signedTx) {
    throw new Error('Could not sign the get withdrawal all rewards transaction');
  }
  try {
    const result = await transactions.broadcast(signedTx);
    log('result', result);
  } catch (error) {
    log('Error', error);
    throw new Error('Could not broadcast the get withdrawal all rewards transaction');
  }

  return true;
};

export const sendUndelegateTx = async (
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
  expectedDelegated = '0.2',
): Promise<boolean> => {
  log('//////////////// sendUndelegateTx //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);

  await main(receiverMnemonic, hdPathIndex);

  const { address } = keyPairReceiver;

  const validatorsInfo = await validators.getValidators();

  if (!validatorsInfo) {
    throw new Error('validatorsInfo is empty');
  }

  const { data: validatorsList } = validatorsInfo;

  const validatorAddresses = validatorsList.map(validator => ({
    validatorAddress: validator.address,
  }));

  if (!validatorAddresses.length) {
    throw new Error('validatorsList is empty');
  }
  const validatorsToUse = validatorAddresses.slice(0, 2);

  log('validatorsToUse', validatorsToUse);

  const delegationInfo = validatorsToUse.map(({ validatorAddress }) => ({ amount: 0.1, validatorAddress }));

  const sendTxMessages = await transactions.getUnDelegateTx(address, delegationInfo);
  const signedTx = await transactions.sign(address, sendTxMessages);

  if (!signedTx) {
    throw new Error('Could not sign the undelegate transaction');
  }
  try {
    const result = await transactions.broadcast(signedTx);
    log('result', result);
  } catch (error) {
    log('Error', error);
    throw new Error('Could not broadcast the undelegate transaction');
  }

  const b1 = await accountsApi.getBalanceCardMetrics(address);
  const { unbounding } = b1;

  if (!unbounding) {
    log('Balances', b1);
    throw new Error(
      `receiver account "${keyPairReceiver.address}" does not have expected unbounding balance `,
    );
  }

  try {
    const [balanceValue] = unbounding.split(' ');
    const a = parseFloat(balanceValue).toFixed(1);
    if (!(a === expectedDelegated)) {
      throw new Error(
        `account "${keyPairReceiver.address}" must have unbounding balance, but its unbounding balance is ${balanceValue}`,
      );
    }
  } catch (error) {
    log('Error', error);
    log('Balances', b1);
    throw new Error(`could not check account "${keyPairReceiver.address}" balance`);
  }
  return true;
};

export const sendSdsPrepayTx = async (
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
  expectedToSend = 0.2,
): Promise<boolean> => {
  log('//////////////// sendSdsPrepayTx //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);

  await sendFromFaucetToReceiver(hdPathIndex, keyPairReceiver, expectedToSend + 0.2);

  await main(receiverMnemonic, hdPathIndex);

  const { address } = keyPairReceiver;

  const sendTxMessages = await transactionsSds.getSdsPrepayTx(address, [{ amount: expectedToSend }]);
  const signedTx = await transactions.sign(address, sendTxMessages);

  if (!signedTx) {
    throw new Error('Could not sign the sds prepay transaction');
  }

  try {
    const result = await transactions.broadcast(signedTx);
    const { code } = result;
    if (code > 0) {
      throw new Error('There was an error with the broadcast, check the result');
    }
    log('result', result);
  } catch (error) {
    log('Error', error);
    throw new Error('Could not broadcast the sds prepay transaction');
  }
  return true;
};

export const getAccountOzoneBalance = async (
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
  minExpectedOzone = '98', // 98.81 for 0.1 stos
): Promise<boolean> => {
  log('//////////////// getAccountOzoneBalance //////////////// ');

  log(
    `We need to wait for ${OZONE_BALANCE_CHECK_WAIT_TIME} ms before checing the balance to ensure it is updated`,
  );

  await delay(OZONE_BALANCE_CHECK_WAIT_TIME);
  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);

  await main(receiverMnemonic, hdPathIndex);

  const { address } = keyPairReceiver;

  const b = await accountsApi.getOtherBalanceCardMetrics(address);
  log('balance from other', b);

  const { ozone } = b;

  if (!ozone) {
    log('Balances', b);
    throw new Error(
      `receiver account "${keyPairReceiver.address}" have not received prepay transaction or its ozone balance was not updated `,
    );
  }

  try {
    const [balanceValue] = ozone.split(' ');
    const a = parseFloat(balanceValue).toFixed(4);
    if (a >= minExpectedOzone) {
      return true;
    }

    throw new Error(
      `account "${address}" must have available ozone balance equal to ${minExpectedOzone}, but its balance is ${balanceValue}`,
    );
  } catch (error) {
    log('Error', error);
    log('Balances', b);
    throw new Error(`could not check account "${address}" balance`);
  }
};

export const uploadFileToRemote = async (
  fileReadName: string,
  randomTestPreffix: string,
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
): Promise<boolean> => {
  log('//////////////// uploadFileToRemote //////////////// ');

  const fileReadPath = `${APP_ROOT_DIR}/src/testing/integration/test_files/${fileReadName}`;
  const fileWritePath = `${fileReadPath}_${randomTestPreffix}`;
  const expectedRemoteFileName = `${fileReadName}_${randomTestPreffix}`;

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keypair = await createKeypairFromMnemonic(receiverPhrase);

  const { address } = keypair;

  await main(receiverMnemonic, hdPathIndex);

  const localTestFileCreated = await createLocalTestFile(fileReadPath, fileWritePath, randomTestPreffix);

  if (!localTestFileCreated) {
    const m = `could not create ${fileWritePath} from ${fileReadPath}`;
    log(m);
    throw new Error(m);
  }

  const targetHash = await filesystemApi.calculateFileHash(fileWritePath);

  const uploadResult = await remoteFileSystemApi.updloadFile(keypair, fileWritePath);

  const { filehash: calculatedFileHash, uploadReturn } = uploadResult;

  if (+uploadReturn !== 0) {
    throw new Error(`Upload did not return expected return code 0, and instead we have "${uploadReturn}"`);
  }

  if (calculatedFileHash !== targetHash) {
    throw new Error(`Upload did not return expected filehash, ${targetHash}`);
  }
  await delay(OZONE_BALANCE_CHECK_WAIT_TIME);

  const userFileList = await remoteFileSystemApi.getUploadedFileList(keypair, 0);

  const { files } = userFileList;

  if (!files.length) {
    throw new Error(`The remote file list is empty for address "${address}"`);
  }

  const [firstUploadedFileInfo] = files;

  const { filehash: remoteFileHash, filename: remoteFileName } = firstUploadedFileInfo;

  if (remoteFileHash !== targetHash || remoteFileName !== expectedRemoteFileName) {
    const errorMsg = `Remote file name "${remoteFileName}" must match with the expected file name "${expectedRemoteFileName}" and remote file hash "${remoteFileHash}" must match to expected file hash "${targetHash}"`;
    throw new Error(errorMsg);
  }

  return true;
};

export const createSharedLinkForFile = async (
  fileReadName: string,
  randomTestPreffix: string,
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
): Promise<boolean> => {
  log('//////////////// createSharedLinkForFile //////////////// ');

  const fileReadPath = `${APP_ROOT_DIR}/src/testing/integration/test_files/${fileReadName}`;
  const fileWritePath = `${fileReadPath}_${randomTestPreffix}`;

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keypair = await createKeypairFromMnemonic(receiverPhrase);

  await main(receiverMnemonic, hdPathIndex);

  const targetHash = await filesystemApi.calculateFileHash(fileWritePath);

  const shareResult = await remoteFileSystemApi.shareFile(keypair, targetHash);

  const { filehash: remoteHash, shareid } = shareResult;

  console.log('shareResult', shareResult);

  if (!shareid) {
    throw new Error(`Shareid is empty. Expected to have a value. We have "${shareid}"`);
  }

  if (remoteHash !== targetHash) {
    throw new Error(
      `File share request did not return expected filehash which is "${targetHash}", and instead we got "${remoteHash}"`,
    );
  }

  await delay(OZONE_BALANCE_CHECK_WAIT_TIME);

  return true;
};

export const getSharedFilesListAndCheckShare = async (
  fileReadName: string,
  randomTestPreffix: string,
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
): Promise<boolean> => {
  log('//////////////// getSharedFilesListAndCheckShare //////////////// ');

  const fileReadPath = `${APP_ROOT_DIR}/src/testing/integration/test_files/${fileReadName}`;
  const fileWritePath = `${fileReadPath}_${randomTestPreffix}`;
  const expectedRemoteFileName = `${fileReadName}_${randomTestPreffix}`;

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keypair = await createKeypairFromMnemonic(receiverPhrase);

  await main(receiverMnemonic, hdPathIndex);

  const targetHash = await filesystemApi.calculateFileHash(fileWritePath);

  const shareListResult = await remoteFileSystemApi.getSharedFileList(keypair, 0);

  const { files: remoteFilesList, totalnumber } = shareListResult;

  if (+totalnumber !== 1) {
    console.log('shareListResult', shareListResult);
    throw new Error(
      `Total number of shares for the previously shared file must be = 1. Instead we have "${totalnumber}"`,
    );
  }
  if (!remoteFilesList) {
    throw new Error(
      `Expected to have an array of files in the "files" field of the response. We have "${remoteFilesList}"`,
    );
  }

  if (!remoteFilesList.length) {
    throw new Error(
      `Expected to have an non-empty array of files in the "files" field of the response. We have "${remoteFilesList}"`,
    );
  }

  const [firstUploadedFileInfo] = remoteFilesList;

  const { filehash: remoteFileHash, filename: remoteFileName } = firstUploadedFileInfo;

  if (remoteFileHash !== targetHash || remoteFileName !== expectedRemoteFileName) {
    const errorMsg = `Remote file name "${remoteFileName}" of the shared file must match with the expected file name "${expectedRemoteFileName}" and remote file hash "${remoteFileHash}" must match to expected file hash "${targetHash}"`;
    throw new Error(errorMsg);
  }

  await delay(OZONE_BALANCE_CHECK_WAIT_TIME);

  return true;
};

export const downloadFileFromRemoteBySharedLink = async (
  fileReadName: string,
  randomTestPreffix: string,
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
): Promise<boolean> => {
  log('//////////////// downloadFileFromRemoteBySharedLink //////////////// ');

  const fileReadPath = `${APP_ROOT_DIR}/src/testing/integration/test_files/${fileReadName}`;

  const uploadedFileWritePath = `${fileReadPath}_${randomTestPreffix}`;

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keypair = await createKeypairFromMnemonic(receiverPhrase);

  await main(receiverMnemonic, hdPathIndex);

  const uploadedLocalFileHash = await filesystemApi.calculateFileHash(uploadedFileWritePath);

  const filePathToSaveDownloadedTo = `${uploadedFileWritePath}_downloaded`;

  const filesize = 10_000_001;

  const shareListResult = await remoteFileSystemApi.getSharedFileList(keypair, 0);

  const { files: remoteFilesList } = shareListResult;

  if (!remoteFilesList.length) {
    throw new Error(
      `Expected to have an non-empty array of files in the "files" field of the response before proceeding with stop share. We have "${remoteFilesList}"`,
    );
  }

  const [firstUploadedFileInfo] = remoteFilesList;

  const { filename: remoteFileName, sharelink } = firstUploadedFileInfo;

  const downloadResult = await remoteFileSystemApi.downloadSharedFile(
    keypair,
    filePathToSaveDownloadedTo + '_' + remoteFileName,
    sharelink,
    filesize,
  );

  const { filePathToSave } = downloadResult;

  const downloadedFileHash = await filesystemApi.calculateFileHash(filePathToSave);

  if (downloadedFileHash !== uploadedLocalFileHash) {
    throw new Error(
      `downloadedFileHash "${downloadedFileHash}" must be equal uploadedLocalFileHash "${uploadedLocalFileHash}" `,
    );
  }

  fs.unlinkSync(filePathToSave, function (err: Error) {
    if (err) {
      throw err;
    }
  });

  await delay(OZONE_BALANCE_CHECK_WAIT_TIME);

  return true;
};

export const stopFileSharingWithSharedId = async (
  fileReadName: string,
  randomTestPreffix: string,
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
): Promise<boolean> => {
  log('//////////////// stopFileSharingWithSharedId //////////////// ');

  const fileReadPath = `${APP_ROOT_DIR}/src/testing/integration/test_files/${fileReadName}`;
  const fileWritePath = `${fileReadPath}_${randomTestPreffix}`;
  const expectedRemoteFileName = `${fileReadName}_${randomTestPreffix}`;

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keypair = await createKeypairFromMnemonic(receiverPhrase);

  await main(receiverMnemonic, hdPathIndex);

  const targetHash = await filesystemApi.calculateFileHash(fileWritePath);

  const shareListResult = await remoteFileSystemApi.getSharedFileList(keypair, 0);

  const { files: remoteFilesList, totalnumber } = shareListResult;

  if (+totalnumber !== 1) {
    console.log('shareListResult', shareListResult);
    throw new Error(
      `Total number of shares before running stop share must be = 1. Instead we have "${totalnumber}"`,
    );
  }

  if (!remoteFilesList) {
    throw new Error(
      `Expected to have an array of files in the "files" field of the response before proceeding with stop share. We have "${remoteFilesList}"`,
    );
  }

  if (!remoteFilesList.length) {
    throw new Error(
      `Expected to have an non-empty array of files in the "files" field of the response before proceeding with stop share. We have "${remoteFilesList}"`,
    );
  }

  const [firstUploadedFileInfo] = remoteFilesList;

  const { filehash: remoteFileHash, filename: remoteFileName, shareid } = firstUploadedFileInfo;

  if (remoteFileHash !== targetHash || remoteFileName !== expectedRemoteFileName) {
    const errorMsg = `Remote file name "${remoteFileName}" of the shared file must match with the expected file name "${expectedRemoteFileName}" and remote file hash "${remoteFileHash}" must match to expected file hash "${targetHash}". Cant proceed with stop sharing`;
    throw new Error(errorMsg);
  }

  const userStopFileShareResult = await remoteFileSystemApi.stopFileSharing(keypair, shareid);

  if (userStopFileShareResult !== true) {
    const errorMsg = `Could not stop sharing shareid "${shareid}" for the filehash "${targetHash}" of user "${keypair.address}". We got result "${userStopFileShareResult}" instead of expected "true"`;
    throw new Error(errorMsg);
  }

  await delay(OZONE_BALANCE_CHECK_WAIT_TIME);

  return true;
};

export const checkIfFileDoesntHaveSharesAfterStop = async (
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
): Promise<boolean> => {
  log('//////////////// checkIfFileDoesntHaveSharesAfterStop //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keypair = await createKeypairFromMnemonic(receiverPhrase);

  await main(receiverMnemonic, hdPathIndex);

  const shareListResultAfterStop = await remoteFileSystemApi.getSharedFileList(keypair, 0);

  const { files: remoteFilesListAfter, totalnumber: totalnumberAfter } = shareListResultAfterStop;

  if (+totalnumberAfter !== 0) {
    console.log('shareListResult', shareListResultAfterStop);
    throw new Error(
      `Total number of shares after running stop share must be = 0. Instead we have "${totalnumberAfter}"`,
    );
  }

  if (!remoteFilesListAfter) {
    throw new Error(
      `Expected to have an array of files in the "files" field of the response after stop share. We have "${remoteFilesListAfter}"`,
    );
  }

  if (remoteFilesListAfter.length > 0) {
    throw new Error(
      `Expected to have an empty array of files in the "files" field of the response after stop share. We have "${remoteFilesListAfter}"`,
    );
  }

  await delay(OZONE_BALANCE_CHECK_WAIT_TIME);

  return true;
};

export const downloadFileFromRemote = async (
  fileReadName: string,
  randomTestPreffix: string,
  hdPathIndex = 0,
  givenReceiverMnemonic = '',
): Promise<boolean> => {
  log('//////////////// downloadFileFromRemote //////////////// ');

  const fileReadPath = `${APP_ROOT_DIR}/src/testing/integration/test_files/${fileReadName}`;

  const uploadedFileWritePath = `${fileReadPath}_${randomTestPreffix}`;

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keypair = await createKeypairFromMnemonic(receiverPhrase);

  await main(receiverMnemonic, hdPathIndex);

  const uploadedLocalFileHash = await filesystemApi.calculateFileHash(uploadedFileWritePath);

  const filePathToSaveDownloadedTo = `${uploadedFileWritePath}_downloaded`;

  const filesize = 10_000_001;

  const downloadResult = await remoteFileSystemApi.downloadFile(
    keypair,
    filePathToSaveDownloadedTo,
    uploadedLocalFileHash,
    filesize,
  );

  const { filePathToSave } = downloadResult;

  const downloadedFileHash = await filesystemApi.calculateFileHash(filePathToSave);

  if (downloadedFileHash !== uploadedLocalFileHash) {
    throw new Error(
      `downloadedFileHash "${downloadedFileHash}" must be equal uploadedLocalFileHash "${uploadedLocalFileHash}" `,
    );
  }

  fs.unlinkSync(filePathToSave, function (err: Error) {
    if (err) {
      throw err;
    }
  });

  fs.unlinkSync(uploadedFileWritePath, function (err: Error) {
    if (err) {
      throw err;
    }
  });

  return true;
};
