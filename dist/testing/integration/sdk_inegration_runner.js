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
exports.uploadFileToRemote = exports.getAccountOzoneBalance = exports.sendSdsPrepayTx = exports.sendUndelegateTx = exports.sendWithdrawAllRewardsTx = exports.sendWithdrawRewardsTx = exports.sendDelegateTx = exports.sendTransferTx = exports.getFaucetAvailableBalance = exports.restoreAccount = exports.createAnAccount = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const process_1 = require("process");
const accounts = __importStar(require("../../accounts"));
const hdVault_1 = require("../../hdVault");
const keyManager_1 = require("../../hdVault/keyManager");
const Sdk_1 = __importDefault(require("../../Sdk"));
const cosmos_1 = require("../../services/cosmos");
const FilesystemService = __importStar(require("../../services/filesystem/filesystem"));
const RemoteFilesystem = __importStar(require("../../services/filesystem/remoteFile"));
const helpers_1 = require("../../services/helpers");
const Network = __importStar(require("../../services/network"));
const transactions = __importStar(require("../../transactions"));
const validators = __importStar(require("../../validators"));
const config_1 = require("../config");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
function buildPpNodeUrl(givenUrl) {
    const ppProtocolPostition = givenUrl.lastIndexOf('://');
    if (!(ppProtocolPostition > 1)) {
        (0, helpers_1.log)(`pp node config value must be proved. "${givenUrl}" is not a valid value`);
        (0, helpers_1.log)('ppProtocolPostition', ppProtocolPostition);
        (0, process_1.exit)(1);
    }
    const ppPortPostition = givenUrl.lastIndexOf(':');
    if (ppProtocolPostition === ppPortPostition) {
        return [givenUrl, ''];
    }
    const ppUrl = givenUrl.slice(0, ppPortPostition || givenUrl.length);
    const ppPort = ppPortPostition ? givenUrl.slice(ppPortPostition + 1) : '';
    return [ppUrl, ppPort];
}
async function createLocalTestFile(fileReadPath, fileWritePath, randomPrefix) {
    let readSize = 0;
    const stats = fs.statSync(fileReadPath);
    const fileSize = stats.size;
    // log('stats', stats);
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
        (0, helpers_1.log)(`completed ${readSize} from ${fileSize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(2)}%`);
        offsetStart = offsetEnd;
        offsetEnd = offsetEnd + step;
        encodedFileChunks.push(encodedFileChunk);
    }
    // that adds a given pseudo randon string from the current timestamp to created a pseudo random file
    if (randomPrefix) {
        encodedFileChunks.push(randomPrefix);
    }
    const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);
    const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
    FilesystemService.writeFile(fileWritePath, decodedFile);
    (0, helpers_1.log)('write of the decoded file is done');
    return true;
}
// /////
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
(0, helpers_1.log)('faucet pkey from the config ', mainFaucet);
(0, helpers_1.log)('pp node url and port from the config', ppNodeAndPort);
(0, helpers_1.log)('faucet mnemonic from the config', faucetMnemonic);
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
    const sdkEnv = sdkEnvDev;
    (0, cosmos_1.resetCosmos)();
    Sdk_1.default.init(Object.assign({}, sdkEnv));
    if (!GLOBAL_CHAIN_ID) {
        try {
            const resolvedChainIDToTest = await Network.getChainId();
            if (!resolvedChainIDToTest) {
                throw new Error('Chain id is empty. Exiting');
            }
            (0, helpers_1.log)('main - resolvedChainIDToTest', resolvedChainIDToTest);
            GLOBAL_CHAIN_ID = resolvedChainIDToTest;
        }
        catch (error) {
            (0, helpers_1.log)('main - resolvedChainID error', error);
            throw new Error('Could not resolve chain id');
        }
    }
    const ppNodeAndPortToUse = buildPpNodeUrl(ppNodeAndPort);
    const [ppUrl, ppPort] = ppNodeAndPortToUse;
    (0, helpers_1.log)('main - will be using ppNodeAndPortToUse', ppNodeAndPortToUse);
    Sdk_1.default.init(Object.assign(Object.assign({}, sdkEnv), { chainId: GLOBAL_CHAIN_ID, ppNodeUrl: ppUrl, ppNodePort: ppPort }));
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    (0, helpers_1.log)('main - sdk initialized user mnemonic', zeroUserMnemonic);
    const serialized = masterKeySeedInfo.encryptedWalletInfo;
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
    await main(faucetMnemonic, hdPathIndex);
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
    await main(faucetMnemonic, hdPathIndex);
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
const getFaucetAvailableBalance = async (hdPathIndex = 0) => {
    (0, helpers_1.log)('////////////////  getFaucetAvailableBalance //////////////// ');
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
        if (!(parseFloat(balanceValue) > 0)) {
            (0, helpers_1.log)(`faucet account "${address}" must have available balanace, but its balance is ${balanceValue}`);
            (0, process_1.exit)(1);
        }
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        (0, helpers_1.log)('Balances', b);
        throw new Error(`could not check faucet account "${address}" balance`);
    }
    return true;
};
exports.getFaucetAvailableBalance = getFaucetAvailableBalance;
const sendFromFaucetToReceiver = async (senderHdPathIndex, keyPairReceiver, amount) => {
    const senderPhrase = hdVault_1.mnemonic.convertStringToArray(faucetMnemonic);
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
        (0, helpers_1.log)('result', result);
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        throw new Error('Could not broadcast the transfer transaction');
    }
    return true;
};
const sendTransferTx = async (hdPathIndex = 0, givenReceiverMnemonic = '') => {
    (0, helpers_1.log)('////////////////  sendTransferTx //////////////// ');
    await main(faucetMnemonic, hdPathIndex);
    const receiverPhrase = givenReceiverMnemonic
        ? hdVault_1.mnemonic.convertStringToArray(givenReceiverMnemonic)
        : hdVault_1.mnemonic.generateMnemonicPhrase(24);
    const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);
    await sendFromFaucetToReceiver(hdPathIndex, keyPairReceiver, 0.5);
    const b = await accounts.getBalanceCardMetrics(keyPairReceiver.address);
    const { available } = b;
    if (!available) {
        (0, helpers_1.log)('Balances', b);
        throw new Error(`receiver account "${keyPairReceiver.address}" have not received transfer transaction or balance was not updated `);
    }
    try {
        const [balanceValue] = available.split(' ');
        if (!(parseFloat(balanceValue) > 0)) {
            throw new Error(`account "${keyPairReceiver.address}" must have available balanace, but its balance is ${balanceValue}`);
        }
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        (0, helpers_1.log)('Balances', b);
        throw new Error(`could not check account "${keyPairReceiver.address}" balance`);
    }
    return true;
};
exports.sendTransferTx = sendTransferTx;
const sendDelegateTx = async (hdPathIndex = 0, givenReceiverMnemonic = '', expectedDelegated = '0.2') => {
    (0, helpers_1.log)('//////////////// sendDelegateTx //////////////// ');
    await main(faucetMnemonic, hdPathIndex);
    const receiverPhrase = givenReceiverMnemonic
        ? hdVault_1.mnemonic.convertStringToArray(givenReceiverMnemonic)
        : hdVault_1.mnemonic.generateMnemonicPhrase(24);
    const receiverMnemonic = hdVault_1.mnemonic.convertArrayToString(receiverPhrase);
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
    (0, helpers_1.log)('validatorsToUse', validatorsToUse);
    const delegationInfo = validatorsToUse.map(({ validatorAddress }) => ({ amount: 0.1, validatorAddress }));
    const sendTxMessages = await transactions.getDelegateTx(address, delegationInfo);
    const signedTx = await transactions.sign(address, sendTxMessages);
    if (!signedTx) {
        throw new Error('Could not sign the delegate transaction');
    }
    try {
        const result = await transactions.broadcast(signedTx);
        (0, helpers_1.log)('result', result);
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        throw new Error('Could not broadcast the delegate transaction');
    }
    const b = await accounts.getBalanceCardMetrics(address);
    (0, helpers_1.log)('balance from delegated', b);
    const { delegated } = b;
    if (!delegated) {
        (0, helpers_1.log)('Balances', b);
        throw new Error(`receiver account "${keyPairReceiver.address}" have not received delegation transaction or balance was not updated `);
    }
    try {
        const [balanceValue] = delegated.split(' ');
        const a = parseFloat(balanceValue).toFixed(1);
        if (!(a === expectedDelegated)) {
            throw new Error(`account "${keyPairReceiver.address}" must have available delegate balance, but its balance is ${balanceValue}`);
        }
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        (0, helpers_1.log)('Balances', b);
        throw new Error(`could not check account "${keyPairReceiver.address}" balance`);
    }
    return true;
};
exports.sendDelegateTx = sendDelegateTx;
const sendWithdrawRewardsTx = async (hdPathIndex = 0, givenReceiverMnemonic = '') => {
    (0, helpers_1.log)('//////////////// sendWithdrawRewardsTx //////////////// ');
    await main(faucetMnemonic, hdPathIndex);
    const receiverPhrase = givenReceiverMnemonic
        ? hdVault_1.mnemonic.convertStringToArray(givenReceiverMnemonic)
        : hdVault_1.mnemonic.generateMnemonicPhrase(24);
    const receiverMnemonic = hdVault_1.mnemonic.convertArrayToString(receiverPhrase);
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
    (0, helpers_1.log)('validatorsToUse', validatorsToUse);
    const sendTxMessages = await transactions.getWithdrawalRewardTx(address, validatorsToUse);
    const signedTx = await transactions.sign(address, sendTxMessages);
    if (!signedTx) {
        throw new Error('Could not sign the get withdrawal rewards transaction');
    }
    try {
        const result = await transactions.broadcast(signedTx);
        (0, helpers_1.log)('result', result);
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        throw new Error('Could not broadcast the get withdrawal rewards transaction');
    }
    return true;
};
exports.sendWithdrawRewardsTx = sendWithdrawRewardsTx;
const sendWithdrawAllRewardsTx = async (hdPathIndex = 0, givenReceiverMnemonic = '') => {
    (0, helpers_1.log)('//////////////// sendWithdrawAllRewardsTx //////////////// ');
    await main(faucetMnemonic, hdPathIndex);
    const receiverPhrase = givenReceiverMnemonic
        ? hdVault_1.mnemonic.convertStringToArray(givenReceiverMnemonic)
        : hdVault_1.mnemonic.generateMnemonicPhrase(24);
    const receiverMnemonic = hdVault_1.mnemonic.convertArrayToString(receiverPhrase);
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
        (0, helpers_1.log)('result', result);
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        throw new Error('Could not broadcast the get withdrawal all rewards transaction');
    }
    return true;
};
exports.sendWithdrawAllRewardsTx = sendWithdrawAllRewardsTx;
const sendUndelegateTx = async (hdPathIndex = 0, givenReceiverMnemonic = '', expectedDelegated = '0.2') => {
    (0, helpers_1.log)('//////////////// sendUndelegateTx //////////////// ');
    await main(faucetMnemonic, hdPathIndex);
    const receiverPhrase = givenReceiverMnemonic
        ? hdVault_1.mnemonic.convertStringToArray(givenReceiverMnemonic)
        : hdVault_1.mnemonic.generateMnemonicPhrase(24);
    const receiverMnemonic = hdVault_1.mnemonic.convertArrayToString(receiverPhrase);
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
    (0, helpers_1.log)('validatorsToUse', validatorsToUse);
    const delegationInfo = validatorsToUse.map(({ validatorAddress }) => ({ amount: 0.1, validatorAddress }));
    const sendTxMessages = await transactions.getUnDelegateTx(address, delegationInfo);
    const signedTx = await transactions.sign(address, sendTxMessages);
    if (!signedTx) {
        throw new Error('Could not sign the undelegate transaction');
    }
    try {
        const result = await transactions.broadcast(signedTx);
        (0, helpers_1.log)('result', result);
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        throw new Error('Could not broadcast the undelegate transaction');
    }
    const b1 = await accounts.getBalanceCardMetrics(address);
    const { unbounding } = b1;
    if (!unbounding) {
        (0, helpers_1.log)('Balances', b1);
        throw new Error(`receiver account "${keyPairReceiver.address}" does not have expected unbounding balance `);
    }
    try {
        const [balanceValue] = unbounding.split(' ');
        const a = parseFloat(balanceValue).toFixed(1);
        if (!(a === expectedDelegated)) {
            throw new Error(`account "${keyPairReceiver.address}" must have unbounding balance, but its unbounding balance is ${balanceValue}`);
        }
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        (0, helpers_1.log)('Balances', b1);
        throw new Error(`could not check account "${keyPairReceiver.address}" balance`);
    }
    return true;
};
exports.sendUndelegateTx = sendUndelegateTx;
const sendSdsPrepayTx = async (hdPathIndex = 0, givenReceiverMnemonic = '', expectedToSend = 0.2) => {
    (0, helpers_1.log)('//////////////// sendSdsPrepayTx //////////////// ');
    await main(faucetMnemonic, hdPathIndex);
    const receiverPhrase = givenReceiverMnemonic
        ? hdVault_1.mnemonic.convertStringToArray(givenReceiverMnemonic)
        : hdVault_1.mnemonic.generateMnemonicPhrase(24);
    const receiverMnemonic = hdVault_1.mnemonic.convertArrayToString(receiverPhrase);
    const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);
    await sendFromFaucetToReceiver(hdPathIndex, keyPairReceiver, expectedToSend + 0.2);
    await main(receiverMnemonic, hdPathIndex);
    const { address } = keyPairReceiver;
    const sendTxMessages = await transactions.getSdsPrepayTx(address, [{ amount: expectedToSend }]);
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
        (0, helpers_1.log)('result', result);
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        throw new Error('Could not broadcast the sds prepay transaction');
    }
    return true;
};
exports.sendSdsPrepayTx = sendSdsPrepayTx;
const getAccountOzoneBalance = async (hdPathIndex = 0, givenReceiverMnemonic = '', minExpectedOzone = '98') => {
    (0, helpers_1.log)('//////////////// getAccountOzoneBalance //////////////// ');
    (0, helpers_1.log)(`We need to wait for ${config_1.OZONE_BALANCE_CHECK_WAIT_TIME} ms before checing the balance to ensure it is updated`);
    await (0, helpers_1.delay)(config_1.OZONE_BALANCE_CHECK_WAIT_TIME);
    await main(faucetMnemonic, hdPathIndex);
    const receiverPhrase = givenReceiverMnemonic
        ? hdVault_1.mnemonic.convertStringToArray(givenReceiverMnemonic)
        : hdVault_1.mnemonic.generateMnemonicPhrase(24);
    const receiverMnemonic = hdVault_1.mnemonic.convertArrayToString(receiverPhrase);
    const keyPairReceiver = await createKeypairFromMnemonic(receiverPhrase);
    await main(receiverMnemonic, hdPathIndex);
    const { address } = keyPairReceiver;
    const b = await accounts.getOtherBalanceCardMetrics(address);
    (0, helpers_1.log)('balance from other', b);
    const { ozone } = b;
    if (!ozone) {
        (0, helpers_1.log)('Balances', b);
        throw new Error(`receiver account "${keyPairReceiver.address}" have not received prepay transaction or its ozone balance was not updated `);
    }
    try {
        const [balanceValue] = ozone.split(' ');
        const a = parseFloat(balanceValue).toFixed(4);
        if (a >= minExpectedOzone) {
            return true;
        }
        throw new Error(`account "${address}" must have available ozone balance equal to ${minExpectedOzone}, but its balance is ${balanceValue}`);
    }
    catch (error) {
        (0, helpers_1.log)('Error', error);
        (0, helpers_1.log)('Balances', b);
        throw new Error(`could not check account "${address}" balance`);
    }
};
exports.getAccountOzoneBalance = getAccountOzoneBalance;
const uploadFileToRemote = async (fileReadName, randomTestPreffix, hdPathIndex = 0, givenReceiverMnemonic = '') => {
    (0, helpers_1.log)('//////////////// uploadFileToRemote //////////////// ');
    const fileReadPath = `${APP_ROOT_DIR}/src/${fileReadName}`;
    const fileWritePath = `${fileReadPath}_${randomTestPreffix}`;
    const expectedRemoteFileName = `${fileReadName}_${randomTestPreffix}`;
    // const fileWritePath = `testing/integration/${fileReadName}}`;
    await main(faucetMnemonic, hdPathIndex);
    const receiverPhrase = givenReceiverMnemonic
        ? hdVault_1.mnemonic.convertStringToArray(givenReceiverMnemonic)
        : hdVault_1.mnemonic.generateMnemonicPhrase(24);
    const receiverMnemonic = hdVault_1.mnemonic.convertArrayToString(receiverPhrase);
    const keypair = await createKeypairFromMnemonic(receiverPhrase);
    const { address } = keypair;
    await main(receiverMnemonic, hdPathIndex);
    const localTestFileCreated = await createLocalTestFile(fileReadPath, fileWritePath, randomTestPreffix);
    if (!localTestFileCreated) {
        const m = `could not create ${fileWritePath} from ${fileReadPath}`;
        (0, helpers_1.log)(m);
        throw new Error(m);
    }
    const sourceHash = await FilesystemService.calculateFileHash(fileReadPath);
    const targetHash = await FilesystemService.calculateFileHash(fileWritePath);
    (0, helpers_1.log)('sourceHash', sourceHash);
    (0, helpers_1.log)('targetHash', targetHash);
    const uploadResult = await RemoteFilesystem.updloadFile(keypair, fileWritePath);
    const { filehash: calculatedFileHash, uploadReturn } = uploadResult;
    if (+uploadReturn !== 0) {
        throw new Error(`Upload did not return expected return code 0, and instead we have "${uploadReturn}"`);
    }
    if (calculatedFileHash !== targetHash) {
        throw new Error(`Upload did not return expected filehash, ${sourceHash}`);
    }
    const userFileList = await RemoteFilesystem.getUploadedFileList(address, 0);
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
exports.uploadFileToRemote = uploadFileToRemote;
//# sourceMappingURL=sdk_inegration_runner.js.map