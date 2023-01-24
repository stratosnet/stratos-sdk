"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPhrase = exports.generateMnemonicPhrase = exports.convertStringToArray = exports.convertArrayToString = void 0;
const bip39_1 = require("bip39");
const crypto_1 = __importDefault(require("crypto"));
const mnemonic12 = 12;
const mnemonic24 = 24;
const convertArrayToString = (mnemonicArray) => {
    return mnemonicArray.map(({ word = '' }) => word).join(' ');
};
exports.convertArrayToString = convertArrayToString;
const convertStringToArray = (mnemonicStr) => {
    const mnemonicArray = mnemonicStr.split(' ');
    return mnemonicArray.map((word, idx) => ({ index: idx + 1, word }));
};
exports.convertStringToArray = convertStringToArray;
const generateMnemonicPhrase = (phraseLength) => {
    let mnemonicString = '';
    if (phraseLength === mnemonic12) {
        mnemonicString = (0, bip39_1.generateMnemonic)();
        return (0, exports.convertStringToArray)(mnemonicString);
    }
    const entropy = crypto_1.default.randomBytes(32);
    mnemonicString = (0, bip39_1.entropyToMnemonic)(entropy);
    // another option
    // const mnemonic = Bip39.encode(Random.getBytes(16)).toString(); // using { Bip39 } '@cosmjs/crypto'
    return (0, exports.convertStringToArray)(mnemonicString);
};
exports.generateMnemonicPhrase = generateMnemonicPhrase;
const verifyPhrase = (phrase) => {
    return (0, bip39_1.validateMnemonic)((0, exports.convertArrayToString)(phrase), bip39_1.wordlists.english);
};
exports.verifyPhrase = verifyPhrase;
//# sourceMappingURL=mnemonic.js.map