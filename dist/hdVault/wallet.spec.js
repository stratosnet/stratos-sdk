"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { deriveKeyPair, sign, verifySignature } from './wallet';
// const phrase = [
//   { index: 1, word: 'rate' },
//   { index: 2, word: 'seminar' },
//   { index: 3, word: 'essence' },
//   { index: 4, word: 'abandon' },
//   { index: 5, word: 'sure' },
//   { index: 6, word: 'grab' },
//   { index: 7, word: 'submit' },
//   { index: 8, word: 'scare' },
//   { index: 9, word: 'rather' },
//   { index: 10, word: 'front' },
//   { index: 11, word: 'dune' },
//   { index: 12, word: 'planet' },
//   { index: 13, word: 'bag' },
//   { index: 14, word: 'cheap' },
//   { index: 15, word: 'first' },
//   { index: 16, word: 'rude' },
//   { index: 17, word: 'enjoy' },
//   { index: 18, word: 'harvest' },
//   { index: 19, word: 'motor' },
//   { index: 20, word: 'demise' },
//   { index: 21, word: 'tennis' },
//   { index: 22, word: 'erase' },
//   { index: 23, word: 'poet' },
//   { index: 24, word: 'pole' },
// ];
// const password = '123456';
// const wrongPassword = '123456ABC';
// const masterKeySeed = createMasterKeySeed(phrase, password);
// const encryptedMasterKeySeedString = masterKeySeed.encryptedMasterKeySeed.toString();
// const path = "m/44'/606'/0'/0'/0'";
// const sourceKeyIndex = 0;
// const sourceAddress = 'st14e2wee4zhfg0q29y5ehk2dt8nmc9ta4rj6s598';
// const sourcePublicKey = 'bB3/zDDHrfo964xIlogLEwv73MdL81z9Mgx7eydZbBQ=';
// const encodedSignData = 'eyBmb286ICdiYXInLCBmb29iYXI6ICdiYXJmb28nIH0=';
// const sourceSignature =
//   'JqfsQ5ABWPrOcLhgORkv2j80hdypUprEhzTMGKze0N2Q5H1uBhq8zsj8lFFQQB0jc1OKJqjJ/nrIGHxXRXIGCA==';
describe('wallet', function () {
    describe('deriveKeyPair', function () {
        it('returns dummy', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                expect(1).toBe(1);
                return [2 /*return*/];
            });
        }); });
    });
});
// describe('deriveKeyPair', () => {
//   it('should derive a keypair', async () => {
//     const keyPair = await deriveKeyPair(sourceKeyIndex, password, encryptedMasterKeySeedString);
//     if (keyPair !== false) {
//       const { address, keyIndex, publicKey } = keyPair;
//       expect(address).toEqual(sourceAddress);
//       expect(keyIndex).toEqual(sourceKeyIndex);
//       expect(publicKey).toEqual(sourcePublicKey);
//     }
//   });
//   it('should reject with false when using a wrong password', async () => {
//     await expect(deriveKeyPair(sourceKeyIndex, wrongPassword, encryptedMasterKeySeedString)).rejects.toEqual(
//       false,
//     );
//   });
// });
// describe('sign', () => {
//   it('signs the message', async () => {
//     const txMessage = {
//       message: encodedSignData,
//       password: password,
//       encryptedMasterKeySeed: encryptedMasterKeySeedString,
//       signingKeyPath: path,
//     };
//     const signature = await sign(txMessage);
//     expect(signature).toEqual(sourceSignature);
//   });
//   it("can't sign with a wrong password", async () => {
//     const txMessage = {
//       message: encodedSignData,
//       password: wrongPassword,
//       encryptedMasterKeySeed: encryptedMasterKeySeedString,
//       signingKeyPath: path,
//     };
//     await expect(sign(txMessage)).rejects.toEqual(false);
//   });
// });
// describe('verifySignature', () => {
//   it('verifies the signature ', async () => {
//     const result = await verifySignature(encodedSignData, sourceSignature, sourcePublicKey);
//     expect(result).toEqual(true);
//   });
//   it("can't verify the signature if public key is not authentic", async () => {
//     const result = await verifySignature(
//       encodedSignData,
//       sourceSignature,
//       masterKeySeed.masterKeySeedPublicKey,
//     );
//     expect(result).toEqual(false);
//   });
//   it("can't verify the signature if public key is corrupted", async () => {
//     await expect(verifySignature(encodedSignData, sourceSignature, 'foo')).resolves.toEqual(false);
//   });
//   it("can't verify the signature if signature is corrupted", async () => {
//     await expect(
//       verifySignature(encodedSignData, 'foo', masterKeySeed.masterKeySeedPublicKey),
//     ).resolves.toEqual(false);
//   });
//   it("can't verify the signature if message is corrupted", async () => {
//     await expect(
//       verifySignature('foo', sourceSignature, masterKeySeed.masterKeySeedPublicKey),
//     ).resolves.toEqual(false);
//   });
// });
//# sourceMappingURL=wallet.spec.js.map