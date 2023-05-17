/**
 * @jest-environment node
 */
import { mnemonic } from '../../hdVault';
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
  describe('Transactions', () => {
    const receiverPhrase = mnemonic.generateMnemonicPhrase(24);
    const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);
    it(
      'Sends a transfer tx and checks that receiver balance was updated',
      done => {
        void Integration.sendTransferTx(0, receiverMnemonic).then(result => {
          expect(result).toBe(true);
          done();
        });
      },
      extendedExecutionTimeout,
    );
    it(
      'Sends a delegation tx and checks that receiver balance was updated',
      done => {
        void Integration.sendDelegateTx(0, receiverMnemonic).then(result => {
          expect(result).toBe(true);
          done();
        });
      },
      extendedExecutionTimeout,
    );
    it(
      'Sends a withdraw rewards tx ',
      done => {
        void Integration.sendWithdrawRewardsTx(0, receiverMnemonic).then(result => {
          expect(result).toBe(true);
          done();
        });
      },
      extendedExecutionTimeout,
    );
    it(
      'Sends a withdraw all rewards tx ',
      done => {
        void Integration.sendWithdrawAllRewardsTx(0, receiverMnemonic).then(result => {
          expect(result).toBe(true);
          done();
        });
      },
      extendedExecutionTimeout,
    );
  });
});
