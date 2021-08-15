import _get from 'lodash/get';
import { getStakingPool, getValidatorsBondedToDelegatorList, getValidatorsList } from '../services/network';
import * as Types from './types';

export const getValidatorsBondedToDelegator = async (
  delegatorAddress: string,
): Promise<Types.ParsedValidatorsData> => {
  const vStatus = Types.ValidatorsNetworkStatus.All;
  const vListResult = await getValidatorsBondedToDelegatorList(vStatus, delegatorAddress);

  const { response } = vListResult;

  if (!response) {
    throw new Error('Could not fetch validators list');
  }

  const { result: validatorResultList } = response;

  if (!response) {
    throw new Error('Could not fetch validators list');
  }

  const parsedData: Types.ParsedLightValidatorItem[] = validatorResultList.map(validatorItem => {
    const operatorAddress = _get(validatorItem, 'operator_address', '') as string;
    const name = _get(validatorItem, 'description.moniker', `v_${operatorAddress}`) as string;
    const status = _get(validatorItem, 'status', 0);

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

export const getValidators = async (
  status = Types.ValidatorStatus.Bonded,
  page?: number,
): Promise<Types.ParsedValidatorsData> => {
  const vStatus = Types.ValidatorsStatusMap.get(status) || Types.ValidatorsNetworkStatus.Bonded;
  const vListResult = await getValidatorsList(vStatus, page);

  const { response } = vListResult;

  if (!response) {
    throw new Error('Could not fetch validators list');
  }

  const { result: validatorResultList } = response;

  const vPoolResult = await getStakingPool();

  const { response: poolResponse } = vPoolResult;

  console.log('poolResponse', poolResponse);

  if (!poolResponse) {
    throw new Error('Could not fetch total staking pool info');
  }

  const totalBondedTokens = _get(poolResponse, 'result.bonded_tokens', 0);
  console.log('totalBondedTokens', totalBondedTokens);

  const parsedData: Types.ParsedValidatorItem[] = validatorResultList.map(validatorItem => {
    const operatorAddress = _get(validatorItem, 'operator_address', '') as string;
    const name = _get(validatorItem, 'description.moniker', `v_${operatorAddress}`) as string;
    const status = _get(validatorItem, 'status', 0);
    const totalTokens = _get(validatorItem, 'tokens', 0);
    console.log('validatorItem', validatorItem);
    const votingPower = (Number(totalTokens) * 100) / totalBondedTokens;
    const comission = _get(validatorItem, 'commission.commission_rates.rate', '0') as string;

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

  console.log('parsedData!', parsedData);

  const result = { data: parsedData, page: page || 1 };

  return result;
};
