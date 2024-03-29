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
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
const NetworkApi = __importStar(require("../services/network/network"));
const Types = __importStar(require("./types"));
const Validators = __importStar(require("./validators"));
describe('validators', () => {
    describe('getValidatorsBondedToDelegator', () => {
        it('can get list of validators bonded to the delegator', async () => {
            const delegatorAddress = 'myAddr';
            const validatorOne = {
                operator_address: 'myAddress1',
                description: {
                    moniker: 'myName1',
                },
                status: 5,
            };
            const validatorTwo = {
                operator_address: 'myAddress2',
                description: {
                    moniker: 'myName2',
                },
                status: 5,
            };
            const validatorResultList = [validatorOne, validatorTwo];
            const vListResult = {
                response: {
                    validators: validatorResultList,
                },
            };
            const spyGetValidatorsBondedToDelegatorList = jest
                .spyOn(NetworkApi, 'getValidatorsBondedToDelegatorList')
                .mockImplementation(() => {
                return Promise.resolve(vListResult);
            });
            const result = await Validators.getValidatorsBondedToDelegator(delegatorAddress);
            const expectedResult = {
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
        });
        it('throws an error if it can not get a network response of the validators list', async () => {
            const delegatorAddress = 'myAddr';
            const vListResult = {};
            const spyGetValidatorsBondedToDelegatorList = jest
                .spyOn(NetworkApi, 'getValidatorsBondedToDelegatorList')
                .mockImplementation(() => {
                return Promise.resolve(vListResult);
            });
            await expect(Validators.getValidatorsBondedToDelegator(delegatorAddress)).rejects.toThrow('Could not fetch validators list');
            spyGetValidatorsBondedToDelegatorList.mockRestore();
        });
        it('throws an error if it network response format is broken', async () => {
            const delegatorAddress = 'myAddr';
            const vListResult = {
                response: {},
            };
            const spyGetValidatorsBondedToDelegatorList = jest
                .spyOn(NetworkApi, 'getValidatorsBondedToDelegatorList')
                .mockImplementation(() => {
                return Promise.resolve(vListResult);
            });
            await expect(Validators.getValidatorsBondedToDelegator(delegatorAddress)).rejects.toThrow('Response is missing. Could not fetch validators list');
            spyGetValidatorsBondedToDelegatorList.mockRestore();
        });
    });
    describe('getValidators', () => {
        it('fetches a list of validators', async () => {
            const votingPowerOne = 10;
            const votingPowerTwo = 40;
            const totalTokensOne = 1000;
            const totalTokensTwo = 4000;
            const comissionOne = '45';
            const comissionTwo = '50';
            const validatorOne = {
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
            const validatorTwo = {
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
            const validatorResultList = [validatorOne, validatorTwo];
            const vListResult = {
                response: {
                    validators: validatorResultList,
                },
            };
            const spyGetValidatorsList = jest.spyOn(NetworkApi, 'getValidatorsList').mockImplementation(() => {
                return Promise.resolve(vListResult);
            });
            const poolResponse = {
                result: {
                    bonded_tokens: 10000,
                },
            };
            const vPoolResult = {
                response: poolResponse,
            };
            const spyGetStakingPool = jest.spyOn(NetworkApi, 'getStakingPool').mockImplementation(() => {
                return Promise.resolve(vPoolResult);
            });
            const result = await Validators.getValidators();
            const expectedResult = {
                data: [
                    {
                        address: 'myAddress1',
                        name: 'myName1',
                        status: Types.ValidatorStatus.Bonded,
                        votingPower: `${votingPowerOne}%`,
                        totalTokens: `${totalTokensOne}`,
                        comission: `${parseFloat(comissionOne)}%`,
                    },
                    {
                        address: 'myAddress2',
                        name: 'myName2',
                        status: Types.ValidatorStatus.Bonded,
                        votingPower: `${votingPowerTwo}%`,
                        totalTokens: `${totalTokensTwo}`,
                        comission: `${parseFloat(comissionTwo)}%`,
                    },
                ],
                page: 1,
            };
            expect(result).toStrictEqual(expectedResult);
            spyGetValidatorsList.mockRestore();
            spyGetStakingPool.mockRestore();
        });
        it('throws an error if it can not get a network response of the validators list', async () => {
            const vListResult = {};
            const spyGetValidatorsList = jest.spyOn(NetworkApi, 'getValidatorsList').mockImplementation(() => {
                return Promise.resolve(vListResult);
            });
            await expect(Validators.getValidators()).rejects.toThrow('Could not fetch validators list');
            spyGetValidatorsList.mockRestore();
        });
        it('throws an error if it can not get a network response about the validaotrs pool', async () => {
            const validatorOne = {
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
            const validatorTwo = {
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
            const validatorResultList = [validatorOne, validatorTwo];
            const vListResult = {
                response: {
                    validators: validatorResultList,
                },
            };
            const spyGetValidatorsList = jest.spyOn(NetworkApi, 'getValidatorsList').mockImplementation(() => {
                return Promise.resolve(vListResult);
            });
            const vPoolResult = {};
            const spyGetStakingPool = jest.spyOn(NetworkApi, 'getStakingPool').mockImplementation(() => {
                return Promise.resolve(vPoolResult);
            });
            await expect(Validators.getValidators()).rejects.toThrow('Could not fetch total staking pool info');
            spyGetValidatorsList.mockRestore();
            spyGetStakingPool.mockRestore();
        });
    });
});
//# sourceMappingURL=validators.spec.js.map