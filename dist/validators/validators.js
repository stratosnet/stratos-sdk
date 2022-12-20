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
exports.getValidators = exports.getValidatorsBondedToDelegator = void 0;
const get_1 = __importDefault(require("lodash/get"));
const network_1 = require("../services/network");
const Types = __importStar(require("./types"));
const getValidatorsBondedToDelegator = async (delegatorAddress) => {
    const vStatus = Types.ValidatorsNetworkStatus.All;
    const vListResult = await (0, network_1.getValidatorsBondedToDelegatorList)(vStatus, delegatorAddress);
    const { response } = vListResult;
    if (!response) {
        throw new Error('Could not fetch validators list');
    }
    const { validators: validatorResultList } = response;
    if (!validatorResultList) {
        throw new Error('Response is missing. Could not fetch validators list');
    }
    const parsedData = validatorResultList.map(validatorItem => {
        const operatorAddress = (0, get_1.default)(validatorItem, 'operator_address', '');
        const name = (0, get_1.default)(validatorItem, 'description.moniker', `v_${operatorAddress}`);
        const status = (0, get_1.default)(validatorItem, 'status', 0);
        const vStatus = Types.ParsedValidatorsStatusMap.get(status) || Types.ValidatorStatus.Bonded;
        return {
            address: operatorAddress,
            name,
            status: vStatus,
        };
    });
    const result = { data: parsedData, page: 1 };
    return result;
};
exports.getValidatorsBondedToDelegator = getValidatorsBondedToDelegator;
const getValidators = async (status = Types.ValidatorStatus.Bonded, page) => {
    const vStatus = Types.ValidatorsStatusMap.get(status) || Types.ValidatorsNetworkStatus.Bonded;
    const vListResult = await (0, network_1.getValidatorsList)(vStatus, page);
    const { response } = vListResult;
    if (!response) {
        throw new Error('Could not fetch validators list');
    }
    const { validators: validatorResultList } = response;
    const vPoolResult = await (0, network_1.getStakingPool)();
    const { response: poolResponse } = vPoolResult;
    if (!poolResponse) {
        throw new Error('Could not fetch total staking pool info');
    }
    const totalBondedTokens = (0, get_1.default)(poolResponse, 'pool.bonded_tokens', 0);
    console.log('totalBondedTokens', totalBondedTokens);
    const parsedData = validatorResultList.map(validatorItem => {
        const operatorAddress = (0, get_1.default)(validatorItem, 'operator_address', '');
        const name = (0, get_1.default)(validatorItem, 'description.moniker', `v_${operatorAddress}`);
        const status = (0, get_1.default)(validatorItem, 'status', 0);
        const totalTokens = (0, get_1.default)(validatorItem, 'tokens', 0);
        const votingPower = (Number(totalTokens) * 100) / totalBondedTokens;
        const comission = (0, get_1.default)(validatorItem, 'commission.commission_rates.rate', '0');
        const vStatus = Types.ParsedValidatorsStatusMap.get(status) || Types.ValidatorStatus.Bonded;
        return {
            address: operatorAddress,
            name,
            votingPower: `${votingPower}%`,
            totalTokens: `${totalTokens}`,
            comission: `${parseFloat(comission)}%`,
            status: vStatus,
        };
    });
    const result = { data: parsedData, page: page || 1 };
    return result;
};
exports.getValidators = getValidators;
//# sourceMappingURL=validators.js.map