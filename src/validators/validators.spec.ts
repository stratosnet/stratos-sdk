import '@testing-library/jest-dom/extend-expect';
import * as NetworkApi from '../services/network/network';
import * as NetworkTypes from '../services/network/types';
import * as Types from './types';
import * as Validators from './validators';

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
      } as NetworkTypes.ValidatorItem;

      const validatorTwo = {
        operator_address: 'myAddress2',
        description: {
          moniker: 'myName2',
        },
        status: 5,
      } as NetworkTypes.ValidatorItem;

      const validatorResultList = [validatorOne, validatorTwo];

      const vListResult = {
        response: {
          result: validatorResultList,
        },
      } as NetworkTypes.ValidatorListDataResult;

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

      const vListResult = {} as NetworkTypes.ValidatorListDataResult;

      const spyGetValidatorsBondedToDelegatorList = jest
        .spyOn(NetworkApi, 'getValidatorsBondedToDelegatorList')
        .mockImplementation(() => {
          return Promise.resolve(vListResult);
        });

      await expect(Validators.getValidatorsBondedToDelegator(delegatorAddress)).rejects.toThrow(
        'Could not fetch validators list',
      );

      spyGetValidatorsBondedToDelegatorList.mockRestore();
    });

    it('throws an error if it network response format is broken', async () => {
      const delegatorAddress = 'myAddr';

      const vListResult = {
        response: {},
      } as NetworkTypes.ValidatorListDataResult;

      const spyGetValidatorsBondedToDelegatorList = jest
        .spyOn(NetworkApi, 'getValidatorsBondedToDelegatorList')
        .mockImplementation(() => {
          return Promise.resolve(vListResult);
        });

      await expect(Validators.getValidatorsBondedToDelegator(delegatorAddress)).rejects.toThrow(
        'Response is missing. Could not fetch validators list',
      );

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

      const validatorOne = ({
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
      } as unknown) as NetworkTypes.ValidatorItem;

      const validatorTwo = ({
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
      } as unknown) as NetworkTypes.ValidatorItem;

      const validatorResultList = [validatorOne, validatorTwo];

      const vListResult = {
        response: {
          result: validatorResultList,
        },
      } as NetworkTypes.ValidatorListDataResult;

      const spyGetValidatorsList = jest.spyOn(NetworkApi, 'getValidatorsList').mockImplementation(() => {
        return Promise.resolve(vListResult);
      });

      const poolResponse = ({
        result: {
          bonded_tokens: 10000,
        },
      } as unknown) as NetworkTypes.StakingPoolResponse;

      const vPoolResult = {
        response: poolResponse,
      } as NetworkTypes.StakingPoolDataResult;

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
      const vListResult = {} as NetworkTypes.ValidatorListDataResult;

      const spyGetValidatorsList = jest.spyOn(NetworkApi, 'getValidatorsList').mockImplementation(() => {
        return Promise.resolve(vListResult);
      });

      await expect(Validators.getValidators()).rejects.toThrow('Could not fetch validators list');

      spyGetValidatorsList.mockRestore();
    });

    it('throws an error if it can not get a network response about the validaotrs pool', async () => {
      const validatorOne = ({
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
      } as unknown) as NetworkTypes.ValidatorItem;

      const validatorTwo = ({
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
      } as unknown) as NetworkTypes.ValidatorItem;

      const validatorResultList = [validatorOne, validatorTwo];

      const vListResult = {
        response: {
          result: validatorResultList,
        },
      } as NetworkTypes.ValidatorListDataResult;

      const spyGetValidatorsList = jest.spyOn(NetworkApi, 'getValidatorsList').mockImplementation(() => {
        return Promise.resolve(vListResult);
      });

      const vPoolResult = {} as NetworkTypes.StakingPoolDataResult;

      const spyGetStakingPool = jest.spyOn(NetworkApi, 'getStakingPool').mockImplementation(() => {
        return Promise.resolve(vPoolResult);
      });

      await expect(Validators.getValidators()).rejects.toThrow('Could not fetch total staking pool info');

      spyGetValidatorsList.mockRestore();
      spyGetStakingPool.mockRestore();
    });
  });
});
