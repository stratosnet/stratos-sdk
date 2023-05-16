"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountBalance = exports.restoreAccount = exports.createAnAccount = void 0;
const accounts = __importStar(require("../../accounts"));
const hdVault_1 = require("../../hdVault");
const keyManager_1 = require("../../hdVault/keyManager");
const Sdk_1 = __importDefault(require("../../Sdk"));
const cosmos_1 = require("../../services/cosmos");
const helpers_1 = require("../../services/helpers");
const Network = __importStar(require("../../services/network"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
function getAppRootDir() {
    let currentDir = __dirname;
    while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
        currentDir = path.join(currentDir, '..');
        (0, helpers_1.log)('currentDir', currentDir);
        if (currentDir === '/') {
            throw new Error(`could not resolve app root path, or package.json is missing in ${currentDir}`);
        }
    }
    return currentDir;
}
let APP_ROOT_DIR = '';
try {
    APP_ROOT_DIR = getAppRootDir();
}
catch (error) {
    (0, helpers_1.log)('test init - could not resolve the APP_ROOT_DIR', error);
    throw error;
}
(0, helpers_1.log)('Resolved APP_ROOT_DIR', APP_ROOT_DIR);
const TESTING_INTEGRATION_NAME = process.env.INTEGRATION_ENV_NAME || 'local';
const envConfigFile = `${APP_ROOT_DIR}/.env_integration_${TESTING_INTEGRATION_NAME}.json`;
try {
    if (!fs.existsSync(envConfigFile)) {
        throw new Error(`config file ${envConfigFile} does not exist. Exiting`);
    }
}
catch (err) {
    (0, helpers_1.log)('We got an error', err);
    throw new Error(`could not check if config file ${envConfigFile} does not exist. Exiting`);
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const envConfig = require(envConfigFile);
const { keys: walletKeys, hostUrl: ppNodeAndPort, faucetMnemonic } = envConfig;
const { mainFaucet } = walletKeys;
(0, helpers_1.log)('loaded config ', envConfig);
(0, helpers_1.log)('faucet pkey ', mainFaucet);
(0, helpers_1.log)('pp node url and port ', ppNodeAndPort);
(0, helpers_1.log)('faucet mnemonic', faucetMnemonic);
let GLOBAL_CHAIN_ID = '';
const sdkEnvDev = {
    restUrl: 'https://rest-dev.thestratos.org',
    rpcUrl: 'https://rpc-dev.thestratos.org',
    chainId: 'dev-chain-46',
    explorerUrl: 'https://explorer-dev.thestratos.org',
};
(0, helpers_1.log)('Using sdk config', sdkEnvDev);
const password = 'yourSecretPassword';
const main = async (zeroUserMnemonic, hdPathIndex = 0) => {
    let resolvedChainID;
    const sdkEnv = sdkEnvDev;
    Sdk_1.default.init(Object.assign({}, sdkEnv));
    if (GLOBAL_CHAIN_ID) {
        (0, helpers_1.log)('main ~ sdk already initialized. Exiting');
        return false;
    }
    try {
        const resolvedChainIDToTest = await Network.getChainId();
        if (!resolvedChainIDToTest) {
            throw new Error('Chain id is empty. Exiting');
        }
        (0, helpers_1.log)('main ~ resolvedChainIDToTest', resolvedChainIDToTest);
        resolvedChainID = resolvedChainIDToTest;
    }
    catch (error) {
        (0, helpers_1.log)('main ~ resolvedChainID error', error);
        throw new Error('Could not resolve chain id');
    }
    GLOBAL_CHAIN_ID = resolvedChainID;
    Sdk_1.default.init(Object.assign(Object.assign({}, sdkEnv), { chainId: resolvedChainID, ppNodeUrl: 'http://35.233.85.255', ppNodePort: '8142' }));
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    (0, helpers_1.log)('masterKeySeedInfo', masterKeySeedInfo);
    const serialized = masterKeySeedInfo.encryptedWalletInfo;
    (0, helpers_1.log)('main ~ serialized ', serialized);
    const _cosmosClient = await (0, cosmos_1.getCosmos)(serialized, password);
    return true;
};
const createKeypairFromMnemonic = async (phrase, hdPathIndex = 0) => {
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    let keyPairZero;
    try {
        keyPairZero = await hdVault_1.wallet.deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeedString);
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        throw new Error('could not create keypar by the helper');
    }
    if (!keyPairZero) {
        throw new Error(`keypar was not derived`);
    }
    return keyPairZero;
};
const createAnAccount = async (hdPathIndex = 0) => {
    (0, helpers_1.log)('////////////////  createAnAccount //////////////// ');
    // await main(faucetMnemonic, hdPathIndex);
    const phrase = hdVault_1.mnemonic.generateMnemonicPhrase(24);
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
exports.createAnAccount = createAnAccount;
const restoreAccount = async (hdPathIndex = 0) => {
    (0, helpers_1.log)('////////////////  restoreAnAccount //////////////// ');
    // await main(faucetMnemonic, hdPathIndex);
    const mnemonicToCheck = 'hope skin cliff bench vanish motion swear reveal police cash street example health object penalty random broom prevent obvious dawn shiver leader prize onion';
    const phrase = hdVault_1.mnemonic.convertStringToArray(mnemonicToCheck);
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
exports.restoreAccount = restoreAccount;
const getAccountBalance = async (hdPathIndex = 0) => {
    (0, helpers_1.log)('////////////////  getAccountBalance //////////////// ');
    await main(faucetMnemonic, hdPathIndex);
    const phrase = hdVault_1.mnemonic.convertStringToArray(faucetMnemonic);
    const keyPairZero = await createKeypairFromMnemonic(phrase, hdPathIndex);
    const { address } = keyPairZero;
    const b = await accounts.getBalanceCardMetrics(address);
    const { available } = b;
    if (!available) {
        (0, helpers_1.log)('Balances', b);
        throw new Error(`faucet account "${address}" must have available balanace`);
    }
    try {
        const [balanceValue] = available.split(' ');
        if (!(parseFloat(balanceValue) > 100)) {
            throw new Error(`faucet account "${address}" must have available balanace, but its balance is ${balanceValue}`);
        }
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        (0, helpers_1.log)('Balances', b);
        throw new Error(`could not check faucet account "${address}" balanace`);
    }
    // log('balanace card metrics ', b);
    return true;
};
exports.getAccountBalance = getAccountBalance;
//# sourceMappingURL=sdk_inegration_runner.js.map