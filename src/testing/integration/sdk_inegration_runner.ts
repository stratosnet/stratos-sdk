/* eslint-disable @typescript-eslint/naming-convention */
import { exit } from 'process';
import { getCosmos } from '../..//services/cosmos';
import { mnemonic, wallet } from '../../hdVault';
import { createMasterKeySeed, getSerializedWalletFromPhrase } from '../../hdVault/keyManager';
import Sdk from '../../Sdk';
import { log, delay } from '../../services/helpers';
import * as Network from '../../services/network';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

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

const { keys: walletKeys, hostUrl: envHostUrl, faucetMnemonic } = envConfig;

const { mainFaucet, receiverOne } = walletKeys;

log('loaded config ', envConfig);

let GLOBAL_CHAIN_ID = '';

const sdkEnvDev = {
  restUrl: 'https://rest-dev.thestratos.org',
  rpcUrl: 'https://rpc-dev.thestratos.org',
  chainId: 'dev-chain-46',
  explorerUrl: 'https://explorer-dev.thestratos.org',
};

log('Using sdk config', sdkEnvDev);

const password = 'yourSecretPassword';

const main = async (zeroUserMnemonic: string, hdPathIndex = 0): Promise<boolean> => {
  let resolvedChainID: string;

  const sdkEnv = sdkEnvDev;

  Sdk.init({ ...sdkEnv });

  if (GLOBAL_CHAIN_ID) {
    log('main ~ sdk already initialized. Exiting');
    return false;
  }

  try {
    const resolvedChainIDToTest = await Network.getChainId();

    if (!resolvedChainIDToTest) {
      throw new Error('Chain id is empty. Exiting');
    }

    log('main ~ resolvedChainIDToTest', resolvedChainIDToTest);
    resolvedChainID = resolvedChainIDToTest;
  } catch (error) {
    log('main ~ resolvedChainID error', error);
    throw new Error('Could not resolve chain id');
  }

  GLOBAL_CHAIN_ID = resolvedChainID;

  Sdk.init({
    ...sdkEnv,
    chainId: resolvedChainID,
    ppNodeUrl: 'http://35.233.85.255',
    ppNodePort: '8142',
  });

  const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
  const masterKeySeedInfo = await createMasterKeySeed(phrase, password, hdPathIndex);

  const serialized = masterKeySeedInfo.encryptedWalletInfo;

  log('main ~ serialized ', serialized);

  const _cosmosClient = await getCosmos(serialized, password);

  return true;
};

export const createAnAccount = async (hdPathIndex = 0): Promise<boolean> => {
  log('////////////////  createAnAccount //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  log('running createAnAccount');

  return true;
};

export const restoreAccount = async (hdPathIndex = 0): Promise<boolean> => {
  log('////////////////  restoreAnAccount //////////////// ');

  await main(faucetMnemonic, hdPathIndex);

  log('running restoreAnAccount');

  return true;
};
// const getBalanceCardMetrics = async (hdPathIndex: number) => {
//   const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
//   const masterKeySeed = await createMasterKeySeed(phrase, password, hdPathIndex);
//
//   const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
//   const keyPairZero = await deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedString);
//   console.log('🚀 ~ file: run.ts ~ line 464 ~ getBalanceCardMetrics ~ keyPairZero', keyPairZero);
//
//   if (!keyPairZero) {
//     return;
//   }
//
//   const delegatorAddress = keyPairZero.address;
//   const b = await accounts.getBalanceCardMetrics(delegatorAddress);
//
//   console.log('balanace card metrics ', b);
// };
