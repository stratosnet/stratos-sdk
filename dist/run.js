"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { SigningStargateClient } from '@cosmjs/stargate';
var dotenv_1 = __importDefault(require("dotenv"));
var fs_1 = __importDefault(require("fs"));
// import keccak256 from 'keccak256';
// import md5File from 'md5-file';
// import multihashing from 'multihashing-async';
var path_1 = __importDefault(require("path"));
// import { Keccak } from 'sha3';
// import * as bigInteger from 'big-integer';
// import * as BigIntegerM from 'js-big-integer';
var accounts = __importStar(require("./accounts"));
var hdVault_1 = require("./hdVault");
var cosmosUtils_1 = require("./hdVault/cosmosUtils");
var keyManager_1 = require("./hdVault/keyManager");
var keyUtils = __importStar(require("./hdVault/keyUtils"));
var wallet_1 = require("./hdVault/wallet");
var Sdk_1 = __importDefault(require("./Sdk"));
var cosmos_1 = require("./services/cosmos");
var FilesystemService = __importStar(require("./services/filesystem"));
var Network = __importStar(require("./services/network"));
var transactions = __importStar(require("./transactions"));
var transactionTypes = __importStar(require("./transactions/types"));
var validators = __importStar(require("./validators"));
// import {
//   DirectSecp256k1HdWallet,
//   DirectSecp256k1Wallet,
//   makeAuthInfoBytes,
//   makeSignDoc,
//   OfflineSigner,
//   Registry,
//   TxBodyEncodeObject,
// } from '@cosmjs/proto-signing';
// import {
//   Bip39,
//   EnglishMnemonic,
//   HdPath,
//   Hmac,
//   ripemd160,
//   Secp256k1,
//   sha256,
//   Sha512,
//   Slip10Curve,
//   Slip10RawIndex,
//   stringToPath,
// } from '@cosmjs/crypto';
var encoding_1 = require("@cosmjs/encoding");
var config_1 = require("./config");
var helpers_1 = require("./services/helpers");
// import md5 from 'blueimp-md5';
// import crypto from 'crypto';
// import multihash from 'multihashes';
// import CID from 'cids';
dotenv_1.default.config();
var password = 'XXXX';
var _a = process.env.ZERO_MNEMONIC, zeroUserMnemonic = _a === void 0 ? '' : _a;
var sdkEnvDev = {
    restUrl: 'https://rest-dev.thestratos.org',
    rpcUrl: 'https://rpc-dev.thestratos.org',
    chainId: 'dev-chain-46',
    explorerUrl: 'https://explorer-dev.thestratos.org',
};
var sdkEnvTest = {
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
var mainFour = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                console.log('keyPairZero', keyPairZero);
                return [2 /*return*/];
        }
    });
}); };
// cosmosjs send
var mainSend = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, keyPairOne, keyPairTwo, fromAddress, sendAmount, sendTxMessages, signedTx, result, error_1, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(1, password, encryptedMasterKeySeedString)];
            case 3:
                keyPairOne = _a.sent();
                if (!keyPairOne) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(2, password, encryptedMasterKeySeedString)];
            case 4:
                keyPairTwo = _a.sent();
                if (!keyPairTwo) {
                    return [2 /*return*/];
                }
                fromAddress = keyPairZero.address;
                sendAmount = 4.2;
                return [4 /*yield*/, transactions.getSendTx(fromAddress, [
                        { amount: sendAmount, toAddress: keyPairOne.address },
                        { amount: sendAmount + 1, toAddress: keyPairTwo.address },
                    ])];
            case 5:
                sendTxMessages = _a.sent();
                return [4 /*yield*/, transactions.sign(fromAddress, sendTxMessages)];
            case 6:
                signedTx = _a.sent();
                if (!signedTx) return [3 /*break*/, 10];
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 8:
                result = _a.sent();
                console.log('broadcasting result!', result);
                return [3 /*break*/, 10];
            case 9:
                error_1 = _a.sent();
                err = error_1;
                console.log('error broadcasting', err.message);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
// cosmosjs delegate
var mainDelegate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var validatorAddress, phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, delegatorAddress, sendTxMessages, signedTx, result, error_2, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                delegatorAddress = keyPairZero.address;
                console.log('🚀 ~ file: run.ts ~ line 138 ~ mainDelegate ~ delegatorAddress', delegatorAddress);
                return [4 /*yield*/, transactions.getDelegateTx(delegatorAddress, [
                        { amount: 1, validatorAddress: validatorAddress },
                        { amount: 2, validatorAddress: validatorAddress },
                    ])];
            case 3:
                sendTxMessages = _a.sent();
                return [4 /*yield*/, transactions.sign(delegatorAddress, sendTxMessages)];
            case 4:
                signedTx = _a.sent();
                if (!signedTx) return [3 /*break*/, 8];
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 6:
                result = _a.sent();
                console.log('delegate broadcasting result!!! :)', result);
                return [3 /*break*/, 8];
            case 7:
                error_2 = _a.sent();
                err = error_2;
                console.log('error broadcasting', err.message);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
// cosmosjs undelegate
var mainUndelegate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var validatorAddress, phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, delegatorAddress, sendTxMessages, signedTx, result, error_3, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                delegatorAddress = keyPairZero.address;
                return [4 /*yield*/, transactions.getUnDelegateTx(delegatorAddress, [
                        { amount: 0.3, validatorAddress: validatorAddress },
                        { amount: 0.2, validatorAddress: validatorAddress },
                    ])];
            case 3:
                sendTxMessages = _a.sent();
                return [4 /*yield*/, transactions.sign(delegatorAddress, sendTxMessages)];
            case 4:
                signedTx = _a.sent();
                if (!signedTx) return [3 /*break*/, 8];
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 6:
                result = _a.sent();
                console.log('undelegate result :)', result);
                return [3 /*break*/, 8];
            case 7:
                error_3 = _a.sent();
                err = error_3;
                console.log('error broadcasting', err.message);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
