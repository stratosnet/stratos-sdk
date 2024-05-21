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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const stratos = __importStar(require("./index"));
const helpers_1 = require("./services/helpers");
dotenv_1.default.config();
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
const runFaucet = async (hdPathIndex, givenMnemonic) => {
    const derivedKeyPair = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(givenMnemonic, hdPathIndex);
    if (!derivedKeyPair) {
        return;
    }
    const walletAddress = derivedKeyPair.address;
    console.log('walletAddress', walletAddress);
    const faucetUrl = stratos.Sdk.environment.faucetUrl || '';
    (0, helpers_1.log)(`will be useing faucetUrl - "${faucetUrl}"`);
    const result = await stratos.accounts.accountsApi.increaseBalance(walletAddress, faucetUrl, config_1.hdVault.stratosTopDenom);
    console.log('faucet result', result);
};
const getBalanceCardMetrics = async (hdPathIndex, givenMnemonic) => {
    const phrase = stratos.crypto.hdVault.mnemonic.convertStringToArray(givenMnemonic);
    const masterKeySeedInfo = await stratos.crypto.hdVault.keyManager.createMasterKeySeed(phrase, password, hdPathIndex);
    const encryptedMasterKeySeed = masterKeySeedInfo.encryptedMasterKeySeed.toString();
    const derivedKeyPair = await stratos.crypto.hdVault.wallet.deriveKeyPair(hdPathIndex, password, encryptedMasterKeySeed);
    if (!derivedKeyPair) {
        return;
    }
    const balanaces = await stratos.accounts.accountsApi.getBalanceCardMetrics(derivedKeyPair.address);
    console.log('balanace card metrics ', balanaces);
};
const getOzoneBalance = async (hdPathIndex, givenMnemonic) => {
    const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(givenMnemonic, hdPathIndex);
    if (!keyPairZero) {
        return;
    }
    const balance = await stratos.accounts.accountsApi.getOtherBalanceCardMetrics(keyPairZero.address);
    console.log(' new other balanace card metrics ', balance);
};
const mainSend = async (hdPathIndex, givenReceiverMnemonic = zeroUserMnemonic, hdPathIndexReceiver = 0) => {
    const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(givenReceiverMnemonic, hdPathIndex);
    const keyPairOne = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(givenReceiverMnemonic, hdPathIndexReceiver);
    if (!keyPairOne || !keyPairZero) {
        return;
    }
    const fromAddress = keyPairZero.address;
    const sendAmount = 1.25;
    const sendTxMessages = await stratos.chain.transactions.getSendTx(fromAddress, [
        { amount: sendAmount, toAddress: keyPairOne.address },
    ]);
    const signedTx = await stratos.chain.transactions.sign(fromAddress, sendTxMessages);
    if (signedTx) {
        try {
            const _result = await stratos.chain.transactions.broadcast(signedTx);
            console.log('broadcasting result!', _result);
        }
        catch (error) {
            const err = error;
            console.log('error broadcasting', err.message);
        }
    }
    await (0, helpers_1.delay)(3000);
    const balances = await stratos.accounts.accountsApi.getBalanceCardMetrics(keyPairOne.address);
    console.log('receiver balance', balances);
};
const mainSdsPrepay = async (hdPathIndex, givenReceiverMnemonic = zeroUserMnemonic) => {
    const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(givenReceiverMnemonic, hdPathIndex);
    if (!keyPairZero) {
        return;
    }
    const sendTxMessages = await stratos.sds.transactions.getSdsPrepayTx(keyPairZero.address, [{ amount: 10 }]);
    (0, helpers_1.dirLog)('from mainSdsPrepay - calling tx sign with this messageToSign', sendTxMessages);
    const signedTx = await stratos.chain.transactions.sign(keyPairZero.address, sendTxMessages);
    let attempts = 0;
    if (signedTx) {
        try {
            console.log('from mainSdsPrepay - calling tx broadcast');
            const result = await stratos.chain.transactions.broadcast(signedTx);
            console.log('broadcast prepay result', result);
        }
        catch (err) {
            console.log('error broadcasting', err.message);
            if (attempts <= 2) {
                attempts += 1;
                (0, helpers_1.dirLog)(`attempts ${attempts}, trying again the same signedTx`, signedTx);
                const result = await stratos.chain.transactions.broadcast(signedTx);
                console.log('broadcast prepay result', result);
            }
        }
    }
};
const testRequestUserFileList = async (hdPathIndex, page, givenReceiverMnemonic = zeroUserMnemonic) => {
    const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(givenReceiverMnemonic, hdPathIndex);
    if (!keyPairZero) {
        return;
    }
    const userFileList = await stratos.sds.remoteFileSystem.remoteFileSystemApi.getUploadedFileList(keyPairZero, page);
    console.log('retrieved user file list', userFileList);
};
const testItFileUpFromBuffer = async (hdPathIndex, filename, givenReceiverMnemonic = zeroUserMnemonic) => {
    const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(givenReceiverMnemonic, hdPathIndex);
    if (!keyPairZero) {
        return;
    }
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const fileReadPath = path_1.default.resolve(SRC_ROOT, filename);
    const resolvedFileName = path_1.default.basename(fileReadPath);
    const fileInfo = await stratos.filesystem.filesystemApi.getFileInfo(fileReadPath);
    const bufferOfTheFile = await stratos.filesystem.filesystemApi.getFileBuffer(fileReadPath);
    const myCb = (data) => {
        const { result: { success, code, details, message }, error, } = data;
        if (error) {
            (0, helpers_1.dirLog)('we have an error. data from myCb', data);
        }
        else if (success === false) {
            (0, helpers_1.log)('success is false. data from myCb', data);
        }
        else if (code ===
            stratos.sds.remoteFileSystem.remoteFileSystemTypes.UPLOAD_CODES.USER_UPLOAD_DATA_RESPONSE_CORRECT) {
            (0, helpers_1.log)('message -', message);
        }
        else if (code === stratos.sds.remoteFileSystem.remoteFileSystemTypes.UPLOAD_CODES.USER_UPLOAD_DATA_COMPLETED) {
            (0, helpers_1.log)('upload data completed message -', message);
        }
        else if (code === stratos.sds.remoteFileSystem.remoteFileSystemTypes.UPLOAD_CODES.USER_UPLOAD_DATA_FINISHED) {
            (0, helpers_1.dirLog)('upload confirmed details', details);
        }
    };
    const uploadResult = await stratos.sds.remoteFileSystem.remoteFileSystemApi.updloadFileFromBuffer(keyPairZero, bufferOfTheFile, resolvedFileName, fileInfo.filehash, fileInfo.size, myCb);
    (0, helpers_1.log)('done! function uploadResult', uploadResult);
};
const testFileDl = async (hdPathIndex, filename, filehash, filesize, givenReceiverMnemonic = zeroUserMnemonic) => {
    (0, helpers_1.log)(`Downloading file ${filename}`);
    const PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
    const SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
    const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(givenReceiverMnemonic, hdPathIndex);
    if (!keyPairZero) {
        return;
    }
    const filePathToSave = path_1.default.resolve(SRC_ROOT, `my_super_new_from_buff_${filename}`);
    await stratos.sds.remoteFileSystem.remoteFileSystemApi.downloadFile(keyPairZero, filePathToSave, filehash, filesize);
    (0, helpers_1.log)('Done. filePathToSave', filePathToSave);
};
const testRequestUserSharedFileList = async (hdPathIndex, page, givenReceiverMnemonic = zeroUserMnemonic) => {
    const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(givenReceiverMnemonic, hdPathIndex);
    if (!keyPairZero) {
        return;
    }
    const userFileList = await stratos.sds.remoteFileSystem.remoteFileSystemApi.getSharedFileList(keyPairZero, page);
    console.log('retrieved user shared file list', userFileList);
};
const testRequestUserFileShare = async (hdPathIndex, filehash, givenReceiverMnemonic = zeroUserMnemonic) => {
    const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(givenReceiverMnemonic, hdPathIndex);
    if (!keyPairZero) {
        return;
    }
    const userShareFileResult = await stratos.sds.remoteFileSystem.remoteFileSystemApi.shareFile(keyPairZero, filehash);
    console.log('retrieved user shared file result', userShareFileResult);
};
const main = async () => {
    const sdkEnv = sdkEnvDev;
    // const sdkEnv = sdkEnvTest;
    // const sdkEnv = sdkEnvMainNet;
    stratos.Sdk.init(Object.assign({}, sdkEnv));
    const { resolvedChainID, resolvedChainVersion, isNewProtocol } = await stratos.network.networkApi.getChainAndProtocolDetails();
    stratos.Sdk.init(Object.assign(Object.assign({}, sdkEnv), { chainId: resolvedChainID, nodeProtocolVersion: resolvedChainVersion, isNewProtocol, 
        // optional
        // keyPathParameters: keyPathParametersForSdk,
        // devnet
        // ppNodeUrl: 'http://35.187.47.46',
        // ppNodePort: '8142',
        ppNodeUrl: 'https://sds-dev-pp-8.thestratos.org' }));
    const hdPathIndex = 0;
    const _cosmosClient = await stratos.chain.cosmos.cosmosService.create(zeroUserMnemonic, hdPathIndex);
    // Create a wallet and show accounts
    // const wallet = await stratos.chain.cosmos.cosmosWallet.createWalletAtPath(hdPathIndex, zeroUserMnemonic);
    // console.log('wallet', wallet);
    // const a = await wallet.getAccounts();
    // console.log('a', a);
    // await runFaucet(hdPathIndex, zeroUserMnemonic);
    // await mainSdsPrepay(hdPathIndex, zeroUserMnemonic);
    // 1 Check balance
    await getBalanceCardMetrics(hdPathIndex, zeroUserMnemonic);
    // await getOzoneBalance(hdPathIndex, zeroUserMnemonic);
    // const hdPathIndexReceiver = 1;
    // await mainSend(hdPathIndex, zeroUserMnemonic, hdPathIndexReceiver);
    // 1a
    // await testRequestUserFileList(hdPathIndex, 0);
    // 2a - that is the file name - it has to be in ./src
    const filename = 'file10M_May_21_v1.bin';
    // await testItFileUpFromBuffer(hdPathIndex, filename);
    // 3a
    const filehash = 'v05j1m52f1862ohm438vtt2rgpgq49hramfrrsqo';
    const filesize = 10000001;
    // filename: 'file10M_May_21_v1.bin',
    // await testFileDl(hdPathIndex, filename, filehash, filesize);
    // 4a
    // await testRequestUserSharedFileList(hdPathIndex, 0);
    // 5a
    // const filehash = 'v05ahm504fq2q53pucu87do4cdcurggsoonhsmfo';
    // await testRequestUserFileShare(hdPathIndex, filehash);
};
main();
//# sourceMappingURL=run.js.map