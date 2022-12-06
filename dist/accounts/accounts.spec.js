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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var NetworkApi = __importStar(require("../services/network/network"));
var TxTypes = __importStar(require("../transactions/types"));
var Accounts = __importStar(require("./accounts"));
describe('accounts', function () {
    // describe('getAccountsData', () => {
    //   it.skip('fetches account data by given address', async () => {
    //     const keyPairAddress = 'myAddress';
    //     const fakeAccountData = {
    //       result: {
    //         type: 'myType',
    //         value: {
    //           address: keyPairAddress,
    //         },
    //       },
    //     };
    //     const fakeCosmos = {
    //       getAccounts: jest.fn(() => {
    //         return fakeAccountData;
    //       }),
    //     } as unknown as Cosmos.CosmosInstance;
    //     const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
    //       return fakeCosmos;
    //     });
    //     const spyGetAccounts = jest.spyOn(fakeCosmos, 'getAccounts');
    //     const result = await Accounts.getAccountsData(keyPairAddress);
    //     expect(result).toBe(fakeAccountData);
    //     expect(spyGetAccounts).toBeCalledWith(keyPairAddress);
    //     spyGetCosmos.mockRestore();
    //   });
    //   it.skip('throws an error if it can not fetch accounts data', async () => {
    //     const keyPairAddress = 'myAddress';
    //     const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
    //       throw new Error('boom');
    //     });
    //     await expect(Accounts.getAccountsData(keyPairAddress)).rejects.toThrow('boom');
    //     spyGetCosmos.mockRestore();
    //   });
    // });
    // describe('getBalance', () => {
    //   it('returns an account balance with default precision', async () => {
    //     const keyPairAddress = 'myAddress';
    //     const requestedDenom = 'myRequestedDenom';
    //     const fakeAccountData = {
    //       result: {
    //         type: 'myType',
    //         value: {
    //           address: keyPairAddress,
    //           coins: [
    //             {
    //               amount: '123456789',
    //               denom: requestedDenom,
    //             },
    //           ],
    //         },
    //       },
    //     } as unknown as Types.AccountsData;
    //     const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
    //       return Promise.resolve(fakeAccountData);
    //     });
    //     const result = await Accounts.getBalance(keyPairAddress, requestedDenom);
    //     expect(result).toBe('0.1234');
    //     spyGetAccountsData.mockRestore();
    //   });
    //   it('returns an account balance with custom precision', async () => {
    //     const keyPairAddress = 'myAddress';
    //     const requestedDenom = 'myRequestedDenom';
    //     const fakeAccountData = {
    //       result: {
    //         type: 'myType',
    //         value: {
    //           address: keyPairAddress,
    //           coins: [
    //             {
    //               amount: '123456789',
    //               denom: requestedDenom,
    //             },
    //           ],
    //         },
    //       },
    //     } as unknown as Types.AccountsData;
    //     const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
    //       return Promise.resolve(fakeAccountData);
    //     });
    //     const result = await Accounts.getBalance(keyPairAddress, requestedDenom, 6);
    //     expect(result).toBe('0.123456');
    //     spyGetAccountsData.mockRestore();
    //   });
    //   it('returns zero if denom is not in the coins list', async () => {
    //     const keyPairAddress = 'myAddress';
    //     const requestedDenom = 'myRequestedDenom';
    //     const fakeAccountData = {
    //       result: {
    //         type: 'myType',
    //         value: {
    //           address: keyPairAddress,
    //           coins: [
    //             {
    //               amount: '123456789',
    //               denom: 'aa',
    //             },
    //           ],
    //         },
    //       },
    //     } as unknown as Types.AccountsData;
    //     const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
    //       return Promise.resolve(fakeAccountData);
    //     });
    //     const result = await Accounts.getBalance(keyPairAddress, requestedDenom);
    //     expect(result).toBe('0.0000');
    //     spyGetAccountsData.mockRestore();
    //   });
    //   it('returns zero if coins list is not in the response', async () => {
    //     const keyPairAddress = 'myAddress';
    //     const requestedDenom = 'myRequestedDenom';
    //     const fakeAccountData = {
    //       result: {
    //         type: 'myType',
    //         value: {
    //           address: keyPairAddress,
    //         },
    //       },
    //     } as unknown as Types.AccountsData;
    //     const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
    //       return Promise.resolve(fakeAccountData);
    //     });
    //     const result = await Accounts.getBalance(keyPairAddress, requestedDenom);
    //     expect(result).toBe('0.0000');
    //     spyGetAccountsData.mockRestore();
    //   });
    // });
    describe('formatBalanceFromWei', function () {
        it('formats given amount without appending denom and using given required precison', function () {
            var myAmount = '500000';
            var result = Accounts.formatBalanceFromWei(myAmount, 5);
            expect(result).toBe('0.00050');
        });
        it('formats given amount without appending denom and using another given required precison', function () {
            var myAmount = '500000';
            var result = Accounts.formatBalanceFromWei(myAmount, 4);
            expect(result).toBe('0.0005');
        });
        it('formats given amount with appending denom ', function () {
            var appendDenom = true;
            var myAmount = '500000';
            var result = Accounts.formatBalanceFromWei(myAmount, 4, appendDenom);
            expect(result).toBe('0.0005 STOS');
        });
    });
    describe('getBalanceCardMetrics', function () {
        it('returns balance card metrics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var availableBalanceResponse, availableBalanceResult, spyGetAvailableBalance, delegatedBalanceResponse, delegatedBalanceResult, spyGetDelegatedBalance, unboundingBalanceResponse, unboundingBalanceResult, spyGetUnboundingBalance, rewardBalanceResponse, rewardBalanceResult, spyGetRewardBalance, keyPairAddress, expectedResult, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        availableBalanceResponse = {
                            result: [
                                {
                                    denom: 'ustos',
                                    amount: '123456789',
                                },
                            ],
                        };
                        availableBalanceResult = {
                            response: availableBalanceResponse,
                        };
                        spyGetAvailableBalance = jest.spyOn(NetworkApi, 'getAvailableBalance').mockImplementation(function () {
                            return Promise.resolve(availableBalanceResult);
                        });
                        delegatedBalanceResponse = {
                            result: [
                                {
                                    balance: {
                                        amount: '232435267',
                                        denom: 'ustos',
                                    },
                                    validator_address: 'v_bar',
                                },
                            ],
                        };
                        delegatedBalanceResult = {
                            response: delegatedBalanceResponse,
                        };
                        spyGetDelegatedBalance = jest.spyOn(NetworkApi, 'getDelegatedBalance').mockImplementation(function () {
                            return Promise.resolve(delegatedBalanceResult);
                        });
                        unboundingBalanceResponse = {
                            result: [
                                {
                                    entries: [
                                        {
                                            balance: '813494321',
                                        },
                                    ],
                                },
                            ],
                        };
                        unboundingBalanceResult = {
                            response: unboundingBalanceResponse,
                        };
                        spyGetUnboundingBalance = jest
                            .spyOn(NetworkApi, 'getUnboundingBalance')
                            .mockImplementation(function () {
                            return Promise.resolve(unboundingBalanceResult);
                        });
                        rewardBalanceResponse = {
                            result: {
                                rewards: [
                                    {
                                        validator_address: 'v_foo',
                                        reward: [{ amount: '0.05' }],
                                    },
                                ],
                                total: [
                                    {
                                        amount: '563435267',
                                        denom: 'ustos',
                                    },
                                ],
                            },
                        };
                        rewardBalanceResult = {
                            response: rewardBalanceResponse,
                        };
                        spyGetRewardBalance = jest.spyOn(NetworkApi, 'getRewardBalance').mockImplementation(function () {
                            return Promise.resolve(rewardBalanceResult);
                        });
                        keyPairAddress = 'myAddress';
                        expectedResult = {
                            available: '0.1234 STOS',
                            delegated: '0.2324 STOS',
                            unbounding: '0.8134 STOS',
                            reward: '0.5634 STOS',
                            detailedBalance: {
                                reward: {
                                    v_foo: '0.05',
                                },
                                delegated: {
                                    v_bar: '0.2324 STOS',
                                },
                            },
                        };
                        return [4 /*yield*/, Accounts.getBalanceCardMetrics(keyPairAddress)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expectedResult);
                        spyGetAvailableBalance.mockRestore();
                        spyGetDelegatedBalance.mockRestore();
                        spyGetUnboundingBalance.mockRestore();
                        spyGetRewardBalance.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns empty balance card metrics if there were handled errors in the fetch functions', function () { return __awaiter(void 0, void 0, void 0, function () {
            var availableBalanceResult, spyGetAvailableBalance, delegatedBalanceResult, spyGetDelegatedBalance, unboundingBalanceResult, spyGetUnboundingBalance, rewardBalanceResult, spyGetRewardBalance, keyPairAddress, expectedResult, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        availableBalanceResult = {
                            error: new Error('boom'),
                        };
                        spyGetAvailableBalance = jest.spyOn(NetworkApi, 'getAvailableBalance').mockImplementation(function () {
                            return Promise.resolve(availableBalanceResult);
                        });
                        delegatedBalanceResult = {
                            error: new Error('boom'),
                        };
                        spyGetDelegatedBalance = jest.spyOn(NetworkApi, 'getDelegatedBalance').mockImplementation(function () {
                            return Promise.resolve(delegatedBalanceResult);
                        });
                        unboundingBalanceResult = {
                            error: new Error('boom'),
                        };
                        spyGetUnboundingBalance = jest
                            .spyOn(NetworkApi, 'getUnboundingBalance')
                            .mockImplementation(function () {
                            return Promise.resolve(unboundingBalanceResult);
                        });
                        rewardBalanceResult = {
                            error: new Error('boom'),
                        };
                        spyGetRewardBalance = jest.spyOn(NetworkApi, 'getRewardBalance').mockImplementation(function () {
                            return Promise.resolve(rewardBalanceResult);
                        });
                        keyPairAddress = 'myAddress';
                        expectedResult = {
                            available: '0.0000 STOS',
                            delegated: '0.0000 STOS',
                            unbounding: '0.0000 STOS',
                            reward: '0.0000 STOS',
                            detailedBalance: {
                                delegated: {},
                                reward: {},
                            },
                        };
                        return [4 /*yield*/, Accounts.getBalanceCardMetrics(keyPairAddress)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expectedResult);
                        spyGetAvailableBalance.mockRestore();
                        spyGetDelegatedBalance.mockRestore();
                        spyGetUnboundingBalance.mockRestore();
                        spyGetRewardBalance.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // describe('getMaxAvailableBalance', () => {
    //   it('returns an account max available balance with default precision', async () => {
    //     const keyPairAddress = 'myAddress';
    //     const requestedDenom = 'myRequestedDenom';
    //     const fakeAccountData = {
    //       result: {
    //         type: 'myType',
    //         value: {
    //           address: keyPairAddress,
    //           coins: [
    //             {
    //               amount: '123456789',
    //               denom: requestedDenom,
    //             },
    //           ],
    //         },
    //       },
    //     } as unknown as Types.AccountsData;
    //     const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
    //       return Promise.resolve(fakeAccountData);
    //     });
    //     const result = await Accounts.getMaxAvailableBalance(keyPairAddress, requestedDenom);
    //     expect(result).toBe('0.1232'); // it is not 0.1234 because of the fee
    //     spyGetAccountsData.mockRestore();
    //   });
    //   it('returns an account max available balance with custom precision', async () => {
    //     const keyPairAddress = 'myAddress';
    //     const requestedDenom = 'myRequestedDenom';
    //     const fakeAccountData = {
    //       result: {
    //         type: 'myType',
    //         value: {
    //           address: keyPairAddress,
    //           coins: [
    //             {
    //               amount: '123456789',
    //               denom: requestedDenom,
    //             },
    //           ],
    //         },
    //       },
    //     } as unknown as Types.AccountsData;
    //     const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
    //       return Promise.resolve(fakeAccountData);
    //     });
    //     const result = await Accounts.getMaxAvailableBalance(keyPairAddress, requestedDenom, 6);
    //     expect(result).toBe('0.123256'); // it is not '0.123456' because we deduct fee
    //     spyGetAccountsData.mockRestore();
    //   });
    //   it('returns zero if denom is not in the coins list', async () => {
    //     const keyPairAddress = 'myAddress';
    //     const requestedDenom = 'myRequestedDenom';
    //     const fakeAccountData = {
    //       result: {
    //         type: 'myType',
    //         value: {
    //           address: keyPairAddress,
    //           coins: [
    //             {
    //               amount: '123456789',
    //               denom: 'aa',
    //             },
    //           ],
    //         },
    //       },
    //     } as unknown as Types.AccountsData;
    //     const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
    //       return Promise.resolve(fakeAccountData);
    //     });
    //     const result = await Accounts.getMaxAvailableBalance(keyPairAddress, requestedDenom);
    //     expect(result).toBe('0.0000');
    //     spyGetAccountsData.mockRestore();
    //   });
    //   it('returns zero if coins list is not in the response', async () => {
    //     const keyPairAddress = 'myAddress';
    //     const requestedDenom = 'myRequestedDenom';
    //     const fakeAccountData = {
    //       result: {
    //         type: 'myType',
    //         value: {
    //           address: keyPairAddress,
    //         },
    //       },
    //     } as unknown as Types.AccountsData;
    //     const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
    //       return Promise.resolve(fakeAccountData);
    //     });
    //     const result = await Accounts.getMaxAvailableBalance(keyPairAddress, requestedDenom);
    //     expect(result).toBe('0.0000');
    //     spyGetAccountsData.mockRestore();
    //   });
    // });
    describe('getAccountTrasactions', function () {
        it.skip('returs a list of account transactions with default type and page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var originalTransactionData, txItem, blockChainTx, txListResponse, txListResult, spyGetTxList, keyPairAddress, expected, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        originalTransactionData = {
                            txData: {
                                data: {
                                    amount: [
                                        {
                                            amount: '234567893',
                                        },
                                    ],
                                    // amount: { amount: '234' }, // delegationAmountValue
                                    to: 'toto', // validatorAddress || to
                                    // validator_address: 'vv', // validatorAddress || to
                                },
                                sender: 'ss',
                            },
                            txType: 'tt',
                        };
                        txItem = {
                            block_height: 1,
                            tx_info: {
                                tx_hash: 'hs',
                                time: '2021-08-17T16:19:27.568637284Z',
                                transaction_data: originalTransactionData,
                            },
                        };
                        blockChainTx = {
                            height: 3,
                            txhash: 'hs',
                            // raw_log: string;
                            // logs: BlockChainTxLog[];
                            // gas_wanted: string;
                            // gas_used: string;
                            // tx: BlockChainSubmittedTx;
                            timestamp: '2021-08-17T16:19:27.568637284Z',
                        };
                        txListResponse = {
                            // data: [txItem],
                            // total: 4,
                            total_count: 4,
                            count: 4,
                            page_number: 1,
                            page_total: 1,
                            // limit: string;
                            txs: [blockChainTx],
                        };
                        txListResult = {
                            response: txListResponse,
                        };
                        spyGetTxList = jest.spyOn(NetworkApi, 'getTxListBlockchain').mockImplementation(function () {
                            return Promise.resolve(txListResult);
                        });
                        keyPairAddress = 'myAddress';
                        expected = {
                            data: [
                                {
                                    amount: '0.2345 STOS',
                                    block: '1',
                                    hash: 'hs',
                                    originalTransactionData: originalTransactionData,
                                    sender: 'ss',
                                    time: '2021-08-17, 12:19:27 p.m.',
                                    to: 'toto',
                                    txType: 'tt',
                                    type: 0,
                                },
                            ],
                            page: 1,
                            total: 4,
                        };
                        return [4 /*yield*/, Accounts.getAccountTrasactions(keyPairAddress)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expected);
                        spyGetTxList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it.skip('returs transactions where receiver is a validator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var originalTransactionData, txItem, txListResponse, txListResult, spyGetTxList, keyPairAddress, expected, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        originalTransactionData = {
                            txData: {
                                data: {
                                    // amount: [
                                    // {
                                    // amount: '234567893',
                                    // },
                                    // ], // amountValue
                                    amount: { amount: '567894533' },
                                    // to: 'toto', // validatorAddress || to
                                    validator_address: 'vv', // validatorAddress || to
                                },
                                sender: 'ss',
                            },
                            txType: 'tt',
                        };
                        txItem = {
                            block_height: 1,
                            tx_info: {
                                tx_hash: 'hs',
                                time: '2021-08-17T16:19:27.568637284Z',
                                transaction_data: originalTransactionData,
                            },
                        };
                        txListResponse = {
                            data: [txItem],
                            total: 4,
                        };
                        txListResult = {
                            response: txListResponse,
                        };
                        spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(function () {
                            return Promise.resolve(txListResult);
                        });
                        keyPairAddress = 'myAddress';
                        expected = {
                            data: [
                                {
                                    amount: '0.5678 STOS',
                                    block: '1',
                                    hash: 'hs',
                                    originalTransactionData: originalTransactionData,
                                    sender: 'ss',
                                    time: '2021-08-17, 12:19:27 p.m.',
                                    to: 'vv',
                                    txType: 'tt',
                                    type: 0,
                                },
                            ],
                            page: 1,
                            total: 4,
                        };
                        return [4 /*yield*/, Accounts.getAccountTrasactions(keyPairAddress)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expected);
                        spyGetTxList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it.skip('returs transactions with specific tx type', function () { return __awaiter(void 0, void 0, void 0, function () {
            var originalTransactionData, txItem, txListResponse, txListResult, spyGetTxList, keyPairAddress, expected, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        originalTransactionData = {
                            txData: {
                                data: {
                                    // amount: [
                                    // {
                                    // amount: '234567893',
                                    // },
                                    // ], // amountValue
                                    amount: { amount: '567894533' },
                                    // to: 'toto', // validatorAddress || to
                                    validator_address: 'vv', // validatorAddress || to
                                },
                                sender: 'ss',
                            },
                            // txType: TxTypes.HistoryTxType.Delegate,
                            txType: TxTypes.TxMsgTypes.Delegate,
                        };
                        txItem = {
                            block_height: 1,
                            tx_info: {
                                tx_hash: 'hs',
                                time: '2021-08-17T16:19:27.568637284Z',
                                transaction_data: originalTransactionData,
                            },
                        };
                        txListResponse = {
                            data: [txItem],
                            total: 4,
                        };
                        txListResult = {
                            response: txListResponse,
                        };
                        spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(function () {
                            return Promise.resolve(txListResult);
                        });
                        keyPairAddress = 'myAddress';
                        expected = {
                            data: [
                                {
                                    amount: '0.5678 STOS',
                                    block: '1',
                                    hash: 'hs',
                                    originalTransactionData: originalTransactionData,
                                    sender: 'ss',
                                    time: '2021-08-17, 12:19:27 p.m.',
                                    to: 'vv',
                                    txType: 'cosmos-sdk/MsgDelegate',
                                    type: 2,
                                },
                            ],
                            page: 1,
                            total: 4,
                        };
                        return [4 /*yield*/, Accounts.getAccountTrasactions(keyPairAddress)];
                    case 1:
                        result = _a.sent();
                        expect(result).toStrictEqual(expected);
                        spyGetTxList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if network can not fetch tx list', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyGetTxList, keyPairAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyGetTxList = jest.spyOn(NetworkApi, 'getTxListBlockchain').mockImplementation(function () {
                            throw new Error('boom');
                        });
                        keyPairAddress = 'myAddress';
                        return [4 /*yield*/, expect(Accounts.getAccountTrasactions(keyPairAddress)).rejects.toThrow('boom')];
                    case 1:
                        _a.sent();
                        spyGetTxList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if network call result does not have response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var txListResult, spyGetTxList, keyPairAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txListResult = {};
                        spyGetTxList = jest.spyOn(NetworkApi, 'getTxListBlockchain').mockImplementation(function () {
                            return Promise.resolve(txListResult);
                        });
                        keyPairAddress = 'myAddress';
                        return [4 /*yield*/, expect(Accounts.getAccountTrasactions(keyPairAddress)).rejects.toThrow('Could not fetch tx history')];
                    case 1:
                        _a.sent();
                        spyGetTxList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getBalanceCardMetricValue', function () {
        it('return properly formatted value for the balance card metric', function () {
            var result = Accounts.getBalanceCardMetricValue('ustos', '123456789');
            expect(result).toBe('0.1234 STOS');
        });
        it('returns default value if no amount is given', function () {
            var result = Accounts.getBalanceCardMetricValue('ustos');
            expect(result).toBe('0.0000 STOS');
        });
        it('returns default value if no denom is given', function () {
            var result = Accounts.getBalanceCardMetricValue();
            expect(result).toBe('0.0000 STOS');
        });
    });
});
//# sourceMappingURL=accounts.spec.js.map