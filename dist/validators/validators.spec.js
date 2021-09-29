"use strict";
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
var NetworkApi = __importStar(require("../services/network/network"));
var Types = __importStar(require("./types"));
var Validators = __importStar(require("./validators"));
describe('validators', function () {
    describe('getValidatorsBondedToDelegator', function () {
        it('can get list of validators bonded to the delegator', function () { return __awaiter(void 0, void 0, void 0, function () {
            var delegatorAddress, validatorOne, validatorTwo, validatorResultList, vListResult, spyGetValidatorsBondedToDelegatorList, result, expectedResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delegatorAddress = 'myAddr';
                        validatorOne = {
                            operator_address: 'myAddress1',
                            description: {
                                moniker: 'myName1',
                            },
                            status: 5,
                        };
                        validatorTwo = {
                            operator_address: 'myAddress2',
                            description: {
                                moniker: 'myName2',
                            },
                            status: 5,
                        };
                        validatorResultList = [validatorOne, validatorTwo];
                        vListResult = {
                            response: {
                                result: validatorResultList,
                            },
                        };
                        spyGetValidatorsBondedToDelegatorList = jest
                            .spyOn(NetworkApi, 'getValidatorsBondedToDelegatorList')
                            .mockImplementation(function () {
                            return Promise.resolve(vListResult);
                        });
                        return [4 /*yield*/, Validators.getValidatorsBondedToDelegator(delegatorAddress)];
                    case 1:
                        result = _a.sent();
                        expectedResult = {
                            data: [
                                {
                                    address: 'myAddress1',
                                    name: 'myName1',
                                    status: Types.ValidatorStatus.Bonded,
                                },
                                {
                                    address: 'myAddress2',
                                    name: 'myName2',
                                    status: Types.ValidatorStatus.Bonded,
                                },
                            ],
                            page: 1,
                        };
                        expect(result).toStrictEqual(expectedResult);
                        spyGetValidatorsBondedToDelegatorList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not get a network response of the validators list', function () { return __awaiter(void 0, void 0, void 0, function () {
            var delegatorAddress, vListResult, spyGetValidatorsBondedToDelegatorList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delegatorAddress = 'myAddr';
                        vListResult = {};
                        spyGetValidatorsBondedToDelegatorList = jest
                            .spyOn(NetworkApi, 'getValidatorsBondedToDelegatorList')
                            .mockImplementation(function () {
                            return Promise.resolve(vListResult);
                        });
                        return [4 /*yield*/, expect(Validators.getValidatorsBondedToDelegator(delegatorAddress)).rejects.toThrow('Could not fetch validators list')];
                    case 1:
                        _a.sent();
                        spyGetValidatorsBondedToDelegatorList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it network response format is broken', function () { return __awaiter(void 0, void 0, void 0, function () {
            var delegatorAddress, vListResult, spyGetValidatorsBondedToDelegatorList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delegatorAddress = 'myAddr';
                        vListResult = {
                            response: {},
                        };
                        spyGetValidatorsBondedToDelegatorList = jest
                            .spyOn(NetworkApi, 'getValidatorsBondedToDelegatorList')
                            .mockImplementation(function () {
                            return Promise.resolve(vListResult);
                        });
                        return [4 /*yield*/, expect(Validators.getValidatorsBondedToDelegator(delegatorAddress)).rejects.toThrow('Response is missing. Could not fetch validators list')];
                    case 1:
                        _a.sent();
                        spyGetValidatorsBondedToDelegatorList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getValidators', function () {
        it('fetches a list of validators', function () { return __awaiter(void 0, void 0, void 0, function () {
            var votingPowerOne, votingPowerTwo, totalTokensOne, totalTokensTwo, comissionOne, comissionTwo, validatorOne, validatorTwo, validatorResultList, vListResult, spyGetValidatorsList, poolResponse, vPoolResult, spyGetStakingPool, result, expectedResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        votingPowerOne = 10;
                        votingPowerTwo = 40;
                        totalTokensOne = 1000;
                        totalTokensTwo = 4000;
                        comissionOne = '45';
                        comissionTwo = '50';
                        validatorOne = {
                            operator_address: 'myAddress1',
                            description: {
                                moniker: 'myName1',
                            },
                            status: 5,
                            tokens: 1000,
                            commission: {
                                commission_rates: {
                                    rate: 45,
                                },
                            },
                        };
                        validatorTwo = {
                            operator_address: 'myAddress2',
                            description: {
                                moniker: 'myName2',
                            },
                            status: 5,
                            tokens: 4000,
                            commission: {
                                commission_rates: {
                                    rate: 50,
                                },
                            },
                        };
                        validatorResultList = [validatorOne, validatorTwo];
                        vListResult = {
                            response: {
                                result: validatorResultList,
                            },
                        };
                        spyGetValidatorsList = jest.spyOn(NetworkApi, 'getValidatorsList').mockImplementation(function () {
                            return Promise.resolve(vListResult);
                        });
                        poolResponse = {
                            result: {
                                bonded_tokens: 10000,
                            },
                        };
                        vPoolResult = {
                            response: poolResponse,
                        };
                        spyGetStakingPool = jest.spyOn(NetworkApi, 'getStakingPool').mockImplementation(function () {
                            return Promise.resolve(vPoolResult);
                        });
                        return [4 /*yield*/, Validators.getValidators()];
                    case 1:
                        result = _a.sent();
                        expectedResult = {
                            data: [
                                {
                                    address: 'myAddress1',
                                    name: 'myName1',
                                    status: Types.ValidatorStatus.Bonded,
                                    votingPower: votingPowerOne + "%",
                                    totalTokens: "" + totalTokensOne,
                                    comission: parseFloat(comissionOne) + "%",
                                },
                                {
                                    address: 'myAddress2',
                                    name: 'myName2',
                                    status: Types.ValidatorStatus.Bonded,
                                    votingPower: votingPowerTwo + "%",
                                    totalTokens: "" + totalTokensTwo,
                                    comission: parseFloat(comissionTwo) + "%",
                                },
                            ],
                            page: 1,
                        };
                        expect(result).toStrictEqual(expectedResult);
                        spyGetValidatorsList.mockRestore();
                        spyGetStakingPool.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not get a network response of the validators list', function () { return __awaiter(void 0, void 0, void 0, function () {
            var vListResult, spyGetValidatorsList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vListResult = {};
                        spyGetValidatorsList = jest.spyOn(NetworkApi, 'getValidatorsList').mockImplementation(function () {
                            return Promise.resolve(vListResult);
                        });
                        return [4 /*yield*/, expect(Validators.getValidators()).rejects.toThrow('Could not fetch validators list')];
                    case 1:
                        _a.sent();
                        spyGetValidatorsList.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws an error if it can not get a network response about the validaotrs pool', function () { return __awaiter(void 0, void 0, void 0, function () {
            var validatorOne, validatorTwo, validatorResultList, vListResult, spyGetValidatorsList, vPoolResult, spyGetStakingPool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validatorOne = {
                            operator_address: 'myAddress1',
                            description: {
                                moniker: 'myName1',
                            },
                            status: 5,
                            tokens: 1000,
                            commission: {
                                commission_rates: {
                                    rate: 45,
                                },
                            },
                        };
                        validatorTwo = {
                            operator_address: 'myAddress2',
                            description: {
                                moniker: 'myName2',
                            },
                            status: 5,
                            tokens: 4000,
                            commission: {
                                commission_rates: {
                                    rate: 50,
                                },
                            },
                        };
                        validatorResultList = [validatorOne, validatorTwo];
                        vListResult = {
                            response: {
                                result: validatorResultList,
                            },
                        };
                        spyGetValidatorsList = jest.spyOn(NetworkApi, 'getValidatorsList').mockImplementation(function () {
                            return Promise.resolve(vListResult);
                        });
                        vPoolResult = {};
                        spyGetStakingPool = jest.spyOn(NetworkApi, 'getStakingPool').mockImplementation(function () {
                            return Promise.resolve(vPoolResult);
                        });
                        return [4 /*yield*/, expect(Validators.getValidators()).rejects.toThrow('Could not fetch total staking pool info')];
                    case 1:
                        _a.sent();
                        spyGetValidatorsList.mockRestore();
                        spyGetStakingPool.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=validators.spec.js.map