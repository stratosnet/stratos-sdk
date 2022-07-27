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
var dotenv_1 = __importDefault(require("dotenv"));
var fs_1 = __importDefault(require("fs"));
// import keccak256 from 'keccak256';
// import md5File from 'md5-file';
var multihashing_async_1 = __importDefault(require("multihashing-async"));
var path_1 = __importDefault(require("path"));
// import { Keccak } from 'sha3';
var accounts = __importStar(require("./accounts"));
var hdVault_1 = require("./hdVault");
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
// import md5 from 'blueimp-md5';
var crypto_1 = __importDefault(require("crypto"));
// import multihash from 'multihashes';
var cids_1 = __importDefault(require("cids"));
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
    restUrl: 'https://rest-test.thestratos.org',
    rpcUrl: 'https://rpc-test.thestratos.org',
    chainId: 'test-chain-1',
    explorerUrl: 'https://explorer-test.thestratos.org',
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
var getAvailableBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4 /*yield*/, Network.getAvailableBalance(address)];
            case 3:
                bResult = _a.sent();
                response = bResult.response;
                console.log('our available balanace', response === null || response === void 0 ? void 0 : response.result);
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
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(2, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
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
var getStandardFee = function () {
    var fee = transactions.getStandardFee(3);
    var sendTx = transactions.getSendTx;
    console.log('fee', fee);
};
var runFaucet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, faucetUrl, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                walletAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
                faucetUrl = 'https://faucet-test.thestratos.org/faucet';
                return [4 /*yield*/, accounts.increaseBalance(walletAddress, faucetUrl)];
            case 1:
                result = _a.sent();
                console.log('faucet result', result);
                return [2 /*return*/];
        }
    });
}); };
var getChainId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var chain;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Network.getChainId()];
            case 1:
                chain = _a.sent();
                console.log('status result!!', chain);
                return [2 /*return*/];
        }
    });
}); };
var getTxHistoryN = function () { return __awaiter(void 0, void 0, void 0, function () {
    var zeroAddress, type, txType, result, response, txs, fTx;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                zeroAddress = 'st1trlky7dx25er4p85waycqel6lxjnl0qunc7hpt';
                type = transactionTypes.HistoryTxType.Delegate;
                txType = transactionTypes.BlockChainTxMsgTypesMap.get(type) || '';
                console.log('🚀 ~ file: run.ts ~ line 558 ~ getTxHistory ~ txType !', txType);
                return [4 /*yield*/, Network.getTxListBlockchain(zeroAddress, '', 1)];
            case 1:
                result = _a.sent();
                console.log('status result!!', result);
                response = result.response;
                if (!response) {
                    return [2 /*return*/, 'aaa!!!'];
                }
                txs = response.txs;
                fTx = txs[0];
                return [2 /*return*/, false];
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
    var phrase, masterKeySeedInfo, wallet, serialized, firstAccount, deserializedWallet, _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeedInfo = _f.sent();
                return [4 /*yield*/, keyUtils.createWalletAtPath(0, zeroUserMnemonic)];
            case 2:
                wallet = _f.sent();
                serialized = masterKeySeedInfo.encryptedWalletInfo;
                return [4 /*yield*/, wallet.getAccounts()];
            case 3:
                firstAccount = (_f.sent())[0];
                console.log('🚀 ~ file: run.ts ~ line 632 ~ cosmosWalletCreateTest ~ firstAccount', firstAccount);
                return [4 /*yield*/, (0, wallet_1.deserializeEncryptedWallet)(serialized, password)];
            case 4:
                deserializedWallet = _f.sent();
                _b = (_a = console).log;
                _c = ['🚀 ~ file: run.ts ~ line 554 ~ cosmosWalletCreateTest ~ deserializedWallet'];
                _e = (_d = JSON).stringify;
                return [4 /*yield*/, deserializedWallet.getAccounts()];
            case 5:
                _b.apply(_a, _c.concat([_e.apply(_d, [_f.sent(), null, 2])]));
                return [2 /*return*/];
        }
    });
}); };
var testAccountData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var wallet, firstAccount, vInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, keyUtils.createWalletAtPath(0, zeroUserMnemonic)];
            case 1:
                wallet = _a.sent();
                return [4 /*yield*/, wallet.getAccounts()];
            case 2:
                firstAccount = (_a.sent())[0];
                return [4 /*yield*/, Network.getValidator('stvaloper1evqx4vnc0jhkgd4f5kruz7vuwt6lse3zfkex5u')];
            case 3:
                vInfo = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 629 ~ testAccountData ~ vInfo', vInfo);
                return [2 /*return*/];
        }
    });
}); };
// async function processFile(path: string, handler: any) {
//   const stream = fs.createReadStream(path);
//   for await (const chunk of stream) {
//     await handler(chunk);
//   }
// }
function processChunk(chunk) {
    return __awaiter(this, void 0, void 0, function () {
        var base64data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('process chunk...');
                    return [4 /*yield*/, delay(2000)];
                case 1:
                    _a.sent();
                    console.log('process chunk... done');
                    base64data = chunk.toString('base64');
                    return [2 /*return*/, base64data];
            }
        });
    });
}
function wait(fn, ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!fn()) return [3 /*break*/, 2];
                    return [4 /*yield*/, delay(ms)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    });
}
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function processFileByChunk(filePath, chunkSize) {
    if (chunkSize === void 0) { chunkSize = 10000; }
    return __awaiter(this, void 0, void 0, function () {
        var foo, fileStream_1, stats_1, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    foo = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    fileStream_1 = fs_1.default.createReadStream(filePath);
                    stats_1 = fs_1.default.statSync(filePath);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var bytesRead = 0;
                            var result = [];
                            fileStream_1.on('readable', function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    var chunk;
                                    return __generator(this, function (_a) {
                                        while (true) {
                                            chunk = fileStream_1.read(chunkSize);
                                            if (!chunk || !chunk.length) {
                                                break;
                                            }
                                            bytesRead += chunk.length;
                                            result.push(chunk);
                                        }
                                        if (bytesRead >= stats_1.size) {
                                            resolve(result);
                                        }
                                        return [2 /*return*/];
                                    });
                                });
                            });
                            fileStream_1.on('error', function (error) {
                                reject(error);
                            });
                        })];
                case 2:
                    foo = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.log(error_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, foo];
            }
        });
    });
}
var testFile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var PROJECT_ROOT, SRC_ROOT, fileReadPath, fileWritePath, buff, base64dataOriginal, chunksOfBuffers, fullBuf, base64dataFullBuf, chunksOfBase64Promises, chunksOfBase64, restoredChunksOfBuffers, buffWriteT, base64data, buffWrite;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
                SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
                fileReadPath = path_1.default.resolve(SRC_ROOT, 'my_image.png');
                fileWritePath = path_1.default.resolve(SRC_ROOT, 'my_image_new.png');
                console.log('🚀 ~ file: run.ts ~ line 631 ~ testFile ~ fileReadPath', fileReadPath);
                buff = fs_1.default.readFileSync(fileReadPath);
                base64dataOriginal = buff.toString('base64');
                return [4 /*yield*/, processFileByChunk(fileReadPath)];
            case 1:
                chunksOfBuffers = _a.sent();
                fullBuf = Buffer.concat(chunksOfBuffers);
                base64dataFullBuf = fullBuf.toString('base64');
                chunksOfBase64Promises = chunksOfBuffers.map(function (chunk) { return __awaiter(void 0, void 0, void 0, function () {
                    var pp;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, processChunk(chunk)];
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
                buffWrite = Buffer.from(base64dataFullBuf, 'base64');
                // const buffWrite = buffWriteT; // ok 4
                // const buffWrite = Buffer.from(base64data, 'base64'); // ok 5
                fs_1.default.writeFileSync(fileWritePath, buffWrite);
                return [2 /*return*/];
        }
    });
}); };
var calcFileHash = function (fileBuffer) { return __awaiter(void 0, void 0, void 0, function () {
    var md5Digest, data, ecodedHash, cid, realFileHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                md5Digest = crypto_1.default.createHash('md5').update(fileBuffer).digest();
                console.log('🚀 ~ file: run.ts ~ line 823 ~ calcFileHash2 ~ md5Digest in string', md5Digest.toString('hex'));
                console.log('🚀 ~ file: run.ts ~ line 807 ~ calcFileHash2 ~ md5Digest (buffer in hex)', md5Digest);
                data = new Uint8Array(md5Digest);
                console.log('🚀 ~ file: run.ts ~ line 831 ~ calcFileHash2 ~ data (in dec, matching w go, 16 bites)', data);
                return [4 /*yield*/, (0, multihashing_async_1.default)(md5Digest, 'keccak-256')];
            case 1:
                ecodedHash = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 811 ~ calcFileHash2 ~ ecodedHash (flieHash in go)', ecodedHash);
                cid = new cids_1.default(1, 'raw', ecodedHash, 'base32hex');
                console.log('🚀 ~ file: run.ts ~ line 813 ~ calcFileHash2 ~ cid', cid);
                realFileHash = cid.toString();
                // old
                // const ecodedHash2 = await multihash.encode(md5Digest, 'keccak-256');
                // console.log(
                //   '🚀 ~ file: run.ts ~ line 845 ~ calcFileHash2 ~ ecodedHash2 (thats where it is fucked. it looks like data, but prepended with 27 and 16)',
                //   ecodedHash2,
                // );
                // const cid2 = new CID(1, 'raw', ecodedHash2, 'base32hex');
                // const realFileHash2 = cid2.toString();
                // console.log('🚀 ~ file: run.ts ~ line 853 ~ calcFileHash2 ~ fucked realFileHash2', realFileHash2);
                //
                return [2 /*return*/, realFileHash];
        }
    });
}); };
var calcFileHash3 = function (fileHash) { return __awaiter(void 0, void 0, void 0, function () {
    var a, ecodedHash, cid, realFileHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                a = Buffer.from(fileHash);
                console.log('🚀 ~ file: run.ts ~ line 808 ~ calcFileHash3 ~ a', a);
                return [4 /*yield*/, (0, multihashing_async_1.default)(a, 'keccak-256', 20)];
            case 1:
                ecodedHash = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 809 ~ calcFileHash3 ~ ecodedHash', ecodedHash);
                cid = new cids_1.default(1, 'raw', ecodedHash, 'base32hex');
                console.log('🚀 ~ file: run.ts ~ line 813 ~ calcFileHash2 ~ cid', cid);
                realFileHash = cid.toString();
                return [2 /*return*/, realFileHash];
        }
    });
}); };
// working file hash
var calcFileHash2 = function (fileBuffer) { return __awaiter(void 0, void 0, void 0, function () {
    var md5Digest, ecodedHash, cid, realFileHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                md5Digest = crypto_1.default.createHash('md5').update(fileBuffer).digest();
                console.log('🚀 ~ file: run.ts ~ line 823 ~ calcFileHash2 ~ md5Digest in string', md5Digest.toString('hex'));
                console.log('🚀 ~ file: run.ts ~ line 807 ~ calcFileHash2 ~ md5Digest (buffer in hex)', md5Digest);
                return [4 /*yield*/, (0, multihashing_async_1.default)(md5Digest, 'keccak-256', 20)];
            case 1:
                ecodedHash = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 811 ~ calcFileHash2 ~ ecodedHash (flieHash in go)', ecodedHash);
                cid = new cids_1.default(1, 'raw', ecodedHash, 'base32hex');
                console.log('🚀 ~ file: run.ts ~ line 813 ~ calcFileHash2 ~ cid', cid);
                realFileHash = cid.toString();
                return [2 /*return*/, realFileHash];
        }
    });
}); };
var testB = function () { return __awaiter(void 0, void 0, void 0, function () {
    var PROJECT_ROOT, SRC_ROOT, expectedHash, fileReadPath, fileBuffer, realFileHash2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
                SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
                expectedHash = 'v05ahm57soq8erhnhv70m8pek9rprtu8v0d9g3mg';
                fileReadPath = path_1.default.resolve(SRC_ROOT, 'my_test_read.t');
                fileBuffer = fs_1.default.readFileSync(fileReadPath);
                return [4 /*yield*/, calcFileHash2(fileBuffer)];
            case 1:
                realFileHash2 = _a.sent();
                console.log('🚀 ~  ~ realFileHash2', realFileHash2);
                console.log('🚀 ~   ~ expectedHash', expectedHash);
                return [2 /*return*/];
        }
    });
}); };
var testIt = function () { return __awaiter(void 0, void 0, void 0, function () {
    var PROJECT_ROOT, SRC_ROOT, fileReadPath, realHash, extraParams, callResult, response, _a, offsetend, offsetstart, isContinue, chunkSize, encodedFileChunks, pCalls, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                PROJECT_ROOT = path_1.default.resolve(__dirname, '../');
                SRC_ROOT = path_1.default.resolve(PROJECT_ROOT, './src');
                fileReadPath = path_1.default.resolve(SRC_ROOT, 'my_image.png');
                return [4 /*yield*/, FilesystemService.calculateFileHash(fileReadPath)];
            case 1:
                realHash = _b.sent();
                extraParams = {
                    filename: 't9.t',
                    filesize: 68,
                    filehash: 'v05ahm57soq8erhnhv70m8pek9rprtu8v0d9g3mg',
                    walletaddr: 'st1macvxhdy33kphmwv7kvvk28hpg0xn7nums5klu',
                    walletpubkey: 'stpub1',
                };
                return [4 /*yield*/, Network.sendUserRequestUpload(extraParams)];
            case 2:
                callResult = _b.sent();
                response = callResult.response;
                if (!response) {
                    return [2 /*return*/];
                }
                _a = response.result, offsetend = _a.offsetend, offsetstart = _a.offsetstart, isContinue = _a.return;
                chunkSize = offsetstart;
                return [4 /*yield*/, FilesystemService.getEncodedFileChunks(fileReadPath)];
            case 3:
                encodedFileChunks = _b.sent();
                pCalls = encodedFileChunks.map(function (currentChunk) { return __awaiter(void 0, void 0, void 0, function () {
                    var extraParamsUpload, callTwoResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                extraParamsUpload = {
                                    filehash: 'v05ahm57soq8erhnhv70m8pek9rprtu8v0d9g3mg',
                                    data: currentChunk,
                                };
                                return [4 /*yield*/, Network.sendUserUploadData(extraParamsUpload)];
                            case 1:
                                callTwoResult = _a.sent();
                                console.log('🚀 ~ file: run.ts ~ line 889 ~ testIt ~ result', callTwoResult);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(pCalls)];
            case 4:
                res = _b.sent();
                console.log('🚀 ~ file: run.ts ~ line 891 ~ testIt ~ res', res);
                return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var resolvedChainID, sdkEnv, error_7, serialized, _cosmosClient;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sdkEnv = sdkEnvDev;
                return [4 /*yield*/, Sdk_1.default.init(__assign({}, sdkEnv))];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, Network.getChainId()];
            case 3:
                resolvedChainID = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                console.log('🚀 ~ file: 494 ~ init ~ resolvedChainID error', error_7);
                throw new Error('Could not resolve chain id');
            case 5:
                if (!resolvedChainID) {
                    throw new Error('Chain id is empty. Exiting');
                }
                return [4 /*yield*/, Sdk_1.default.init(__assign(__assign({}, sdkEnv), { chainId: resolvedChainID }))];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, keyManager_1.getSerializedWalletFromPhrase)(zeroUserMnemonic, password)];
            case 7:
                serialized = _a.sent();
                return [4 /*yield*/, (0, cosmos_1.getCosmos)(serialized, password)];
            case 8:
                _cosmosClient = _a.sent();
                // cosmosWalletCreateTest();
                // testAccountData();
                // mainSend();
                // mainDelegate();
                // mainUndelegate();
                // mainWithdrawRewards();
                // mainWithdrawAllRewards();
                // mainSdsPrepay();
                // mainFour();
                // mainBalance();
                // testFile();
                // testB();
                testIt();
                return [2 /*return*/];
        }
    });
}); };
main();
//# sourceMappingURL=run.js.map