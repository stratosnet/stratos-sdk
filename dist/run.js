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
exports.makeStratosHubPath = void 0;
var crypto_1 = require("@cosmjs/crypto");
var accounts = __importStar(require("./accounts"));
var hdVault_1 = require("./hdVault");
var keyManager_1 = require("./hdVault/keyManager");
var wallet_1 = require("./hdVault/wallet");
var Sdk_1 = __importDefault(require("./Sdk"));
var Network = __importStar(require("./services/network"));
var transactions = __importStar(require("./transactions"));
var transactionTypes = __importStar(require("./transactions/types"));
var validators = __importStar(require("./validators"));
var dotenv_1 = __importDefault(require("dotenv"));
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
/**
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
function makeStratosHubPath(a) {
    return [
        crypto_1.Slip10RawIndex.hardened(44),
        crypto_1.Slip10RawIndex.hardened(606),
        crypto_1.Slip10RawIndex.hardened(0),
        crypto_1.Slip10RawIndex.normal(0),
        crypto_1.Slip10RawIndex.normal(a),
    ];
}
exports.makeStratosHubPath = makeStratosHubPath;
// creates an account and derives 2 keypairs
var mainFour = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, keyPairOne;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                phrase = hdVault_1.mnemonic.convertStringToArray(zeroUserMnemonic);
                return [4 /*yield*/, (0, keyManager_1.createMasterKeySeed)(phrase, password)];
            case 1:
                masterKeySeed = _a.sent();
                console.log('masterKeySeed!', masterKeySeed);
                encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(0, password, encryptedMasterKeySeedString)];
            case 2:
                keyPairZero = _a.sent();
                console.log('keyPairZero', keyPairZero);
                return [4 /*yield*/, (0, wallet_1.deriveKeyPair)(1, password, encryptedMasterKeySeedString)];
            case 3:
                keyPairOne = _a.sent();
                console.log('keyPairOne', keyPairOne);
                return [2 /*return*/];
        }
    });
}); };
// cosmosjs send
var mainSend = function () { return __awaiter(void 0, void 0, void 0, function () {
    var firstAddress, phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, fromAddress, sendAmount, sendTxMessage, signedTx, result, error_1, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                firstAddress = 'st1p6xr32qthheenk3v94zkyudz7vmjaght0l4q7j';
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
                fromAddress = keyPairZero.address;
                sendAmount = 1;
                return [4 /*yield*/, transactions.getSendTx(fromAddress, [
                        { amount: sendAmount, toAddress: firstAddress },
                        { amount: 2, toAddress: firstAddress },
                        { amount: 3, toAddress: firstAddress },
                    ])];
            case 3:
                sendTxMessage = _a.sent();
                signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);
                if (!signedTx) return [3 /*break*/, 7];
                console.log('signedTx sends', JSON.stringify(signedTx, null, 1));
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 5:
                result = _a.sent();
                console.log('broadcasting result!', result);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                err = error_1;
                console.log('error broadcasting', err.message);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// cosmosjs delegate
var mainDelegate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var validatorAddress, phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, delegatorAddress, sendTxMessage, signedTx, result, error_2, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validatorAddress = 'stvaloper1g23pphr8zrt6jzguh0t30g02hludkt9a50axgh';
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
                return [4 /*yield*/, transactions.getDelegateTx(delegatorAddress, [
                        { amount: 1, validatorAddress: validatorAddress },
                        { amount: 2, validatorAddress: validatorAddress },
                    ])];
            case 3:
                sendTxMessage = _a.sent();
                signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);
                if (!signedTx) return [3 /*break*/, 7];
                console.log('signedTx!', JSON.stringify(signedTx, null, 2));
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 5:
                result = _a.sent();
                console.log('delegate broadcasting result!!! :)', result);
                return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                err = error_2;
                console.log('error broadcasting', err.message);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// cosmosjs undelegate
var mainUndelegate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var validatorAddress, phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, delegatorAddress, sendTxMessage, signedTx, result, error_3, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validatorAddress = 'stvaloper1x8a6ug6wu8d269n5s75260grv60lkln0pewk5n';
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
                sendTxMessage = _a.sent();
                signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);
                if (!signedTx) return [3 /*break*/, 7];
                console.log('signedTx', JSON.stringify(signedTx, null, 2));
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 5:
                result = _a.sent();
                console.log('undelegate result :)', result);
                return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                err = error_3;
                console.log('error broadcasting', err.message);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// cosmosjs withdraw rewards
