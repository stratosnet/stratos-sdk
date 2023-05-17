/* eslint-disable @typescript-eslint/naming-convention */
import { exit } from 'process';
import * as accounts from '../../accounts';
import { mnemonic, wallet } from '../../hdVault';
import { createMasterKeySeed, getSerializedWalletFromPhrase } from '../../hdVault/keyManager';
import Sdk from '../../Sdk';
import { getCosmos, resetCosmos, StratosCosmos } from '../../services/cosmos';
import { log, delay } from '../../services/helpers';
import * as Network from '../../services/network';
import * as transactions from '../../transactions';
import * as validators from '../../validators';

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

const { keys: walletKeys, hostUrl: ppNodeAndPort, faucetMnemonic } = envConfig;

const { mainFaucet } = walletKeys;

log('loaded config ', envConfig);
log('faucet pkey ', mainFaucet);
log('pp node url and port ', ppNodeAndPort);
log('faucet mnemonic', faucetMnemonic);

let GLOBAL_CHAIN_ID = '';

const sdkEnvDev = {
  restUrl: 'https://rest-dev.thestratos.org',
  rpcUrl: 'https://rpc-dev.thestratos.org',
  chainId: 'dev-chain-46',
  explorerUrl: 'https://explorer-dev.thestratos.org',
};

log('Using sdk config', sdkEnvDev);

const password = 'yourSecretPassword';

const main = async (zeroUserMnemonic: string, hdPathIndex = 0, resetSdk = false): Promise<boolean> => {
  const sdkEnv = sdkEnvDev;

  Sdk.init({ ...sdkEnv });

  if (!GLOBAL_CHAIN_ID) {
    // log('main ~ sdk already initialized. Exiting');
    try {
      const resolvedChainIDToTest = await Network.getChainId();

      if (!resolvedChainIDToTest) {
        throw new Error('Chain id is empty. Exiting');
      }

      log('main ~ resolvedChainIDToTest', resolvedChainIDToTest);
      // resolvedChainID = resolvedChainIDToTest;
      GLOBAL_CHAIN_ID = resolvedChainIDToTest;
    } catch (error) {
      log('main ~ resolvedChainID error', error);
      throw new Error('Could not resolve chain id');
    }

    Sdk.init({
      ...sdkEnv,
      chainId: GLOBAL_CHAIN_ID,
      ppNodeUrl: 'http://35.233.85.255',
      ppNodePort: '8142',
    });
  }

  if (resetSdk) {
    resetCosmos();
  }

  if (StratosCosmos.cosmosInstance) {
    log('we have keypar initialized, exiting');
    return true;
  }

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password, hdPathIndex);
  log('masterKeySeedInfo', masterKeySeedInfo);
  log('zeroUserMnemonic', zeroUserMnemonic);

  const serialized = masterKeySeedInfo.encryptedWalletInfo;

  log('main ~ serialized ', serialized);

  const _cosmosClient = await getCosmos(serialized, password);

  return true;
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

export const createAnAccount = async (hdPathIndex = 0): Promise<boolean> => {
  log('////////////////  createAnAccount //////////////// ');

  // await main(faucetMnemonic, hdPathIndex);

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

  // await main(faucetMnemonic, hdPathIndex);

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

  const b = await accounts.getBalanceCardMetrics(address);

  const { available } = b;

  if (!available) {
    log('Balances', b);
    throw new Error(`faucet account "${address}" must have available balanace`);
  }

  try {
    const [balanceValue] = available.split(' ');
    if (!(parseFloat(balanceValue) > 0)) {
      throw new Error(
        `faucet account "${address}" must have available balanace, but its balance is ${balanceValue}`,
      );
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
  keyPairReceiver: wallet.KeyPairInfo,
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

  await sendFromFaucetToReceiver(hdPathIndex, keyPairReceiver, 0.3);

  const b = await accounts.getBalanceCardMetrics(keyPairReceiver.address);

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
): Promise<boolean> => {
  log('//////////////// sendDelegateTx //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  const receiverPhrase = givenReceiverMnemonic
    ? mnemonic.convertStringToArray(givenReceiverMnemonic)
    : mnemonic.generateMnemonicPhrase(24);

  const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
  const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);

  await sendFromFaucetToReceiver(hdPathIndex, keyPairReceiver, 0.5);

  await main(receiverMnemonic, hdPathIndex, true);

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

  const b = await accounts.getBalanceCardMetrics(address);
  log('balance from delegated', b);

  const { delegated } = b;

  if (!delegated) {
    log('Balances', b);
    throw new Error(
      `receiver account "${keyPairReceiver.address}" have not received delegation transaction or balance was not updated `,
    );
  }

  try {
    const [balanceValue] = delegated.split(' ');
    const a = parseFloat(balanceValue).toFixed(1);
    if (!(a === expectedDelegated)) {
      throw new Error(
        `account "${keyPairReceiver.address}" must have available delegate balance, but its balance is ${balanceValue}`,
      );
    }
  } catch (error) {
    log('Error', error);
    log('Balances', b);
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

  await main(receiverMnemonic, hdPathIndex, true);

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

  await main(receiverMnemonic, hdPathIndex, true);

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

  await main(receiverMnemonic, hdPathIndex, true);

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

  const b1 = await accounts.getBalanceCardMetrics(address);
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
