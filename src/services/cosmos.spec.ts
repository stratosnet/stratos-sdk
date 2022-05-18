import cosmosjs from '@cosmostation/cosmosjs';
import '@testing-library/jest-dom/extend-expect';
import * as cosmos from './cosmos';

const originalInstance = cosmos.StratosCosmos.cosmosInstance;

const resetCosmosInstance = () => {
  cosmos.StratosCosmos.cosmosInstance = originalInstance;
};

beforeEach(resetCosmosInstance);
afterEach(resetCosmosInstance);

describe('cosmos (unit test)', () => {
  it('returns previously initialized cosmos instance', () => {
    const expectedCosmosInstance = { foo: 'Bar' };

    const spyInit = jest.spyOn(cosmos.StratosCosmos, 'init');

    cosmos.StratosCosmos.cosmosInstance = expectedCosmosInstance as unknown as cosmos.CosmosInstance;

    const cosmosInstance = cosmos.getCosmos();

    expect(cosmosInstance).toEqual(expectedCosmosInstance);
    expect(spyInit).not.toBeCalled();

    spyInit.mockRestore();
  });

  it('if there is no cosmos instance it calls init', () => {
    const spyInit = jest.spyOn(cosmos.StratosCosmos, 'init');

    cosmos.getCosmos();

    expect(spyInit).toBeCalled();

    spyInit.mockRestore();
  });

  it('cosmos instance is properly initialized from the init ', () => {
    const expectedCosmosInstance = { foo: 'Bar' };

    const spyInit = jest.spyOn(cosmos.StratosCosmos, 'init');

    const spyCosmosNetwork = jest
      .spyOn(cosmosjs, 'network')
      .mockImplementation(jest.fn(() => expectedCosmosInstance));

    const cosmosInstance = cosmos.getCosmos();
    expect(cosmosInstance).toEqual(expectedCosmosInstance);

    expect(spyInit).toBeCalled();

    spyInit.mockRestore();
    spyCosmosNetwork.mockRestore();
  });
});