var mainWithdrawRewards = function () { return __awaiter(void 0, void 0, void 0, function () {
    var validatorAddress, phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, delegatorAddress, sendTxMessage, signedTx, result, error_4, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                validatorAddress = 'stvaloper1x8a6ug6wu8d269n5s75260grv60lkln0pewk5n';
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
                sendTxMessage = _a.sent();
                signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);
                if (!signedTx) return [3 /*break*/, 7];
                console.log('signedTx', JSON.stringify(signedTx, null, 2));
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 5:
                result = _a.sent();
                console.log('delegate withdrawal result :)', result);
                return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                err = error_4;
                console.log('error broadcasting', err.message);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// cosmosjs withdraw all rewards
var mainWithdrawAllRewards = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, delegatorAddress, sendTxMessage, signedTx, err;
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
                signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);
                if (signedTx) {
                    console.log('signedTx', JSON.stringify(signedTx, null, 2));
                    try {
                        // const result = await transactions.broadcast(signedTx);
                        // console.log('delegate withdrawal all result :)', result);
                    }
                    catch (error) {
                        err = error;
                        console.log('error broadcasting', err.message);
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
// cosmosjs withdraw rewards
var mainSdsPrepay = function () { return __awaiter(void 0, void 0, void 0, function () {
    var phrase, masterKeySeed, encryptedMasterKeySeedString, keyPairZero, sendTxMessage, signedTx, result, err_1;
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
                return [4 /*yield*/, transactions.getSdsPrepayTx(keyPairZero.address, [{ amount: 5 }])];
            case 3:
                sendTxMessage = _a.sent();
                signedTx = transactions.sign(sendTxMessage, keyPairZero.privateKey);
                if (!signedTx) return [3 /*break*/, 7];
                console.log('signedTx', JSON.stringify(signedTx, null, 2));
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, transactions.broadcast(signedTx)];
            case 5:
                result = _a.sent();
                console.log('broadcast prepay result :)', result);
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.log('error broadcasting', err_1.message);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
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
                if (!keyPairZero) {
                    return [2 /*return*/];
                }
                console.log('keyPairZero', keyPairZero.address);
                delegatorAddress = 'st1k4ach36c8qwuckefz94vy83y308h5uzyrsllx6';
                return [4 /*yield*/, accounts.getBalance(delegatorAddress, 'ustos')];
            case 3:
                b = _a.sent();
                console.log('our bal ', b);
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
                console.log('keyPairZero', keyPairZero);
                delegatorAddress = keyPairZero.address;
                return [4 /*yield*/, accounts.getBalanceCardMetrics(delegatorAddress)];
            case 3:
                b = _a.sent();
                console.log('our balanace card metrics ', b);
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
                type = transactionTypes.HistoryTxType.SdsPrepay;
                txType = transactionTypes.BlockChainTxMsgTypesMap.get(type) || '';
                console.log('🚀 ~ file: run.ts ~ line 558 ~ getTxHistory ~ txType', txType);
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
    var zeroAddress, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                zeroAddress = 'st1trlky7dx25er4p85waycqel6lxjnl0qunc7hpt';
                return [4 /*yield*/, accounts.getAccountTrasactions(zeroAddress, transactionTypes.HistoryTxType.All, 1)];
            case 1:
                result = _a.sent();
                console.log('hist result!!', result);
                return [2 /*return*/, true];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var resolvedChainID, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Network.getChainId()];
            case 1:
                resolvedChainID = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.log('🚀 ~ file: 494 ~ init ~ resolvedChainID error', error_5);
                throw new Error('Could not resolve chain id');
            case 3:
                if (!resolvedChainID) {
                    throw new Error('Chain id is empty. Exiting');
                }
                Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { chainId: resolvedChainID }));
                getBalanceCardMetrics();
                return [2 /*return*/];
        }
    });
}); };
main();
//# sourceMappingURL=run.js.map