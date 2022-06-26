"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPhrase = exports.generateMnemonicPhrase = exports.convertStringToArray = exports.convertArrayToString = void 0;
var bip39_1 = require("bip39");
var crypto_1 = __importDefault(require("crypto"));
var mnemonic12 = 12;
var mnemonic24 = 24;
var convertArrayToString = function (mnemonicArray) {
    return mnemonicArray.map(function (_a) {
        var _b = _a.word, word = _b === void 0 ? '' : _b;
        return word;
    }).join(' ');
};
exports.convertArrayToString = convertArrayToString;
var convertStringToArray = function (mnemonicStr) {
    var mnemonicArray = mnemonicStr.split(' ');
    return mnemonicArray.map(function (word, idx) { return ({ index: idx + 1, word: word }); });
};
exports.convertStringToArray = convertStringToArray;
var generateMnemonicPhrase = function (phraseLength) {
    var mnemonicString = '';
    if (phraseLength === mnemonic12) {
        mnemonicString = (0, bip39_1.generateMnemonic)();
        return (0, exports.convertStringToArray)(mnemonicString);
    }
    var entropy = crypto_1.default.randomBytes(32);
    mnemonicString = (0, bip39_1.entropyToMnemonic)(entropy);
    // another option
    // const mnemonic = Bip39.encode(Random.getBytes(16)).toString(); // using { Bip39 } '@cosmjs/crypto'
    return (0, exports.convertStringToArray)(mnemonicString);
};
exports.generateMnemonicPhrase = generateMnemonicPhrase;
var verifyPhrase = function (phrase) {
    return (0, bip39_1.validateMnemonic)((0, exports.convertArrayToString)(phrase), bip39_1.wordlists.english);
};
exports.verifyPhrase = verifyPhrase;
//# sourceMappingURL=mnemonic.js.map