// cosmosjs withdraw rewards
var mainWithdrawRewards = function () { return __awaiter(void 0, void 0, void 0, function () {
    var validatorAddress, phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, delegatorAddress, sendTxMessages, signedTx, result, error_4, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validatorAddress = 'stvaloper1hxrrqfpnddjcfk55tu5420rw8ta94032z3dm76';
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                delegatorAddress = keyPairZero.address;
                return [4 /*yield*/, transactions.getWithdrawalRewardTx(delegatorAddress, [
                        { validatorAddress: validatorAddress },
                        { validatorAddress: validatorAddress },
                    ])];
            case 3:
                sendTxMessages = _a.sent();
                return [4 /*yield*/, transactions.sign(delegatorAddress, sendTxMessages)];
            case 4:
                signedTx = _a.sent();
                if (!signedTx) return [3 /*break*/, 8];
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 6:
                result = _a.sent();
                console.log('delegate withdrawal result :)', result);
                return [3 /*break*/, 8];
            case 7:
                error_4 = _a.sent();
                err = error_4;
                console.log('error broadcasting', err.message);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
// cosmosjs withdraw all rewards
var mainWithdrawAllRewards = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, delegatorAddress, sendTxMessage, signedTx, result, error_5, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                delegatorAddress = keyPairZero.address;
                console.log('🚀 ~ file: run.ts ~ line 295 ~ mainWithdrawAllRewards ~ delegatorAddress', delegatorAddress);
                return [4 /*yield*/, transactions.getWithdrawalAllRewardTx(delegatorAddress)];
            case 3:
                sendTxMessage = _a.sent();
                return [4 /*yield*/, transactions.sign(delegatorAddress, sendTxMessage)];
            case 4:
                signedTx = _a.sent();
                if (!signedTx) return [3 /*break*/, 8];
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 6:
                result = _a.sent();
                console.log('delegate withdrawal all result :)', result);
                return [3 /*break*/, 8];
            case 7:
                error_5 = _a.sent();
                err = error_5;
                console.log('error broadcasting', err.message);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
// cosmosjs withdraw rewards
var mainSdsPrepay = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, sendTxMessages, signedTx, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 292 ~ mainSdsPrepay ~ keyPairZero', keyPairZero);
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, transactions.getSdsPrepayTx(keyPairZero.address, [{ amount: 3 }])];
            case 3:
                sendTxMessages = _a.sent();
                return [4 /*yield*/, transactions.sign(keyPairZero.address, sendTxMessages)];
            case 4:
                signedTx = _a.sent();
                if (!signedTx) return [3 /*break*/, 8];
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 6:
                result = _a.sent();
                console.log('broadcast prepay result', result);
                return [3 /*break*/, 8];
            case 7:
                err_1 = _a.sent();
                console.log('error broadcasting', err_1.message);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var uploadRequest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, filehash, walletaddr, messageToSign, signature, pubkeyMine, valid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 311 ~ uploadRequest ~ keyPairZero', keyPairZero);
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                filehash = 'v05ahm53rv07iscjr3cf5c8cjjmq1q64sb8d4aqo';
                walletaddr = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
                messageToSign = "" + filehash + walletaddr;
                return [4 /*yield*/, keyUtils.signWithPrivateKey(messageToSign, keyPairZero.privateKey)];
            case 3:
                signature = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 342 ~ uploadRequest ~ signature', signature);
                return [4 /*yield*/, keyUtils.getPublicKeyFromPrivKey((0, encoding_1.fromHex)(keyPairZero.privateKey))];
            case 4:
                pubkeyMine = _a.sent();
                return [4 /*yield*/, keyUtils.verifySignature(messageToSign, signature, pubkeyMine.value)];
            case 5:
                valid = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 349 ~ uploadRequest ~ valid', valid);
                return [2 /*return*/];
        }
    });
}); };
var getAccountTrasactions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var zeroAddress, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                zeroAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
                return [4 /*yield*/, accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.All, 1)];
            case 1:
                r = _a.sent();
                console.log('r!!', r.data);
                console.log('r!!', r.data[1]);
                return [2 /*return*/];
        }
    });
}); };
var getValidators = function () { return __awaiter(void 0, void 0, void 0, function () {
    var vData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, validators.getValidators()];
            case 1:
                vData = _a.sent();
                console.log('vData');
                return [2 /*return*/];
        }
    });
}); };
var mainBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, keyPairOne, keyPairTwo, b0, b1, b2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(1, password, encryptedMasterKeySeedString)];
            case 3:
                keyPairOne = _a.sent();
                if (!keyPairOne) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(2, password, encryptedMasterKeySeedString)];
            case 4:
                keyPairTwo = _a.sent();
                if (!keyPairTwo) {
                    return [2 /*return*/];
                }
                console.log('keyPairZero', keyPairZero.address);
                console.log('keyPairOne', keyPairOne.address);
                console.log('keyPairTwo', keyPairTwo.address);
                return [4 /*yield*/, accounts.getBalance(keyPairZero.address, 'ustos')];
            case 5:
                b0 = _a.sent();
                return [4 /*yield*/, accounts.getBalance(keyPairOne.address, 'ustos')];
            case 6:
                b1 = _a.sent();
                return [4 /*yield*/, accounts.getBalance(keyPairTwo.address, 'ustos')];
            case 7:
                b2 = _a.sent();
                console.log('our bal keyPairZero', b0);
                console.log('our bal keyPairOne', b1);
                console.log('our bal keyPairTwo', b2);
                return [2 /*return*/];
        }
    });
}); };
var getDelegatedBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, address, bResult, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                console.log('keyPairZero', keyPairZero.address);
                address = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
                return [4 /*yield*/, Network.getDelegatedBalance(address)];
            case 3:
                bResult = _a.sent();
                response = bResult.response;
                console.log('our delegated balanace', response === null || response === void 0 ? void 0 : response.result[0].balance);
                return [2 /*return*/];
        }
    });
}); };
var getUnboundingBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, address, bResult, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                console.log('keyPairZero', keyPairZero.address);
                address = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
                return [4 /*yield*/, Network.getUnboundingBalance(address)];
            case 3:
                bResult = _a.sent();
                response = bResult.response;
                console.log('our unbounding balanace', response === null || response === void 0 ? void 0 : response.result); // an array ?
                return [2 /*return*/];
        }
    });
}); };
var getRewardBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, address, bResult, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                console.log('keyPairZero', keyPairZero.address);
                address = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
                return [4 /*yield*/, Network.getRewardBalance(address)];
            case 3:
                bResult = _a.sent();
                response = bResult.response;
                console.log('our reward balanace', response === null || response === void 0 ? void 0 : response.result.rewards); // an array ?
                return [2 /*return*/];
        }
    });
}); };
var getOzoneBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, callResultB;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Network.sendUserRequestGetOzone([{ walletaddr: keyPairZero.address }])];
            case 3:
                callResultB = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 296 ~ mainSdsPrepay ~ callResultB', callResultB);
                return [2 /*return*/];
        }
    });
}); };
var getBalanceCardMetrics = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, delegatorAddress, b;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 464 ~ getBalanceCardMetrics ~ keyPairZero', keyPairZero);
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                delegatorAddress = keyPairZero.address;
                return [4 /*yield*/, accounts.getBalanceCardMetrics(delegatorAddress)];
            case 3:
                b = _a.sent();
                console.log('balanace card metrics ', b);
                return [2 /*return*/];
        }
    });
}); };
var formatBalanceFromWei = function () {
    var amount = '50000';
    var balanceOne = accounts.formatBalanceFromWei(amount, 4);
    console.log('🚀 ~ file: run.ts ~ line 464 ~ formatBalanceFromWei ~ balanceOne', balanceOne);
    var balanceTwo = accounts.formatBalanceFromWei(amount, 5, true);
    console.log('🚀 ~ file: run.ts ~ line 466 ~ formatBalanceFromWei ~ balanceTwo', balanceTwo);
};
var runFaucet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, faucetUrl, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                walletAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
                faucetUrl = 'https://faucet-dev.thestratos.org/credit';
                return [4 /*yield*/, accounts.increaseBalance(walletAddress, faucetUrl, config_1.hdVault.stratosTopDenom)];
            case 1:
                result = _a.sent();
                console.log('faucet result', result);
                return [2 /*return*/];
        }
    });
}); };
var getTxHistory = function () { return __awaiter(void 0, void 0, void 0, function () {
    var wallet, firstAccount, zeroAddress, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, keyUtils.createWalletAtPath(0, zeroUserMnemonic)];
            case 1:
                wallet = _a.sent();
                console.log('running getTxHistory');
                return [4 /*yield*/, wallet.getAccounts()];
            case 2:
                firstAccount = (_a.sent())[0];
                zeroAddress = firstAccount.address;
                return [4 /*yield*/, accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Transfer, 1)];
            case 3:
                result = _a.sent();
                console.log('hist result!! !', result);
                return [2 /*return*/, true];
        }
    });
}); };
var cosmosWalletCreateTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeedInfo, encryptedMasterKeySeed, encryptedWalletInfo, encryptedMasterKeySeedString, derivedMasterKeySeed, newWallet, f, keyPairZeroA;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeedInfo = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 512 ~ cosmosWalletCreateTest ~ masterKeySeedInfo', masterKeySeedInfo);
                encryptedMasterKeySeed = masterKeySeedInfo.encryptedMasterKeySeed, encryptedWalletInfo = masterKeySeedInfo.encryptedWalletInfo;
                encryptedMasterKeySeedString = encryptedMasterKeySeed.toString();
                return [4 /*yield*/, keyUtils.unlockMasterKeySeed(password, encryptedMasterKeySeedString)];
            case 2:
                derivedMasterKeySeed = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 517 ~ cosmosWalletCreateTest ~ derivedMasterKeySeed', derivedMasterKeySeed);
                return [4 /*yield*/, (0, cosmosUtils_1.deserializeWithEncryptionKey)(password, encryptedWalletInfo)];
            case 3:
                newWallet = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 524 ~ cosmosWalletCreateTest ~ newWallet', newWallet);
                return [4 /*yield*/, newWallet.getAccounts()];
            case 4:
                f = (_a.sent())[0];
                console.log('🚀 ~ file: run.ts ~ line 527 ~ cosmosWalletCreateTest ~ f', f);
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString())];
            case 5:
                keyPairZeroA = _a.sent();
                console.log('keyPairZeroA from crearted masterKeySeedInfo', keyPairZeroA);
                return [2 /*return*/];
        }
    });
}); };
var testAccountData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var wallet, firstAccount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, keyUtils.createWalletAtPath(0, zeroUserMnemonic)];
            case 1:
                wallet = _a.sent();
                return [4 /*yield*/, wallet.getAccounts()];
            case 2:
                firstAccount = (_a.sent())[0];
                console.log('🚀 ~ file: run.ts ~ line 621 ~ testAccountData ~ firstAccount', firstAccount);
                return [2 /*return*/];
        }
    });
}); };
// async function processFile(path: string, handler: any) {
var testFile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var PROJECT_ROOT, SRC_ROOT, imageFileName, fileReadPath, fileWritePath, buff, base64dataOriginal, chunksOfBuffers, fullBuf, base64dataFullBuf, chunksOfBase64Promises, chunksOfBase64, restoredChunksOfBuffers, buffWriteT, base64data, buffWrite;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
                SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
                imageFileName = 'stratos_landing_page.png';
                fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
                fileWritePath = path_1.default.resolve(SRC_ROOT, "new_" + imageFileName);
                console.log('🚀 ~ file: run.ts ~ line 631 ~ testFile ~ fileReadPath', fileReadPath);
                buff = fs_1.default.readFileSync(fileReadPath);
                base64dataOriginal = buff.toString('base64');
                return [4 /*yield*/, FilesystemService.getFileChunks(fileReadPath)];
            case 1:
                chunksOfBuffers = _a.sent();
                fullBuf = Buffer.concat(chunksOfBuffers);
                base64dataFullBuf = fullBuf.toString('base64');
                chunksOfBase64Promises = chunksOfBuffers.map(function (chunk) { return __awaiter(void 0, void 0, void 0, function () {
                    var pp;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, FilesystemService.encodeBuffer(chunk)];
                            case 1:
                                pp = _a.sent();
                                return [2 /*return*/, pp];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(chunksOfBase64Promises)];
            case 2:
                chunksOfBase64 = _a.sent();
                restoredChunksOfBuffers = chunksOfBase64.map(function (base64dataChunk) {
                    return Buffer.from(base64dataChunk, 'base64');
                });
                buffWriteT = Buffer.concat(restoredChunksOfBuffers);
                base64data = buffWriteT.toString('base64');
                console.log('🚀 ~ file: run.ts ~ line 720 ~ testFile ~ base64dataOriginal', base64dataOriginal.length);
                console.log('🚀 ~ file: run.ts ~ line 729 ~ testFile ~ base64data', base64data.length);
                console.log('🚀 ~ file: run.ts ~ line 729 ~ testFile ~ base64dataFullBuf', base64dataFullBuf.length);
                buffWrite = Buffer.from(base64data, 'base64');
                fs_1.default.writeFileSync(fileWritePath, buffWrite);
                return [2 /*return*/];
        }
    });
}); };
var testFileHash = function () { return __awaiter(void 0, void 0, void 0, function () {
    var PROJECT_ROOT, SRC_ROOT, imageFileName, expectedHash, fileReadPath, realFileHash2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
                SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
                imageFileName = 'stratos_landing_page.png';
                expectedHash = 'v05ahm53rv07iscjr3cf5c8cjjmq1q64sb8d4aqo';
                fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
                return [4 /*yield*/, FilesystemService.calculateFileHash(fileReadPath)];
            case 1:
                realFileHash2 = _a.sent();
                console.log('🚀 ~  ~ realFileHash2', realFileHash2);
                console.log('🚀 ~   ~ expectedHash', expectedHash);
                return [2 /*return*/];
        }
    });
}); };
var testUploadRequest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var PROJECT_ROOT, SRC_ROOT, imageFileName, fileReadPath, fileInfo, phrase, masterKeySeedInfo, keyPairZeroA, address, publicKey, messageToSign, signature, extraParams, callResult, response, connectedUrl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
                SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
                imageFileName = 'file100M1';
                fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
                return [4 /*yield*/, FilesystemService.getFileInfo(fileReadPath)];
            case 1:
                fileInfo = _a.sent();
                console.log('file info', fileInfo);
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 2:
                masterKeySeedInfo = _a.sent();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString())];
            case 3:
                keyPairZeroA = _a.sent();
                // console.log('🚀 ~ file: run.ts ~ line 617 ~ testUploadRequest ~ keyPairZeroA', keyPairZeroA);
                if (!keyPairZeroA) {
                    return [2 /*return*/];
                }
                address = keyPairZeroA.address, publicKey = keyPairZeroA.publicKey;
                messageToSign = "" + fileInfo.filehash + address;
                return [4 /*yield*/, keyUtils.signWithPrivateKey(messageToSign, keyPairZeroA.privateKey)];
            case 4:
                signature = _a.sent();
                extraParams = [
                    {
                        filename: imageFileName,
                        filesize: fileInfo.size,
                        filehash: fileInfo.filehash,
                        walletaddr: address,
                        walletpubkey: publicKey,
                        signature: signature,
                    },
                ];
                return [4 /*yield*/, Network.sendUserRequestUpload(extraParams)];
            case 5:
                callResult = _a.sent();
                response = callResult.response;
                console.log('🚀 ~ file: run.ts ~ line 905 ~ testIt ~ response', JSON.stringify(response, null, 2));
                // now upload itself
                if (!response) {
                    return [2 /*return*/];
                }
                connectedUrl = Sdk_1.default.environment.ppNodeUrl + ":" + Sdk_1.default.environment.ppNodePort;
                return [2 /*return*/, {
                        data: "response from " + connectedUrl,
                        response: response,
                    }];
        }
    });
}); };
var testRequestUsetFileList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeedInfo, keyPairZeroA, address, extraParams, callResult, response, connectedUrl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeedInfo = _a.sent();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString())];
            case 2:
                keyPairZeroA = _a.sent();
                if (!keyPairZeroA) {
                    return [2 /*return*/];
                }
                address = keyPairZeroA.address;
                extraParams = [
                    {
                        walletaddr: address,
                        // walletpubkey: publicKey,
                        page: 0,
                    },
                ];
                return [4 /*yield*/, Network.sendUserRequestList(extraParams)];
            case 3:
                callResult = _a.sent();
                response = callResult.response;
                console.log('file list request result', JSON.stringify(callResult));
                // now upload itself
                if (!response) {
                    return [2 /*return*/];
                }
                connectedUrl = Sdk_1.default.environment.ppNodeUrl + ":" + Sdk_1.default.environment.ppNodePort;
                return [2 /*return*/, {
                        data: "response from " + connectedUrl,
                        response: response,
                    }];
        }
    });
}); };
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
var testReadAndWriteLocal = function (filename) { return __awaiter(void 0, void 0, void 0, function () {
    var PROJECT_ROOT, SRC_ROOT, imageFileName, fileReadPath, fileInfo, readSize, stats, fileSize, step, offsetStart, offsetEnd, encodedFileChunks, completedProgress, readBinaryFile, fileChunk, encodedFileChunk, fileWritePath, fileWritePathFromBuff, decodedChunksList, decodedFile, encodedFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
                SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
                imageFileName = filename;
                fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
                return [4 /*yield*/, FilesystemService.getFileInfo(fileReadPath)];
            case 1:
                fileInfo = _a.sent();
                console.log('fileInfo', fileInfo);
                readSize = 0;
                stats = fs_1.default.statSync(fileReadPath);
                fileSize = stats.size;
                console.log('stats', stats);
                step = 5000000;
                offsetStart = 0;
                offsetEnd = step;
                encodedFileChunks = [];
                completedProgress = 0;
                return [4 /*yield*/, FilesystemService.getFileBuffer(fileReadPath)];
            case 2:
                readBinaryFile = _a.sent();
                _a.label = 3;
            case 3:
                if (!(readSize < fileSize)) return [3 /*break*/, 5];
                fileChunk = readBinaryFile.slice(offsetStart, offsetEnd);
                // }
                // else {
                //   let remained = readChunkSize;
                //   const subChunks = [];
                //   while (remained > 0) {
                //     const currentStep = remained > maxStep ? maxStep : remained;
                //     subChunks.push(currentStep);
                //
                //     remained = remained - currentStep;
                //   }
                //   const myList = [];
                //
                //   for (const chunkLength of subChunks) {
                //     const chunkMini = await FilesystemService.getFileChunk(fileStream, chunkLength);
                //
                //     await delay(100);
                //     myList.push(chunkMini);
                //   }
                //
                //   const filteredList = myList.filter(Boolean);
                //
                //   const aggregatedBuf = Buffer.concat(filteredList);
                //   fileChunk = aggregatedBuf;
                // }
                if (!fileChunk) {
                    return [3 /*break*/, 5];
                }
                return [4 /*yield*/, FilesystemService.encodeBuffer(fileChunk)];
            case 4:
                encodedFileChunk = _a.sent();
                readSize = readSize + fileChunk.length;
                completedProgress = (100 * readSize) / fileSize;
                console.log("completed " + readSize + " from " + fileSize + " bytes, or " + (Math.round(completedProgress * 100) / 100).toFixed(2) + "%");
                offsetStart = offsetEnd;
                offsetEnd = offsetEnd + step;
                encodedFileChunks.push(encodedFileChunk);
                return [3 /*break*/, 3];
            case 5:
                fileWritePath = path_1.default.resolve(SRC_ROOT, "my_new_" + filename);
                fileWritePathFromBuff = path_1.default.resolve(SRC_ROOT, "my_new_from_buff_" + filename);
                console.log('fileWritePath ', fileWritePath);
                console.log('encoded file chunks length', encodedFileChunks.length);
                return [4 /*yield*/, FilesystemService.decodeFileChunks(encodedFileChunks)];
            case 6:
                decodedChunksList = _a.sent();
                console.log('decodeFileChunks length - should be 576', decodedChunksList.length);
                decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
                console.log('we should see decodedFile length (combined from decodedChunksList array)', decodedFile.length);
                FilesystemService.writeFile(fileWritePathFromBuff, decodedFile);
                console.log('we should have an entire file written');
                return [4 /*yield*/, FilesystemService.encodeFile(decodedFile)];
            case 7:
                encodedFile = _a.sent();
                console.log('this is not be shown as the string is way too long');
                return [4 /*yield*/, FilesystemService.writeFileToPath(fileWritePath, encodedFile)];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var testReadAndWriteLocalWorking = function (filename) { return __awaiter(void 0, void 0, void 0, function () {
    var PROJECT_ROOT, SRC_ROOT, imageFileName, fileReadPath, fileInfo, fileStream, readSize, stats, fileSize, step, offsetStart, offsetEnd, maxStep, readChunkSize, encodedFileChunks, completedProgress, fileChunk, remained, subChunks, currentStep, myList, _i, subChunks_1, chunkLength, chunkMini, filteredList, aggregatedBuf, encodedFileChunk, fileWritePath, fileWritePathFromBuff, decodedChunksList, decodedFile, encodedFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
                SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
                imageFileName = filename;
                fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
                return [4 /*yield*/, FilesystemService.getFileInfo(fileReadPath)];
            case 1:
                fileInfo = _a.sent();
                console.log('fileInfo', fileInfo);
                return [4 /*yield*/, FilesystemService.getUploadFileStream(fileReadPath)];
            case 2:
                fileStream = _a.sent();
                readSize = 0;
                stats = fs_1.default.statSync(fileReadPath);
                fileSize = stats.size;
                console.log('stats', stats);
                step = 5000000;
                offsetStart = 0;
                offsetEnd = step;
                maxStep = 65536;
                readChunkSize = offsetEnd - offsetStart;
                encodedFileChunks = [];
                completedProgress = 0;
                _a.label = 3;
            case 3:
                if (!(readSize < fileSize)) return [3 /*break*/, 14];
                fileChunk = void 0;
                if (!(readChunkSize < maxStep)) return [3 /*break*/, 5];
                return [4 /*yield*/, FilesystemService.getFileChunk(fileStream, readChunkSize)];
            case 4:
                fileChunk = _a.sent();
                return [3 /*break*/, 11];
            case 5:
                remained = readChunkSize;
                subChunks = [];
                while (remained > 0) {
                    currentStep = remained > maxStep ? maxStep : remained;
                    subChunks.push(currentStep);
                    remained = remained - currentStep;
                }
                myList = [];
                _i = 0, subChunks_1 = subChunks;
                _a.label = 6;
            case 6:
                if (!(_i < subChunks_1.length)) return [3 /*break*/, 10];
                chunkLength = subChunks_1[_i];
                return [4 /*yield*/, FilesystemService.getFileChunk(fileStream, chunkLength)];
            case 7:
                chunkMini = _a.sent();
                return [4 /*yield*/, delay(100)];
            case 8:
                _a.sent();
                myList.push(chunkMini);
                _a.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 6];
            case 10:
                filteredList = myList.filter(Boolean);
                aggregatedBuf = Buffer.concat(filteredList);
                fileChunk = aggregatedBuf;
                _a.label = 11;
            case 11:
                if (!fileChunk) {
                    return [3 /*break*/, 14];
                }
                if (!fileChunk) return [3 /*break*/, 13];
                return [4 /*yield*/, FilesystemService.encodeBuffer(fileChunk)];
            case 12:
                encodedFileChunk = _a.sent();
                readSize = readSize + fileChunk.length;
                completedProgress = (100 * readSize) / fileSize;
                console.log("completed " + readSize + " from " + fileSize + " bytes, or " + (Math.round(completedProgress * 100) / 100).toFixed(2) + "%");
                offsetStart = offsetEnd;
                offsetEnd = offsetEnd + step;
                encodedFileChunks.push(encodedFileChunk);
                _a.label = 13;
            case 13: return [3 /*break*/, 3];
            case 14:
                fileWritePath = path_1.default.resolve(SRC_ROOT, "my_new_" + filename);
                fileWritePathFromBuff = path_1.default.resolve(SRC_ROOT, "my_new_from_buff_" + filename);
                console.log('fileWritePath ', fileWritePath);
                console.log('encoded file chunks length', encodedFileChunks.length);
                return [4 /*yield*/, FilesystemService.decodeFileChunks(encodedFileChunks)];
            case 15:
                decodedChunksList = _a.sent();
                console.log('decodeFileChunks length - should be 576', decodedChunksList.length);
                decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
                console.log('we should see decodedFile length (combined from decodedChunksList array)', decodedFile.length);
                FilesystemService.writeFile(fileWritePathFromBuff, decodedFile);
                console.log('we should have an entire file written');
                return [4 /*yield*/, FilesystemService.encodeFile(decodedFile)];
            case 16:
                encodedFile = _a.sent();
                console.log('this is not be shown as the string is way too long');
                return [4 /*yield*/, FilesystemService.writeFileToPath(fileWritePath, encodedFile)];
            case 17:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// request upload and upload
var testIt = function (filename) { return __awaiter(void 0, void 0, void 0, function () {
    var PROJECT_ROOT, SRC_ROOT, imageFileName, fileReadPath, fileInfo, phrase, masterKeySeedInfo, keyPairZeroA, address, publicKey, messageToSign, stats, fileSize, signature, extraParams, callResultInit, responseInit, resultWithOffesets, offsetStartGlobal, offsetEndGlobal, isContinueGlobal, offsetendInit, offsetstartInit, isContinueInit, readSize, completedProgress, readBinaryFile, fileChunk, encodedFileChunk, extraParamsForUpload, callResultUpload, responseUpload, _a, offsetendUpload, offsetstartUpload, isContinueUpload;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
                SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
                imageFileName = filename;
                fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
                return [4 /*yield*/, FilesystemService.getFileInfo(fileReadPath)];
            case 1:
                fileInfo = _b.sent();
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 2:
                masterKeySeedInfo = _b.sent();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString())];
            case 3:
                keyPairZeroA = _b.sent();
                if (!keyPairZeroA) {
                    return [2 /*return*/];
                }
                address = keyPairZeroA.address, publicKey = keyPairZeroA.publicKey;
                messageToSign = "" + fileInfo.filehash + address;
                stats = fs_1.default.statSync(fileReadPath);
                fileSize = stats.size;
                console.log('stats', stats);
                return [4 /*yield*/, keyUtils.signWithPrivateKey(messageToSign, keyPairZeroA.privateKey)];
            case 4:
                signature = _b.sent();
                extraParams = [
                    {
                        filename: imageFileName,
                        filesize: fileInfo.size,
                        filehash: fileInfo.filehash,
                        walletaddr: address,
                        walletpubkey: publicKey,
                        signature: signature,
                    },
                ];
                return [4 /*yield*/, Network.sendUserRequestUpload(extraParams)];
            case 5:
                callResultInit = _b.sent();
                responseInit = callResultInit.response;
                console.log('call result init', JSON.stringify(callResultInit));
                if (!responseInit) {
                    console.log('we dont have response. it might be an error', callResultInit);
                    return [2 /*return*/];
                }
                resultWithOffesets = responseInit.result;
                console.log('result with offesets', resultWithOffesets);
                offsetStartGlobal = 0;
                offsetEndGlobal = 0;
                isContinueGlobal = 0;
                offsetendInit = resultWithOffesets.offsetend, offsetstartInit = resultWithOffesets.offsetstart, isContinueInit = resultWithOffesets.return;
                if (offsetendInit === undefined) {
                    console.log('a we dont have an offest. could be an error. response is', responseInit);
                    return [2 /*return*/];
                }
                if (offsetstartInit === undefined) {
                    console.log('b we dont have an offest. could be an error. response is', responseInit);
                    return [2 /*return*/];
                }
                readSize = 0;
                completedProgress = 0;
                isContinueGlobal = +isContinueInit;
                offsetStartGlobal = +offsetstartInit;
                offsetEndGlobal = +offsetendInit;
                return [4 /*yield*/, FilesystemService.getFileBuffer(fileReadPath)];
            case 6:
                readBinaryFile = _b.sent();
                _b.label = 7;
            case 7:
                if (!(isContinueGlobal === 1)) return [3 /*break*/, 11];
                fileChunk = readBinaryFile.slice(offsetStartGlobal, offsetEndGlobal);
                // fileChunk = await FilesystemService.getFileChunk(fileStream, readChunkSize);
                // } else {
                //   let remained = readChunkSize;
                //   const subChunks = [];
                //   while (remained > 0) {
                //     const currentStep = remained > maxStep ? maxStep : remained;
                //     subChunks.push(currentStep);
                //
                //     remained = remained - currentStep;
                //   }
                //   const myList = [];
                //
                //   for (const chunkLength of subChunks) {
                //     const chunkMini = await FilesystemService.getFileChunk(fileStream, chunkLength);
                //
                //     await delay(10);
                //     myList.push(chunkMini);
                //   }
                //   const filteredList = myList.filter(Boolean);
                //
                //   const aggregatedBuf = Buffer.concat(filteredList);
                //   // console.log('aggregatedBuf', aggregatedBuf);
                //   fileChunk = aggregatedBuf;
                // }
                if (!fileChunk) {
                    console.log('fileChunk is missing, Exiting ', fileChunk);
                    return [3 /*break*/, 11];
                }
                (0, helpers_1.log)('from run.ts - completed before encoding a chunk to base64', completedProgress);
                if (!fileChunk) return [3 /*break*/, 10];
                return [4 /*yield*/, FilesystemService.encodeBuffer(fileChunk)];
            case 8:
                encodedFileChunk = _b.sent();
                readSize = readSize + fileChunk.length;
                completedProgress = (100 * readSize) / fileSize;
                (0, helpers_1.log)("from run.ts - completed " + readSize + " from " + fileSize + " bytes, or " + (Math.round(completedProgress * 100) / 100).toFixed(2) + "%");
                extraParamsForUpload = [
                    {
                        filehash: fileInfo.filehash,
                        data: encodedFileChunk,
                    },
                ];
                // isContinueGlobal = 0;
                // log('from run.ts - completed', completedProgress);
                (0, helpers_1.log)('from run.ts - will call upload', offsetStartGlobal, offsetEndGlobal);
                return [4 /*yield*/, Network.sendUserUploadData(extraParamsForUpload)];
            case 9:
                callResultUpload = _b.sent();
                (0, helpers_1.log)('call result upload', JSON.stringify(callResultUpload));
                responseUpload = callResultUpload.response;
                (0, helpers_1.log)('🚀 ~ file: run.ts ~ line 766 ~ testIt ~ result', callResultUpload);
                if (!responseUpload) {
                    console.log('we dont have response. it might be an error', callResultUpload);
                    return [2 /*return*/];
                }
                _a = responseUpload.result, offsetendUpload = _a.offsetend, offsetstartUpload = _a.offsetstart, isContinueUpload = _a.return;
                if (offsetendUpload === undefined) {
                    console.log('1 we dont have an offest. could be an error. response is', responseUpload);
                    return [2 /*return*/];
                }
                if (offsetstartUpload === undefined) {
                    console.log('2 we dont have an offest. could be an error. response is', responseUpload);
                    return [2 /*return*/];
                }
                isContinueGlobal = +isContinueUpload;
                offsetStartGlobal = +offsetstartUpload;
                offsetEndGlobal = +offsetendUpload;
                _b.label = 10;
            case 10: return [3 /*break*/, 7];
            case 11: return [2 /*return*/];
        }
    });
}); };
var testItWorking = function (filename) { return __awaiter(void 0, void 0, void 0, function () {
    var PROJECT_ROOT, SRC_ROOT, imageFileName, fileReadPath, fileInfo, phrase, masterKeySeedInfo, keyPairZeroA, address, publicKey, messageToSign, stats, fileSize, signature, extraParams, callResultInit, responseInit, resultWithOffesets, offsetStartGlobal, offsetEndGlobal, isContinueGlobal, offsetendInit, offsetstartInit, isContinueInit, fileStream, readSize, maxStep, completedProgress, readChunkSize, fileChunk, remained, subChunks, currentStep, myList, _i, subChunks_2, chunkLength, chunkMini, filteredList, aggregatedBuf, encodedFileChunk, extraParamsForUpload, callResultUpload, responseUpload, _a, offsetendUpload, offsetstartUpload, isContinueUpload;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
                SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
                imageFileName = filename;
                fileReadPath = path_1.default.resolve(SRC_ROOT, imageFileName);
                return [4 /*yield*/, FilesystemService.getFileInfo(fileReadPath)];
            case 1:
                fileInfo = _b.sent();
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 2:
                masterKeySeedInfo = _b.sent();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, masterKeySeedInfo.encryptedMasterKeySeed.toString())];
            case 3:
                keyPairZeroA = _b.sent();
                if (!keyPairZeroA) {
                    return [2 /*return*/];
                }
                address = keyPairZeroA.address, publicKey = keyPairZeroA.publicKey;
                messageToSign = "" + fileInfo.filehash + address;
                stats = fs_1.default.statSync(fileReadPath);
                fileSize = stats.size;
                console.log('stats', stats);
                return [4 /*yield*/, keyUtils.signWithPrivateKey(messageToSign, keyPairZeroA.privateKey)];
            case 4:
                signature = _b.sent();
                extraParams = [
                    {
                        filename: imageFileName,
                        filesize: fileInfo.size,
                        filehash: fileInfo.filehash,
                        walletaddr: address,
                        walletpubkey: publicKey,
                        signature: signature,
                    },
                ];
                return [4 /*yield*/, Network.sendUserRequestUpload(extraParams)];
            case 5:
                callResultInit = _b.sent();
                responseInit = callResultInit.response;
                console.log('call result init', JSON.stringify(callResultInit));
                if (!responseInit) {
                    console.log('we dont have response. it might be an error', callResultInit);
                    return [2 /*return*/];
                }
                resultWithOffesets = responseInit.result;
                console.log('result with offesets', resultWithOffesets);
                offsetStartGlobal = 0;
                offsetEndGlobal = 0;
                isContinueGlobal = 0;
                offsetendInit = resultWithOffesets.offsetend, offsetstartInit = resultWithOffesets.offsetstart, isContinueInit = resultWithOffesets.return;
                if (offsetendInit === undefined) {
                    console.log('a we dont have an offest. could be an error. response is', responseInit);
                    return [2 /*return*/];
                }
                if (offsetstartInit === undefined) {
                    console.log('b we dont have an offest. could be an error. response is', responseInit);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, FilesystemService.getUploadFileStream(fileReadPath)];
            case 6:
                fileStream = _b.sent();
                readSize = 0;
                maxStep = 65536;
                completedProgress = 0;
                isContinueGlobal = +isContinueInit;
                offsetStartGlobal = +offsetstartInit;
                offsetEndGlobal = +offsetendInit;
                _b.label = 7;
            case 7:
                if (!(isContinueGlobal === 1)) return [3 /*break*/, 19];
                readChunkSize = offsetEndGlobal - offsetStartGlobal;
                fileChunk = void 0;
                if (!(readChunkSize < maxStep)) return [3 /*break*/, 9];
                return [4 /*yield*/, FilesystemService.getFileChunk(fileStream, readChunkSize)];
            case 8:
                fileChunk = _b.sent();
                return [3 /*break*/, 15];
            case 9:
                remained = readChunkSize;
                subChunks = [];
                while (remained > 0) {
                    currentStep = remained > maxStep ? maxStep : remained;
                    subChunks.push(currentStep);
                    remained = remained - currentStep;
                }
                myList = [];
                _i = 0, subChunks_2 = subChunks;
                _b.label = 10;
            case 10:
                if (!(_i < subChunks_2.length)) return [3 /*break*/, 14];
                chunkLength = subChunks_2[_i];
                return [4 /*yield*/, FilesystemService.getFileChunk(fileStream, chunkLength)];
            case 11:
                chunkMini = _b.sent();
                return [4 /*yield*/, delay(10)];
            case 12:
                _b.sent();
                myList.push(chunkMini);
                _b.label = 13;
            case 13:
                _i++;
                return [3 /*break*/, 10];
            case 14:
                filteredList = myList.filter(Boolean);
                aggregatedBuf = Buffer.concat(filteredList);
                // console.log('aggregatedBuf', aggregatedBuf);
                fileChunk = aggregatedBuf;
                _b.label = 15;
            case 15:
                if (!fileChunk) {
                    console.log('fileChunk is missing, Exiting ', fileChunk);
                    return [3 /*break*/, 19];
                }
                if (!fileChunk) return [3 /*break*/, 18];
                return [4 /*yield*/, FilesystemService.encodeBuffer(fileChunk)];
            case 16:
                encodedFileChunk = _b.sent();
                readSize = readSize + fileChunk.length;
                completedProgress = (100 * readSize) / fileSize;
                console.log("completed " + readSize + " from " + fileSize + " bytes, or " + (Math.round(completedProgress * 100) / 100).toFixed(2) + "%");
                extraParamsForUpload = [
                    {
                        filehash: fileInfo.filehash,
                        data: encodedFileChunk,
                    },
                ];
                // isContinueGlobal = 0;
                (0, helpers_1.log)('from run.ts params for upload', extraParamsForUpload);
                return [4 /*yield*/, Network.sendUserUploadData(extraParamsForUpload)];
            case 17:
                callResultUpload = _b.sent();
                console.log('call result upload', JSON.stringify(callResultUpload));
                responseUpload = callResultUpload.response;
                console.log('🚀 ~ file: run.ts ~ line 766 ~ testIt ~ result', callResultUpload);
                if (!responseUpload) {
                    console.log('we dont have response. it might be an error', callResultUpload);
                    return [2 /*return*/];
                }
                _a = responseUpload.result, offsetendUpload = _a.offsetend, offsetstartUpload = _a.offsetstart, isContinueUpload = _a.return;
                if (offsetendUpload === undefined) {
                    console.log('1 we dont have an offest. could be an error. response is', responseUpload);
                    return [2 /*return*/];
                }
                if (offsetstartUpload === undefined) {
                    console.log('2 we dont have an offest. could be an error. response is', responseUpload);
                    return [2 /*return*/];
                }
                isContinueGlobal = +isContinueUpload;
                offsetStartGlobal = +offsetstartUpload;
                offsetEndGlobal = +offsetendUpload;
                _b.label = 18;
            case 18: return [3 /*break*/, 7];
            case 19: return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var resolvedChainID, sdkEnv, resolvedChainIDToTest, error_6, phrase, masterKeySeedInfo, serialized, _cosmosClient, filename;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sdkEnv = sdkEnvDev;
                Sdk_1.default.init(__assign({}, sdkEnv));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Network.getChainId()];
            case 2:
                resolvedChainIDToTest = _a.sent();
                if (!resolvedChainIDToTest) {
                    throw new Error('Chain id is empty. Exiting');
                }
                console.log('🚀 ~ file: run.ts ~ line 817 ~ main ~ resolvedChainIDToTest', resolvedChainIDToTest);
                resolvedChainID = resolvedChainIDToTest;
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.log('🚀 ~ file: 494 ~ init ~ resolvedChainID error', error_6);
                throw new Error('Could not resolve chain id');
            case 4:
                // 2
                Sdk_1.default.init(__assign(__assign({}, sdkEnv), { chainId: resolvedChainID, 
                    // pp a
                    // ppNodeUrl: 'http://13.115.18.9',
                    // ppNodePort: '8137',
                    // pp b
                    ppNodeUrl: 'http://54.185.84.33', ppNodePort: '8148' }));
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 5:
                masterKeySeedInfo = _a.sent();
                serialized = masterKeySeedInfo.encryptedWalletInfo;
                return [4 /*yield*/, (0, cosmos_1.getCosmos)(serialized, password)];
            case 6:
                _cosmosClient = _a.sent();
                filename = 'file1_30M_dec_6';
                return [4 /*yield*/, testIt(filename)];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
main();
//# sourceMappingURL=run.js.map