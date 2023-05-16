/**
 * @jest-environment node
 */
import * as Integration from './sdk_inegration_runner';

const extendedExecutionTimeout = 18000;

describe(`Stratos SDK integration (integration test)`, () => {
  describe('User Account', () => {
    it(
      'Creates a new account',
      async () => {
        return Integration.createAnAccount().then(result => {
          expect(result).toBe(true);
        });
      },
      extendedExecutionTimeout,
    );
    it(
      'Restores an account from the mnemonic',
      done => {
        void Integration.restoreAccount().then(result => {
          expect(result).toBe(true);
          done();
        });
      },
      extendedExecutionTimeout,
    );
    it(
      'Check that faucet account has balance',
      done => {
        void Integration.getFaucetAvailableBalance().then(result => {
          expect(result).toBe(true);
          done();
        });
      },
      extendedExecutionTimeout,
    );
  });
});
