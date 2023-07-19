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
const encoding_1 = require("@cosmjs/encoding");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const accounts = __importStar(require("./accounts"));
const config_1 = require("./config");
const hdVault_1 = require("./hdVault");
const cosmosUtils_1 = require("./hdVault/cosmosUtils");
const cosmosWallet = __importStar(require("./hdVault/cosmosWallet"));
const keyManager_1 = require("./hdVault/keyManager");
const keyUtils = __importStar(require("./hdVault/keyUtils"));
const wallet_1 = require("./hdVault/wallet");
const Sdk_1 = __importDefault(require("./Sdk"));
const RemoteFilesystem = __importStar(require("./sds/remoteFile"));
const cosmos_1 = require("./services/cosmos");
const FilesystemService = __importStar(require("./services/filesystem"));
const helpers_1 = require("./services/helpers");
const Network = __importStar(require("./services/network"));
const transactions = __importStar(require("./transactions"));
const evm = __importStar(require("./transactions/evm"));
const transactionTypes = __importStar(require("./transactions/types"));
const validators = __importStar(require("./validators"));
dotenv_1.default.config();
const password = 'XXXX';
const { ZERO_MNEMONIC: zeroUserMnemonic = '' } = process.env;
const sdkEnvDev = {
    restUrl: 'https://rest-dev.thestratos.org',
    rpcUrl: 'https://rpc-dev.thestratos.org',
    chainId: 'dev-chain-46',
    explorerUrl: 'https://explorer-dev.thestratos.org',
    faucetUrl: 'https://faucet-dev.thestratos.org/credit',
};
const sdkEnvTestOld = {
    key: 'testnet',
    name: 'Tropos-4',
    restUrl: 'https://rest-tropos.thestratos.org',
    rpcUrl: 'https://rpc-tropos.thestratos.org',
    chainId: 'stratos-testnet-2',
    explorerUrl: 'https://big-dipper-tropos.thestratos.org',
    faucetUrl: 'https://faucet-tropos.thestratos.org/credit',
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
// creates an account and derives 2 keypairs
const mainFour = async () => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
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
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
    if (!keyPairZero) {
        return;
    }
    const fromAddress = keyPairZero.address;
    const serialized = masterKeySeed.encryptedWalletInfo;
    const _cosmosClient = await (0, cosmos_1.getCosmos)(serialized, password);
    const { sequence } = await _cosmosClient.getSequence(fromAddress);
    const payload = evm.DynamicFeeTx.fromPartial({
        chainId: '2048',
        nonce: sequence,
        gasFeeCap: (1000000000).toString(),
        gas: 21000,
        to: '0x000000000000000000000000000000000000dEaD',
        value: '1',
    });
    console.log('simulated gas', await _cosmosClient.execEvm(payload, keyPairZero, true));
    const signedTx = await _cosmosClient.signForEvm(payload, keyPairZero);
    if (signedTx) {
        try {
            const result = await transactions.broadcast(signedTx);
            console.log('broadcasting result!', result);
        }
        catch (error) {
            const err = error;
            console.log('error broadcasting', err.message);
        }
    }
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
const simulateSend = async (hdPathIndex, givenReceiverMnemonic) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    console.log('phrase', phrase);
    const mnemonicToUse = givenReceiverMnemonic ? givenReceiverMnemonic : zeroUserMnemonic;
    console.log('mnemonicToUse', mnemonicToUse);
    const receiverPhrase = hdVault_1.mnemonic.convertStringToArray(mnemonicToUse);
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
    console.log('standardFeeAmount', config_1.tokens.standardFeeAmount());
    console.log('minGasPrice', config_1.tokens.minGasPrice.toString());
};
// cosmosjs send
const mainSend = async (hdPathIndex, givenReceiverMnemonic = zeroUserMnemonic, hdPathIndexReceiver = 0) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    console.log('phrase', phrase);
    const mnemonicToUse = givenReceiverMnemonic ? givenReceiverMnemonic : zeroUserMnemonic;
    console.log('mnemonicToUse', mnemonicToUse);
    const receiverPhrase = hdVault_1.mnemonic.convertStringToArray(mnemonicToUse);
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
        }
        catch (error) {
            const err = error;
            console.log('error broadcasting', err.message);
        }
    }
};
// cosmosjs delegate
const mainDelegate = async () => {
    const validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
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
        }
        catch (error) {
            const err = error;
            console.log('error broadcasting', err.message);
        }
    }
};
// cosmosjs undelegate
const mainUndelegate = async () => {
    const validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
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
        }
        catch (error) {
            const err = error;
            console.log('error broadcasting', err.message);
        }
    }
};
// cosmosjs withdraw rewards
const mainWithdrawRewards = async () => {
    const validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
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
        }
        catch (error) {
            const err = error;
            console.log('error broadcasting', err.message);
        }
    }
};
// cosmosjs withdraw all rewards
const mainWithdrawAllRewards = async () => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
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
        }
        catch (error) {
            const err = error;
            console.log('error broadcasting', err.message);
        }
    }
};
// cosmosjs withdraw rewards
const mainSdsPrepay = async (hdPathIndex, givenReceiverMnemonic) => {
    // console.log('mnemonic ', zeroUserMnemonic);
    const mnemonicToUse = givenReceiverMnemonic ? givenReceiverMnemonic : zeroUserMnemonic;
    const phrase = hdVault_1.mnemonic.convertStringToArray(mnemonicToUse);
    // console.log('phrase', phrase);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, encryptedMasterKeySeedString);
    if (!keyPairZero) {
        return;
    }
    const sendTxMessages = await transactions.getSdsPrepayTx(keyPairZero.address, [{ amount: 0.1 }]);
    (0, helpers_1.dirLog)('from mainSdsPrepay - calling tx sign with this messageToSign', sendTxMessages);
    const signedTx = await transactions.sign(keyPairZero.address, sendTxMessages);
    let attempts = 0;
    if (signedTx) {
        try {
            console.log('from mainSdsPrepay - calling tx broadcast');
            const result = await transactions.broadcast(signedTx);
            console.log('broadcast prepay result', result);
        }
        catch (err) {
            console.log('error broadcasting', err.message);
            if (attempts <= 2) {
                attempts += 1;
                (0, helpers_1.dirLog)(`attempts ${attempts}, trying again the same signedTx`, signedTx);
                const result = await transactions.broadcast(signedTx);
                console.log('broadcast prepay result', result);
            }
        }
    }
};
const uploadRequest = async () => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
    console.log('🚀 ~ file: run.ts ~ line 311 ~ uploadRequest ~ keyPairZero', keyPairZero);
    if (!keyPairZero) {
        return;
    }
    const filehash = 'v05ahm53rv07iscjr3cf5c8cjjmq1q64sb8d4aqo';
    const walletaddr = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
    const messageToSign = `${filehash}${walletaddr}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keyPairZero.privateKey);
    console.log('🚀 ~ file: run.ts ~ line 342 ~ uploadRequest ~ signature', signature);
    const pubkeyMine = await cosmosWallet.getPublicKeyFromPrivKey((0, encoding_1.fromHex)(keyPairZero.privateKey));
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
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
    if (!keyPairZero) {
        return;
    }
    const keyPairOne = await (0, wallet_1.deriveKeyPair)(1, password, encryptedMasterKeySeedString);
    if (!keyPairOne) {
        return;
    }
    const keyPairTwo = await (0, wallet_1.deriveKeyPair)(2, password, encryptedMasterKeySeedString);
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
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
    if (!keyPairZero) {
        return;
    }
    console.log('keyPairZero', keyPairZero.address);
    const address = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
    const bResult = await Network.getDelegatedBalance(address);
    const { response } = bResult;
    console.log('our delegated balanace', response === null || response === void 0 ? void 0 : response.result[0].balance);
};
const getUnboundingBalance = async () => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
    if (!keyPairZero) {
        return;
    }
    console.log('keyPairZero', keyPairZero.address);
    const address = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
    const bResult = await Network.getUnboundingBalance(address);
    const { response } = bResult;
    console.log('our unbounding balanace', response === null || response === void 0 ? void 0 : response.result); // an array ?
};
const getRewardBalance = async () => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
    if (!keyPairZero) {
        return;
    }
    console.log('keyPairZero', keyPairZero.address);
    const address = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
    const bResult = await Network.getRewardBalance(address);
    const { response } = bResult;
    console.log('our reward balanace', response === null || response === void 0 ? void 0 : response.result.rewards); // an array ?
};
const getOzoneBalance = async (hdPathIndex, givenMnemonic) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(givenMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
    if (!keyPairZero) {
        return;
    }
    const b = await accounts.getOtherBalanceCardMetrics(keyPairZero.address);
    console.log('other balanace card metrics ', b);
};
const getBalanceCardMetrics = async (hdPathIndex, givenMnemonic) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(givenMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, encryptedMasterKeySeedString);
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
const runFaucet = async (hdPathIndex, givenMnemonic) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(givenMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, encryptedMasterKeySeedString);
    if (!keyPairZero) {
        return;
    }
    const walletAddress = keyPairZero.address;
    console.log('walletAddress', walletAddress);
    // const faucetUrl = 'https://faucet-dev.thestratos.org/credit';
    const faucetUrl = Sdk_1.default.environment.faucetUrl;
    (0, helpers_1.log)(`will be useing faucetUrl - "${faucetUrl}"`);
    const result = await accounts.increaseBalance(walletAddress, faucetUrl, config_1.hdVault.stratosTopDenom);
    console.log('faucet result', result);
};
const getTxHistory = async () => {
    const wallet = await keyUtils.createWalletAtPath(0, zeroUserMnemonic);
    console.log('running getTxHistory');
    const [firstAccount] = await wallet.getAccounts();
    const zeroAddress = firstAccount.address;
    const result = await accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Transfer, 1);
    console.log('hist result!! !', result);
    return true;
};
const cosmosWalletCreateTest = async () => {
    // Old way
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    console.log('🚀 ~ file: run.ts ~ line 512 ~ cosmosWalletCreateTest ~ masterKeySeedInfo', masterKeySeedInfo);
    const { encryptedMasterKeySeed, encryptedWalletInfo } = masterKeySeedInfo;
    const encryptedMasterKeySeedString = encryptedMasterKeySeed.toString();
    const derivedMasterKeySeed = await keyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeedString);
    console.log('🚀 ~ file: run.ts ~ line 517 ~ cosmosWalletCreateTest ~ derivedMasterKeySeed', derivedMasterKeySeed);
    const newWallet = await (0, cosmosUtils_1.deserializeWithEncryptionKey)(password, encryptedWalletInfo);
    console.log('🚀 ~ file: run.ts ~ line 524 ~ cosmosWalletCreateTest ~ newWallet', newWallet);
    const [f] = await newWallet.getAccounts();
    console.log('🚀 ~ file: run.ts ~ line 527 ~ cosmosWalletCreateTest ~ f', f);
    const keyPairZeroA = await (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
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
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const imageFileName = 'stratos_landing_page.png';
    const fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
    const fileWritePath = path_1.default.resolve(SRC_ROOT, `new_${imageFileName}`);
    console.log('🚀 ~ file: run.ts ~ line 631 ~ testFile ~ fileReadPath', fileReadPath);
    const buff = fs_1.default.readFileSync(fileReadPath);
    const base64dataOriginal = buff.toString('base64');
    const chunksOfBuffers = await FilesystemService.getFileChunks(fileReadPath);
    const fullBuf = Buffer.concat(chunksOfBuffers);
    const base64dataFullBuf = fullBuf.toString('base64');
    const chunksOfBase64Promises = chunksOfBuffers.map(async (chunk) => {
        const pp = await FilesystemService.encodeBuffer(chunk);
        return pp;
    });
    const chunksOfBase64 = await Promise.all(chunksOfBase64Promises);
    const restoredChunksOfBuffers = chunksOfBase64.map(base64dataChunk => Buffer.from(base64dataChunk, 'base64'));
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
    fs_1.default.writeFileSync(fileWritePath, buffWrite);
};
const testRequestUserFileShare = async (filehash, hdPathIndex) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
    if (!keyPairZero) {
        (0, helpers_1.log)('Error. We dont have a keypair');
        return;
    }
    const userShareFileResult = await RemoteFilesystem.shareFile(keyPairZero, filehash);
    console.log('retrieved user shared file result', userShareFileResult);
};
const testRequestUserStopFileShare = async (shareid, hdPathIndex) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
    if (!keyPairZero) {
        (0, helpers_1.log)('Error. We dont have a keypair');
        return;
    }
    const userFileList = await RemoteFilesystem.stopFileSharing(keyPairZero, shareid);
    console.log('retrieved user shared file list', userFileList);
};
const testRequestUserSharedFileList = async (page, hdPathIndex) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZeroA = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
    if (!keyPairZeroA) {
        (0, helpers_1.log)('Error. We dont have a keypair');
        return;
    }
    // const { address } = keyPairZeroA;
    const userFileList = await RemoteFilesystem.getSharedFileList(keyPairZeroA, page);
    console.log('retrieved user shared file list', userFileList);
};
const testRequestUserDownloadSharedFile = async (hdPathIndex, sharelink) => {
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZeroA = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
    if (!keyPairZeroA) {
        (0, helpers_1.log)('Error. We dont have a keypair');
        return;
    }
    // const { address } = keyPairZeroA;
    const filePathToSave = path_1.default.resolve(SRC_ROOT, `my_super_new_from_shared_${sharelink}`);
    const userDownloadSharedFileResult = await RemoteFilesystem.downloadSharedFile(keyPairZeroA, filePathToSave, sharelink);
    console.log('retrieved user shared file list', userDownloadSharedFileResult);
};
const testRequestUserFileList = async (page, hdPathIndex) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZeroA = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
    if (!keyPairZeroA) {
        (0, helpers_1.log)('Error. We dont have a keypair');
        return;
    }
    // const { address , publicKey } = keyPairZeroA;
    // const page = 4;
    const userFileList = await RemoteFilesystem.getUploadedFileList(keyPairZeroA, page);
    console.log('retrieved user file list', userFileList);
};
// read local file and write a new one
// 33 sec for 1gb, 1m 1sec for 2 gb
const testReadAndWriteLocal = async (filename) => {
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const imageFileName = filename;
    const fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
    const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
    (0, helpers_1.log)('fileInfo', fileInfo);
    let readSize = 0;
    const stats = fs_1.default.statSync(fileReadPath);
    const fileSize = stats.size;
    (0, helpers_1.log)('stats', stats);
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
    const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);
    const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
    const fileWritePathFromBuff = path_1.default.resolve(SRC_ROOT, `my_new_from_decoded_${filename}`);
    FilesystemService.writeFile(fileWritePathFromBuff, decodedFile);
    (0, helpers_1.log)('write of the decoded file is done');
    // const fileWritePath = path.resolve(SRC_ROOT, `my_new_encoded_from_decoded_${filename}`);
    // const encodedFile = await FilesystemService.encodeFile(decodedFile);
    // await FilesystemService.writeFileToPath(fileWritePath, encodedFile);
    // log('writeFileToPath of the encodedFile from decoded file is done');
};
// read local file and write a new one (multiple IO)
// 51 sec for 1gb, 1m 38sec for 2gb
const testReadAndWriteLocalMultipleIo = async (filename) => {
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const imageFileName = filename;
    const fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
    const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
    (0, helpers_1.log)('fileInfo', fileInfo);
    const fileStream = await FilesystemService.getLocalFileReadStream(fileReadPath);
    let readSize = 0;
    const stats = fs_1.default.statSync(fileReadPath);
    const fileSize = stats.size;
    (0, helpers_1.log)('stats', stats);
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
        }
        else {
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
                await (0, helpers_1.delay)(1);
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
            (0, helpers_1.log)(`completed ${readSize} from ${fileSize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(2)}%`);
            offsetStart = offsetEnd;
            offsetEnd = offsetEnd + step;
            encodedFileChunks.push(encodedFileChunk);
        }
    }
    // console.log('fileWritePath ', fileWritePath);
    // console.log('encoded file chunks length', encodedFileChunks.length);
    const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);
    const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
    const fileWritePathFromBuff = path_1.default.resolve(SRC_ROOT, `my_new_from_decoded_io_${filename}`);
    FilesystemService.writeFile(fileWritePathFromBuff, decodedFile);
    (0, helpers_1.log)('write of the decoded file is done');
    // const fileWritePath = path.resolve(SRC_ROOT, `my_new_encoded_from_decoded_io_${filename}`);
    // const encodedFile = await FilesystemService.encodeFile(decodedFile);
    // await FilesystemService.writeFileToPath(fileWritePath, encodedFile);
    // log('writeFileToPath of the encodedFile from decoded file is done');
};
const testFileDl = async (hdPathIndex, filename, filehash) => {
    console.log(`downloading file ${filename}`);
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZeroA = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
    if (!keyPairZeroA) {
        return;
    }
    const filePathToSave = path_1.default.resolve(SRC_ROOT, `my_super_new_from_buff_${filename}`);
    await RemoteFilesystem.downloadFile(keyPairZeroA, filePathToSave, filehash);
    (0, helpers_1.log)('done. filePathToSave', filePathToSave);
};
const testItFileUp = async (filename, hdPathIndex) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    const keypair = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, masterKeySeed.encryptedMasterKeySeed.toString());
    if (!keypair) {
        return;
    }
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const fileReadPath = path_1.default.resolve(SRC_ROOT, filename);
    await RemoteFilesystem.updloadFile(keypair, fileReadPath);
    (0, helpers_1.log)('done!');
};
const testAddressConverstion = async (hdPathIndex) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    const keypair = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, masterKeySeed.encryptedMasterKeySeed.toString());
    if (!keypair) {
        return;
    }
    const { address } = keypair;
    (0, helpers_1.log)('address to convert ', address);
    const evmAddress = keyUtils.convertNativeToEvmAddress(address);
    (0, helpers_1.log)('converted evmAddress', evmAddress);
    const nativeAddress = keyUtils.convertEvmToNativeToAddress(evmAddress);
    (0, helpers_1.log)('converted nativeAddress', nativeAddress);
};
const main = async () => {
    let resolvedChainID;
    // const sdkEnv = sdkEnvTest;
    const sdkEnv = sdkEnvDev;
    Sdk_1.default.init(Object.assign({}, sdkEnv));
    try {
        const resolvedChainIDToTest = await Network.getChainId();
        if (!resolvedChainIDToTest) {
            throw new Error('Chain id is empty. Exiting');
        }
        console.log('🚀 ~ file: run.ts ~ line 817 ~ main ~ resolvedChainIDToTest', resolvedChainIDToTest);
        resolvedChainID = resolvedChainIDToTest;
    }
    catch (error) {
        console.log('🚀 ~ file: 494 ~ init ~ resolvedChainID error', error);
        throw new Error('Could not resolve chain id');
    }
    // 2
    Sdk_1.default.init(Object.assign(Object.assign({}, sdkEnv), { chainId: resolvedChainID, 
        // devnet
        ppNodeUrl: 'http://34.145.36.237', ppNodePort: '8135' }));
    console.log('sdkEnv', Sdk_1.default.environment);
    // tropos
    // ppNodeUrl: 'http://35.233.251.112',
    //     ppNodePort: '8159',
    // await evmSend();
    const hdPathIndex = 0;
    const testMnemonic = 'gossip magic please parade album ceiling cereal jealous common chimney cushion bounce bridge saddle elegant laptop across exhaust wasp garlic high flash near dad';
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    // const phrase = mnemonic.convertStringToArray(testMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    const serialized = masterKeySeedInfo.encryptedWalletInfo;
    const _cosmosClient = await (0, cosmos_1.getCosmos)(serialized, password);
    // 1a
    // await testRequestUserFileList(0, hdPathIndex);
    // 2a
    // const filename = 'file250_06_06';
    // await testItFileUp(filename, hdPathIndex);
    // 3a
    // const filename = 'file10_test_1689623710986';
    // const filehash = 'v05ahm504fq2q53pucu87do4cdcurggsoonhsmfo';
    // await testFileDl(hdPathIndex, filename, filehash);
    // 4a
    await testRequestUserSharedFileList(0, hdPathIndex);
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
    // await getBalanceCardMetrics(hdPathIndex, zeroUserMnemonic);
    // await getBalanceCardMetrics(hdPathIndex, testMnemonic);
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
    // const hdPathIndexReceiver = 10;
    // await mainSend(hdPathIndex, receiverMnemonic, hdPathIndexReceiver);
    // 33 sec, 1m 1sec
    // testReadAndWriteLocal(filename);
    // 51 sec, 1m 38sec
    // testReadAndWriteLocalMultipleIo(filename);
    // const randomPrefix = Date.now() + '';
    // const rr = await integration.uploadFileToRemote(filename, randomPrefix, 0, zeroUserMnemonic);
};
main();
//# sourceMappingURL=run.js.map