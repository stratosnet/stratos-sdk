/**
 * @jest-environment node
 */
import path from 'path';
import { mnemonic } from '../../hdVault';
import * as Integration from './sdk_inegration_runner';

const extendedExecutionTimeout = 60000;

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
  describe('Prepay OZONE, upload and download', () => {
    const receiverPhrase = mnemonic.generateMnemonicPhrase(24);
    const receiverMnemonic = mnemonic.convertArrayToString(receiverPhrase);

    describe('Prepay and OZONE', () => {
      it(
        'Sends an sds prepay tx',
        done => {
          void Integration.sendSdsPrepayTx(0, receiverMnemonic, 0.1).then(result => {
            expect(result).toBe(true);
            done();
          });
        },
        extendedExecutionTimeout,
      );
      it(
        'Check that account has ozone balance, assuming that for 0.1 STOS account should have at least 98.1 OZ',
        done => {
          void Integration.getAccountOzoneBalance(0, receiverMnemonic, '98.1').then(result => {
            expect(result).toBe(true);
            done();
          });
        },
        extendedExecutionTimeout,
      );
    });
    describe('Remote File System', () => {
      const randomPrefix = Date.now() + '';
      const fileReadName = `file10_test`;

      it(
        'Uploads a local file to remote',
        done => {
          void Integration.uploadFileToRemote(fileReadName, randomPrefix, 0, receiverMnemonic).then(
            result => {
              expect(result).toBe(true);
              done();
            },
          );
        },
        extendedExecutionTimeout,
      );
    });
  });
});
