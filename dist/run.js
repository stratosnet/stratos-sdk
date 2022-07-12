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
var accounts = __importStar(require("./accounts"));
var hdVault_1 = require("./hdVault");
var keyManager_1 = require("./hdVault/keyManager");
var keyUtils = __importStar(require("./hdVault/keyUtils"));
var wallet_1 = require("./hdVault/wallet");
var Sdk_1 = __importDefault(require("./Sdk"));
var cosmos_1 = require("./services/cosmos");
var Network = __importStar(require("./services/network"));
var transactions = __importStar(require("./transactions"));
var transactionTypes = __importStar(require("./transactions/types"));
var validators = __importStar(require("./validators"));
var stargate_1 = require("@cosmjs/stargate");
// import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
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
                return [4 /*yield*/, wallet.getAccounts()];
            case 2:
                firstAccount = (_a.sent())[0];
                zeroAddress = firstAccount.address;
                return [4 /*yield*/, accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.Delegate, 1)];
            case 3:
                result = _a.sent();
                console.log('hist result!! !', result);
                return [2 /*return*/, true];
        }
    });
}); };
var cosmosWalletCreateTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeedInfo, wallet, serialized, firstAccount, deserializedWallet, firstAccountRestored, rpcEndpoint, client, recipient, sendAmount, sendTxMessages, signedTx, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeedInfo = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 633 ~ cosmosWalletCreateTest ~ masterKeySeedInfo created', masterKeySeedInfo);
                return [4 /*yield*/, keyUtils.createWalletAtPath(0, zeroUserMnemonic)];
            case 2:
                wallet = _a.sent();
                serialized = masterKeySeedInfo.encryptedWalletInfo;
                return [4 /*yield*/, wallet.getAccounts()];
            case 3:
                firstAccount = (_a.sent())[0];
                console.log('🚀 ~ file: run.ts ~ line 632 ~ cosmosWalletCreateTest ~ firstAccount', firstAccount);
                return [4 /*yield*/, (0, wallet_1.deserializeEncryptedWallet)(serialized, password)];
            case 4:
                deserializedWallet = _a.sent();
                return [4 /*yield*/, deserializedWallet.getAccounts()];
            case 5:
                firstAccountRestored = (_a.sent())[0];
                console.log('🚀 ~ file: run.ts ~ line 656 ~ cosmosWalletCreateTest ~ firstAccountRestored', firstAccountRestored);
                rpcEndpoint = Sdk_1.default.environment.rpcUrl;
                return [4 /*yield*/, stargate_1.SigningStargateClient.connectWithSigner(rpcEndpoint, deserializedWallet)];
            case 6:
                client = _a.sent();
                recipient = 'st1trlky7dx25er4p85waycqel6lxjnl0qunc7hpt';
                sendAmount = 2;
                return [4 /*yield*/, transactions.getSendTx(firstAccount.address, [
                        { amount: sendAmount, toAddress: recipient },
                        { amount: sendAmount + 1, toAddress: recipient },
                    ])];
            case 7:
                sendTxMessages = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 592 ~ cosmosWalletCreateTest ~ sendTxMessages', JSON.stringify(sendTxMessages, null, 2));
                return [4 /*yield*/, transactions.sign(firstAccount.address, sendTxMessages)];
            case 8:
                signedTx = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 595 ~ cosmosWalletCreateTest ~ signedTx', signedTx);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 9:
                result = _a.sent();
                console.log('🚀 ~ file: run.ts ~ line 598 ~ cosmosWalletCreateTest ~ result!', result);
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
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var resolvedChainID, sdkEnv, error_6, serialized, _cosmosClient;
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
                error_6 = _a.sent();
                console.log('🚀 ~ file: 494 ~ init ~ resolvedChainID error', error_6);
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
                console.log('🚀 ~ file: run.ts ~ line 629 ~ main ~ serialized', serialized);
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
                mainBalance();
                return [2 /*return*/];
        }
    });
}); };
main();
//# sourceMappingURL=run.js.map