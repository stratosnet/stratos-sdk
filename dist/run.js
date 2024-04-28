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
// import { fromBase64, fromHex, toAscii, toBase64, toBech32, toHex } from '@cosmjs/encoding';
const dotenv_1 = __importDefault(require("dotenv"));
// import fs from 'fs';
// import path from 'path';
// import type { KeyPathParameters } from './Sdk';
// import * as RemoteFilesystem from './sds/remoteFile';
// import * as SdsTypes from './sds/types';
// import { getCosmos, resetCosmos } from './chain/cosmos';
// import { SimpleObject } from 'services/walletService';
// import * as accounts from './accounts';
const config_1 = require("./config");
// import { mnemonic, wallet } from './hdVault';
// import { deserializeWithEncryptionKey, serializeWithEncryptionKey } from './hdVault/cosmosUtils';
// import * as cosmosWallet from './hdVault/cosmosWallet';
// import { createMasterKeySeed, getSerializedWalletFromPhrase } from './hdVault/keyManager';
// import * as keyUtils from './hdVault/keyUtils';
// import { deriveKeyPair, deserializeEncryptedWallet } from './hdVault/wallet';
// import Sdk from './Sdk';
const stratos = __importStar(require("./index"));
const helpers_1 = require("./services/helpers");
// import * as FilesystemService from './services/filesystem';
// import { delay, dirLog, getTimestampInSeconds, log } from './services/helpers';
// import * as Network from './services/network';
// import * as NetworkTypes from './services/network/types';
// import * as integration from './testing/integration/sdk_inegration_runner';
// import * as transactions from './transactions';
// import * as evm from './transactions/evm';
// import * as transactionTypes from './transactions/types';
// import * as validators from './validators';
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
    // console.log('run sendTxMessages ', sendTxMessages);
    // TxRaw
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
const main = async () => {
    const sdkEnv = sdkEnvDev;
    // const sdkEnv = sdkEnvTest;
    // const sdkEnv = sdkEnvMainNet;
    stratos.Sdk.init(Object.assign({}, sdkEnv));
    const { resolvedChainID, resolvedChainVersion, isNewProtocol } = await stratos.networkApi.getChainAndProtocolDetails();
    stratos.Sdk.init(Object.assign(Object.assign({}, sdkEnv), { chainId: resolvedChainID, nodeProtocolVersion: resolvedChainVersion, isNewProtocol, 
        // devnet
        // ppNodeUrl: 'http://35.187.47.46',
        // ppNodePort: '8142',
        // ppNodePort: '8146',
        // ppNodePort: '8150',
        // optional
        // keyPathParameters: keyPathParametersForSdk,
        // ppNodeUrl: '35.233.146.208',
        ppNodeUrl: 'https://sds-dev-pp-8.thestratos.org' }));
    // console.log('sdkEnv', Sdk.environment);
    // await evmSend();
    const hdPathIndex = 0;
    const testMnemonic = 'speed script velvet draft assault observe invest bracket sick item car switch fruit very rigid only about matrix gorilla local uphold kid morning face';
    // here is that mnemonic
    // const phrase = mnemonic.convertStringToArray(zeroUserMnemonic);
    // const masterKeySeedInfo = await createMasterKeySeed(phrase, password, hdPathIndex);
    // const serialized = masterKeySeedInfo.encryptedWalletInfo;
    // const serialized = '';
    // const _cosmosClient = await stratos.cosmos.cosmosService.getCosmos(serialized, password);
    const _cosmosClient = await stratos.chain.cosmos.cosmosService.create(zeroUserMnemonic, hdPathIndex);
    // const wallet = await stratos.chain.cosmos.cosmosWallet.createWalletAtPath(hdPathIndex, zeroUserMnemonic);
    // console.log('wallet', wallet);
    // const a = await wallet.getAccounts();
    // console.log('a', a);
    // const encryptedMasterKeySeed =
    // const phrase = stratos.crypto.hdVault.mnemonic.convertStringToArray(zeroUserMnemonic);
    // const masterKeySeedInfo = await stratos.crypto.hdVault.keyManager.createMasterKeySeed(
    //   phrase,
    //   password,
    //   hdPathIndex,
    // );
    // const b = masterKeySeedInfo.encryptedMasterKeySeed.toString();
    // const derivedKeyPair = await stratos.crypto.hdVault.wallet.deriveKeyPair(hdPathIndex, password, b);
    // console.log('derivedKeyPair', derivedKeyPair);
    // const serialized = stratos.cosmos.cosmosUtils.serializeWithEncryptionKey(password, wallet);
    // const _cosmosClient2 = await stratos.cosmos.cosmosService.getCosmos(serialized, password);
    // console.log('_cosmosClient2', _cosmosClient2);
    // testA();
    // 1a
    // await testRequestUserFileList(0, hdPathIndex);
    // 2a - that is the file name - it has to be in ./src
    // const filename = 'file2000M_April_4_v3.bin';
    // await testItFileUpFromBuffer(filename, hdPathIndex);
    // await testItFileUp(filename, hdPathIndex);
    // await testFileHash(filename, hdPathIndex);
    // 3a
    // const filehash = 'v05j1m51nj0f78oldq11lfvk3qobhb9rrj351n5g';
    // const filesize = 2_000_000_006;
    // const filename= 'file200M_March_23_v7';
    //
    // await testFileDl(hdPathIndex, filename, filehash, filesize);
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
    // await getBalanceCardMetrics(hdPathIndex, testMnemonic);
    // await getBalanceCardMetrics(hdPathIndex, mainnetDev);
    // await getAccountTransactions(0, mainnetDev);
    // const faucetMnemonic =''
    //
    // await getBalanceCardMetrics(hdPathIndex, mainnetDev);
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
    // console.log('receiverMnemonic', receiverMnemonic);
    // stvaloper1ql2uj69zf8xvrtfyj6pzehh8xhd2dt8enefsep: '21.9600 STOS',
    // stvaloper1zy9qal508nvc9h0xqmyz500mkuxhteu7wn4sgp: '2,097.6794 STOS',
    // stvaloper1dnt7mjfxskza094cwjvt70707ts2lc2hv9zrkh: '1,024.0000 STOS'
    // const validatorSrcAddress = 'stvaloper1dnt7mjfxskza094cwjvt70707ts2lc2hv9zrkh';
    // const validatorDstAddress = 'stvaloper1zy9qal508nvc9h0xqmyz500mkuxhteu7wn4sgp';
    // const redelegateAmount = 5;
    // await mainReDelegate(0, zeroUserMnemonic, validatorSrcAddress, validatorDstAddress, redelegateAmount);
    const hdPathIndexReceiver = 1;
    await mainSend(hdPathIndex, zeroUserMnemonic, hdPathIndexReceiver);
    // await getBalanceCardMetrics(hdPathIndexReceiver, zeroUserMnemonic);
    // const vAddress = 'stvaloper1dnt7mjfxskza094cwjvt70707ts2lc2hv9zrkh';
    // await mainDelegate(hdPathIndex, zeroUserMnemonic, vAddress, 1000);
    // 33 sec, 1m 1sec
    // testReadAndWriteLocal(filename);
    // 51 sec, 1m 38sec
    // testReadAndWriteLocalMultipleIo(filename);
    // const randomPrefix = Date.now() + '';
    // const rr = await integration.uploadFileToRemote(filename, randomPrefix, 0, zeroUserMnemonic);
    // await getTxHistory(zeroUserMnemonic, 0);
    // await getTxHistory(mainnetDev, 0);
    // await tmpTest(0, zeroUserMnemonic);
    //
    // await tmpTest(0, mainnetDev);
    // await testAccountData();
    // await testAddressConverstion(0);
};
main();
//# sourceMappingURL=run.js.map