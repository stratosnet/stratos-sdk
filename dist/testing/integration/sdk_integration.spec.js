"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment node
 */
const remotefs_1 = require("../../config/remotefs");
const hdVault_1 = require("../../crypto/hdVault");
const config_1 = require("../config");
const Integration = __importStar(require("./sdk_inegration_runner"));
const extendedExecutionTimeout = config_1.OZONE_BALANCE_CHECK_WAIT_TIME * 2;
describe(`Stratos SDK integration (integration test)`, () => {
    describe('User Account', () => {
        it('Creates a new account', async () => {
            return Integration.createAnAccount().then(result => {
                expect(result).toBe(true);
            });
        }, extendedExecutionTimeout);
        it('Restores an account from the mnemonic', done => {
            void Integration.restoreAccount().then(result => {
                expect(result).toBe(true);
                done();
            });
        }, extendedExecutionTimeout);
        it('Check that faucet account has balance', done => {
            void Integration.getFaucetAvailableBalance().then(result => {
                expect(result).toBe(true);
                done();
            });
        }, extendedExecutionTimeout);
    });
    describe('Transactions', () => {
        const receiverPhrase = hdVault_1.mnemonic.generateMnemonicPhrase(24);
        const receiverMnemonic = hdVault_1.mnemonic.convertArrayToString(receiverPhrase);
        it('Sends a transfer tx and checks that receiver balance was updated', done => {
            void Integration.sendTransferTx(0, receiverMnemonic).then(result => {
                expect(result).toBe(true);
                done();
            });
        }, extendedExecutionTimeout);
        it('Sends a delegation tx and checks that receiver balance was updated', done => {
            void Integration.sendDelegateTx(0, receiverMnemonic).then(result => {
                expect(result).toBe(true);
                done();
            });
        }, extendedExecutionTimeout);
        it('Sends a withdraw rewards tx ', done => {
            void Integration.sendWithdrawRewardsTx(0, receiverMnemonic).then(result => {
                expect(result).toBe(true);
                done();
            });
        }, extendedExecutionTimeout);
        it('Sends a withdraw all rewards tx ', done => {
            void Integration.sendWithdrawAllRewardsTx(0, receiverMnemonic).then(result => {
                expect(result).toBe(true);
                done();
            });
        }, extendedExecutionTimeout);
        describe('Transactions (re-delegate)', () => {
            const receiverPhraseRedelegate = hdVault_1.mnemonic.generateMnemonicPhrase(24);
            const receiverMnemonicRedelegate = hdVault_1.mnemonic.convertArrayToString(receiverPhraseRedelegate);
            it('Sends a redelegation tx and checks that receiver balance was updated', done => {
                void Integration.sendBeginRedelegateTx(0, receiverMnemonicRedelegate).then(result => {
                    expect(result).toBe(true);
                    done();
                });
            }, extendedExecutionTimeout);
        });
    });
    describe('Prepay OZONE, SDS Remote file system', () => {
        const receiverPhrase = hdVault_1.mnemonic.generateMnemonicPhrase(24);
        const receiverMnemonic = hdVault_1.mnemonic.convertArrayToString(receiverPhrase);
        describe('Prepay and OZONE', () => {
            it('Sends an sds prepay tx', done => {
                void Integration.sendSdsPrepayTx(0, receiverMnemonic, 0.1).then(result => {
                    expect(result).toBe(true);
                    done();
                });
            }, extendedExecutionTimeout);
            it('Check that account has ozone balance, assuming that for 0.1 STOS account should have at least 95 OZ', done => {
                void Integration.getAccountOzoneBalance(0, receiverMnemonic, '95').then(result => {
                    expect(result).toBe(true);
                    done();
                });
            }, extendedExecutionTimeout);
        });
        describe('Remote File System', () => {
            const randomPrefix = Date.now() + '';
            const fileReadName = `file10_test`;
            it('Uploads a local file to remote and verifies its existence on the remote side', done => {
                void Integration.uploadFileToRemote(fileReadName, randomPrefix, 0, receiverMnemonic).then(result => {
                    expect(result).toBe(true);
                    done();
                });
            }, extendedExecutionTimeout * 3 + remotefs_1.FILE_STATUS_CHECK_WAIT_TIME);
            it('Creates the remote file shared link from filehash', done => {
                void Integration.createSharedLinkForFile(fileReadName, randomPrefix, 0, receiverMnemonic).then(result => {
                    expect(result).toBe(true);
                    done();
                });
            }, extendedExecutionTimeout);
            it('Check the get shared files list works and contains the shared file info.', done => {
                void Integration.getSharedFilesListAndCheckShare(fileReadName, randomPrefix, 0, receiverMnemonic).then(result => {
                    expect(result).toBe(true);
                    done();
                });
            }, extendedExecutionTimeout);
            it('Stop sharing the file by a given sharedId', done => {
                void Integration.stopFileSharingWithSharedId(fileReadName, randomPrefix, 0, receiverMnemonic).then(result => {
                    expect(result).toBe(true);
                    done();
                });
            }, extendedExecutionTimeout);
            it('Verifies that there is no shares aftrer the file stoped sharing', done => {
                void Integration.checkIfFileDoesntHaveSharesAfterStop(0, receiverMnemonic).then(result => {
                    expect(result).toBe(true);
                    done();
                });
            }, extendedExecutionTimeout);
            it('Downloads the remote file to local file and compares its hash', done => {
                void Integration.downloadFileFromRemote(fileReadName, randomPrefix, 0, receiverMnemonic).then(result => {
                    expect(result).toBe(true);
                    done();
                });
            }, extendedExecutionTimeout);
        });
    });
});
//# sourceMappingURL=sdk_integration.spec.js.map