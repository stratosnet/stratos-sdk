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
const cosmos_1 = require("./services/cosmos");
const FilesystemService = __importStar(require("./services/filesystem"));
const helpers_1 = require("./services/helpers");
const Network = __importStar(require("./services/network"));
const transactions = __importStar(require("./transactions"));
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
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
    console.log('keyPairZero', keyPairZero);
    // const keyPairOne = await deriveKeyPair(1, password, encryptedMasterKeySeedString);
    // console.log('keyPairOne', keyPairOne);
};
const simulateSend = async () => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
    if (!keyPairZero) {
        return;
    }
    const fromAddress = keyPairZero.address;
    const sendAmount = 0.2;
    const sendTxMessages = await transactions.getSendTx(fromAddress, [
        { amount: sendAmount, toAddress: keyPairZero.address },
    ]);
    console.log('keyPairZero.address', keyPairZero.address);
    const fees = await transactions.getStandardFee(keyPairZero.address, sendTxMessages);
    console.log('fees', fees);
    console.log('standardFeeAmount', config_1.tokens.standardFeeAmount());
    console.log('minGasPrice', config_1.tokens.minGasPrice.toString());
};
// cosmosjs send
const mainSend = async () => {
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
    const fromAddress = keyPairZero.address;
    const sendAmount = 0.2;
    const sendTxMessages = await transactions.getSendTx(fromAddress, [
        { amount: sendAmount, toAddress: keyPairOne.address },
        { amount: sendAmount + 1, toAddress: keyPairTwo.address },
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
    // const signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);
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
const mainSdsPrepay = async (hdPathIndex) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, encryptedMasterKeySeedString);
    console.log('🚀 ~ file: run.ts ~ line 292 ~ mainSdsPrepay ~ keyPairZero', keyPairZero);
    if (!keyPairZero) {
        return;
    }
    const sendTxMessages = await transactions.getSdsPrepayTx(keyPairZero.address, [{ amount: 0.5 }]);
    //
    console.log('from mainSdsPrepay - calling tx sign');
    const signedTx = await transactions.sign(keyPairZero.address, sendTxMessages);
    if (signedTx) {
        try {
            console.log('from mainSdsPrepay - calling tx broadcast');
            const result = await transactions.broadcast(signedTx);
            console.log('broadcast prepay result', result);
        }
        catch (err) {
            console.log('error broadcasting', err.message);
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
const getOzoneBalance = async () => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString);
    if (!keyPairZero) {
        return;
    }
    const callResultB = await Network.sendUserRequestGetOzone([{ walletaddr: keyPairZero.address }]);
    console.log('🚀 ~ file: run.ts ~ line 296 ~ mainSdsPrepay ~ callResultB', callResultB);
};
const getBalanceCardMetrics = async (hdPathIndex) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeed = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
    const keyPairZero = await (0, wallet_1.deriveKeyPair)(hdPathIndex, password, encryptedMasterKeySeedString);
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
    // const walletAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
    const walletAddress = 'st19nn9fnlzkpm3hah3pstz0wq496cehclpru8m3u';
    // const faucetUrl = 'https://faucet-tropos.thestratos.org/credit';
    // const result = await accounts.increaseBalance(walletAddress, faucetUrl, hdVault.stratosDenom);
    const faucetUrl = 'https://faucet-dev.thestratos.org/credit';
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
const testFileHash = async () => {
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const imageFileName = 'stratos_landing_page.png';
    const expectedHash = 'v05ahm53rv07iscjr3cf5c8cjjmq1q64sb8d4aqo';
    const fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
    const realFileHash2 = await FilesystemService.calculateFileHash(fileReadPath);
    console.log('🚀 ~  ~ realFileHash2', realFileHash2);
    console.log('🚀 ~   ~ expectedHash', expectedHash);
};
const testUploadRequest = async () => {
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    // const imageFileName = 'stratos_landing_page.png';
    // const imageFileName = 'img7.png';
    const imageFileName = 'file100M1';
    const fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
    const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
    console.log('file info', fileInfo);
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZeroA = await (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
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
    const connectedUrl = `${Sdk_1.default.environment.ppNodeUrl}:${Sdk_1.default.environment.ppNodePort}`;
    return {
        data: `response from ${connectedUrl}`,
        response,
    };
};
const testRequestUserFileList = async (page) => {
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZeroA = await (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
    if (!keyPairZeroA) {
        console.log('Error. We dont have a keypair');
        return;
    }
    const { address } = keyPairZeroA;
    // const page = 4;
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
const testReadAndWriteLocal = async (filename) => {
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const imageFileName = filename;
    const fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
    const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
    console.log('fileInfo', fileInfo);
    // const fileStream = await FilesystemService.getUploadFileStream(fileReadPath);
    let readSize = 0;
    const stats = fs_1.default.statSync(fileReadPath);
    const fileSize = stats.size;
    console.log('stats', stats);
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
        // if (fileChunk) {
        const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
        readSize = readSize + fileChunk.length;
        completedProgress = (100 * readSize) / fileSize;
        console.log(`completed ${readSize} from ${fileSize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(2)}%`);
        offsetStart = offsetEnd;
        offsetEnd = offsetEnd + step;
        encodedFileChunks.push(encodedFileChunk);
        // }
    }
    const fileWritePath = path_1.default.resolve(SRC_ROOT, `my_new_${filename}`);
    const fileWritePathFromBuff = path_1.default.resolve(SRC_ROOT, `my_new_from_buff_${filename}`);
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
const testReadAndWriteLocalWorking = async (filename) => {
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const imageFileName = filename;
    const fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
    const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
    console.log('fileInfo', fileInfo);
    const fileStream = await FilesystemService.getUploadFileStream(fileReadPath);
    let readSize = 0;
    const stats = fs_1.default.statSync(fileReadPath);
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
                await (0, helpers_1.delay)(100);
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
            console.log(`completed ${readSize} from ${fileSize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(2)}%`);
            offsetStart = offsetEnd;
            offsetEnd = offsetEnd + step;
            encodedFileChunks.push(encodedFileChunk);
        }
    }
    const fileWritePath = path_1.default.resolve(SRC_ROOT, `my_new_${filename}`);
    const fileWritePathFromBuff = path_1.default.resolve(SRC_ROOT, `my_new_from_buff_${filename}`);
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
const testDl = async (filename, filehashA, filesizeA) => {
    var _a;
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    console.log(`downloading file ${filename}`);
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZeroA = await (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
    if (!keyPairZeroA) {
        return;
    }
    const { address, publicKey } = keyPairZeroA;
    // const filehash = fileInfo.filehash;
    const filehash = filehashA;
    // const filesize = fileInfo.size;
    const filesize = filesizeA;
    const sdmAddress = address;
    const filehandle = `sdm://${sdmAddress}/${filehash}`;
    const messageToSign = `${filehash}${address}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keyPairZeroA.privateKey);
    const extraParams = [
        {
            filehandle,
            walletaddr: address,
            walletpubkey: publicKey,
            signature,
        },
    ];
    const callResultRequestDl = await Network.sendUserRequestDownload(extraParams);
    const { response: responseRequestDl } = callResultRequestDl;
    if (!responseRequestDl) {
        console.log('we dont have response for dl request. it might be an error', callResultRequestDl);
        return;
    }
    const { result: resultWithOffesets } = responseRequestDl;
    let offsetStartGlobal = 0;
    let offsetEndGlobal = 0;
    let isContinueGlobal = 0;
    const fileInfoChunks = [];
    const { return: isContinueInit, reqid, offsetstart: offsetstartInit, offsetend: offsetendInit, filedata, } = resultWithOffesets;
    const responseDownloadInitFormatted = { isContinueInit, offsetstartInit, offsetendInit };
    console.log('responseDownloadInitFormatted', responseDownloadInitFormatted);
    if (offsetendInit === undefined) {
        console.log('a we dont have an offest. could be an error. response is', responseRequestDl);
        return;
    }
    if (offsetstartInit === undefined) {
        console.log('b we dont have an offest. could be an error. response is', responseRequestDl);
        return;
    }
    isContinueGlobal = +isContinueInit;
    offsetStartGlobal = +offsetstartInit;
    offsetEndGlobal = +offsetendInit;
    const fileChunk = { offsetstart: offsetEndGlobal, offsetend: offsetEndGlobal, filedata };
    fileInfoChunks.push(fileChunk);
    while (isContinueGlobal === 2) {
        (0, helpers_1.log)('from run.ts - will call download confirmation for ', offsetStartGlobal, offsetEndGlobal);
        const extraParamsForDownload = [
            {
                filehash,
                reqid,
            },
        ];
        const callResultDownload = await Network.sendUserDownloadData(extraParamsForDownload);
        const { response: responseDownload } = callResultDownload;
        if (!responseDownload) {
            console.log('we dont have response. it might be an error', callResultDownload);
            return;
        }
        const { return: dlReturn, offsetstart: dlOffsetstart, offsetend: dlOffsetend } = responseDownload.result;
        const responseDownloadFormatted = { dlReturn, dlOffsetstart, dlOffsetend };
        console.log('responseDownloadFormatted', responseDownloadFormatted);
        const { result: { offsetend: offsetendDownload, offsetstart: offsetstartDownload, return: isContinueDownload, filedata: downloadedFileData, }, } = responseDownload;
        isContinueGlobal = +isContinueDownload;
        // if (offsetstartDownload && offsetendDownload) {
        if (offsetstartDownload !== undefined && offsetendDownload !== undefined) {
            offsetStartGlobal = +offsetstartDownload;
            offsetEndGlobal = +offsetendDownload;
            const fileChunkDl = {
                offsetstart: offsetStartGlobal,
                offsetend: offsetEndGlobal,
                filedata: downloadedFileData,
            };
            fileInfoChunks.push(Object.assign({}, fileChunkDl));
        }
    }
    let downloadConfirmed = '-1';
    if (isContinueGlobal === 3) {
        const extraParamsForDownload = [
            {
                filehash,
                filesize,
                reqid,
            },
        ];
        const callResultDownloadFileInfo = await Network.sendUserDownloadedFileInfo(extraParamsForDownload);
        (0, helpers_1.log)('call result download', JSON.stringify(callResultDownloadFileInfo));
        const { response: responseDownloadFileInfo } = callResultDownloadFileInfo;
        downloadConfirmed = ((_a = responseDownloadFileInfo === null || responseDownloadFileInfo === void 0 ? void 0 : responseDownloadFileInfo.result) === null || _a === void 0 ? void 0 : _a.return) || '-1';
        (0, helpers_1.log)('🚀 ~ file: run.ts ~ line 1097 ~ testIt ~ responseDownloadFileInfo', responseDownloadFileInfo);
    }
    if (+downloadConfirmed !== 0) {
        throw Error('could not get download confirmation');
    }
    const sortedFileInfoChunks = fileInfoChunks.sort((a, b) => {
        const res = a.offsetstart - b.offsetstart;
        return res;
    });
    // log('sortedFileInfoChunks, ', sortedFileInfoChunks);
    (0, helpers_1.log)('sortedFileInfoChunks.length ', sortedFileInfoChunks.length);
    const encodedFileChunks = sortedFileInfoChunks
        .map(fileInfoChunk => {
        (0, helpers_1.log)('offsetstart, offsetend', fileInfoChunk.offsetstart, fileInfoChunk.offsetend);
        return fileInfoChunk.filedata || '';
    })
        .filter(Boolean);
    (0, helpers_1.log)('encodedFileChunks', encodedFileChunks.length);
    const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);
    const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
    const fileWritePathFromBuff = path_1.default.resolve(SRC_ROOT, `my_new_from_buff_${filename}`);
    (0, helpers_1.log)(`file is saved into ${fileWritePathFromBuff}`, fileWritePathFromBuff);
    FilesystemService.writeFile(fileWritePathFromBuff, decodedFile);
};
// request upload and upload
const testIt = async (filename) => {
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const imageFileName = filename;
    const fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
    const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZeroA = await (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
    if (!keyPairZeroA) {
        return;
    }
    const { address, publicKey } = keyPairZeroA;
    const messageToSign = `${fileInfo.filehash}${address}`;
    const stats = fs_1.default.statSync(fileReadPath);
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
    (0, helpers_1.log)('call result init', JSON.stringify(callResultInit));
    if (!responseInit) {
        console.log('we dont have response. it might be an error', callResultInit);
        return;
    }
    const { result: resultWithOffesets } = responseInit;
    (0, helpers_1.log)('result with offesets', resultWithOffesets);
    let offsetStartGlobal = 0;
    let offsetEndGlobal = 0;
    let isContinueGlobal = 0;
    const { offsetend: offsetendInit, offsetstart: offsetstartInit, return: isContinueInit, } = resultWithOffesets;
    if (offsetendInit === undefined) {
        console.log('a we dont have an offest. could be an error. response is', responseInit);
        return;
    }
    if (offsetstartInit === undefined) {
        console.log('b we dont have an offest. could be an error. response is', responseInit);
        return;
    }
    let readSize = 0;
    // const maxStep = 65536;
    let completedProgress = 0;
    isContinueGlobal = +isContinueInit;
    offsetStartGlobal = +offsetstartInit;
    offsetEndGlobal = +offsetendInit;
    const readBinaryFile = await FilesystemService.getFileBuffer(fileReadPath);
    while (isContinueGlobal === 1) {
        const fileChunk = readBinaryFile.slice(offsetStartGlobal, offsetEndGlobal);
        if (!fileChunk) {
            console.log('fileChunk is missing, Exiting ', fileChunk);
            break;
        }
        (0, helpers_1.log)('from run.ts - completed before encoding a chunk to base64', completedProgress);
        if (fileChunk) {
            const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
            readSize = readSize + fileChunk.length;
            completedProgress = (100 * readSize) / fileSize;
            (0, helpers_1.log)(`from run.ts - completed ${readSize} from ${fileSize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(2)}%`);
            // upload
            const extraParamsForUpload = [
                {
                    filehash: fileInfo.filehash,
                    data: encodedFileChunk,
                },
            ];
            // isContinueGlobal = 0;
            // log('from run.ts - completed', completedProgress);
            (0, helpers_1.log)('from run.ts - will call upload', offsetStartGlobal, offsetEndGlobal);
            const callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);
            (0, helpers_1.log)('call result upload', JSON.stringify(callResultUpload));
            const { response: responseUpload } = callResultUpload;
            // log('🚀 ~ file: run.ts ~ line 766 ~ testIt ~ result', callResultUpload);
            if (!responseUpload) {
                console.log('we dont have response. it might be an error', callResultUpload);
                return;
            }
            const { result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload }, } = responseUpload;
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
const testItWorking = async (filename) => {
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const imageFileName = filename;
    const fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
    const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password);
    const keyPairZeroA = await (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString());
    if (!keyPairZeroA) {
        return;
    }
    const { address, publicKey } = keyPairZeroA;
    const messageToSign = `${fileInfo.filehash}${address}`;
    const stats = fs_1.default.statSync(fileReadPath);
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
    const { offsetend: offsetendInit, offsetstart: offsetstartInit, return: isContinueInit, } = resultWithOffesets;
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
                await (0, helpers_1.delay)(10);
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
            console.log(`completed ${readSize} from ${fileSize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(2)}%`);
            // upload
            const extraParamsForUpload = [
                {
                    filehash: fileInfo.filehash,
                    data: encodedFileChunk,
                },
            ];
            // isContinueGlobal = 0;
            (0, helpers_1.log)('from run.ts params for upload', extraParamsForUpload);
            const callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);
            console.log('call result upload', JSON.stringify(callResultUpload));
            const { response: responseUpload } = callResultUpload;
            console.log('🚀 ~ file: run.ts ~ line 766 ~ testIt ~ result', callResultUpload);
            if (!responseUpload) {
                console.log('we dont have response. it might be an error', callResultUpload);
                return;
            }
            const { result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload }, } = responseUpload;
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
    let resolvedChainID;
    const sdkEnv = sdkEnvTest;
    // const sdkEnv = sdkEnvDev;
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
        // pp a
        // ppNodeUrl: 'http://34.85.35.181',
        // ppNodePort: '8141',
        // pp b
        ppNodeUrl: 'http://52.14.150.146', ppNodePort: '8159' }));
    const hdPathIndex = 0;
    const phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
    const masterKeySeedInfo = await (0, keyManager_1.createMasterKeySeed)(phrase, password, hdPathIndex);
    console.log('masterKeySeedInfo', masterKeySeedInfo);
    const serialized = masterKeySeedInfo.encryptedWalletInfo;
    const _cosmosClient = await (0, cosmos_1.getCosmos)(serialized, password);
    // const filename = 'file4_10M_jan20';
    // const filename = 'file1_200M_jan22';
    // request and upload
    // await testIt(filename);
    // download the file
    const filehash = 'v05ahm51atjqkpte7gnqa94bl3p731odvvdvfvo8';
    const filesize = 200000000;
    const filename = 'file1_200M_jan22';
    // const filehash = 'v05ahm54qtdk0oogho52ujtk5v6rdlpbhumfshmg';
    // const filesize = 10000000;
    // const filename = 'file4_10M_jan20';
    // await testDl(filename, filehash, filesize);
    // await testRequestUserFileList(0);
    // await testReadAndWriteLocal(filename);
    await getBalanceCardMetrics(hdPathIndex);
    // await simulateSend();
    // await mainSdsPrepay(hdPathIndex);
    // await mainSend();
    // await testUploadRequest();
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
//# sourceMappingURL=run.js.map