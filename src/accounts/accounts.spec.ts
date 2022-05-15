import '@testing-library/jest-dom/extend-expect';

import * as Cosmos from '../services/cosmos';
import * as NetworkApi from '../services/network/network';
import * as NetworkTypes from '../services/network/types';

import * as TxTypes from '../transactions/types';
import * as Types from './types';

import * as Accounts from './accounts';

describe('accounts', () => {
  describe('getAccountsData', () => {
    it('fetches account data by given address', async () => {
      const keyPairAddress = 'myAddress';

      const fakeAccountData = {
        result: {
          type: 'myType',
          value: {
            address: keyPairAddress,
          },
        },
      };

      const fakeCosmos = {
        getAccounts: jest.fn(() => {
          return fakeAccountData;
        }),
      } as unknown as Cosmos.CosmosInstance;

      const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
        return fakeCosmos;
      });

      const spyGetAccounts = jest.spyOn(fakeCosmos, 'getAccounts');

      const result = await Accounts.getAccountsData(keyPairAddress);

      expect(result).toBe(fakeAccountData);
      expect(spyGetAccounts).toBeCalledWith(keyPairAddress);

      spyGetCosmos.mockRestore();
    });
    it('throws an error if it can not fetch accounts data', async () => {
      const keyPairAddress = 'myAddress';

      const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
        throw new Error('boom');
      });

      await expect(Accounts.getAccountsData(keyPairAddress)).rejects.toThrow('boom');

      spyGetCosmos.mockRestore();
    });
  });

  describe('getBalance', () => {
    it('returns an account balance with default precision', async () => {
      const keyPairAddress = 'myAddress';
      const requestedDenom = 'myRequestedDenom';

      const fakeAccountData = {
        result: {
          type: 'myType',
          value: {
            address: keyPairAddress,
            coins: [
              {
                amount: '123456789',
                denom: requestedDenom,
              },
            ],
          },
        },
      } as unknown as Types.AccountsData;

      const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
        return Promise.resolve(fakeAccountData);
      });

      const result = await Accounts.getBalance(keyPairAddress, requestedDenom);

      expect(result).toBe('0.1234');

      spyGetAccountsData.mockRestore();
    });
    it('returns an account balance with custom precision', async () => {
      const keyPairAddress = 'myAddress';
      const requestedDenom = 'myRequestedDenom';

      const fakeAccountData = {
        result: {
          type: 'myType',
          value: {
            address: keyPairAddress,
            coins: [
              {
                amount: '123456789',
                denom: requestedDenom,
              },
            ],
          },
        },
      } as unknown as Types.AccountsData;

      const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
        return Promise.resolve(fakeAccountData);
      });

      const result = await Accounts.getBalance(keyPairAddress, requestedDenom, 6);

      expect(result).toBe('0.123456');

      spyGetAccountsData.mockRestore();
    });
    it('returns zero if denom is not in the coins list', async () => {
      const keyPairAddress = 'myAddress';
      const requestedDenom = 'myRequestedDenom';

      const fakeAccountData = {
        result: {
          type: 'myType',
          value: {
            address: keyPairAddress,
            coins: [
              {
                amount: '123456789',
                denom: 'aa',
              },
            ],
          },
        },
      } as unknown as Types.AccountsData;

      const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
        return Promise.resolve(fakeAccountData);
      });

      const result = await Accounts.getBalance(keyPairAddress, requestedDenom);

      expect(result).toBe('0.0000');

      spyGetAccountsData.mockRestore();
    });
    it('returns zero if coins list is not in the response', async () => {
      const keyPairAddress = 'myAddress';
      const requestedDenom = 'myRequestedDenom';

      const fakeAccountData = {
        result: {
          type: 'myType',
          value: {
            address: keyPairAddress,
          },
        },
      } as unknown as Types.AccountsData;

      const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
        return Promise.resolve(fakeAccountData);
      });

      const result = await Accounts.getBalance(keyPairAddress, requestedDenom);

      expect(result).toBe('0.0000');

      spyGetAccountsData.mockRestore();
    });
  });

  describe('formatBalanceFromWei', () => {
    it('formats given amount without appending denom and using given required precison', () => {
      const myAmount = '500000';
      const result = Accounts.formatBalanceFromWei(myAmount, 5);
      expect(result).toBe('0.00050');
    });
    it('formats given amount without appending denom and using another given required precison', () => {
      const myAmount = '500000';
      const result = Accounts.formatBalanceFromWei(myAmount, 4);
      expect(result).toBe('0.0005');
    });
    it('formats given amount with appending denom ', () => {
      const appendDenom = true;
      const myAmount = '500000';
      const result = Accounts.formatBalanceFromWei(myAmount, 4, appendDenom);
      expect(result).toBe('0.0005 STOS');
    });
  });

  describe('getBalanceCardMetrics', () => {
    it('returns balance card metrics', async () => {
      const availableBalanceResponse = {
        result: [
          {
            denom: 'ustos',
            amount: '123456789',
          },
        ],
      } as NetworkTypes.AvailableBalanceResponse;

      const availableBalanceResult = {
        response: availableBalanceResponse,
      } as NetworkTypes.AvailableBalanceDataResult;

      const spyGetAvailableBalance = jest.spyOn(NetworkApi, 'getAvailableBalance').mockImplementation(() => {
        return Promise.resolve(availableBalanceResult);
      });

      const delegatedBalanceResponse = {
        result: [
          {
            balance: {
              amount: '232435267',
              denom: 'ustos',
            },
            validator_address: 'v_bar',
          },
        ],
      } as unknown as NetworkTypes.RewardBalanceResult;

      const delegatedBalanceResult = {
        response: delegatedBalanceResponse,
      } as unknown as NetworkTypes.DelegatedBalanceDataResult;

      const spyGetDelegatedBalance = jest.spyOn(NetworkApi, 'getDelegatedBalance').mockImplementation(() => {
        return Promise.resolve(delegatedBalanceResult);
      });

      const unboundingBalanceResponse = {
        result: [
          {
            entries: [
              {
                balance: '813494321',
              },
            ],
          },
        ],
      } as unknown as NetworkTypes.RewardBalanceResult;

      const unboundingBalanceResult = {
        response: unboundingBalanceResponse,
      } as unknown as NetworkTypes.UnboundingBalanceDataResult;

      const spyGetUnboundingBalance = jest
        .spyOn(NetworkApi, 'getUnboundingBalance')
        .mockImplementation(() => {
          return Promise.resolve(unboundingBalanceResult);
        });

      const rewardBalanceResponse = {
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
      } as unknown as NetworkTypes.RewardBalanceResult;

      const rewardBalanceResult = {
        response: rewardBalanceResponse,
      } as unknown as NetworkTypes.RewardBalanceDataResult;

      const spyGetRewardBalance = jest.spyOn(NetworkApi, 'getRewardBalance').mockImplementation(() => {
        return Promise.resolve(rewardBalanceResult);
      });

      const keyPairAddress = 'myAddress';

      const expectedResult = {
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

      const result = await Accounts.getBalanceCardMetrics(keyPairAddress);

      expect(result).toStrictEqual(expectedResult);

      spyGetAvailableBalance.mockRestore();
      spyGetDelegatedBalance.mockRestore();
      spyGetUnboundingBalance.mockRestore();
      spyGetRewardBalance.mockRestore();
    });

    it('returns empty balance card metrics if there were handled errors in the fetch functions', async () => {
      const availableBalanceResult = {
        error: new Error('boom'),
      } as NetworkTypes.AvailableBalanceDataResult;

      const spyGetAvailableBalance = jest.spyOn(NetworkApi, 'getAvailableBalance').mockImplementation(() => {
        return Promise.resolve(availableBalanceResult);
      });

      const delegatedBalanceResult = {
        error: new Error('boom'),
      } as unknown as NetworkTypes.DelegatedBalanceDataResult;

      const spyGetDelegatedBalance = jest.spyOn(NetworkApi, 'getDelegatedBalance').mockImplementation(() => {
        return Promise.resolve(delegatedBalanceResult);
      });

      const unboundingBalanceResult = {
        error: new Error('boom'),
      } as unknown as NetworkTypes.UnboundingBalanceDataResult;

      const spyGetUnboundingBalance = jest
        .spyOn(NetworkApi, 'getUnboundingBalance')
        .mockImplementation(() => {
          return Promise.resolve(unboundingBalanceResult);
        });

      const rewardBalanceResult = {
        error: new Error('boom'),
      } as unknown as NetworkTypes.RewardBalanceDataResult;

      const spyGetRewardBalance = jest.spyOn(NetworkApi, 'getRewardBalance').mockImplementation(() => {
        return Promise.resolve(rewardBalanceResult);
      });

      const keyPairAddress = 'myAddress';

      const expectedResult = {
        available: '0.0000 STOS',
        delegated: '0.0000 STOS',
        unbounding: '0.0000 STOS',
        reward: '0.0000 STOS',
        detailedBalance: {
          delegated: {},
          reward: {},
        },
      };

      const result = await Accounts.getBalanceCardMetrics(keyPairAddress);

      expect(result).toStrictEqual(expectedResult);

      spyGetAvailableBalance.mockRestore();
      spyGetDelegatedBalance.mockRestore();
      spyGetUnboundingBalance.mockRestore();
      spyGetRewardBalance.mockRestore();
    });
  });

  describe('getMaxAvailableBalance', () => {
    it('returns an account max available balance with default precision', async () => {
      const keyPairAddress = 'myAddress';
      const requestedDenom = 'myRequestedDenom';

      const fakeAccountData = {
        result: {
          type: 'myType',
          value: {
            address: keyPairAddress,
            coins: [
              {
                amount: '123456789',
                denom: requestedDenom,
              },
            ],
          },
        },
      } as unknown as Types.AccountsData;

      const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
        return Promise.resolve(fakeAccountData);
      });

      const result = await Accounts.getMaxAvailableBalance(keyPairAddress, requestedDenom);

      expect(result).toBe('0.1232'); // it is not 0.1234 because of the fee

      spyGetAccountsData.mockRestore();
    });
    it('returns an account max available balance with custom precision', async () => {
      const keyPairAddress = 'myAddress';
      const requestedDenom = 'myRequestedDenom';

      const fakeAccountData = {
        result: {
          type: 'myType',
          value: {
            address: keyPairAddress,
            coins: [
              {
                amount: '123456789',
                denom: requestedDenom,
              },
            ],
          },
        },
      } as unknown as Types.AccountsData;

      const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
        return Promise.resolve(fakeAccountData);
      });

      const result = await Accounts.getMaxAvailableBalance(keyPairAddress, requestedDenom, 6);

      expect(result).toBe('0.123256'); // it is not '0.123456' because we deduct fee

      spyGetAccountsData.mockRestore();
    });
    it('returns zero if denom is not in the coins list', async () => {
      const keyPairAddress = 'myAddress';
      const requestedDenom = 'myRequestedDenom';

      const fakeAccountData = {
        result: {
          type: 'myType',
          value: {
            address: keyPairAddress,
            coins: [
              {
                amount: '123456789',
                denom: 'aa',
              },
            ],
          },
        },
      } as unknown as Types.AccountsData;

      const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
        return Promise.resolve(fakeAccountData);
      });

      const result = await Accounts.getMaxAvailableBalance(keyPairAddress, requestedDenom);

      expect(result).toBe('0.0000');

      spyGetAccountsData.mockRestore();
    });
    it('returns zero if coins list is not in the response', async () => {
      const keyPairAddress = 'myAddress';
      const requestedDenom = 'myRequestedDenom';

      const fakeAccountData = {
        result: {
          type: 'myType',
          value: {
            address: keyPairAddress,
          },
        },
      } as unknown as Types.AccountsData;

      const spyGetAccountsData = jest.spyOn(Accounts, 'getAccountsData').mockImplementation(() => {
        return Promise.resolve(fakeAccountData);
      });

      const result = await Accounts.getMaxAvailableBalance(keyPairAddress, requestedDenom);

      expect(result).toBe('0.0000');

      spyGetAccountsData.mockRestore();
    });
  });

  describe('getAccountTrasactions', () => {
    it.skip('returs a list of account transactions with default type and page', async () => {
      const originalTransactionData = {
        txData: {
          data: {
            amount: [
              {
                amount: '234567893',
              },
            ], // amountValue
            // amount: { amount: '234' }, // delegationAmountValue
            to: 'toto', // validatorAddress || to
            // validator_address: 'vv', // validatorAddress || to
          },
          sender: 'ss',
        },
        txType: 'tt',
      };

      const txItem = {
        block_height: 1,
        tx_info: {
          tx_hash: 'hs',
          time: '2021-08-17T16:19:27.568637284Z',
          transaction_data: originalTransactionData,
        },
      };
      const blockChainTx = {
        height: 3,
        txhash: 'hs',
        // raw_log: string;
        // logs: BlockChainTxLog[];
        // gas_wanted: string;
        // gas_used: string;
        // tx: BlockChainSubmittedTx;
        timestamp: '2021-08-17T16:19:27.568637284Z',
      };

      const txListResponse = {
        // data: [txItem],
        // total: 4,
        total_count: 4,
        count: 4,
        page_number: 1,
        page_total: 1,
        // limit: string;
        txs: [blockChainTx],
      } as unknown as NetworkTypes.RestTxListResponse;

      const txListResult = {
        response: txListResponse,
      } as NetworkTypes.RestTxListDataResult;

      const spyGetTxList = jest.spyOn(NetworkApi, 'getTxListBlockchain').mockImplementation(() => {
        return Promise.resolve(txListResult);
      });

      const keyPairAddress = 'myAddress';

      const expected = {
        data: [
          {
            amount: '0.2345 STOS',
            block: '1',
            hash: 'hs',
            originalTransactionData,
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

      const result = await Accounts.getAccountTrasactions(keyPairAddress);
      expect(result).toStrictEqual(expected);

      spyGetTxList.mockRestore();
    });
    it.skip('returs transactions where receiver is a validator', async () => {
      const originalTransactionData = {
        txData: {
          data: {
            // amount: [
            // {
            // amount: '234567893',
            // },
            // ], // amountValue
            amount: { amount: '567894533' }, // delegationAmountValue
            // to: 'toto', // validatorAddress || to
            validator_address: 'vv', // validatorAddress || to
          },
          sender: 'ss',
        },
        txType: 'tt',
      };

      const txItem = {
        block_height: 1,
        tx_info: {
          tx_hash: 'hs',
          time: '2021-08-17T16:19:27.568637284Z',
          transaction_data: originalTransactionData,
        },
      };

      const txListResponse = {
        data: [txItem],
        total: 4,
      } as unknown as NetworkTypes.ExplorerTxListResponse;

      const txListResult = {
        response: txListResponse,
      } as NetworkTypes.ExplorerTxListDataResult;

      const spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(() => {
        return Promise.resolve(txListResult);
      });

      const keyPairAddress = 'myAddress';

      const expected = {
        data: [
          {
            amount: '0.5678 STOS',
            block: '1',
            hash: 'hs',
            originalTransactionData,
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

      const result = await Accounts.getAccountTrasactions(keyPairAddress);
      expect(result).toStrictEqual(expected);

      spyGetTxList.mockRestore();
    });
    it.skip('returs transactions with specific tx type', async () => {
      const originalTransactionData = {
        txData: {
          data: {
            // amount: [
            // {
            // amount: '234567893',
            // },
            // ], // amountValue
            amount: { amount: '567894533' }, // delegationAmountValue
            // to: 'toto', // validatorAddress || to
            validator_address: 'vv', // validatorAddress || to
          },
          sender: 'ss',
        },
        // txType: TxTypes.HistoryTxType.Delegate,
        txType: TxTypes.TxMsgTypes.Delegate,
      };

      const txItem = {
        block_height: 1,
        tx_info: {
          tx_hash: 'hs',
          time: '2021-08-17T16:19:27.568637284Z',
          transaction_data: originalTransactionData,
        },
      };

      const txListResponse = {
        data: [txItem],
        total: 4,
      } as unknown as NetworkTypes.ExplorerTxListResponse;

      const txListResult = {
        response: txListResponse,
      } as NetworkTypes.ExplorerTxListDataResult;

      const spyGetTxList = jest.spyOn(NetworkApi, 'getTxList').mockImplementation(() => {
        return Promise.resolve(txListResult);
      });

      const keyPairAddress = 'myAddress';

      const expected = {
        data: [
          {
            amount: '0.5678 STOS',
            block: '1',
            hash: 'hs',
            originalTransactionData,
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

      const result = await Accounts.getAccountTrasactions(keyPairAddress);
      expect(result).toStrictEqual(expected);

      spyGetTxList.mockRestore();
    });
    it('throws an error if network can not fetch tx list', async () => {
      const spyGetTxList = jest.spyOn(NetworkApi, 'getTxListBlockchain').mockImplementation(() => {
        throw new Error('boom');
      });

      const keyPairAddress = 'myAddress';

      await expect(Accounts.getAccountTrasactions(keyPairAddress)).rejects.toThrow('boom');

      spyGetTxList.mockRestore();
    });
    it('throws an error if network call result does not have response', async () => {
      const txListResult = {} as NetworkTypes.RestTxListDataResult;

      const spyGetTxList = jest.spyOn(NetworkApi, 'getTxListBlockchain').mockImplementation(() => {
        return Promise.resolve(txListResult);
      });

      const keyPairAddress = 'myAddress';

      await expect(Accounts.getAccountTrasactions(keyPairAddress)).rejects.toThrow(
        'Could not fetch tx history',
      );

      spyGetTxList.mockRestore();
    });
  });

  describe('getBalanceCardMetricValue', () => {
    it('return properly formatted value for the balance card metric', () => {
      const result = Accounts.getBalanceCardMetricValue('ustos', '123456789');
      expect(result).toBe('0.1234 STOS');
    });
    it('returns default value if no amount is given', () => {
      const result = Accounts.getBalanceCardMetricValue('ustos');
      expect(result).toBe('0.0000 STOS');
    });
    it('returns default value if no denom is given', () => {
      const result = Accounts.getBalanceCardMetricValue();
      expect(result).toBe('0.0000 STOS');
    });
  });
});
