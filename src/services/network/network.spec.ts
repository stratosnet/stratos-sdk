import '@testing-library/jest-dom/extend-expect';
import BigNumber from 'bignumber.js';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import * as network from './network';

const myDefaultResult = [
  {
    foo: 'bar',
  },
  {
    barfoo: 'foobar',
  },
];

const sdkEnvTest = {
  restUrl: 'https://rest-test.thestratos.org',
  rpcUrl: 'https://rpc-test.thestratos.org',
  chainId: 'test-chain-1',
  explorerUrl: 'https://explorer-test.thestratos.org',
};

const defaultUrl = `https://foo.com`;

// const resolvedChainID = await Network.getChainId();

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

  const hostUrl = 'https://foo.bar';

  // Sdk.init(sdkEnv);
  // Sdk.init({ ...sdkEnvTest, chainId: resolvedChainID });

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
});
