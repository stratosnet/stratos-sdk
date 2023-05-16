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
const Integration = __importStar(require("./sdk_inegration_runner"));
const extendedExecutionTimeout = 18000;
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
});
//# sourceMappingURL=sdk_integration.spec.js.map