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
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
var bigNumber_1 = require("../services/bigNumber");
var Cosmos = __importStar(require("../services/cosmos"));
var Transactions = __importStar(require("./transactions"));
var encoding_1 = require("@cosmjs/encoding");
var Utils = __importStar(require("../hdVault/utils"));
var ValidatorsApi = __importStar(require("../validators/validators"));
describe('transactions', function () {
    describe('broadcast', function () {
        it('broadcasts transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeBroadcastResult, fakeCosmos, spyGetCosmos, spyBroadcast, signedTx, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeBroadcastResult = {
                            height: '1',
                            txhash: 'abcde',
                        };
                        fakeCosmos = {
                            broadcast: jest.fn(function () {
                                return fakeBroadcastResult;
                            }),
                        };
                        spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(function () {
                            return fakeCosmos;
                        });
                        spyBroadcast = jest.spyOn(fakeCosmos, 'broadcast');
                        signedTx = {
                            foo: 'bar',
                        };
                        return [4 /*yield*/, Transactions.broadcast(signedTx)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(fakeBroadcastResult);
                        expect(spyBroadcast).toBeCalledWith(signedTx);
                        spyGetCosmos.mockRestore();
                        spyBroadcast.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('broadcasts transaction throws expected error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeCosmos, spyGetCosmos, signedTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeCosmos = {
                            broadcast: jest.fn(function () {
                                throw new Error('boomm');
                            }),
                        };
                        spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(function () {
                            return fakeCosmos;
                        });
                        signedTx = {
                            foo: 'bar',
                        };
                        return [4 /*yield*/, expect(Transactions.broadcast(signedTx)).rejects.toThrow('boomm')];
                    case 1:
                        _a.sent();
                        spyGetCosmos.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('sign', function () {
        it('signs transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
            var fakeSignResult, fakeCosmos, spyGetCosmos, spySign, txMessage, privateKey, result, encodedPkey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fakeSignResult = {
                            tx: {
                                foo: 'bar',
                            },
                        };
                        fakeCosmos = {
                            sign: jest.fn(function () {
                                return fakeSignResult;
                            }),
                        };
                        spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(function () {
                            return fakeCosmos;
                        });
                        spySign = jest.spyOn(fakeCosmos, 'sign');
                        txMessage = {
                            foo: 'bar',
                        };
                        privateKey = 'abcd';
                        return [4 /*yield*/, Transactions.sign(txMessage, privateKey)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBe(fakeSignResult);
                        encodedPkey = Utils.uint8ArrayToBuffer((0, encoding_1.fromHex)(privateKey));
                        expect(spySign).toHaveBeenCalledWith(txMessage, encodedPkey);
                        spyGetCosmos.mockRestore();
                        spySign.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getStandardFee', function () {
        it('returns an expected standard fee', function () { return __awaiter(void 0, void 0, void 0, function () {
            var numberOfMessages, expectedFee, result;
            return __generator(this, function (_a) {
                numberOfMessages = 3;
                expectedFee = {
                    amount: [{ amount: String(200000), denom: 'ustos' }],
                    gas: String(500000 + 100000 * numberOfMessages),
                };
                result = Transactions.getStandardFee(numberOfMessages);
                expect(result).toStrictEqual(expectedFee);
                return [2 /*return*/];
            });
        }); });
    });
    describe('getStandardAmount', function () {
        it('returns an expected standard amount list', function () { return __awaiter(void 0, void 0, void 0, function () {
            var amounts, expected, result;
            return __generator(this, function (_a) {
                amounts = [2, 5];
                expected = [
                    {
                        amount: (0, bigNumber_1.toWei)(amounts[0], 9).toString(),
                        denom: 'ustos',
                    },
                    {
                        amount: (0, bigNumber_1.toWei)(amounts[1], 9).toString(),
                        denom: 'ustos',
                    },
                ];
                result = Transactions.getStandardAmount(amounts);
                expect(result).toStrictEqual(expected);
                return [2 /*return*/];
            });
        }); });
    });
    describe('getBaseTx', function () {
        it('generates a base tx body', function () { return __awaiter(void 0, void 0, void 0, function () {
            var keyPairAddress, myAccountNumber, fakeAccountData, fakeCosmos, spyGetCosmos, myFee, spyGetStandardFee, chainId, expected, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keyPairAddress = 'myAddress';
                        myAccountNumber = 'boombam';
                        fakeAccountData = {
                            result: {
                                type: 'myType',
                                value: {
                                    address: keyPairAddress,
                                    sequence: '34',
                                    account_number: myAccountNumber,
                                },
                            },
                        };
                        fakeCosmos = {
                            getAccounts: jest.fn(function () {
                                return fakeAccountData;
                            }),
                        };
                        spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(function () {
                            return fakeCosmos;
                        });
                        myFee = {
                            foobar: 'barfoo',
                        };
                        spyGetStandardFee = jest.spyOn(Transactions, 'getStandardFee').mockImplementation(function () {
                            return myFee;
                        });
                        chainId = 'test-chain-1';
                        expected = {
                            chain_id: chainId,
                            fee: myFee,
                            memo: '',
                            account_number: myAccountNumber,
                            sequence: '34',
                        };
                        return [4 /*yield*/, Transactions.getBaseTx(keyPairAddress)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expected);
                        spyGetCosmos.mockRestore();
                        spyGetStandardFee.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getSendTx', function () {
        it('returns a send tx', function () { return __awaiter(void 0, void 0, void 0, function () {
            var keyPairAddress, toAddress, baseTx, spyGetBaseTx, expectedMsgData, fakeCosmos, spyGetCosmos, spyNewStdMsg, sendPayload, result, myTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keyPairAddress = 'myAddress';
                        toAddress = 'toAddress';
                        baseTx = {
                            baseFoo: 'baseBar',
                        };
                        spyGetBaseTx = jest.spyOn(Transactions, 'getBaseTx').mockImplementation(function () {
                            return Promise.resolve(baseTx);
                        });
                        expectedMsgData = {
                            chain_id: '1',
                            barMsg: 'foo',
                            memo: '',
                        };
                        fakeCosmos = {
                            newStdMsg: jest.fn(function () {
                                return expectedMsgData;
                            }),
                        };
                        spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(function () {
                            return fakeCosmos;
                        });
                        spyNewStdMsg = jest.spyOn(fakeCosmos, 'newStdMsg');
                        sendPayload = [
                            {
                                amount: 2,
                                toAddress: toAddress,
                            },
                        ];
                        return [4 /*yield*/, Transactions.getSendTx(keyPairAddress, sendPayload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expectedMsgData);
                        myTx = __assign(__assign({}, baseTx), { msgs: [
                                {
                                    type: 'cosmos-sdk/MsgSend',
                                    value: {
                                        amount: [
                                            {
                                                amount: '2000000000',
                                                denom: 'ustos',
                                            },
                                        ],
                                        from_address: keyPairAddress,
                                        to_address: toAddress,
                                    },
                                },
                            ] });
                        expect(spyNewStdMsg).toHaveBeenCalledWith(myTx);
                        spyGetBaseTx.mockRestore();
                        spyGetCosmos.mockRestore();
                        spyNewStdMsg.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getDelegateTx', function () {
        it('returns a delegate tx', function () { return __awaiter(void 0, void 0, void 0, function () {
            var delegatorAddress, validatorAddress, baseTx, spyGetBaseTx, expectedMsgData, fakeCosmos, spyGetCosmos, spyNewStdMsg, delegatePayload, result, myTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delegatorAddress = 'myAddress';
                        validatorAddress = 'toAddress';
                        baseTx = {
                            baseFoo: 'baseBar',
                        };
                        spyGetBaseTx = jest.spyOn(Transactions, 'getBaseTx').mockImplementation(function () {
                            return Promise.resolve(baseTx);
                        });
                        expectedMsgData = {
                            chain_id: '1',
                            barMsg: 'foo',
                            memo: '',
                        };
                        fakeCosmos = {
                            newStdMsg: jest.fn(function () {
                                return expectedMsgData;
                            }),
                        };
                        spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(function () {
                            return fakeCosmos;
                        });
                        spyNewStdMsg = jest.spyOn(fakeCosmos, 'newStdMsg');
                        delegatePayload = [
                            {
                                amount: 3,
                                validatorAddress: validatorAddress,
                            },
                        ];
                        return [4 /*yield*/, Transactions.getDelegateTx(delegatorAddress, delegatePayload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expectedMsgData);
                        myTx = __assign(__assign({}, baseTx), { msgs: [
                                {
                                    type: 'cosmos-sdk/MsgDelegate',
                                    value: {
                                        amount: {
                                            amount: '3000000000',
                                            denom: 'ustos',
                                        },
                                        delegator_address: delegatorAddress,
                                        validator_address: validatorAddress,
                                    },
                                },
                            ] });
                        expect(spyNewStdMsg).toHaveBeenCalledWith(myTx);
                        spyGetBaseTx.mockRestore();
                        spyGetCosmos.mockRestore();
                        spyNewStdMsg.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUnDelegateTx', function () {
        it('returns a undelegate tx', function () { return __awaiter(void 0, void 0, void 0, function () {
            var delegatorAddress, validatorAddress, baseTx, spyGetBaseTx, expectedMsgData, fakeCosmos, spyGetCosmos, spyNewStdMsg, unDelegatePayload, result, myTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delegatorAddress = 'myAddress';
                        validatorAddress = 'toAddress';
                        baseTx = {
                            baseFoo: 'baseBar',
                        };
                        spyGetBaseTx = jest.spyOn(Transactions, 'getBaseTx').mockImplementation(function () {
                            return Promise.resolve(baseTx);
                        });
                        expectedMsgData = {
                            chain_id: '1',
                            barMsg: 'foo',
                            memo: '',
                        };
                        fakeCosmos = {
                            newStdMsg: jest.fn(function () {
                                return expectedMsgData;
                            }),
                        };
                        spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(function () {
                            return fakeCosmos;
                        });
                        spyNewStdMsg = jest.spyOn(fakeCosmos, 'newStdMsg');
                        unDelegatePayload = [
                            {
                                amount: 4,
                                validatorAddress: validatorAddress,
                            },
                        ];
                        return [4 /*yield*/, Transactions.getUnDelegateTx(delegatorAddress, unDelegatePayload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expectedMsgData);
                        myTx = __assign(__assign({}, baseTx), { msgs: [
                                {
                                    type: 'cosmos-sdk/MsgUndelegate',
                                    value: {
                                        amount: {
                                            amount: '4000000000',
                                            denom: 'ustos',
                                        },
                                        delegator_address: delegatorAddress,
                                        validator_address: validatorAddress,
                                    },
                                },
                            ] });
                        expect(spyNewStdMsg).toHaveBeenCalledWith(myTx);
                        spyGetBaseTx.mockRestore();
                        spyGetCosmos.mockRestore();
                        spyNewStdMsg.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getWithdrawalRewardTx', function () {
        it('returns a reward withdrawal tx', function () { return __awaiter(void 0, void 0, void 0, function () {
            var delegatorAddress, validatorAddress, baseTx, spyGetBaseTx, expectedMsgData, fakeCosmos, spyGetCosmos, spyNewStdMsg, withdrawalPayload, result, myTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delegatorAddress = 'myAddress';
                        validatorAddress = 'toAddress';
                        baseTx = {
                            baseFoo: 'baseBar',
                        };
                        spyGetBaseTx = jest.spyOn(Transactions, 'getBaseTx').mockImplementation(function () {
                            return Promise.resolve(baseTx);
                        });
                        expectedMsgData = {
                            chain_id: '1',
                            barMsg: 'foo',
                            memo: '',
                        };
                        fakeCosmos = {
                            newStdMsg: jest.fn(function () {
                                return expectedMsgData;
                            }),
                        };
                        spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(function () {
                            return fakeCosmos;
                        });
                        spyNewStdMsg = jest.spyOn(fakeCosmos, 'newStdMsg');
                        withdrawalPayload = [
                            {
                                validatorAddress: validatorAddress,
                            },
                        ];
                        return [4 /*yield*/, Transactions.getWithdrawalRewardTx(delegatorAddress, withdrawalPayload)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expectedMsgData);
                        myTx = __assign(__assign({}, baseTx), { msgs: [
                                {
                                    type: 'cosmos-sdk/MsgWithdrawDelegationReward',
                                    value: {
                                        delegator_address: delegatorAddress,
                                        validator_address: validatorAddress,
                                    },
                                },
                            ] });
                        expect(spyNewStdMsg).toHaveBeenCalledWith(myTx);
                        spyGetBaseTx.mockRestore();
                        spyGetCosmos.mockRestore();
                        spyNewStdMsg.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getWithdrawalAllRewardTx', function () {
        it('returns a all reward withdrawal tx', function () { return __awaiter(void 0, void 0, void 0, function () {
            var delegatorAddress, validatorAddress, vListResult, spyGetValidatorsBondedToDelegator, baseTx, spyGetBaseTx, expectedMsgData, fakeCosmos, spyGetCosmos, spyNewStdMsg, result, myTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delegatorAddress = 'myAddress';
                        validatorAddress = 'toAddress';
                        vListResult = {
                            data: [
                                {
                                    address: validatorAddress,
                                },
                                {
                                    address: 'anotherVlidatorAddress',
                                },
                            ],
                        };
                        spyGetValidatorsBondedToDelegator = jest
                            .spyOn(ValidatorsApi, 'getValidatorsBondedToDelegator')
                            .mockImplementation(function () {
                            return Promise.resolve(vListResult);
                        });
                        baseTx = {
                            baseFoo: 'baseBar',
                        };
                        spyGetBaseTx = jest.spyOn(Transactions, 'getBaseTx').mockImplementation(function () {
                            return Promise.resolve(baseTx);
                        });
                        expectedMsgData = {
                            chain_id: '1',
                            barMsg: 'foo',
                            memo: '',
                        };
                        fakeCosmos = {
                            newStdMsg: jest.fn(function () {
                                return expectedMsgData;
                            }),
                        };
                        spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(function () {
                            return fakeCosmos;
                        });
                        spyNewStdMsg = jest.spyOn(fakeCosmos, 'newStdMsg');
                        return [4 /*yield*/, Transactions.getWithdrawalAllRewardTx(delegatorAddress)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expectedMsgData);
                        myTx = __assign(__assign({}, baseTx), { msgs: [
                                {
                                    type: 'cosmos-sdk/MsgWithdrawDelegationReward',
                                    value: {
                                        delegator_address: delegatorAddress,
                                        validator_address: validatorAddress,
                                    },
                                },
                                {
                                    type: 'cosmos-sdk/MsgWithdrawDelegationReward',
                                    value: {
                                        delegator_address: delegatorAddress,
                                        validator_address: 'anotherVlidatorAddress',
                                    },
                                },
                            ] });
                        expect(spyGetValidatorsBondedToDelegator).toHaveBeenCalledWith(delegatorAddress);
                        expect(spyNewStdMsg).toHaveBeenCalledWith(myTx);
                        spyGetValidatorsBondedToDelegator.mockRestore();
                        spyGetBaseTx.mockRestore();
                        spyGetCosmos.mockRestore();
                        spyNewStdMsg.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=transactions.spec.js.map