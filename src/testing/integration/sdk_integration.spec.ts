/**
 * @jest-environment node
 */
import * as Integration from './sdk_inegration_runner';

const extendedExecutionTimeout = 1800;

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
  });
});
