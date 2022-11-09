import '@testing-library/jest-dom/extend-expect';
import BigNumber from 'bignumber.js';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { hdVault } from '../../config';
import Sdk from '../../Sdk';
import * as network from './network';

const myDefaultResult = [
  {
    foo: 'bar',
  },
  {
    barfoo: 'foobar',
  },
];

const defaultUrl = `https://foo.com`;

const hostUrl = 'https://foo.bar';

const sdkEnvTest = {
  restUrl: defaultUrl,
  rpcUrl: defaultUrl,
  chainId: 'test-chain-1',
  explorerUrl: defaultUrl,
};

const server = setupServer(
  rest.get(defaultUrl, (_req, res, ctx) => {
    return res(ctx.json(myDefaultResult));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('network (unit test)', () => {
  const testConfig = {
    headers: {
      testHeader: 'test-value',
    },
  };

  Sdk.init({ ...sdkEnvTest });

  describe('apiPost', () => {
    const data = { foo: 'bar' };
    const myHandle = 'foobar';

    it('returns properly formatted response data', async () => {
      server.use(
        rest.post(defaultUrl, (_req, res, ctx) => {
          return res(ctx.json(myHandle));
        }),
      );

      const dataResult = await network.apiPost(defaultUrl, data, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response).toEqual('foobar');
    });

    it('makes a call with no data', async () => {
      server.use(
        rest.post(defaultUrl, (_req, res, ctx) => {
          return res(ctx.json(myHandle));
        }),
      );

      const dataResult = await network.apiPost(defaultUrl, undefined, testConfig);

      expect(dataResult).toHaveProperty('response');
      const { response } = dataResult;

      expect(response).toEqual('foobar');
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.post(defaultUrl, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.apiPost(defaultUrl, data, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('apiGet', () => {
    it('returns properly formatted response data', async () => {
      const dataResult = await network.apiGet(defaultUrl, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');

      const { response } = dataResult;

      expect(response.length).toEqual(2);
    });

    it('returns an error in case of a server error', async () => {
      server.use(
        rest.get(defaultUrl, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.apiGet(defaultUrl, testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getSubmitTransactionData', () => {
    it('return empty tx data with no data given to the input', () => {
      const txData = network.getSubmitTransactionData();
      expect(txData).toStrictEqual({ response: undefined });
    });
    it('return empty tx data with empty string given to the input', () => {
      const givenData = '';
      const txData = network.getSubmitTransactionData(givenData);
      expect(txData).toStrictEqual({ response: undefined });
    });
    it('return given string parsed as number', () => {
      const givenData = '1234';
      const txData = network.getSubmitTransactionData(givenData);
      expect(txData).toStrictEqual({ response: 1234 });
    });
    it('return given stringified object properly parsed', () => {
      const givenData = {
        foo: 'bar',
        barfoo: 123,
      };
      const txData = network.getSubmitTransactionData(JSON.stringify(givenData));
      expect(txData).toEqual({ response: givenData });
    });
    it('return properly formatted error', () => {
      const givenData = '124343hh s';
      const txData = network.getSubmitTransactionData(givenData);

      expect(txData).not.toHaveProperty('response');
      expect(txData).toHaveProperty('error');

      expect(txData.error!.message).toContain("Can't submit transaction. Can't parse transaction data.");
    });
    it('return properly formatted error for mailformed json', () => {
      const givenData = '{f:1}';
      const txData = network.getSubmitTransactionData(givenData);

      expect(txData).not.toHaveProperty('response');
      expect(txData).toHaveProperty('error');

      expect(txData.error!.message).toContain("Can't submit transaction. Can't parse transaction data.");
    });
    it('return given stringified object properly parsed', () => {
      const givenData = {
        foo: 'bar',
        barfoo: 123434343434343435343434343434242342342432,
      };
      const txData = network.getSubmitTransactionData(JSON.stringify(givenData));

      const {
        response: { barfoo },
      } = txData;

      expect(barfoo instanceof BigNumber).toEqual(true);
    });
  });

  describe('submitTransaction', () => {
    const delegatorAddr = '123';

    const url = `${hostUrl}/staking/delegators/${delegatorAddr}/delegations`;

    it('returns properly formatted response', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';
      const myData = { foo: myResponse };

      server.use(
        rest.post(url, (_req, res, ctx) => {
          const { foo } = _req.body as {
            foo: string;
          };
          return res(ctx.json(foo));
        }),
      );

      const spy = jest.spyOn(network, 'getSubmitTransactionData');
      const spyPost = jest.spyOn(network, 'apiPost');

      const myNewData = JSON.stringify(myData);
      const dataResult = await network.submitTransaction(delegatorAddr, myNewData, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');
      expect(dataResult.response).toBe(myResponse);

      expect(spy).toHaveBeenCalledWith(myNewData);
      expect(spy).toReturnWith({ response: myData });
      expect(spyPost).toHaveBeenCalledWith(url, myData, testConfig);
    });

    it('returns properly formatted response with no input data', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';

      server.use(
        rest.post(url, (_req, res, ctx) => {
          return res(ctx.json(myResponse));
        }),
      );

      const dataResult = await network.submitTransaction(delegatorAddr, undefined, testConfig);

      expect(dataResult).toHaveProperty('response');
      expect(dataResult).not.toHaveProperty('error');
    });

    it('returns an error in case of a server error', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      server.use(
        rest.post(url, (_req, res, ctx) => {
          return res(ctx.status(500));
        }),
      );

      const dataResult = await network.submitTransaction(delegatorAddr, '', testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });

    it('returns an error in case of a user error', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      server.use(
        rest.post(url, (_req, res, ctx) => {
          return res(ctx.status(404));
        }),
      );

      const dataResult = await network.submitTransaction(delegatorAddr, '', testConfig);

      expect(dataResult).not.toHaveProperty('response');
      expect(dataResult).toHaveProperty('error');
    });
  });

  describe('getAccountsData', () => {
    const address = '123';

    const url = `${hostUrl}/auth/acconts/${address}`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getAccountsData(address);

      expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
      spyApiGet.mockRestore();
    });
  });

  describe('getStakingValidators', () => {
    const address = '123';

    const url = `${hostUrl}/auth/acconts/${address}`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getStakingValidators(address);

      expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
      spyApiGet.mockRestore();
    });
  });

  describe('getTxListBlockchain', () => {
    const address = '123';
    const txType = 'from';
    const page = 1;

    const url = `${hostUrl}/txs`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const params: { page: number; 'message.sender': string; 'message.action'?: string; limit: number } = {
        page,
        limit: 3,
        'message.sender': address,
      };

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getTxListBlockchain(address, '');

      expect(spyApiGet).toHaveBeenCalledWith(url, { params });
      spyApiGet.mockRestore();
    });

    it('calls api with a proper url having a given type', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const params: { page: number; 'message.sender': string; 'message.action'?: string; limit: number } = {
        page,
        limit: 3,
        'message.sender': address,
        'message.action': txType,
      };

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getTxListBlockchain(address, txType);

      expect(spyApiGet).toHaveBeenCalledWith(url, { params });
      spyApiGet.mockRestore();
    });
  });

  describe('getValidatorsList', () => {
    const status = 'foo';
    const page = 1;

    const url = `${hostUrl}/staking/validators`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getValidatorsList(status, page);

      expect(spyApiGet).toHaveBeenCalledWith(url, { params: { page, status } });
      spyApiGet.mockRestore();
    });
  });

  describe('getValidatorsBondedToDelegatorList', () => {
    const delegatorAddress = '123';
    const status = 'foo';

    const url = `${hostUrl}/staking/delegators/${delegatorAddress}/validators`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getValidatorsBondedToDelegatorList(status, delegatorAddress);

      expect(spyApiGet).toHaveBeenCalledWith(url, { params: { status } });
      spyApiGet.mockRestore();
    });
  });

  describe('getValidator', () => {
    const address = '123';

    const url = `${hostUrl}/staking/validators/${address}`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getValidator(address);

      expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
      spyApiGet.mockRestore();
    });
  });

  describe('getStakingPool', () => {
    const url = `${hostUrl}/staking/pool`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getStakingPool(undefined);

      expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
      spyApiGet.mockRestore();
    });
  });

  describe('getAvailableBalance', () => {
    const address = '123';
    const url = `${hostUrl}/bank/balances/${address}`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getAvailableBalance(address);

      expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
      spyApiGet.mockRestore();
    });
  });

  describe('getDelegatedBalance', () => {
    const delegatorAddr = '123';
    const url = `${hostUrl}/staking/delegators/${delegatorAddr}/delegations`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getDelegatedBalance(delegatorAddr);

      expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
      spyApiGet.mockRestore();
    });
  });

  describe('getUnboundingBalance', () => {
    const delegatorAddr = '123';
    const url = `${hostUrl}/staking/delegators/${delegatorAddr}/unbonding_delegations`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getUnboundingBalance(delegatorAddr);

      expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
      spyApiGet.mockRestore();
    });
  });

  describe('getRewardBalance', () => {
    const delegatorAddr = '123';
    const url = `${hostUrl}/distribution/delegators/${delegatorAddr}/rewards`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getRewardBalance(delegatorAddr);

      expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
      spyApiGet.mockRestore();
    });
  });

  describe('requestBalanceIncrease', () => {
    const walletAddress = '123';
    const faucetUrl = `${hostUrl}/345`;
    const url = `${faucetUrl}/${walletAddress}`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, restUrl: hostUrl });

      const spyApiPost = jest.spyOn(network, 'apiPost');
      server.use(
        rest.post(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.requestBalanceIncrease(walletAddress, faucetUrl, hdVault.stratosTopDenom, testConfig);

      expect(spyApiPost).toHaveBeenCalledWith(url, {}, testConfig);
      spyApiPost.mockRestore();
    });
  });

  describe('getRpcStatus', () => {
    const url = `${hostUrl}/status`;

    it('calls api with a proper url', async () => {
      Sdk.init({ ...sdkEnvTest, rpcUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'apiGet');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json({}));
        }),
      );

      await network.getRpcStatus();

      expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
      spyApiGet.mockRestore();
    });
  });

  describe('getChainId', () => {
    const url = `${hostUrl}/status`;

    it('returns proper chainId', async () => {
      const response = {
        result: {
          node_info: {
            network: 'foobar',
          },
        },
      };

      Sdk.init({ ...sdkEnvTest, rpcUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'getRpcStatus');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(response));
        }),
      );

      const chainId = await network.getChainId();

      expect(chainId).toEqual('foobar');

      expect(spyApiGet).toHaveBeenCalledWith();
      spyApiGet.mockRestore();
    });

    it('returns undefined in case of error in getRpcStatus', async () => {
      const response = {
        result: {
          bnar: 'foo',
        },
      };

      Sdk.init({ ...sdkEnvTest, rpcUrl: hostUrl });

      const spyApiGet = jest.spyOn(network, 'getRpcStatus');
      server.use(
        rest.get(url, (_req, res, ctx) => {
          return res(ctx.json(response));
        }),
      );

      const chainId = await network.getChainId();

      expect(chainId).toEqual(undefined);

      expect(spyApiGet).toHaveBeenCalledWith();
      spyApiGet.mockRestore();
    });
  });
});
